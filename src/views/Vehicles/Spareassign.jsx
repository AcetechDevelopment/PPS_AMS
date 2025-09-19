import React, { useEffect, useState, createRef, useMemo  } from 'react'
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
  CImage,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell
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
import {vehicleNum,validateHSN,ValidMonth,ValidSingleDigit} from '../../utils/validators';


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



const[selectedvalues,setselectedvalues]=useState({vehicle_id:"",trailer_id:""})
const[showHistory,setShowHistory]=useState(false)
const [save_data, setsave_data] = useState({vehicle_id:"",trailer_id:""});
const [updated_data, setupdated_data] = useState({vehicle_id:"",trailer_id:""});

const submitvichile = async () => {
    const data = selectedvalues;
   if (
    !data.vehicle_id ||
    !data.trailer_id
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
      const response = await fetch(`${apiUrl}trailerassign/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });
    
      if (response.ok) {
        const result = await response.json();
        toast.success('New Trailer Assigned!');
        fetchData({ pageSize, pageIndex, sortBy, search });
        setShow(false);
        setselectedvalues({vehicle_id:"",trailer_id:""});
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





const getcategorylist = async () =>
{
  setcategoryoption([]);
   try{
       const response = await fetch(
      `${apiUrl}options/category`,
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
      value: item.id,
      label: item.category
    }));
    setcategoryoption(datas);
   }
   catch(err) {

   }
};



const [brandoption, setbrandoption] = useState([]);
const [brandid, setbrandid] = useState('');

const getbrandlist = async (catid) =>
{
  setbrandoption([]);
   try{
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
    const datas = result.data.map(item => ({
      value: item.brand_id,
      label: item.brand
    }));
    setbrandoption(datas);
   }
   catch(err) {

   }
}


const [ebrandoption, setebrandoption] = useState([]);
const [ebrandid, setebrandid] = useState('');
const egetbrandlist = async (catid) =>
{
  setebrandoption([]);
   try{
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
    const datas = result.data.map(item => ({
      value: item.brand_id,
      label: item.brand
    }));
    setebrandoption(datas);
   }
   catch(err) {

   }
}



const [emodeloption, setemodeloption] = useState([]);
const [emodelid, setemodelid] = useState('');

const egetmodellist = async (brandid) =>
{
  setemodeloption([]);
   try{
       const response = await fetch(
      `${apiUrl}options/model/${brandid}`,
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
      value: item.id,
      label: item.model
    }));
    setemodeloption(datas);
   }
   catch(err) {

   }
}


const typelist = [
  {
  "value":1,
  'label':"Mover"
  }, 
  {
  "value":2,
  'label':"Puller"
  }
];



useEffect(() => {
  getcategorylist();
},[]);

  const addnet = () =>{
    setnet_wt(gross_wt-tare_wt);
  }


  useEffect(() => {
    addnet();
  }, [gross_wt, tare_wt, addnet]);

  const authToken = JSON.parse(sessionStorage.getItem('authToken')) || '';


  const fetchData = async ({ pageSize, pageIndex, sortBy, search, todate, location }) => {
    setLoading(true);
    const sortColumn = sortBy.length > 0 ? sortBy[0].id : 'id'; 
    const sortOrder = sortBy.length > 0 && sortBy[0].desc ? 'desc' : 'asc';

    const orderBy = `${sortColumn} ${sortOrder}`;

    const pageSizee = 15;
    const pageindex = pageIndex * pageSizee;

    // const pageindex = pageIndex*15;
  
    try {
      const response = await fetch(
        `${apiUrl}trailerassign/list?start=${pageindex}&limit=${pageSizee}&search=${search}&order_by=${orderBy}`,
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
      setData(result.data);   
      const tot = Math.round(result.total*1/15)  
      setPageCount(tot);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
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
      { Header: 'Trailer Number', accessor: 'trailer_number'},
      { Header: 'Vehicle Number', accessor: 'vehicle_no' },
      {
              Header: () => <FaBars />,
              id: 'actions', 
              Cell: ({ row }) => {
                const id = row.original.id;
            
                return (
                  <div className="flex gap-5">
                      <FaHistory className="ms-2 pointer text-info" onClick={() => viewvehicle(id)}/>

                      <FaExchangeAlt className="ms-2 pointer text-primary" onClick={() => editvehicle(id)} />
      
                      <FaMinusSquare className="ms-2 pointer text-danger" onClick={() => deletevehicle(id)}/>
                        
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
      initialState: { pageIndex: 0 },
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
    fetchData({ pageSize, pageIndex, sortBy,  search, todate, location });
  }, [pageSize, pageIndex, sortBy,  search, todate, location]); 


   
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
    const response = await fetch(`${BASE}trailerassign/edit/${id}`, {
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
        user_id: res.user_id,
        vehicle_id: { value: res.vehicle_id, label: res.vehicle_no },
        trailer_id: { value: res.trailer_id, label: res.trailer_number },
        v_id:res.vehicle_id,
        r_id: res.trailer_id
      });

      setupdateShow(true);
    } else {
      const error = await response.json();
      ReactSwal.fire({
        title: 'Error',
        text: error.message || 'Unable to reach Trailer data',
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
};



  
const updatevichile = async () => {
    const data = updated_data;
   if (
    !data.vehicle_id ||
    !data.trailer_id
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
      const response = await fetch(`${BASE}trailerassign/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });
    
      if (response.ok) {
        const result = await response.json();
        toast.success('Trailer Exchange Updated!');
        fetchData({ pageSize, pageIndex, sortBy, search });
        setupdateShow(false);
         setupdated_data({
                 id: '',
                 vehicle_id: { value: '', label: '' },
                 trailer_id: { value: '', label: '' },
                 v_id:'',
                 r_id:''
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

 const viewvehicle = async (id) => {
  try {
    const response = await fetch(`${BASE}trailerassign/history/${id}`, {
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
        const response = await fetch(`${BASE}trailerassign/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          ReactSwal.fire({
            title: 'Deleted!',
            text: 'Trailer Assign deleted successfully!',
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


    const [vehicle_search, setVehicle_search] = useState("");
    const [vehicle_options, setVehicle_options] = useState([]);
  
  
    const [trailer_search, settrailer_search] = useState("");
    const [trailer_options, settrailer_options] = useState([]);
  
  
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
  
  const fetchtrailer_search = async (search) => {
    if (!search) {
      settrailer_options([]);
      return;
    }
  
    try {
      const url = `${BASE}trailer/search/${encodeURIComponent(search)}`;
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
        label: item.trailer_number,
      }));
  
      settrailer_options(formatted);
     // vehicle options created
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
    useEffect(() => {
      const delayDebounce = setTimeout(() => {
        fetchvehicle_search(vehicle_search);
      }, 5); 
  
      return () => clearTimeout(delayDebounce);
    }, [vehicle_search]);
   
      useEffect(() => {
      const delayDebounce = setTimeout(() => {
        fetchtrailer_search(trailer_search);
      }, 5); 
  
      return () => clearTimeout(delayDebounce);
    }, [trailer_search]);
   
  

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className='bg-secondary text-light'>
         Trailer Assign
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


                <CTable striped bordered hover size="sm"  variant="dark" {...getTableProps()} style={{ fontSize: '0.75rem' }}>
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
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map((cell) => (
                         
                                 <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                         

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
                      {pageIndex + 1} of {pageOptions.length}
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
          <CModalTitle id="NewProcessing">Trailer Assign</CModalTitle>
        </CModalHeader>
        <CModalBody>

          <CRow>

          <CCol md={12}>

             <CFormLabel className="col-form-label">
              Select Trailer
              </CFormLabel>
                <Select options={trailer_options} 
                      isMulti={false}
                      placeholder="Select Trailer" 
                      size="sm" className='mb-2 small-select'
                      classNamePrefix="custom-select"
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: base => ({ ...base, zIndex: 9999 }) 
                      }}
                      onInputChange={(inputValue, { action }) => {
                            if (action === "input-change") {
                              settrailer_search(inputValue);
                            }
                          }}
                              onChange={(selectedOption) => {
                            setselectedvalues((prev)=>({...prev,trailer_id:selectedOption? selectedOption.value:""}))     
                          }}
                     />


              <CFormLabel className="col-form-label">
              Select Vehicle
              </CFormLabel>
                <Select
                options={vehicle_options}
                placeholder="Select Vehicle"
                className="mb-2 small-select"
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
                  setselectedvalues((prev) => ({
                    ...prev, vehicle_id: selectedOption ? selectedOption.value : "",
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





{/* update */}
      <CModal
        alignment="center"
        scrollable
        visible={updateshow}
        size="md"
        onClose={() => handleEClose()}
        aria-labelledby="NewProcessing"
        >
          <CModalHeader className='bg-secondary'>
           {updated_data.image ? <CImage rounded src={`${file_base_url}uploads/${updated_data.image}`} width={50} height={50} className='me-2' /> : ''}  <CModalTitle id="NewProcessing"> {updated_data.vno}</CModalTitle>
        </CModalHeader>
        <CModalBody>

          <CRow>

          <CCol md={12}>

                  <CFormLabel className="col-form-label">
                    Select Trailer
                  </CFormLabel>
                   <Select
                        options={trailer_options}
                        isMulti={false}
                        placeholder="Select Trailer"
                        size="sm" className='mb-2 small-select'
                        classNamePrefix="custom-select"
                        value={updated_data.trailer_id}
                        onChange={(selectedOption) => {
                          setupdated_data((prev) => ({
                            ...prev,
                            trailer_id: selectedOption,
                            r_id: selectedOption ? selectedOption.value : "",
                          }));
                        }}
                        onInputChange={(inputValue, { action }) => {
                          if (action === "input-change") settrailer_search(inputValue);
                        }}
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                      />

                      <CFormLabel className="col-form-label">
                      Select Vehicle
                      </CFormLabel>
                        <Select
                            options={vehicle_options}
                            isMulti={false}
                            placeholder="Select Vehicle"
                            size="sm" className='mb-2 small-select'
                            classNamePrefix="custom-select"
                            value={updated_data.vehicle_id}
                            onChange={(selectedOption) => {
                              setupdated_data((prev) => ({
                                ...prev,
                                vehicle_id: selectedOption,
                                v_id: selectedOption ? selectedOption.value : "",
                              }));
                            }}
                            onInputChange={(inputValue, { action }) => {
                              if (action === "input-change") setVehicle_search(inputValue);
                            }}
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                          />
            </CCol>
          </CRow>
        </CModalBody>

         <CModalFooter>
          <CButton color="primary" onClick={updatevichile}>Exchange</CButton>
        </CModalFooter>
      </CModal>
     
      <CModal visible={showHistory} onClose={() => setShowHistory(false)} size="lg">
  <CModalHeader>
    <CModalTitle>Trailer Exchange History</CModalTitle>
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
            <CTableHeaderCell>User ID</CTableHeaderCell>
            <CTableHeaderCell>Vehicle No</CTableHeaderCell>
            <CTableHeaderCell>Trailer No</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>DateTime</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {history.map((row) => (
            <CTableRow key={row.id}>
              <CTableDataCell>{row.id}</CTableDataCell>
              <CTableDataCell>{row.user_id}</CTableDataCell>
              <CTableDataCell>{row.vehicle_no}</CTableDataCell>
              <CTableDataCell>{row.trailer_number}</CTableDataCell>
              <CTableDataCell>{row.status}</CTableDataCell>
              <CTableDataCell>{row.datetime}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    ) : (
      <p>No history available for this trailer.</p>
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
