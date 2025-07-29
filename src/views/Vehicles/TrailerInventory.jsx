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
} from '@coreui/react'
import { FaBars } from 'react-icons/fa';
import { CIcon } from '@coreui/icons-react';
import { cilTrash, cilPencil } from '@coreui/icons';
import Select from 'react-select';
import { useTable, usePagination, useSortBy } from 'react-table';
import { isNumberKey, base_url, today } from '../service';


const TrailerInventory = () => {
    const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '30px', 
      height: '30px',
      fontSize: '0.8rem', 
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: '4px',
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: '4px',
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 6px',
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
  };
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  const [search, setsearch] = useState('');

const [categoryoption, setcategoryoption] = useState([]);
const [categoryid, setcategoryid] = useState('');
const apiUrl = import.meta.env.VITE_API_URL;


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

const getbrandlist = async () =>
{
  setbrandoption([]);
   try{
       const response = await fetch(
      `${apiUrl}options/brand`,
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
      label: item.brand
    }));
    setbrandoption(datas);
   }
   catch(err) {

   }
}

useEffect(() => {
  getcategorylist();
  getbrandlist();
},[]);

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
      const response = await fetch(`${apiUrl}vehicle/list`, {
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
        `${apiUrl}vehicle/list?start=${pageindex}&limit=${pageSizee}&search=${search}&order_by=${orderBy}`,
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
        fetchData({ pageSize, pageIndex, sortBy,  search, todate, location });
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
      { Header: 'SL', accessor: 'id', disableSortBy: true, },
      { Header: 'Trailer Number', accessor: 'vehicle_number' },
      { Header: 'Category', accessor: 'type' },
      { Header: 'Brand', accessor: 'brand' },
      { Header: 'Model', accessor: 'model' },
      { Header: 'Wheels count', accessor: 'wheels_count' },
      { Header: 'Purchase date', accessor: 'purchase_date' },
      { Header: 'HSN', accessor: 'hsn' },
      {
        Header: () => <FaBars />,
        accessor: 'net_wt1',
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
         Trailer Inventory
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
                 <CButton className="btn btn-sm btn-secondary w-auto" onClick={handleShow}> Excel </CButton>
                 <CButton className="btn btn-sm btn-secondary w-auto" onClick={handleShow}> PDF </CButton>
                 <CButton className="btn btn-sm btn-secondary w-auto" onClick={handleShow}> Print </CButton>
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
        size="xl"
        onClose={() => handleClose()}
        aria-labelledby="NewProcessing"
        >
        <CModalHeader className='bg-secondary'>
          <CModalTitle id="NewProcessing">New Trailer</CModalTitle>
        </CModalHeader>
        <CModalBody>

          <CRow>

          <CCol md={6}>


            <CFormLabel className="col-form-label">
              Trailer Number
              </CFormLabel>
              <CFormInput type="text" size="sm" 
              onChange={(e) => setbill_no(e.target.value)}
              placeholder="Trailer Number" className='mb-2' />

              <CFormLabel className="col-form-label">
              Type
              </CFormLabel>
              <CFormInput type="text" size="sm" 
              onChange={(e) => setbill_no(e.target.value)}
              placeholder="Type" className='mb-2' />

              <CFormLabel className="col-form-label">
               Category
              </CFormLabel>
                <Select options={categoryoption} isMulti={false} placeholder="Select Category" size="sm" className='mb-2' 
                styles={customStyles}
                onChange={(e) => setcategoryid(e?.value)}
                />

              <CFormLabel className="col-form-label">
              Brand
              </CFormLabel>
              <Select options={brandoption} isMulti={false} placeholder="Select Brand" size="sm" className='mb-2' 
                        styles={customStyles}
                        onChange={(e) => setbrandid(e?.value)}
                        />

              <CFormLabel className="col-form-label">
               Model
              </CFormLabel>
              <CFormInput type="text" size="sm" 
              onChange={(e) => setbill_no(e.target.value)}
              placeholder="Model" className='mb-2' />
             
             <CFormLabel className="col-form-label">
               HSN Number
              </CFormLabel>
              <CFormInput type="text" size="sm" 
              onChange={(e) => setbill_no(e.target.value)}
              placeholder="HSN Number" className='mb-2' />
             

               </CCol>

            <CCol md={6}>

               <CFormLabel className="col-form-label">
              Purchase Date
              </CFormLabel>
              <CFormInput type="date" value={date_time} size="sm" 
              onChange={(e) => setdate_time(e.target.value)}
               className='mb-2' />

              <CFormLabel className="col-form-label">
               Years of warranty
              </CFormLabel>
              <CFormInput type="text" size="sm" 
              onChange={(e) => setbill_no(e.target.value)}
              placeholder="Years of warranty" className='mb-2' />



               <CFormLabel className="col-form-label">
                AMC 
              </CFormLabel>

                <CInputGroup className="mb-2">
                <CFormInput type="text" size="sm" 
                onChange={(e) => setbill_no(e.target.value)}
                placeholder="AMC Number" />

                <CFormInput type="date" value={date_time} size="sm" 
                onChange={(e) => setdate_time(e.target.value)}
                />
              </CInputGroup>


               <CFormLabel className="col-form-label">
               Tyre count / Stepney Count
              </CFormLabel>
              <CInputGroup className="mb-2">
                <CFormInput type="text" size="sm" 
                onChange={(e) => setbill_no(e.target.value)}
                placeholder="Tyre count" />

                <CFormInput type="text" size="sm" 
                onChange={(e) => setdate_time(e.target.value)}
                placeholder="Stepney Count" />
              </CInputGroup>

             <div className="mb-3">
              <label htmlFor="formFileSm" className="form-label">Image</label>
              <input className="form-control form-control-sm" id="formFileSm" type="file" />
            </div>



            </CCol>

          </CRow>
        </CModalBody>

         <CModalFooter>
          <CButton color="primary">Add</CButton>
        </CModalFooter>
      </CModal>


    </>
  )
}

export default TrailerInventory
