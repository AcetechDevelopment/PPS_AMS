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
  CImage
} from '@coreui/react'
import { FaBars,FaTrash,FaEdit,FaEye } from 'react-icons/fa';
import { CIcon } from '@coreui/icons-react';
import { cilTrash, cilPencil } from '@coreui/icons';
import Select from 'react-select';
import { useTable, usePagination, useSortBy } from 'react-table';
import { isNumberKey, base_url, today, file_base_url } from '../service';
import { toast } from 'react-toastify';
import {vehicleNum,validateHSN,ValidMonth,ValidSingleDigit} from '../../utils/validators';


const VehicleInventory = () => {
const apiUrl = import.meta.env.VITE_API_URL;

const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
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


// new vehicle
const [save_data, setsave_data] = useState(
  {
    vno: '', 
    type: '',
    category: '',
    brand: '',
    modal:'',
    purchasedate:today,
    warrentyyear:'',
    amc:'',
    amcdate:today,
    tyrecnt:'',
    stepnycnt:'',
    fuel:'1',
    enginenumber:'',
    chassisnumber:'',
    hsn:'',
    insurancenumber:'',
    insuranceenddate:today,
    fitness:'',
    fitnessdate:today,
    puc:'',
    pucdate:today,
    greentax:'',
    greendate:today,
    file: null,
  },
);

// update vehicle 

const [updated_data, setupdated_data] = useState(
  {
    vno: '', 
    type: '',
    category: '',
    brand: '',
    modal:'',
    purchasedate:today,
    warrentyyear:'',
    amc:'',
    amcdate:today,
    tyrecnt:'',
    stepnycnt:'',
    fuel:'1',
    enginenumber:'',
    chassisnumber:'',
    hsn:'',
    insurancenumber:'',
    insuranceenddate:today,
    fitness:'',
    fitnessdate:today,
    puc:'',
    pucdate:today,
    greentax:'',
    greendate:today,
    file: null,
  },
);

const submitvichile = async () => {
    const data = save_data;
   if (
    !data.vno ||
    !data.type ||
    !data.enginenumber ||
    !data.hsn
    ) {
      toast.error('All fields are required!');
      return;
    }

    const verify = vehicleNum(data.vno);
    if(!verify.isValid)
    {
      toast.error('Vehicle Number Invalid!');
       return;
    }
    const hsnCheck = validateHSN(data.hsn);
     if (!hsnCheck.isValid) return toast.error(hsnCheck.error);


      const monthCheck = ValidMonth(data.warrentyyear);
     if (!monthCheck.isValid) return toast.error('Months Invalid!');

      const tyreCheck = ValidSingleDigit(data.tyrecnt);
     if (!tyreCheck.isValid) return toast.error('Tyre Count Invalid!');

      const stepnyCheck = ValidSingleDigit(data.stepnycnt);
     if (!stepnyCheck.isValid) return toast.error('Stepney Count Invalid!');
  
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
      const response = await fetch(`${apiUrl}vehicle/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });
    
      if (response.ok) {
        const result = await response.json();
        toast.success('New Vehicle created!');
        fetchData({ pageSize, pageIndex, sortBy, search });
        setShow(false);

         setsave_data({
                  vno: '', 
                  type: '',
                  category: '',
                  brand: '',
                  modal:'',
                  purchasedate:today,
                  warrentyyear:'',
                  amc:'',
                  amcdate:today,
                  tyrecnt:'',
                  stepnycnt:'',
                  fuel:'1',
                  enginenumber:'',
                  chassisnumber:'',
                  hsn:'',
                  insurancenumber:'',
                  insuranceenddate:today,
                  fitness:'',
                  fitnessdate:today,
                  puc:'',
                  pucdate:today,
                  greentax:'',
                  greendate:today,
                  file: null,
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


const [modeloption, setmodeloption] = useState([]);
const [modelid, setmodelid] = useState('');

const getmodellist = async (brandid) =>
{
  setmodeloption([]);
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
    setmodeloption(datas);
   }
   catch(err) {

   }
}

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
      { Header: 'Vehicle Number', accessor: 'vehicle_number' },
      { Header: 'Category', accessor: 'category' },
      { Header: 'Brand', accessor: 'brandname', className: 'center' },
      { Header: 'Model', accessor: 'modelname' },
      { Header: 'Engine number', accessor: 'engine_num' },
      { Header: 'Chassis number', accessor: 'chassis_num' },
      { Header: 'Wheels count', accessor: 'tyre_count' },
      { Header: 'HSN', accessor: 'hsn' },
       { Header: 'Part', accessor: 'part' },
      { Header: 'Purchase date', accessor: 'purchase_date' },
      {
              Header: () => <FaBars />,
              id: 'actions', 
              Cell: ({ row }) => {
                const id = row.original.id;
            
                return (
                  <div className="flex gap-5">
                      <FaEye className="ms-2 pointer text-info" onClick={() => viewvehicle(id)}/>

                      <FaEdit className="ms-2 pointer text-primary" onClick={() => editvehicle(id)} />
      
                      <FaTrash className="ms-2 pointer text-danger" onClick={() => deletevehicle(id)}/>
                        
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


  
  const [updateshow, setupdateShow] = useState(false);
  const handleEClose = () => setupdateShow(false);

  const editvehicle = async(id) => 
  {
     if (!authToken) {
      ReactSwal.fire({
        title: 'Error',
        text: 'Unauthorized, please log in.',
        icon: 'error',
      });
      return;
    }
  
    try {
      const response = await fetch(`${base_url}vehicle/edit/${id}`, {
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
                  id:res.id,
                  vno: res.vehicle_number, 
                  type: res.type_id,
                  category: res.cat_id,
                  brand: res.brand_id,
                  modal:res.model_id,
                  purchasedate:res.purchase_date,
                  warrentyyear:res.year_warranty,
                  amc:res.amc,
                  amcdate:res.amc_date,
                  tyrecnt:res.tyre_count,
                  stepnycnt:res.step_count,
                  fuel:res.fuel_type,
                  enginenumber:res.engine_num,
                  chassisnumber:res.chassis_num,
                  hsn:res.hsn,
                  insurancenumber:res.insurance,
                  insuranceenddate:res.ins_date,
                  fitness:res.fc,
                  fitnessdate:res.fc_date,
                  puc:res.pc,
                  pucdate:res.pc_date,
                  greentax:res.green_tax,
                  greendate:res.gtax_date,
                  image:res.image,
                  file:null,
                });
             egetbrandlist(res.cat_id);
             egetmodellist(res.brand_id);
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
    !data.vno ||
    !data.type ||
    !data.enginenumber ||
    !data.hsn
    ) {
      toast.error('All fields are required!');
      return;
    }

    const verify = vehicleNum(data.vno);
    if(!verify.isValid)
    {
      toast.error('Vehicle Number Invalid!');
       return;
    }
    const hsnCheck = validateHSN(data.hsn);
     if (!hsnCheck.isValid) return toast.error(hsnCheck.error);


     const monthCheck = ValidMonth(data.warrentyyear);
     if (!monthCheck.isValid) return toast.error('Months Invalid!');

      const tyreCheck = ValidSingleDigit(data.tyrecnt);
     if (!tyreCheck.isValid) return toast.error('Tyre Count Invalid!');

      const stepnyCheck = ValidSingleDigit(data.stepnycnt);
     if (!stepnyCheck.isValid) return toast.error('Stepney Count Invalid!');
  
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
      const response = await fetch(`${apiUrl}vehicle/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });
    
      if (response.ok) {
        const result = await response.json();
        toast.success('Vehicle Updated!');
        fetchData({ pageSize, pageIndex, sortBy, search });
        setupdateShow(false);

         setupdated_data({
                  id:'',
                  vno: '', 
                  type: '',
                  category: '',
                  brand: '',
                  modal:'',
                  purchasedate:today,
                  warrentyyear:'',
                  amc:'',
                  amcdate:today,
                  tyrecnt:'',
                  stepnycnt:'',
                  fuel:'1',
                  enginenumber:'',
                  chassisnumber:'',
                  hsn:'',
                  insurancenumber:'',
                  insuranceenddate:today,
                  fitness:'',
                  fitnessdate:today,
                  puc:'',
                  pucdate:today,
                  greentax:'',
                  greendate:today,
                  image:'',
                  file: null,
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

  const viewvehicle = (id) =>
  {
   
  }

  const deletevehicle = (id) => 
  {
    
  }
  

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className='bg-secondary text-light'>
         Vehicle Inventory
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
                            <div>
                                 <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            </div>   

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
          <CModalTitle id="NewProcessing">New Vehicle</CModalTitle>
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
                  onChange={(e) => {
                    setsave_data((prev) => ({
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
                />

              <CFormLabel className="col-form-label">
              Type
              </CFormLabel>
               <Select options={typelist} isMulti={false} placeholder="Select Category" size="sm" className='mb-2 small-select' 
                classNamePrefix="custom-select"
                onChange={(selectedOption) => {
                          setsave_data((prev) => ({
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
                onChange={(selectedOption) => {
                          setsave_data((prev) => ({
                            ...prev,
                            category: selectedOption ? selectedOption.value : '',
                          }));
                          if (selectedOption) {
                            getbrandlist(selectedOption.value);
                          }
                        }}
                />

              <CFormLabel className="col-form-label">
              Brand
              </CFormLabel>
              <Select options={brandoption} 
              isMulti={false}
               placeholder="Select Brand" 
               size="sm" 
               className='mb-2 small-select'
              classNamePrefix="custom-select"
              value={save_data.brand}
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

                 <Select options={modeloption} isMulti={false} placeholder="Select Model" size="sm" className='mb-2 small-select' 
                 classNamePrefix="custom-select"
                        onChange={(selectedOption) => {
                        setsave_data((prev) => ({
                          ...prev,
                          modal: selectedOption ? selectedOption.value : '',
                        }));
                      }}
                        />

              <CFormLabel className="col-form-label">
              Purchase Date
              </CFormLabel>
              <CFormInput type="date" value={save_data. purchasedate} size="sm" 
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
                AMC 
              </CFormLabel>

                <CInputGroup className="mb-2">
                <CFormInput type="text" size="sm"
                onChange={(e) =>
                  setsave_data((prev) => ({
                    ...prev,
                    amc: e.target.value,
                  }))
                }
                placeholder="AMC File Number" />

                <CFormInput type="date" value={save_data.amcdate} size="sm" 
                onChange={(e) =>
                  setsave_data((prev) => ({
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
                onChange={(e) =>
                  setsave_data((prev) => ({
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
                onChange={(e) =>
                  setsave_data((prev) => ({
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
                  onChange={(e) =>
                  setsave_data((prev) => ({
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
              onChange={(e) =>
                  setsave_data((prev) => ({
                    ...prev,
                    enginenumber: e.target.value,
                  }))
                }
              placeholder="Engine Number" className='mb-2' />

              <CFormLabel className="col-form-label">
               Chassis number
              </CFormLabel>
              <CFormInput type="text" size="sm" 
              onChange={(e) =>
                  setsave_data((prev) => ({
                    ...prev,
                    chassisnumber: e.target.value,
                  }))
                }
              placeholder="Chassis number" className='mb-2' />


              <CFormLabel className="col-form-label">
               HSN Number
              </CFormLabel>
              <CFormInput type="text" size="sm" 
              onChange={(e) =>
                  setsave_data((prev) => ({
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
                <CFormInput type="text" size="sm" value={save_data.insurancenumber}
                onChange={(e) =>
                  setsave_data((prev) => ({
                    ...prev,
                    insurancenumber: e.target.value,
                  }))
                }
                placeholder="Insurance Number" />

                <CFormInput type="date" value={save_data.insuranceenddate} size="sm" 
                onChange={(e) =>
                  setsave_data((prev) => ({
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
                onChange={(e) =>
                  setsave_data((prev) => ({
                    ...prev,
                    fitness: e.target.value,
                  }))
                }
                placeholder="Fitness Certificate Number" />

                <CFormInput type="date" value={save_data.fitnessdate} size="sm" 
                 onChange={(e) =>
                  setsave_data((prev) => ({
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
                 onChange={(e) =>
                  setsave_data((prev) => ({
                    ...prev,
                    puc: e.target.value,
                   }))
                 }
                placeholder="Pollution Certificate Number" />

                <CFormInput type="date" value={save_data.pucdate} size="sm" 
                onChange={(e) =>
                  setsave_data((prev) => ({
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
                 onChange={(e) =>
                  setsave_data((prev) => ({
                    ...prev,
                    greentax: e.target.value,
                   }))
                 }
                placeholder="Green Tax Number" />

                <CFormInput type="date" value={save_data.greendate} size="sm" 
                 onChange={(e) =>
                  setsave_data((prev) => ({
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
                setsave_data((prev) => ({
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
                  value = {updated_data.vno}
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
                <Select options={categoryoption} isMulti={false}
                 placeholder="Select Category"
                  size="sm" className='mb-2 small-select' 
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
              <Select options={ebrandoption} isMulti={false} placeholder="Select Brand" size="sm" className='mb-2 small-select'
              classNamePrefix="custom-select"
              value={ebrandoption.find(option => option.value === updated_data.brand) || null}
                        onChange={(selectedOption) => {
                        setupdated_data((prev) => ({
                          ...prev,
                          brand: selectedOption ? selectedOption.value : '',
                        }));
                        if (selectedOption) {
                            egetmodellist(selectedOption.value);
                          }
                      }}
                        />

              <CFormLabel className="col-form-label">
               Model
              </CFormLabel>

                 <Select options={emodeloption} isMulti={false} placeholder="Select Model" size="sm" className='mb-2 small-select' 
                 classNamePrefix="custom-select"
                 value={emodeloption.find(option => option.value === updated_data.modal) || null}
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
               value = {updated_data.purchasedate}
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
              value = {updated_data.warrentyyear}
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
                 value = {updated_data.amc}
                onChange={(e) =>
                  setupdated_data((prev) => ({
                    ...prev,
                    amc: e.target.value,
                  }))
                }
                placeholder="AMC File Number" />

                <CFormInput type="date" size="sm" 
                 value = {updated_data.amcdate}
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
                value = {updated_data.tyrecnt}
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
                value = {updated_data.stepnycnt}
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
              value = {updated_data.enginenumber}
              onChange={(e) =>
                  setupdated_data((prev) => ({
                    ...prev,
                    enginenumber: e.target.value,
                  }))
                }
              placeholder="Engine Number" className='mb-2' />

              <CFormLabel className="col-form-label">
               Chassis number
              </CFormLabel>
              <CFormInput type="text" size="sm" 
              value = {updated_data.chassisnumber}
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
              value = {updated_data.hsn}
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
                value = {updated_data.insurancenumber}
                onChange={(e) =>
                  setupdated_data((prev) => ({
                    ...prev,
                    insurancenumber: e.target.value,
                  }))
                }
                placeholder="Insurance Number" />

                <CFormInput type="date"  size="sm" 
                value = {updated_data.insuranceenddate}
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
                value = {updated_data.fitness}
                onChange={(e) =>
                  setupdated_data((prev) => ({
                    ...prev,
                    fitness: e.target.value,
                  }))
                }
                placeholder="Fitness Certificate Number" />

                <CFormInput type="date" size="sm" 
                 value = {updated_data.fitnessdate}
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
                value = {updated_data.puc}
                 onChange={(e) =>
                  setupdated_data((prev) => ({
                    ...prev,
                    puc: e.target.value,
                   }))
                 }
                placeholder="Pollution Certificate Number" />

                <CFormInput type="date" size="sm" 
                value = {updated_data.pucdate}
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
                value = {updated_data.greentax}
                 onChange={(e) =>
                  setupdated_data((prev) => ({
                    ...prev,
                    greentax: e.target.value,
                   }))
                 }
                placeholder="Green Tax Number" />

                <CFormInput type="date" size="sm" 
                value = {updated_data.greendate}
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

export default VehicleInventory
