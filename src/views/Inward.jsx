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
  CCardBody, 
  CButtonGroup, 
  CTableHead,
  CFormInput,
  CRow,
  CCol,
  CFormLabel,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react';
import { cilTrash, cilPencil } from '@coreui/icons';
import Select from 'react-select';
import { useTable, usePagination, useSortBy } from 'react-table';
import { isNumberKey, base_url, today } from './service';



const Inward = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);

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

  const search  = '';

  const addnet = () =>{
    setnet_wt(gross_wt-tare_wt);
  }


  useEffect(() => {
    addnet();
  }, [gross_wt, tare_wt, addnet]);

  const authToken = JSON.parse(sessionStorage.getItem('authToken')) || '';

  const handleSubmit = async () => {
    if (!loc_id || !vehicle_no || !date_time || !tare_wt || !gross_wt) {
      alert('All fields are required!');
      return;
    }

   
    
  
    const payload = {
      loc_id,
      bill_no,
      vehicle_no,
      date_time,
      tare_wt,
      gross_wt,
      net_wt,
      material
    };

  
    try {
      const response = await fetch(`${base_url}inward/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert('Negative Waste Added!');
        fetchData({ pageSize, pageIndex, sortBy, search });
        setShow(false);
        setName('');
        setUsername('');
        setEmail('');
        setMobile('');
        setPassword('');
        setConfirmPassword('');
        setgroup_id('');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Unable to register user'}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to connect to the server. Please try again later.');
    }
  };
  

  const fetchData = async ({ pageSize, pageIndex, sortBy, fromdate, todate, location }) => {
    setLoading(true);
    const sortColumn = sortBy.length > 0 ? sortBy[0].id : 'id'; 
    const sortOrder = sortBy.length > 0 && sortBy[0].desc ? 'desc' : 'asc';
  
    try {
      const response = await fetch(
        `${base_url}inward/list?pageSize=${pageSize}&pageIndex=${pageIndex+1}&sortBy=${sortColumn}&sortOrder=${sortOrder}&from=${fromdate}&to=${todate}&location=${location}`,
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
      setData(result.negative);
      setPageCount(result.pageCount);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };
  

  const delete_user = async (userId) => {
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
        const response = await fetch(`${base_url}delete_user/${userId}`, {
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
          
          fetchData({ pageSize, pageIndex, sortBy, fromdate, todate, location });
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
  
  const edit_user = async (userId) => {
    if (!authToken) {
      ReactSwal.fire({
        title: 'Error',
        text: 'Unauthorized, please log in.',
        icon: 'error',
      });
      return;
    }
  
    try {
      const response = await fetch(`${base_url}update_user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        const ddata = data.data;
        setid(ddata.id);
        setName(ddata.name);
        setUsername(ddata.username);
        setEmail(ddata.email);
        setMobile(ddata.mobile);
        setgroup_id(ddata.group_id);
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
  };

  const handleUpdate = async () => {
    if (!name || !username || !email || !password || !confirmPassword || (group_id === null || group_id === undefined || group_id === '') || !mobile) {
      alert('All fields are required!');
      return;
    }
  
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
      const payload = {
        id,
        name,
        username,
        email,
        password,
        group_id,
        mobile
      };

  
    try {
      const response = await fetch(`${base_url}api/update_user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert('User created successfully!');
        fetchData({ pageSize, pageIndex, sortBy,  fromdate, todate, location });
        setupdateShow(false);
        setName('');
        setUsername('');
        setEmail('');
        setMobile('');3
        setPassword('');
        setConfirmPassword('');
        setgroup_id('');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Unable to register user'}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to connect to the server. Please try again later.');
    }
  };
  
  
  const columns = useMemo(
    () => [
      { Header: 'Trip Id', accessor: 'id' },
      { Header: 'Date', accessor: 'date_time' },
      { Header: 'Time', accessor: 'time' },
      { Header: 'Location', accessor: 'loc_id' },
      { Header: 'Vehicle', accessor: 'vehicle_no' },
      { Header: 'Zone', accessor: 'zone' },
      { Header: 'Material', accessor: 'material' },
      { Header: 'Gross Weight', accessor: 'gross_wt' },
      { Header: 'Tare Weight', accessor: 'tare_wt' },
      { Header: 'Net Weight', accessor: 'net_wt' },
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
    fetchData({ pageSize, pageIndex, sortBy,  fromdate, todate, location });
  }, [pageSize, pageIndex, sortBy,  fromdate, todate, location]); 


   
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(false);


  const [updateshow, setupdateShow] = useState(false);
  const handleEClose = () => setupdateShow(false);

  const options = [
    { value: '1', label: 'CHETPET' },
    { value: 'pdggw', label: 'PERUNGUDI' },
    { value: 'kdg', label: 'KODUNGAIYUR' },
    { value: '4', label: 'SOWCARPET' },
  ];


  const searchoptions = [
    { value: '0', label: 'All Location' },
    { value: '1', label: 'CHETPET' },
    { value: 'pdggw', label: 'PERUNGUDI' },
    { value: 'kdg', label: 'KODUNGAIYUR' },
    { value: '4', label: 'SOWCARPET' },
  ];
  

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className='bg-secondary text-light'>
         Inward
        </CCardHeader>
        <CCardBody>
                
              <input
                  type="date"
                  value={fromdate}
                  onChange={(e) => setfromdate(e.target.value)}
                  className="form-control form-control-sm m-1 float-end w-auto"
                />

                <input
                  type="date"
                  value={todate}
                  onChange={(e) => settodate(e.target.value)}
                  className="form-control form-control-sm m-1 float-end w-auto"
                />

                <Select options={searchoptions} isMulti={false} 
                onChange={(e) => setlocation(e?.value)}placeholder="Select Location" size="sm" className="m-1 float-end w-auto" />

                <CButtonGroup role="group" aria-label="Basic example">
                 <CButton className="btn btn-sm btn-secondary w-auto" onClick={handleShow}> Excel </CButton>
                 <CButton className="btn btn-sm btn-secondary w-auto" onClick={handleShow}> PDF </CButton>
                 <CButton className="btn btn-sm btn-secondary w-auto" onClick={handleShow}> Print </CButton>
                 </CButtonGroup>


                <CTable striped bordered hover size="sm"  variant="dark" {...getTableProps()}>
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
        fullscreen
        visible={show}
        onClose={() => handleClose()}
        aria-labelledby="NewProcessing"
        >
        <CModalHeader className='bg-secondary'>
          <CModalTitle id="NewProcessing">New Negative Waste Entry</CModalTitle>
        </CModalHeader>
        <CModalBody>

          <CRow>
          <CCol md={3}>
          </CCol>
          <CCol md={6}>
            <CFormLabel htmlFor="inputEmail3" className="col-sm-2 col-form-label">
             Select Location
             </CFormLabel>
             <Select options={options} isMulti={false} placeholder="Select Location" size="sm" className='mb-2' 
             onChange={(e) => setlocationid(e?.value)}
             />


             <CFormLabel className="col-sm-2 col-form-label">
              Select Date
              </CFormLabel>
              <CFormInput type="date" value={date_time} size="sm" 
              onChange={(e) => setdate_time(e.target.value)}
               className='mb-2' />

             <CFormLabel className="col-sm-2 col-form-label">
              Bill Number
              </CFormLabel>
              <CFormInput type="text" size="sm" 
              onChange={(e) => setbill_no(e.target.value)}
              placeholder="Bill Number" className='mb-2' />

              

              <CFormLabel className="col-sm-2 col-form-label">
               Vehicle No
              </CFormLabel>
              <CFormInput type="text" size="sm"
              onChange={(e) => setvehicle_no(e.target.value)} 
              placeholder="Vehicle No" className='mb-2' />


              <CFormLabel className="col-sm-2 col-form-label">
                 Material
                </CFormLabel>
              <select className="form-select form-select-sm">
                <option selected={true} value="1">Negative Waste</option>
              </select>

            <CFormLabel className="col-sm-2 col-form-label">
            Tare Weight
             </CFormLabel>
            <CFormInput type="text" size="sm" 
            onChange={(e) => { settare_wt(e.target.value); addnet()} }
            placeholder="Tare Weight" onKeyPress={isNumberKey} className='mb-2' />

            <CFormLabel className="col-sm-2 col-form-label">
            Gross Weight
             </CFormLabel>
            <CFormInput type="text" size="sm" onKeyPress={isNumberKey}
            onChange={(e) => { setgross_wt(e.target.value); addnet()} } 
            placeholder="Gross Weight" className='mb-2' />

            <CFormLabel className="col-sm-2 col-form-label">
            Net Weight
             </CFormLabel>
            <CFormInput type="text" readOnly={true} size="sm" 
            value={net_wt}
            onKeyPress={isNumberKey} placeholder="Net Weight"  className='mb-3' />

            <div className="d-flex justify-content-center mt-4">
            <CButton className="btn btn-sm btn-success w-100" size="xl" onClick={handleSubmit}> Add </CButton>
            </div>


            </CCol>
          </CRow>

          <CCol md={3}>
          </CCol>


      

        </CModalBody>
      </CModal>


    </>
  )
}

export default Inward
