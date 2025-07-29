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
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';



const Processing = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [fromdate, setfromdate] = useState(today);
  const [todate, settodate] = useState(today);
  const [location, setlocation] = useState('');
  const [loc_id, setlocationid] = useState('');
  const [date_time, setpdate] = useState('');
  const [woodchips, setwoodchips] = useState('');
  const [dryer, setdryer] = useState('');
  const [briquette, setbriquette] = useState('');

  const [coir, setcoir] = useState('');
  const [pith, setpith] = useState('');
  const [coco, setcoco] = useState('');



  const [id, setid] = useState('');

  const authToken = JSON.parse(sessionStorage.getItem('authToken')) || '';

  const handleSubmit = async () => {
    if (!loc_id || !date_time) {
      alert('All fields are required!');
      return;
    }
  
    const payload = {
      loc_id,
      date_time,
      woodchips,
      dryer,
      briquette,
      coir,
      pith,
      coco,
    };
  
    try {
      const response = await fetch(`${base_url}process/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert('New Process added!');
        fetchData({ pageSize, pageIndex, sortBy, fromdate, todate, location });
        setShow(false);
        setlocationid('');
        setpdate(today);
        setwoodchips('');
        setdryer('');
        setbriquette('');
        setcoir('');
        setpith('');
        setcoco('');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Unable to add process'}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to connect to the server. Please try again later.');
    }
  };
  

  const fetchData = async ({ pageSize, pageIndex, sortBy, fromdate, todate, location}) => {
    setLoading(true);
    const sortColumn = sortBy.length > 0 ? sortBy[0].id : 'id'; 
    const sortOrder = sortBy.length > 0 && sortBy[0].desc ? 'desc' : 'asc';
  
    try {
      const response = await fetch(
        `${base_url}process/list?pageSize=${pageSize}&pageIndex=${pageIndex+1}&sortBy=${sortColumn}&sortOrder=${sortOrder}&from=${fromdate}&to=${todate}&location=${location}`,
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
      setData(result.Process);
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
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      });
  
      if (result.isConfirmed) {
        const response = await fetch(`${base_url}process/delete/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });
  
        if (response.ok) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Process deleted successfully!',
            icon: 'success',
          });
          
          fetchData({ pageSize, pageIndex, sortBy, fromdate, todate, location});
        } else {
          const error = await response.json();
          Swal.fire({
            title: 'Error',
            text: error.message || 'Unable to delete This',
            icon: 'error',
          });
        }
      }
    } catch (err) {
      console.error('Error:', err);
      Swal.fire({
        title: 'Error',
        text: 'Failed to connect to the server. Please try again later.',
        icon: 'error',
      });
    }
  };
  
  const edit_user = async (userId) => {
    if (!authToken) {
      Swal.fire({
        title: 'Error',
        text: 'Unauthorized, please log in.',
        icon: 'error',
      });
      return;
    }
  
    try {
      const response = await fetch(`${base_url}process/edit/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        const ddata = data.project;
        setid(ddata.id);
        setlocationid(String(ddata.loc_id));
        setpdate(new Date(ddata.date_time).toISOString().split("T")[0]);
        setwoodchips(ddata.woodchips);
        setdryer(ddata.dryer);
        setbriquette(ddata.briquette);
        setcoir(ddata.coir);
        setpith(ddata.pith);
        setcoco(ddata.coco);


        setupdateShow(true);
      } else {
        const error = await response.json();
        Swal.fire({
          title: 'Error',
          text: error.message || 'Unable to reach this data',
          icon: 'error',
        });
      }
    } catch (err) {
      console.error('Error:', err);
      Swal.fire({
        title: 'Error',
        text: 'Failed to connect to the server. Please try again later.',
        icon: 'error',
      });
    }
  };

  const handleUpdate = async () => {
    if (!loc_id || !date_time) {
      alert('All fields are required!');
      return;
    }
  
      const payload = {
        id,
        loc_id,
        date_time,
        woodchips,
        dryer,
        briquette,
        coir,
        pith,
        coco,
      };

  
    try {
      const response = await fetch(`${base_url}process/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert('Updated successfully!');
        fetchData({ pageSize, pageIndex, sortBy, fromdate, todate, location });
        setupdateShow(false);
        setShow(false);
        setlocationid('');
        setpdate(today);
        setwoodchips('');
        setdryer('');
        setbriquette('');
        setcoir('');
        setpith('');
        setcoco('');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Unable to update'}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to connect to the server. Please try again later.');
    }
  };
  
  
  const columns = useMemo(
    () => [
      { Header: 'SL', accessor: 'sl' },
      { Header: 'Date', accessor: 'date_time' },
      { Header: 'Location', accessor: 'loc_id' },
      { Header: 'Wood chips', accessor: 'woodchips' },
      { Header: 'Dryer', accessor: 'dryer' },
      { Header: 'Briquette', accessor: 'briquette' },
      { Header: 'Coir', accessor: 'coir' },
      { Header: 'Pith', accessor: 'pith' },
      { Header: 'Coco Shredder', accessor: 'coco' },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => (
          <>
          <CIcon icon={cilPencil} className='text-success pointer' 
            onClick={() => edit_user(row.original.id)}
            style={{marginRight: '10px' }}
          />
        
          <CIcon icon={cilTrash} className='text-danger pointer'
          onClick={() => delete_user(row.original.id)}
        />
        </>
        ),
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
    fetchData({ pageSize, pageIndex, sortBy, fromdate, todate, location });
  }, [pageSize, pageIndex, sortBy, fromdate, todate, location]); 


   
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setpdate(today);
    setShow(true);
  }


  const [updateshow, setupdateShow] = useState(false);
  const handleEClose = () => setupdateShow(false);

  const options = [
    // { value: '1', label: 'CHETPET' },
    { value: '2', label: 'PERUNGUDI' },
    { value: '3', label: 'KODUNGAIYUR' },
    // { value: '4', label: 'SOWCARPET' },
  ];


  const searchoptions = [
    { value: '0', label: 'All Location' },
    // { value: '1', label: 'CHETPET' },
    { value: '2', label: 'PERUNGUDI' },
    { value: '3', label: 'KODUNGAIYUR' },
    // { value: '4', label: 'SOWCARPET' },
  ];
  

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className='bg-secondary text-light'>
          Processing
         
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
                 <CButton className="btn btn-sm btn-warning w-auto" onClick={handleShow}> Add </CButton>
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
          <CModalTitle id="NewProcessing">New Process Entry</CModalTitle>
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
            <CFormInput type="date" value={date_time}  onChange={(e) => setpdate(e.target.value)}  size="sm" placeholder="Small input" className='mb-3' />


            <CFormLabel className="col-sm-2 col-form-label">
            WOOD CHIPS
             </CFormLabel>
            <CFormInput type="text" size="sm" 
            placeholder="WOOD CHIPS" onKeyPress={isNumberKey} className='mb-2'  onChange={(e) => setwoodchips(e.target.value)} />

            <CFormLabel className="col-sm-2 col-form-label">
            WOOD POWDER
             </CFormLabel>
            <CFormInput type="text" size="sm" 
            placeholder="WOOD POWDER" onKeyPress={isNumberKey} className='mb-2'  onChange={(e) => setdryer(e.target.value)} />


          <CFormLabel className="col-sm-2 col-form-label">
             DRYER
             </CFormLabel>
            <CFormInput type="text" size="sm" 
            placeholder="DRYER" onKeyPress={isNumberKey} className='mb-2'  onChange={(e) => setdryer(e.target.value)} />

             <CFormLabel className="col-sm-2 col-form-label">
             BRIQUETTE
             </CFormLabel>
            <CFormInput type="text" size="sm" 
            placeholder="BRIQUETTE" onKeyPress={isNumberKey} className='mb-2'  onChange={(e) => setbriquette(e.target.value)} />

            <CFormLabel className="col-sm-2 col-form-label">
            COIR
             </CFormLabel>
            <CFormInput type="text" size="sm" 
            placeholder="COIR" onKeyPress={isNumberKey} className='mb-2'  onChange={(e) => setcoir(e.target.value)} />

            <CFormLabel className="col-sm-2 col-form-label">
            PITH
             </CFormLabel>
            <CFormInput type="text" size="sm" 
            placeholder="PITH" onKeyPress={isNumberKey} className='mb-2'  onChange={(e) => setpith(e.target.value)} />

           <CFormLabel className="col-sm-7 col-form-label">
             COCO SHREDDER
             </CFormLabel>
            <CFormInput type="text" size="sm" 
            placeholder="COCO SHREDDER" onKeyPress={isNumberKey} className='mb-2'  onChange={(e) => setcoco(e.target.value)} />

            <div className="d-flex justify-content-center mt-4">
            <CButton className="btn btn-sm btn-success w-100" size="xl" onClick={handleSubmit}> Add </CButton>
            </div>


            </CCol>
          </CRow>

          <CCol md={3}>
          </CCol>


      

        </CModalBody>
      </CModal>


      {/* Update */}


      <CModal
        fullscreen
        visible={updateshow}
        onClose={() => handleEClose()}
        aria-labelledby="editProcessing"
        >
        <CModalHeader className='bg-secondary'>
          <CModalTitle id="editProcessing">Update Process Entry</CModalTitle>
        </CModalHeader>
        <CModalBody>

          <CRow>
          <CCol md={3}>
          </CCol>
          <CCol md={6}>
            <CFormLabel htmlFor="inputEmail3" className="col-sm-2 col-form-label">
             Select Location
             </CFormLabel>
             <Select 
              value={options.find(option => option.value === loc_id)}
              options={options} 
              isMulti={false} 
              placeholder="Select Location" size="sm" className='mb-2' 
              onChange={(e) => setlocationid(e?.value)}
             />

             <CFormLabel className="col-sm-2 col-form-label">
             Select Date
             </CFormLabel>
            <CFormInput type="date" value={date_time}  onChange={(e) => setpdate(e.target.value)}  size="sm" placeholder="Small input" className='mb-3' />


            <CFormLabel className="col-sm-6 col-form-label">
            Wood chips
             </CFormLabel>
            <CFormInput type="text" size="sm" 
            value={woodchips}
            placeholder="Wood chips" onKeyPress={isNumberKey} className='mb-3'  onChange={(e) => setwoodchips(e.target.value)} />

            <CFormLabel className="col-sm-6 col-form-label">
             Dryer
             </CFormLabel>
            <CFormInput value={dryer} type="text" size="sm" onKeyPress={isNumberKey} placeholder="Dryer" className='mb-3'  onChange={(e) => setdryer(e.target.value)} />

            <CFormLabel className="col-sm-6 col-form-label">
              Briquette
             </CFormLabel>
            <CFormInput value={briquette} type="text" size="sm" onKeyPress={isNumberKey} placeholder="Briquette"  className='mb-3'  onChange={(e) => setbriquette(e.target.value)}/>


            <CFormLabel className="col-sm-6 col-form-label">
            COIR
             </CFormLabel>
            <CFormInput type="text" size="sm" 
            placeholder="COIR" value={coir} onKeyPress={isNumberKey} className='mb-2'  onChange={(e) => setcoir(e.target.value)} />

            <CFormLabel className="col-sm-6 col-form-label">
            PITH
             </CFormLabel>
            <CFormInput type="text" size="sm" 
            placeholder="PITH" value={pith} onKeyPress={isNumberKey} className='mb-2'  onChange={(e) => setpith(e.target.value)} />

           <CFormLabel className="col-sm-7 col-form-label">
             COCO SHREDDER
             </CFormLabel>
            <CFormInput type="text" size="sm" 
            placeholder="COCO SHREDDER" value={coco} onKeyPress={isNumberKey} className='mb-2'  onChange={(e) => setcoco(e.target.value)} />


             <div className="d-flex justify-content-center mt-4">
            <CButton className="btn btn-sm btn-success w-100" size="xl" onClick={handleUpdate} > Update </CButton>
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

export default Processing
