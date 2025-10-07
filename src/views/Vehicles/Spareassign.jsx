import React, { useEffect, useState, createRef, useMemo } from 'react'
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
  CImage, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell
} from '@coreui/react'
import { FaBars, FaExchangeAlt, FaMinusSquare, FaHistory } from 'react-icons/fa';
import { CIcon } from '@coreui/icons-react';
import { cilTrash, cilPencil } from '@coreui/icons';
import Select from 'react-select';
import { useTable, usePagination, useSortBy } from 'react-table';
import { isNumberKey, base_url, today, file_base_url } from '../service';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { vehicleNum, validateHSN, ValidMonth, ValidSingleDigit } from '../../utils/validators';


const SpareAssign = () => {
  const BASE = import.meta.env.VITE_BASE_URL;
  const apiUrl = import.meta.env.VITE_API_URL;
  const ReactSwal = withReactContent(Swal);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [search, setsearch] = useState('');
  const [categoryoption, setcategoryoption] = useState([]);
  const [categoryid, setcategoryid] = useState('');
  const [history, sethistory] = useState([])
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
  const [selectedvalues, setselectedvalues] = useState({ vehicle_id: "", trailer_id: "" })
  const [showHistory, setShowHistory] = useState(false)
  const [save_data, setsave_data] = useState({ vehicle_id: "", trailer_id: "", brand: "", modal: "", partnumber: "", serialno: ""  });
  // const [updated_data, setupdated_data] = useState({ vehicle_id: "", trailer_id: "" });
  const [brandoption, setbrandoption] = useState([]);
  const authToken = JSON.parse(sessionStorage.getItem('authToken')) || '';
  


  const submitvichile = async () => {
    const data = save_data;
    if (
      !data.vehicle_id ||
      !data.serialno
    ) {
      toast.error('All fields are required!');
      return;
    }


    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'file' && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value?.toString() || '');
      }
    });

    try {
      const response = await fetch(`${apiUrl}spareassign/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('New Spare Assigned!');
        fetchData({ pageSize, pageIndex, sortBy, search });
        setShow(false);
        setsave_data({ vehicle_id: "", trailer_id: "", brand: "", modal: "", partnumber: "", serialno: "" });
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


  const getbrandlist = async () => {
    setbrandoption([]);
    try {
      const response = await fetch(
        `${BASE}options/brand/9`,
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
      const datas = result.data.map(item => ({
        value: item.brand_id,
        label: item.brand
      }));
      setbrandoption(datas);
    }
    catch (err) {

    }
  }

  useEffect(() => {
    getbrandlist();
  }, []);

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


   const [partnoOption, setpartnoOption] = useState([]);
 
  const getpartnolist = async (modelid) => {
    setpartnoOption([]);
    try {
      const response = await fetch(
        `${BASE}options/getspare/${modelid}`,
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
      const datas = result?.spare?.map(item => ({
        value: item.part_num,
        label: item.part_num
      }));
      setpartnoOption(datas);
    }
    catch (err) {

    }
  }
   const [serialnoOptions, setserialnoOptions] = useState([]);


  const getserialnolist = async (partno) => {
    setserialnoOptions([]);
    try {
      const response = await fetch(
        `${BASE}options/getserial/${partno}`,
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
        label: item.serial_number
      }));
      setserialnoOptions(datas);
    }
    catch (err) {

    }
  }


  const fetchData = async ({ pageSize = 15, pageIndex, sortBy, search, todate, location }) => {
    setLoading(true);
    const sortColumn = sortBy.length > 0 ? sortBy[0].id : 'id';
    const sortOrder = sortBy.length > 0 && sortBy[0].desc ? 'desc' : 'asc';

    const orderBy = `${sortColumn} ${sortOrder}`;

    const limit = pageSize;
    const start = pageIndex * limit;

    try {
      const response = await fetch(
        `${apiUrl}spareassign/list?start=${start}&limit=${limit}&search=${search}&order_by=${orderBy}`,
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
      { Header: 'Vehicle', accessor: 'vehicle_number' },
      { Header: 'Brand', accessor: 'brand_name' },
      { Header: 'Model', accessor: 'model' },
      { Header: 'Part No', accessor: 'part_num' },
      { Header: 'Spare Name', accessor: 'spare_name' },
      { Header: 'Serial No', accessor: 'serial_number' },
      {
        Header: () => <FaBars />,
        id: 'actions',
        Cell: ({ row }) => {
          const id = row.original.id;

          return (
            <div className="flex gap-5">
              <FaHistory className="ms-2 pointer text-info" onClick={() => viewvehicle(id)} />

              <FaMinusSquare className="ms-2 pointer text-danger" onClick={() => deletevehicle(id)} />

            </div>
          );
        },
        disableSortBy: true,
      },
    ],
    []
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



  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  const viewvehicle = async (id) => {
    try {
      const response = await fetch(`${BASE}spareassign/history/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        sethistory(data.data); // assuming your API returns { data: [...] }
        setShowHistory(true)
      } else {
        const error = await response.json();
        ReactSwal.fire({
          title: 'Error',
          text: error.message || 'Failed to fetch history',
          icon: 'error',
        });
      }
    } catch (err) {
      console.error('Error:', err);
      ReactSwal.fire({
        title: 'Error',
        text: 'Unable to connect to the server',
        icon: 'error',
      });
    }
  };


  const deletevehicle = async (id) => {
    try {
      const result = await ReactSwal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this Data!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        const response = await fetch(`${BASE}spareassign/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          ReactSwal.fire({
            title: 'Deleted!',
            text: 'Spare Assign deleted successfully!',
            icon: 'success',
          });

          fetchData({ pageSize, pageIndex, sortBy, search, todate, location });
        } else {
          const error = await response.json();
          ReactSwal.fire({
            title: 'Error',
            text: error.message || 'Unable to delete Spare Assign',
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


  const [vehicle_search, setVehicle_search] = useState("");
  const [vehicle_options, setVehicle_options] = useState([]);


  const fetchvehicle_search = async (search) => {
    if (!search) {
      setVehicle_options([]);
      return;
    }

    try {
      const url = `${BASE}vehicle/search/${encodeURIComponent(search)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      // transform API -> react-select format
      const formatted = result.map((item) => ({
        value: item.id,
        label: item.vehicle_number,
      }));

      setVehicle_options(formatted);
      // vehicle options created
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  const [brand_search, setbrand_search] = useState("");
  const [brand_options, setbrand_options] = useState([]);


  const fetchbrand_search = async (search) => {
    if (!search) {
      setbrand_options([]);
      return;
    }

    try {
      const url = `${BASE}options/brand_search/${encodeURIComponent(search)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const result = data.data;
      // transform API -> react-select format
      const formatted = result.map((item) => ({
        value: item.brand_id,
        label: item.brand_name,
      }));

      setbrand_options(formatted);

      console.log("brand options", formatted);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

   useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchbrand_search(brand_search);
    }, 5);

    return () => clearTimeout(delayDebounce);
  }, [brand_search]);

  
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchvehicle_search(vehicle_search);
    }, 5);

    return () => clearTimeout(delayDebounce);
  }, [vehicle_search]);

 



  return (
    <>
      <CCard className="mb-4">
                    <CCardHeader className='bg-secondary text-light'>
                      Spare Assign
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
          <CModalTitle id="NewProcessing">Spare Assign</CModalTitle>
        </CModalHeader>
        <CModalBody>

          <CRow>

            <CCol md={12}>

              <CFormLabel className="col-form-label">
                Select Vehicle
              </CFormLabel>
              <Select options={vehicle_options}
                isMulti={false}
                placeholder="Select Vehicle"
                size="sm" className='mb-2 small-select'
                classNamePrefix="custom-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 })
                }}
                onInputChange={(inputValue, { action }) => {
                  if (action === "input-change") {
                    setVehicle_search(inputValue);
                  }
                }}
                onChange={(selectedOption) => {
                  setsave_data((prev) => ({ ...prev, vehicle_id: selectedOption ? selectedOption.value : "" }))
                }}
              />

              <CFormLabel className="col-form-label">
                Brand
              </CFormLabel>
              <Select options={brand_options}
                isMulti={false}
                placeholder="Select Brand"
                size="sm" className='mb-2 small-select'
                classNamePrefix="custom-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 })
                }}
                onInputChange={(inputValue, { action }) => {
                  if (action === "input-change") {
                    setbrand_search(inputValue);
                  }
                }}
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

              <CFormLabel className="col-form-label">
                Model
              </CFormLabel>

              <Select options={modeloption}
                isMulti={false}
                placeholder="Select Model"
                size="sm" className='mb-2 small-select'
                classNamePrefix="custom-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 })
                }}
                onChange={(selectedOption) => {
                  setsave_data((prev) => ({
                    ...prev,
                    modal: selectedOption ? selectedOption.value : '',
                  }));
                  if (selectedOption) {
                    getpartnolist(selectedOption.value);
                  }
                }}
              />
                 <CFormLabel className="col-form-label">
                Part Number
              </CFormLabel>

              <Select options={partnoOption}
                isMulti={false}
                placeholder="Select PartNumber"
                size="sm" className='mb-2 small-select'
                classNamePrefix="custom-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 })
                }}
                onChange={(selectedOption) => {
                  setsave_data((prev) => ({
                    ...prev,
                    partnumber: selectedOption ? selectedOption.value : '',
                  }));
                   if (selectedOption) {
                    getserialnolist(selectedOption.value);
                  }
                }}
              />

              <CFormLabel className="col-form-label">
                Serial Number
              </CFormLabel>

              <Select options={serialnoOptions}
                isMulti={false}
                placeholder="Select SerialNo"
                size="sm" className='mb-2 small-select'
                classNamePrefix="custom-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 })
                }}
                onChange={(selectedOption) => {
                  setsave_data((prev) => ({
                    ...prev,
                    serialno: selectedOption ? selectedOption.value : '',
                  }));
                  
                }}
              />

           
            </CCol>
          </CRow>
        </CModalBody>

        <CModalFooter>
          <CButton color="primary" onClick={submitvichile}>Add</CButton>
        </CModalFooter>
      </CModal>



             <CModal visible={showHistory} onClose={() => setShowHistory(false)} size="lg">
              <CModalHeader>
                <CModalTitle>Spare Assign History</CModalTitle>
              </CModalHeader>
              <CModalBody>
                {history.length > 0 ? (
                  <CTable
                    striped
                  bordered
                  hover
                  size="sm"
                  variant="dark"
                  style={{ fontSize: '0.75rem' }}
                  >
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>ID</CTableHeaderCell>
                        <CTableHeaderCell>Updated By</CTableHeaderCell>
                        <CTableHeaderCell>Vehicle No</CTableHeaderCell>
                        <CTableHeaderCell>Spare Name</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>DateTime</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {history.map((row, index) => (
                        <CTableRow key={row.id}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{row.user_id}</CTableDataCell>
                          <CTableDataCell>{row.vehicle_no}</CTableDataCell>
                          <CTableDataCell>{row.spare_name}</CTableDataCell>
                          <CTableDataCell>{row.status}</CTableDataCell>
                          <CTableDataCell>{row.datetime}</CTableDataCell>
                        </CTableRow>
                      ))}
      
                    </CTableBody>
                  </CTable>
                ) : (
                  <p>No history available for this Spare.</p>
                )}
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setShowHistory(false)}>
                  Close
                </CButton>
              </CModalFooter>
            </CModal>
</>
  )
}

export default SpareAssign