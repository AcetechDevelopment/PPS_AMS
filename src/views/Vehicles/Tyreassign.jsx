import React, { useEffect, useState, createRef, useMemo, useContext } from 'react'
import {
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CTable,
  CCard,
  CCardHeader,
  CModalFooter,
  CCardBody,
  CButtonGroup,
  CTableHead,
  CFormInput,
  CInputGroup,
  CRow,
  CCol,
  CFormLabel,
  CImage, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell
} from '@coreui/react'
import { FaBars, FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import { CIcon } from '@coreui/icons-react';
import { cilTrash, cilPencil } from '@coreui/icons';
import Select from 'react-select';
import { useTable, usePagination, useSortBy } from 'react-table';
import { isNumberKey, base_url, today, file_base_url } from '../service';
import { vehicleNum, validateHSN, ValidMonth, ValidSingleDigit } from '../../utils/validators';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';
import { Sharedcontext } from '../../components/Context';
import { exportToExcel } from '../export/excel';
import { exportToPDF } from '../export/pdf';
import { exportToPrint } from '../export/print';
import { useLocation } from "react-router-dom";




const Spareassign = () => {

  const BASE = import.meta.env.VITE_BASE_URL;
  const apiUrl = import.meta.env.VITE_API_URL;
  const ReactSwal = withReactContent(Swal);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Excelloading, setExcelLoading] = useState(false);
  const [Pdfloading, setPdfLoading] = useState(false);
  const [Printloading, setPrintLoading] = useState(false);
  const [selectedtype, setSelectedtype] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [search, setsearch] = useState('');
  const [categoryoption, setcategoryoption] = useState([]);
  const [categoryid, setcategoryid] = useState('');
  const [fromdate, setfromdate] = useState(today);
  const [todate, settodate] = useState(today);
  const [loc_id, setlocationid] = useState('');
  const [bill_no, setbill_no] = useState('');
  const [vehicle_no, setvehicle_no] = useState('');
  const [material, setmaterial] = useState(1);
  const [date_time, setdate_time] = useState(today);
  const [tare_wt, settare_wt] = useState(0);
  const [gross_wt, setgross_wt] = useState(0);
  const [net_wt, setnet_wt] = useState(0);
  const [id, setid] = useState('');
  const [typelist, settypelist] = useState([])
  const [view, setview] = useState(false)
  const { roleId ,fetchActionDetails,action_details} = useContext(Sharedcontext)
  const location = useLocation(); // 👈 gives full URL path
 
   
   const authToken = JSON.parse(sessionStorage.getItem('authToken'))
  

  // new vehicle
  const [save_data, setsave_data] = useState(null);
  // update vehicle const [updated_data, setupdated_data] = useState(intial_data);

  const submitvichile = async () => {
    const data = save_data;
    if (
       !data.id
      // !data.vehicle_no||
      // !data.trailer_no
  
    ) {
      toast.error('All fields are required!');
      return;
    }

    const verify = vehicleNum(data.vehicle_no);
    if (!verify.isValid) {
      toast.error('Vehicle Number Invalid!');
      return;
    }
  

    const formData = new FormData();

  
    Object.entries(data).forEach(([key, value]) => {

      let finalValue = value;
      if (value instanceof Date) {
        finalValue = value.toISOString().split('T')[0];
      }


      if (key === 'file' && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value?.toString() || '');
      }
    });

    try {
      const response = await fetch(`${BASE}vehicle/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result)
        toast.success('New Vehicle created!');
        fetchData({ pageSize, pageIndex, sortBy, search });
        setShow(false);

        setsave_data(result );


      } else {
        const error = await response.json();
        const errorMessage = error.message || Object.values(error)[0] || 'Duplicate entry';
        toast.error(`Error: ${errorMessage}`);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to connect to the server. Please try again later.');
    }

  };
  

  useEffect(() => { console.log(save_data) }, [save_data])


  const [brandoption, setbrandoption] = useState([]);
  

  const getbrandlist = async (catid) => {
    setbrandoption([]);

    try {
      const response = await fetch(
        `${apiUrl}options/brand/${catid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      console.log(result)
      const datas = result?.data?.map((item) => ({
        value: item.brand_id,
        label: item.brand
      }))
      setbrandoption(datas);
    }
    catch (err) {

    }
  }

  const [modeloption, setmodeloption] = useState([]);


  const getmodellist = async (brandid) => {
    setmodeloption([]);
    try {
      const response = await fetch(
        `${BASE}options/model/${brandid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      const datas = result?.data?.map(item => ({
        value: item.id,
        label: item.model
      }));
      setmodeloption(datas);
    }
    catch (err) {

    }
  }

  
 


  const fetchData = async ({ pageSize = 15, pageIndex = 0, sortBy = [], search = '', todate, location } = {}) => {
    setLoading(true);

    const sortColumn = sortBy.length > 0 ? sortBy[0].id : 'id';
    const sortOrder = sortBy.length > 0 && sortBy[0].desc ? 'desc' : 'asc';
    const orderBy = `${sortColumn} ${sortOrder}`;

    const limit = pageSize;
    const start = pageIndex * limit;

    try {
      const url = `${BASE}spareassign/list?start=${start}&limit=${limit}&search=${encodeURIComponent(search)}&order_by=${encodeURIComponent(orderBy)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const items = Array.isArray(result.data) ? result.data : [];
      let pageItems = [];
      if (items.length <= limit && pageIndex > 0) {
        pageItems = items;
      } else {
        pageItems = items.slice(start, start + limit);
      }

      setData(pageItems);
      const total = Number(result.total) || items.length || 0;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      setPageCount(totalPages);

    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setPageCount(1);
    } finally {
      setLoading(false);
    }
  };




  const columns = useMemo(
    () => [
      {
        Header: 'SL',
        id: 'sl',
        disableSortBy: true,
        Cell: ({ row }) => row.index + 1,
      },
      { Header: 'Vehicle Number', accessor: 'vehicle_no' },
      
      { Header: 'Trailer Number', accessor: 'trailer_no' },
      {
        Header: () => <FaBars />,
        id: 'actions',
        Cell: ({ row }) => {
          const id = row.original.id;
          if (!action_details) return null
          return (
            <div className="">
              <FaEye
                size={15}
                className={`ms-2 me-2 ${action_details?.isView ? "text-info pointer" : "text-muted"}`}
                onClick={() => action_details?.isView && viewvehicle(id)}
                style={{ cursor: action_details?.isView ? "pointer" : "not-allowed", opacity: action_details?.isView ? 1 : 0.5 }}
              />

              <FaEdit
                size={15}
                className={`ms-2 me-2 ${action_details?.isEdit ? "text-primary pointer" : "text-muted"}`}
                onClick={() => action_details?.isEdit && editvehicle(id)}
                style={{ cursor: action_details?.isEdit ? "pointer" : "not-allowed", opacity: action_details?.isEdit ? 1 : 0.5 }}
              />

              <FaTrash
                size={15}
                className={`ms-2 me-2 ${action_details?.isDelete ? "text-danger pointer" : "text-muted"}`}
                onClick={() => action_details?.isDelete && deletevehicle(id)}
                style={{ cursor: action_details?.isDelete ? "pointer" : "not-allowed", opacity: action_details?.isDelete ? 1 : 0.5 }}
              />

            </div>
          );
        },
        disableSortBy: true,
      },
    ],
    [action_details]
  );




  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount: controlledPageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, sortBy },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 15 },
      manualPagination: true,
      pageCount,
      manualSortBy: true,
      autoResetPage: false,
      autoResetSortBy: false,
      fetchData,
    },
    useSortBy,
    usePagination
  );


  useEffect(() => {
    fetchData({ pageSize, pageIndex, sortBy, search, todate, location });
  }, [pageSize, pageIndex, sortBy, search, todate, location]);

  useEffect(() => { console.log(save_data.vno) }, [])

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [updateshow, setupdateShow] = useState(false);
  const handleEClose = () => setupdateShow(false);

  const editvehicle = async (id) => {
    if (!authToken) {
      ReactSwal.fire({
        title: 'Error',
        text: 'Unauthorized, please log in.',
        icon: 'error',
      });
      return;
    }

    try {
      const response = await fetch(`${BASE}spareassign/edit/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const res = data.data;
        setupdated_data({
          id: res.id,
          vehicle_no: res.vehicle_no,
          trailer_no:res.trailer_no
        });
      
        setupdateShow(true);
      } else {
        const error = await response.json();
        ReactSwal.fire({
          title: 'Error',
          text: error.message || 'Unable to reach user data',
          icon: 'error',
        });
      }
    } catch (err) {
      console.error('Error:', err);
      ReactSwal.fire({
        title: 'Error',
        text: 'Failed to connect to the server. Please try again later.',
        icon: 'error',
      });
    }
  }



  const updatevichile = async () => {
    const data = updated_data;
    if (
      !data.vehicle_no ||
      !data.trailer_no 
    ) {
      toast.error('All fields are required!');
      return;
    }

    const verify = vehicleNum(data.vehicle_no);
    if (!verify.isValid) {
      toast.error('Vehicle Number Invalid!');
      return;
    }
  
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {

      let finalValue = value;
      if (value instanceof Date) {
        finalValue = value.toISOString().split('T')[0];
      }


      if (key === 'file' && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value?.toString() || '');
      }
    });
    console.log(formData)
    try {
      const response = await fetch(`${BASE}vehicle/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,

      });

      if (response.ok) {
        const result = await response.json();
        console.log(response)
        toast.success('Vehicle Updated!');
        fetchData({ pageSize, pageIndex, sortBy, search });
        setupdateShow(false);

        setupdated_data(intial_data);
      } else {
        const error = await response.json();
        const errorMessage = error.message || Object.values(error)[0] || 'Duplicate entry';
        toast.error(`Error: ${errorMessage}`);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to connect to the server. Please try again later.');
    }

  };

  const viewvehicle = async (id) => {
    setview(true);
    try {
      const response = await fetch(`${BASE}vehicle/edit/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const res = data.data;
        setupdated_data({
          id: res.id,
         vehicle_no:res.vehicle_no,
         trailer_no:res.trailer_no
        });
    
        console.log("success")
      } else {

      }
    } catch (err) {
      console.error('Error:', err);
      ReactSwal.fire({
        title: 'Error',
        text: 'Failed to connect to the server. Please try again later.',
        icon: 'error',
      });
    }

  }

  const handleviewclose = () => {
    setview(false)
  }

  const deletevehicle = async (id) => {
    try {
      const result = await ReactSwal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this user!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        const response = await fetch(`${BASE}vehicle/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          ReactSwal.fire({
            title: 'Deleted!',
            text: 'User deleted successfully!',
            icon: 'success',
          });

          fetchData({ pageSize, pageIndex, sortBy, search, todate, location });
        } else {
          const error = await response.json();
          ReactSwal.fire({
            title: 'Error',
            text: error.message || 'Unable to delete user',
            icon: 'error',
          });
        }
      }
    } catch (err) {
      console.error('Error:', err);
      ReactSwal.fire({
        title: 'Error',
        text: 'Failed to connect to the server. Please try again later.',
        icon: 'error',
      });
    }
  };



  const handleExportExcel = async () => {
    try {
      setExcelLoading(true);
      const response = await fetch(`${BASE}vehicle/list?start=0&limit=1000`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      const allData = Array.isArray(result.data) ? result.data : [];

      if (allData.length === 0) {
        alert("No data found for export");
        return;
      }
      const dataForExcel = allData.map((row, index) => ({
        "SL No": index + 1,
        "Vehicle No": row.vehicle_no,
       
        "Brand": row.brandname,
        "Model": row.modelname,
        // "Engine number": row.engine_num,
        // "Chassis number": row.chassis_num,
        // "HSN": row.hsn,
        // "Part No": row.part_num,
        // "Purchase date": row.purchase_date,
        // "Months of Warranty": row.year_warranty,
        // "Warranty Expire Date": row.exp_warranty,
        // "AMC Number": row.amc,
        // "AMC Date": row.amc_date,
        // "Wheels count": row.tyre_count,
        // "Stepney Count": row.step_count,
        // "Fuel Type":
        //   row?.fuel_type == 1
        //     ? "Diesel"
        //     : row?.fuel_type == 2
        //       ? "Petrol"
        //       : row?.fuel_type == 3
        //         ? "Gas"
        //         : "Battery",
        // "Insurance": row.insurance,
        // "Insurance Date": row.ins_date,
        // "Fitness Certificate": row.fc,
        // "Fitness Certificate Date": row.fc_date,
        // "Pollution Certificate": row.pc,
        // "Pollution Certificate Date": row.pc_date,
        // "Green Tax": row.green_tax,
        // "Green Tax Date": row.gtax_date,
        "Status": row.status === 1 ? "Inactive" : "Active",
      }));

      exportToExcel(dataForExcel, "Trailer Assign");

    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch data");
    } finally {
      setExcelLoading(false);
    }
  };




  const handleExportPDF = async () => {
    try {
      setPdfLoading(true);
      const response = await fetch(`${BASE}spareassign/list?start=0&limit=1000`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      const allData = Array.isArray(result.data) ? result.data : [];

      if (allData.length === 0) {
        alert("No data found for export");
        return;
      }
      const dataForExcel = allData.map((row, index) => ({
        "SL No": index + 1,
        "Vehicle No": row.vehicle_no,
        "Trailer No":row.trailer_no,
        "Status": row.status === 1 ? "Inactive" : "Active",
      }));

      exportToPDF(dataForExcel, "Trailer Assign");
    } catch (error) {
      console.error("PDF Export Error:", error);
      alert("Failed to export PDF");
    } finally {
      setPdfLoading(false);
    }
  };


  const handlePrint = async () => {
    try {
      setPrintLoading(true);
      const response = await fetch(`${BASE}spareassign/list?start=0&limit=1000`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      const allData = Array.isArray(result.data) ? result.data : [];

      if (allData.length === 0) {
        alert("No data found for export");
        return;
      }
      const dataForExcel = allData.map((row, index) => ({
        "SL No": index + 1,
        "Vehicle No": row.vehicle_no,
        'Trailer No':row.trailer_no,
        "Status": row.status === 1 ? "Inactive" : "Active",
      }));
      exportToPrint(dataForExcel, "Vehicle_Inventory");
    } catch (error) {
      console.error("Print Error:", error);
      alert("Failed to print report");
    } finally {
      setPrintLoading(false);
    }
  };


  // const fetchActionDetails = async (pageName) => {
  //   console.log("fetch")
  //   try {
  //     const response = await fetch(`${BASE}permission/lists/${roleId}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${authToken}`,
  //       },
  //     });

  //     if (response.ok) {
  //       console.log("fetching")
  //       console.log(response)
  //       const data = await response.json();
  //       let founditem=null
  //       const findrecursively = (nodes) => {
  //        for(let node of nodes){
  //         if ( node.to && node.to.replace("/", "") === pageName) // compare with path
  //         {
  //           return node
  //         }
  //         if(node.children)
  //         {
  //           const child=findrecursively(node.children)
  //           if(child)
  //           {
  //             return child
  //           }
  //         }
  //        }
  //        return null
  //       }
  //        founditem = findrecursively(data)
  //       console.log(founditem)
  //       console.log(founditem?.isView)
  //       setactiondetails(founditem)

  //       // if (Array.isArray(data)
  //       //   &&
  //       //   data[1]?.children?.[0]?.children?.[0] &&
  //       //   data[1].children[0].children[0].name === "Vehicle Inventory") {
  //       //   veh_invent = data[1].children[0].children[0]
  //       // }




  //     } else {
  //       const error = await response.json();
  //       ReactSwal.fire({
  //         title: 'Error',
  //         text: error.message || 'Unable to reach user data',
  //         icon: 'error',
  //       });
  //     }
  //   } catch (err) {
  //     console.error('Error:', err);
  //     ReactSwal.fire({
  //       title: 'Error',
  //       text: 'Failed to connect to the server. Please try again later.',
  //       icon: 'error',
  //     });
  //   }
  // }
  //  / remove leading "/" → "vehicle_inventory"
  useEffect(() => {
    const pageName = location.pathname.replace("/", "");
    fetchActionDetails(pageName);
   }, [roleId,location])


  useEffect(() => { console.log(roleId) }, [roleId])

  const fuelOptions = [
    { value: "1", label: "Diesel" },
    { value: "2", label: "Petrol" },
    { value: "3", label: "Gas" },
    { value: "4", label: "Battery" },
  ];
  setTimeout(() => {
    console.log("Image URL →", `${file_base_url}uploads/${updated_data.image}`);
  }, 1000)
    const selectoptions = [{ value: 'vehicle', label: 'Vehicle' }, { value: 'trailer', label: 'Trailer' },]


  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className='bg-secondary text-light'>
          Tyre Assign
        </CCardHeader>

        <CCardBody>
          <input
            type="search"
            onChange={(e) => setsearch(e.target.value)}
            className="form-control form-control-sm m-1 float-end w-auto"
            placeholder='Search'
          />

          <CButtonGroup role="group" aria-label="Basic example">
            <CButton className="btn btn-sm btn-primary w-auto" onClick={handleShow}> New </CButton>
            <CButton className="btn btn-sm btn-secondary w-auto"
              onClick={() => {
                Excelloading
                handleExportExcel();
              }} disabled={Excelloading} >
              {Excelloading ? "Exporting..." : "Excel"}
            </CButton>

            <CButton className="btn btn-sm btn-secondary w-auto"
              onClick={() => {
                Pdfloading
                handleExportPDF();
              }} disabled={Pdfloading} >
              {Pdfloading ? "Exporting..." : "PDF"}
            </CButton>

            <CButton className="btn btn-sm btn-secondary w-auto"
              onClick={() => {
                Printloading
                handlePrint();
              }} disabled={Printloading} >
              {Printloading ? "Printing..." : "Print"}
            </CButton>

          </CButtonGroup>
          <CTable striped bordered hover size="sm" variant="dark" {...getTableProps()} style={{ fontSize: '0.75rem' }}>
            <CTableHead color="secondary">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </CTableHead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                const serial = pageIndex * pageSize + row.index + 1;
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (

                      <td {...cell.getCellProps()}>
                        {cell.column.id === 'sl' ? serial : cell.render('Cell')}
                      </td>


                    ))}
                  </tr>
                );
              })}
            </tbody>

          </CTable>

          <div>
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageCount}
              </strong>{' '}
            </span>
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className='mb-3 bg-secondary float-end w-auto'>
              {'<<'}
            </button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage} className='mb-3 bg-secondary float-end w-auto'>
              {'<'}
            </button>
            <button onClick={() => nextPage()} disabled={!canNextPage} className='mb-3 bg-secondary float-end w-auto'>
              {'>'}
            </button>
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className='mb-3 bg-secondary float-end w-auto'>
              {'>>'}
            </button>
          </div>
        </CCardBody>
      </CCard>


     <CModal
                alignment="center"
                scrollable
                visible={show}
                size="md"
                onClose={() => handleClose()}
                aria-labelledby="NewProcessing"
            >
                <CModalHeader className='bg-secondary'>
                    <CModalTitle id="NewProcessing">Tyre Assign</CModalTitle>
                </CModalHeader>
                <CModalBody>

                    <CRow>

                        <CCol md={12}>
                            <CFormLabel className="col-form-label">
                                Select type
                            </CFormLabel>
                            <Select options={selectoptions} value={selectedtype} isMulti={false} placeholder="Select type" size="sm" className='mb-2 small-select'
                                classNamePrefix="custom-select"
                                onChange={(option) => {
                                    setSelectedtype(option)
                                }}
                            />


                            <CFormLabel className="col-form-label">
                                Select Number
                            </CFormLabel>
                            <Select isMulti={false} placeholder="Select Number" size="sm" className='mb-2 small-select'
                                classNamePrefix="custom-select"
                                onChange={(selectedOption) => {
                                    setsave_data((prev) => ({
                                        ...prev,
                                        brand: selectedOption ? selectedOption.value : '',
                                    }));
                                    if (selectedOption) {
                                        getmodellist(selectedOption.value);
                                    }
                                }}
                            />


                        </CCol>
                    </CRow>

                    <CRow>
                        {[...Array(6)].map((_, index) => (<CCol md={6}>nvkvhbk</CCol>))}
                    </CRow>

                </CModalBody>

                <CModalFooter>
                    <CButton color="primary" onClick={submitvichile}>Add</CButton>
                </CModalFooter>
            </CModal>







            {/* update */}
            <CModal
                alignment="center"
                scrollable
                visible={updateshow}
                size="xl"
                onClose={() => handleEClose()}
                aria-labelledby="NewProcessing"
            >
                <CModalHeader className='bg-secondary'>
                    {updated_data.image ? <CImage rounded src={`${file_base_url}uploads/${updated_data.image}`} width={50} height={50} className='me-2' /> : ''}  <CModalTitle id="NewProcessing"> {updated_data.vno}</CModalTitle>
                </CModalHeader>
                <CModalBody>

                    <CRow>

                        <CCol md={6}>

                            <CFormLabel className="col-form-label">
                                Vehicle Number
                            </CFormLabel>
                            <CFormInput
                                type="text"
                                size="sm"
                                placeholder="Vehicle Number"
                                className="mb-2 vehiclenumber"
                                value={updated_data.vno}
                                onChange={(e) => {
                                    setupdated_data((prev) => ({
                                        ...prev,
                                        vno: e.target.value.toUpperCase(),
                                    }));
                                }}
                                onKeyUp={(e) => {
                                    const result = vehicleNum(e.target.value);
                                    if (e.target.value.length > 9 && !result.isValid) {
                                        toast.error('Vehicle Number Invalid!');
                                    }
                                }}
                                readOnly
                            />



                            <CFormLabel className="col-form-label">
                                Type
                            </CFormLabel>
                            <Select options={typelist} isMulti={false} placeholder="Select Category" size="sm" className='mb-2 small-select'
                                classNamePrefix="custom-select"
                                value={typelist.find(option => option.value === updated_data.type) || null}
                                onChange={(selectedOption) => {
                                    setupdated_data((prev) => ({
                                        ...prev,
                                        type: selectedOption ? selectedOption.value : '',
                                    }));
                                }}
                            />

                            <CFormLabel className="col-form-label">
                                Category
                            </CFormLabel>
                            <Select options={categoryoption} isMulti={false} placeholder="Select Category" size="sm" className='mb-2 small-select'
                                classNamePrefix="custom-select"
                                value={categoryoption.find(option => option.value === updated_data.category) || null}
                                onChange={(selectedOption) => {
                                    setupdated_data((prev) => ({
                                        ...prev,
                                        category: selectedOption ? selectedOption.value : '',
                                    }));
                                    if (selectedOption) {
                                        ebrandoption(selectedOption.value);
                                    }
                                }}
                            />

                            <CFormLabel className="col-form-label">
                                Brand
                            </CFormLabel>
                            <Select options={brandoption} isMulti={false} placeholder="Select Brand" size="sm" className='mb-2 small-select'
                                classNamePrefix="custom-select"
                                value={brandoption.find(option => option.value === updated_data.brand) || null}
                                onChange={(selectedOption) => {
                                    setupdated_data((prev) => ({
                                        ...prev,
                                        brand: selectedOption ? selectedOption.value : '',
                                    }));
                                    if (selectedOption) {
                                        getmodellist(selectedOption.value);
                                    }
                                }}
                            />

                            <CFormLabel className="col-form-label">
                                Model
                            </CFormLabel>

                            <Select options={modeloption} isMulti={false} placeholder="Select Model" size="sm" className='mb-2 small-select'
                                classNamePrefix="custom-select"
                                value={modeloption.find(option => option.value === updated_data.modal) || null}
                                onChange={(selectedOption) => {
                                    setupdated_data((prev) => ({
                                        ...prev,
                                        modal: selectedOption ? selectedOption.value : '',
                                    }));
                                }}
                            />

                            <CFormLabel className="col-form-label">
                                Purchase Date
                            </CFormLabel>
                            <CFormInput type="date" size="sm"
                                value={updated_data.purchasedate}
                                onChange={(e) =>
                                    setupdated_data((prev) => ({
                                        ...prev,
                                        purchasedate: e.target.value,
                                    }))
                                }
                                className='mb-2' />

                            <CFormLabel className="col-form-label">
                                Months of warranty
                            </CFormLabel>
                            <CFormInput type="text" size="sm"
                                value={updated_data.warrentyyear}
                                onChange={(e) =>
                                    setupdated_data((prev) => ({
                                        ...prev,
                                        warrentyyear: e.target.value,
                                    }))
                                }
                                onKeyUp={(e) => {
                                    const result = ValidMonth(e.target.value);
                                    if (e.target.value.length > 1 && !result.isValid) {
                                        toast.error('Month Invalid!');
                                    }
                                }}
                                placeholder="Month of warranty" className='mb-2' />



                            <CFormLabel className="col-form-label">
                                AMC
                            </CFormLabel>

                            <CInputGroup className="mb-2">
                                <CFormInput type="text" size="sm"
                                    value={updated_data.amc}
                                    onChange={(e) =>
                                        setupdated_data((prev) => ({
                                            ...prev,
                                            amc: e.target.value,
                                        }))
                                    }
                                    placeholder="AMC File Number" />

                                <CFormInput type="date" size="sm"
                                    value={updated_data.amcdate}
                                    onChange={(e) =>
                                        setupdated_data((prev) => ({
                                            ...prev,
                                            amcdate: e.target.value,
                                        }))
                                    }
                                />
                            </CInputGroup>


                            <CFormLabel className="col-form-label">
                                Tyre count / Stepney Count
                            </CFormLabel>
                            <CInputGroup className="mb-2">
                                <CFormInput type="text" size="sm"
                                    value={updated_data.tyrecnt}
                                    onChange={(e) =>
                                        setupdated_data((prev) => ({
                                            ...prev,
                                            tyrecnt: e.target.value,
                                        }))
                                    }
                                    onKeyUp={(e) => {
                                        const result = ValidSingleDigit(e.target.value);
                                        if (e.target.value.length > 0 && !result.isValid) {
                                            toast.error('Tyre Count Invalid!');
                                        }
                                    }}
                                    placeholder="Tyre count" />

                                <CFormInput type="text" size="sm"
                                    value={updated_data.stepnycnt}
                                    onChange={(e) =>
                                        setupdated_data((prev) => ({
                                            ...prev,
                                            stepnycnt: e.target.value,
                                        }))
                                    }
                                    onKeyUp={(e) => {
                                        const result = ValidSingleDigit(e.target.value);
                                        if (e.target.value.length > 0 && !result.isValid) {
                                            toast.error('Tyre Count Invalid!');
                                        }
                                    }}
                                    placeholder="Stepney Count" />
                            </CInputGroup>

                        </CCol>

                        <CCol md={6}>


                            <CFormLabel className="col-form-label">
                                Fuel Type
                            </CFormLabel>
                            <select placeholder="Select Brand" size="sm" className='form-control form-control-sm mb-2'
                                value={updated_data.fuel}
                                onChange={(e) =>
                                    setupdated_data((prev) => ({
                                        ...prev,
                                        fuel: e.target.value,
                                    }))
                                }
                            >
                                <option value="1">Diesel</option>
                                <option value="2">Petrol</option>
                                <option value="3">Gas</option>
                                <option value="4">Battery</option>
                            </select>

                            <CFormLabel className="col-form-label">
                                Engine Number
                            </CFormLabel>
                            <CFormInput type="text" size="sm"
                                value={updated_data.enginenumber}
                                onChange={(e) =>
                                    setupdated_data((prev) => ({
                                        ...prev,
                                        enginenumber: e.target.value,
                                    }))
                                }
                                placeholder="Engine Number" className='mb-2' />

                            <CFormLabel className="col-form-label">
                                Classic number
                            </CFormLabel>
                            <CFormInput type="text" size="sm"
                                value={updated_data.chassisnumber}
                                onChange={(e) =>
                                    setupdated_data((prev) => ({
                                        ...prev,
                                        chassisnumber: e.target.value,
                                    }))
                                }
                                placeholder="Chassis number" className='mb-2' />


                            <CFormLabel className="col-form-label">
                                HSN Number
                            </CFormLabel>
                            <CFormInput type="text" size="sm"
                                value={updated_data.hsn}
                                onChange={(e) =>
                                    setupdated_data((prev) => ({
                                        ...prev,
                                        hsn: e.target.value,
                                    }))
                                }
                                onKeyUp={(e) => {
                                    const result = validateHSN(e.target.value);
                                    if (e.target.value.length > 7 && !result.isValid) {
                                        toast.error('HSN Number Invalid!');
                                    }
                                }}
                                placeholder="HSN Number" className='mb-2' />

                            <CFormLabel className="col-form-label">
                                Insurance
                            </CFormLabel>

                            <CInputGroup className="mb-2">
                                <CFormInput type="text" size="sm"
                                    value={updated_data.insurancenumber}
                                    onChange={(e) =>
                                        setupdated_data((prev) => ({
                                            ...prev,
                                            insurancenumber: e.target.value,
                                        }))
                                    }
                                    placeholder="Insurance Number" />

                                <CFormInput type="date" size="sm"
                                    value={updated_data.insuranceenddate}
                                    onChange={(e) =>
                                        setupdated_data((prev) => ({
                                            ...prev,
                                            insuranceenddate: e.target.value,
                                        }))
                                    }
                                />
                            </CInputGroup>

                            <CFormLabel className="col-form-label">
                                Fitness Certificate
                            </CFormLabel>
                            <CInputGroup className="mb-2">
                                <CFormInput type="text" size="sm"
                                    value={updated_data.fitness}
                                    onChange={(e) =>
                                        setupdated_data((prev) => ({
                                            ...prev,
                                            fitness: e.target.value,
                                        }))
                                    }
                                    placeholder="Fitness Certificate Number" />

                                <CFormInput type="date" size="sm"
                                    value={updated_data.fitnessdate}
                                    onChange={(e) =>
                                        setupdated_data((prev) => ({
                                            ...prev,
                                            fitnessdate: e.target.value,
                                        }))
                                    }
                                />
                            </CInputGroup>


                            <CFormLabel className="col-form-label">
                                Pollution  Certificate
                            </CFormLabel>

                            <CInputGroup className="mb-2">
                                <CFormInput type="text" size="sm"
                                    value={updated_data.puc}
                                    onChange={(e) =>
                                        setupdated_data((prev) => ({
                                            ...prev,
                                            puc: e.target.value,
                                        }))
                                    }
                                    placeholder="Pollution Certificate Number" />

                                <CFormInput type="date" size="sm"
                                    value={updated_data.pucdate}
                                    onChange={(e) =>
                                        setupdated_data((prev) => ({
                                            ...prev,
                                            pucdate: e.target.value,
                                        }))
                                    }
                                />
                            </CInputGroup>

                            <CFormLabel className="col-form-label">
                                Green Tax
                            </CFormLabel>
                            <CInputGroup className="mb-2">
                                <CFormInput type="text" size="sm"
                                    value={updated_data.greentax}
                                    onChange={(e) =>
                                        setupdated_data((prev) => ({
                                            ...prev,
                                            greentax: e.target.value,
                                        }))
                                    }
                                    placeholder="Green Tax Number" />

                                <CFormInput type="date" size="sm"
                                    value={updated_data.greendate}
                                    onChange={(e) =>
                                        setupdated_data((prev) => ({
                                            ...prev,
                                            greendate: e.target.value,
                                        }))
                                    }
                                />
                            </CInputGroup>

                            <div className="mb-3">
                                <label htmlFor="formFileSm" className="form-label">Image</label>
                                <input className="form-control form-control-sm" id="formFileSm" type="file"
                                    onChange={(e) =>
                                        setupdated_data((prev) => ({
                                            ...prev,
                                            file: e.target.files[0],
                                        }))
                                    }

                                />
                            </div>

                        </CCol>

                    </CRow>
                </CModalBody>

                <CModalFooter>
                    <CButton color="primary" onClick={updatevichile}>Update</CButton>
                </CModalFooter>
            </CModal>


        </>
    )




}

export default Spareassign
