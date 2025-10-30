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
  
  
  
  const ToolInventory = () => {
  
    const BASE = import.meta.env.VITE_BASE_URL;
    const apiUrl = import.meta.env.VITE_API_URL;
    const ReactSwal = withReactContent(Swal);
    const [data, setData] = useState([]);
  
    const [loading, setLoading] = useState(false);
    const [Excelloading, setExcelLoading] = useState(false);
    const [Pdfloading, setPdfLoading] = useState(false);
    const [Printloading, setPrintLoading] = useState(false);
  
  
    const [pageCount, setPageCount] = useState(0);
    const [search, setsearch] = useState('');
    const [categoryoption, setcategoryoption] = useState([]);
    const [categoryid, setcategoryid] = useState('');
    const [fromdate, setfromdate] = useState(today);
    const [todate, settodate] = useState(today);
    const [location, setlocation] = useState('');
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
    const [action_details, setactiondetails] = useState({})
    const { roleId } = useContext(Sharedcontext)
    
  
    const intial_data = {
      toolname: '',
      purchasedate: today,
      warrentyyear: '',
      identity: '',
    };
  
    const [save_data, setsave_data] = useState(intial_data);

    console.log(save_data);
    
    const [updated_data, setupdated_data] = useState(intial_data);
  
    const submitvichile = async () => {
      const data = save_data;
      if (
        !data.toolname ||
        !data.identity 
      ) {
        toast.error('All fields are required!');
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
        const response = await fetch(`${BASE}tool/create`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
          body: formData
        });
  
        if (response.ok) {
          const result = await response.json();
          toast.success('New Tool created!');
          fetchData({ pageSize, pageIndex, sortBy, search });
          setShow(false);
  
          setsave_data({
             toolname: '',
            purchasedate: today,
            warrentyyear: '',
            identity: '',
          });
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

    useEffect(() => { getlistoptions() }, [])
    useEffect(() => { getcategorylist() }, [save_data.type])
  
    const getlistoptions = async () => {
      try {
        const response = await fetch(
          `${BASE}options/type`,
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
  
        const datas = result?.Type?.map(item => ({
          value: item.id,
          label: item.type
        }));
        settypelist(datas);
      }
      catch (err) {
  
      }
  
    }
  
    const getcategorylist = async () => {
      setcategoryoption([]);
      try {
        const response = await fetch(
          `${BASE}options/category`,
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
  
        const datas = result?.data?.map(item => ({
          value: item.id,
          label: item.category
        }));
        setcategoryoption(datas);
      }
      catch (err) {
  
      }
    }
  
    const [brandoption, setbrandoption] = useState([]);
    const [brandid, setbrandid] = useState('');
  
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
    const [modelid, setmodelid] = useState('');
  
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
  
    useEffect(() => {
      getcategorylist();
    }, []);
  
    const authToken = JSON.parse(sessionStorage.getItem('authToken')) || '';
  
  
     const fetchData = async ({ pageSize = 15, pageIndex = 0, sortBy = [], search = '', todate, location } = {}) => {
      setLoading(true);
  
      const sortColumn = sortBy.length > 0 ? sortBy[0].id : 'id';
      const sortOrder = sortBy.length > 0 && sortBy[0].desc ? 'desc' : 'asc';
      const orderBy = `${sortColumn} ${sortOrder}`;
  
      const limit = pageSize;
      const start = pageIndex * limit;
  
      try {
        const url = `${BASE}tool/list?start=${start}&limit=${limit}&search=${encodeURIComponent(search)}&order_by=${encodeURIComponent(orderBy)}`;
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
        { Header: 'Tool Name', accessor: 'toolname' },
        { Header: 'Identity', accessor: 'identity' },
        { Header: 'Purchase date', accessor: 'purchase_date' },
        {
          Header: () => <FaBars />,
          id: 'actions',
          Cell: ({ row }) => {
            const id = row.original.id;
            if (!action_details) return null
            return (
              <div className="">
                {action_details?.isView && (
                  <FaEye
                    size={15}
                    className="ms-2 me-2 pointer text-info"
                    onClick={() => viewvehicle(id)}
                  />
                )}
                {action_details?.isEdit && (
                  <FaEdit
                    size={15}
                    className="ms-2 me-2 pointer text-info"
                    onClick={() => editvehicle(id)}
                  />
                )}
  
                {action_details?.isDelete && (
                  <FaTrash
                    size={15}
                    className="ms-2 me-2 pointer text-info"
                    onClick={() => deletevehicle(id)}
                  />
                )}
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
        const response = await fetch(`${BASE}tool/edit/${id}`, {
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
            toolname: res.toolname,
            years_warrenty: res.years_warrenty,
            purchase_date: res.purchase_date,
            identity:res.identity
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
         !data.toolname ||
         !data.identity 
      ) {
        toast.error('All fields are required!');
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
        const response = await fetch(`${BASE}tool/update`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
          body: formData,
  
        });
  
        if (response.ok) {
          const result = await response.json();
          toast.success('Tool Updated!');
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
        const response = await fetch(`${BASE}tool/edit/${id}`, {
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
            toolname: res.toolname,
            years_warrenty: res.years_warrenty,
            purchase_date: res.purchase_date,
            identity:res.identity
          });
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
          const response = await fetch(`${BASE}tool/delete/${id}`, {
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
  
  const fetchVehicleData = async (authToken) => {
    const response = await fetch(`${BASE}tool/list?start=0&limit=1000`, {
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
      return [];
    }
  
    return allData.map((row, index) => ({
      "SL No": index + 1,
      "Spare Name": row.toolname,
      "Identity": row.identity,
      "Purchase date": row.purchase_date,
      "Months of Warranty": row.years_warrenty,
    }));
  };
  
  
  const handleExportExcel = async () => {
    try {
      setExcelLoading(true);
      const data = await fetchVehicleData(authToken);
      if (data.length > 0) exportToExcel(data, "Tool_Inventory");
    } catch (error) {
      console.error("Excel Export Error:", error);
      alert("Failed to export Excel");
    } finally {
      setExcelLoading(false);
    }
  };
  
  const handleExportPDF = async () => {
    try {
      setPdfLoading(true);
      const data = await fetchVehicleData(authToken);
      if (data.length > 0) exportToPDF(data, "Tool_Inventory");
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
      const data = await fetchVehicleData(authToken);
      if (data.length > 0) exportToPrint(data, "Tool_Inventory");
    } catch (error) {
      console.error("Print Error:", error);
      alert("Failed to print report");
    } finally {
      setPrintLoading(false);
    }
  };
  
  
    const fetchActionDetails = async () => {
      console.log("fetch")
      try {
        const response = await fetch(`${BASE}permission/lists/${roleId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });
  
        if (response.ok) {
          console.log("fetching")
          const data = await response.json();
          let veh_invent = null;
          if (Array.isArray(data)
            &&
            data[1]?.children?.[0]?.children?.[0] &&
            data[1].children[0].children[0].name === "Vehicle Inventory") {
            veh_invent = data[1].children[0].children[0]
          }
  
          console.log(veh_invent)
          console.log(veh_invent?.isView)
          setactiondetails(veh_invent)
  
  
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
    useEffect(() => { fetchActionDetails() }, [roleId])

    return (
      <>
         <CCard className="mb-4">
                <CCardHeader className='bg-secondary text-light'>
                  Tool Inventory
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
                      onClick={() => {Excelloading
                            handleExportExcel();
                          }} disabled={Excelloading} >
                            { Excelloading ? "Exporting..." : "Excel" } 
                         </CButton>
  
                    <CButton className="btn btn-sm btn-secondary w-auto" 
                    onClick={() => {Pdfloading
                            handleExportPDF();
                          }} disabled={Pdfloading} >
                            { Pdfloading ? "Exporting..." : "PDF" }   
                    </CButton>
  
                    <CButton className="btn btn-sm btn-secondary w-auto"
                        onClick={() => {Printloading
                            handlePrint();
                          }} disabled={Printloading} >
                            { Printloading ? "Printing..." : "Print" } 
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
  
  
  
        {/* create */}
        <CModal
          alignment="center"
          scrollable
          visible={show}
          size="md"
          onClose={() => handleClose()}
          aria-labelledby="NewProcessing"
        >
          <CModalHeader className='bg-secondary'>
            <CModalTitle id="NewProcessing">New Tool</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol md={12}>
                <CFormLabel className="col-form-label">
                  Tool Name
                </CFormLabel>
                <CFormInput
                  type="text"
                  size="sm"
                  placeholder="Tool Name"
                  className="mb-2 vehiclenumber"
                  onChange={(e) => {
                    setsave_data((prev) => ({
                      ...prev,
                      toolname: e.target.value.toUpperCase(),
                    }));
                  }}
                />
  
                <CFormLabel className="col-form-label">
                  Purchase Date
                </CFormLabel>
                <CFormInput type="date" value={save_data.purchasedate} size="sm"
                  onChange={(e) =>
                    setsave_data((prev) => ({
                      ...prev,
                      purchasedate: e.target.value,
                    }))
                  }
                  className='mb-2' />
  
                <CFormLabel className="col-form-label">
                  Months of warranty
                </CFormLabel>
                <CFormInput type="text" size="sm"
                  onChange={(e) =>
                    setsave_data((prev) => ({
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
                  Identity
                </CFormLabel>
                <CInputGroup className="mb-2">
                  <CFormInput type="text" size="sm"
                    onChange={(e) =>
                      setsave_data((prev) => ({
                        ...prev,
                        identity: e.target.value,
                      }))
                    }
                    placeholder="Identity" />
                </CInputGroup>
  
              </CCol>
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
          
             <CModalTitle id="NewProcessing"> {updated_data.toolname}</CModalTitle>
          </CModalHeader>
          <CModalBody>
  
            <CRow>
  
              <CCol md={12}>


                 <CFormLabel className="col-form-label">
                  Tool Name
                </CFormLabel>
                <CFormInput
                  type="text"
                  size="sm"
                  placeholder="Tool Name"
                  className="mb-2 vehiclenumber"
                  value={updated_data.toolname}
                  onChange={(e) => {
                    setupdated_data((prev) => ({
                      ...prev,
                      toolname: e.target.value.toUpperCase(),
                    }));
                  }}
                />
  
                <CFormLabel className="col-form-label">
                  Purchase Date
                </CFormLabel>
                <CFormInput type="date" value={updated_data.purchase_date} size="sm"
                  onChange={(e) =>
                    setupdated_data((prev) => ({
                      ...prev,
                      purchase_date: e.target.value,
                    }))
                  }
                  className='mb-2' />
  
                <CFormLabel className="col-form-label">
                  Months of warranty
                </CFormLabel>
                <CFormInput type="text" size="sm"
                 value={updated_data.years_warrenty}
                  onChange={(e) =>
                    setupdated_data((prev) => ({
                      ...prev,
                      years_warrenty: e.target.value,
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
                  Identity
                </CFormLabel>
                <CInputGroup className="mb-2">
                  <CFormInput type="text" size="sm"
                  value={updated_data.identity}
                    onChange={(e) =>
                      setupdated_data((prev) => ({
                        ...prev,
                        identity: e.target.value,
                      }))
                    }
                    placeholder="Identity" />
                </CInputGroup>
  
                
              </CCol>
            </CRow>
          </CModalBody>
  
          <CModalFooter>
            <CButton color="primary" onClick={updatevichile}>Update</CButton>
          </CModalFooter>
        </CModal>
  
  
        {view && (
          <CModal
            alignment="center"
            scrollable
            visible={view}
            size="md"
            onClose={() => handleviewclose()}
            aria-labelledby="NewProcessing"
          >
            <CModalHeader className="bg-secondary">
              <CModalTitle id="ViewVehicle">{updated_data.toolname}</CModalTitle>
            </CModalHeader>
  
            <CModalBody>
              <CTable bordered hover>
                <CTableBody>
                  {[
                    { label: "Tool Name", value: updated_data.toolname },
                    { label: "Identity", value: updated_data.identity },
                    { label: "Warrenty Months", value: updated_data.years_warrenty },
                    { label: "Purchase Date", value: updated_data.purchase_date },
                  ].map((item, idx) => (
                    <CTableRow key={idx}>
                      <CTableHeaderCell className="fw-bold" style={{ width: "30%" }}>
                        {item.label}
                      </CTableHeaderCell>
                      <CTableDataCell>{item.value || "-"}</CTableDataCell>
                    </CTableRow>
                  ))}
  
                </CTableBody>
              </CTable>
            </CModalBody>
  
            <CModalFooter>
              <CButton color="secondary" onClick={() => setview(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
        )}
  
      </>
    )
  }
  
  export default ToolInventory
  