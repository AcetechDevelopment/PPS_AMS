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
} from '@coreui/react';
import { FaBars,FaTrash,FaEdit } from 'react-icons/fa';
import { CIcon } from '@coreui/icons-react';
import { cilTrash, cilPencil } from '@coreui/icons';
import Select from 'react-select';
import { useTable, usePagination, useSortBy } from 'react-table';
import { isNumberKey, base_url, today } from '../service';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const apiUrl = import.meta.env.VITE_BASE_URL;

const Generalmaster = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [search, setsearch] = useState('');
  const [todate, settodate] = useState(today);
  const [location, setlocation] = useState('');
  const [id, setid] = useState('');

  const [categoryoption, setcategoryoption] = useState([]);
  const [brandoption, setbrandoption] = useState([]);

  const [categoryid, setcategoryid] = useState('');
  const [brandid, setbrandid] = useState('');
  const [modelname, setmodel_name] = useState('');
  
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

const authToken = JSON.parse(sessionStorage.getItem('authToken')) || '';

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
}


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


   
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);

const [updateshow, setupdateShow] = useState(false);
const handleEClose = () => setupdateShow(false);

  const handleSubmit = async () => {
    if (!categoryid || !brandid || !modelname) {
      toast.error('All fields are required!');
      return;
    }

    const payload = {
      brand_id:brandid,
      category:categoryid,
      model:modelname
    };
  
    try {
      const response = await fetch(`${apiUrl}model/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
    
      if (response.ok) {
        const result = await response.json();
        toast.success('Model created!');
        fetchData({ pageSize, pageIndex, sortBy, search });
        setShow(false);
        setcategoryid('');
        setbrandid('');
        setmodel_name('');
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
  

  const fetchData = async ({ pageSize, pageIndex, sortBy}) => {
    setLoading(true);
    const sortColumn = sortBy.length > 0 ? sortBy[0].id : 'id'; 
    const sortOrder = sortBy.length > 0 && sortBy[0].desc ? 'desc' : 'asc';

    const orderBy = `${sortColumn} ${sortOrder}`;

    const pageSizee = 10;
    const pageindex = pageIndex * pageSizee;
  
    try {
      const response = await fetch(
        `${apiUrl}model/list?start=${pageindex}&limit=${pageSizee}&search=${search}&order_by=${orderBy}`,
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
      const tot = Math.round(result.total*1/1)  
      setPageCount(tot);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };
  

  const deletemodel = async (id) => {
    const result = await Swal.fire({
      title: 'Delete this item?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${apiUrl}model/delete/${id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (res.ok) {
          fetchData({ pageSize, pageIndex, sortBy});
          Swal.fire('Deleted!', data.message || 'Item has been deleted.', 'success');
        } else {
          Swal.fire('Error', data.message || 'Failed to delete item.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong. Try again.', 'error');
      }
    }
  };
  

  const [ebrandid, setebrandid] = useState('');
  const [ecategoryid, setecategoryid] = useState('');
  const [emodel, setemodel] = useState('');
  const [emodelid, setemodelid] = useState('');

  const editmodels = async(id) =>
    {
      setupdateShow(true);
      try {
        const response = await fetch(
          `${apiUrl}model/edit/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
          }
        );
        const result = await response.json();
        setebrandid(result.data.brand_id);
        setecategoryid(result.data.category);
        setemodel(result.data.model);
        setemodelid(result.data.id);
      } catch (error) {
        console.error('Brand fetch error:', error);
      } 
      
    }


    const handlemodelSubmit = async () => {
      if (!emodel || !ecategoryid || !ebrandid || !emodelid) {
        toast.error('All fields are required!');
        return;
      }
    
      const payload = {
        id: emodelid,
        brand_id: ebrandid,
        category: ecategoryid,
        model: emodel
      };
    
      try {
        const response = await fetch(`${apiUrl}model/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        });
    
        if (response.ok) {
          const result = await response.json();
          toast.success('Model updated successfully!');
          fetchData({ pageSize, pageIndex, sortBy });
          
          // Reset fields after success
          setupdateShow(false);
          setebrandid('');
          setecategoryid('');
          setemodel('');
          setemodelid('');
        } else {
          const error = await response.json();
          toast.error(`Error: ${error.message || 'Unable to update model.'}`);
        }
      } catch (err) {
        console.error('Error:', err);
        toast.error('Duplicate Model entry.!');
      }
    };
    
  
  
  const columns = useMemo(
    () => [
      {
        Header: 'SL',
        Cell: ({ row }) => row.index + 1,
      },
      { Header: 'Category', accessor: 'category_name' },
      { Header: 'Brand', accessor: 'brand_name' },
      { Header: 'Model', accessor: 'model' },
      {
        Header: () => <FaBars />,
        id: 'actions', 
        Cell: ({ row }) => {
          const id = row.original.id;
      
          return (
            <div className="flex gap-5">
                <FaEdit className="ms-2 pointer text-primary" onClick={() => editmodels(id)} />

                <FaTrash className="ms-2 pointer text-danger" onClick={() => deletemodel(id)}/>
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






  // type table
  const [typeData, setTypeData] = useState([]);
  const [typeLoading, setTypeLoading] = useState(false);
  const [typePageCount, setTypePageCount] = useState(0);
  const [typeSearch, setTypeSearch] = useState('');

  const fetchTypeData = async ({ pageSize, pageIndex, sortBy }) => {
    setTypeLoading(true);
    const sortColumn = sortBy.length > 0 ? sortBy[0].id : 'id';
    const sortOrder = sortBy.length > 0 && sortBy[0].desc ? 'desc' : 'asc';
    const orderBy = `${sortColumn} ${sortOrder}`;

    try {
      const response = await fetch(
        `${apiUrl}type/list?start=${pageIndex * pageSize}&limit=${pageSize}&search=${typeSearch}&order_by=${orderBy}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );
      const result = await response.json();
      setTypeData(result.data || []);
      setTypePageCount(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error('Type list fetch error:', error);
      setTypeData([]);
    } finally {
      setTypeLoading(false);
    }
  };

  const typeColumns = useMemo(
    () => [
      {
        Header: 'SL',
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: () => <FaBars />,
        id: 'actions', 
        Cell: ({ row }) => {
          const id = row.original.id;
      
          return (
            <div className="flex gap-5">
                <FaEdit className="ms-2 pointer text-primary" onClick={() => editCol(id)} />

                <FaTrash className="ms-2 pointer text-danger" onClick={() => deleteCol(id)}/>
            </div>
          );
        },
        disableSortBy: true,
      }
    ],
    []
  );



  const {
    getTableProps: getTypeTableProps,
    getTableBodyProps: getTypeTableBodyProps,
    headerGroups: typeHeaderGroups,
    prepareRow: prepareTypeRow,
    page: typePage,
    state: { pageIndex: typePageIndex, pageSize: typePageSize, sortBy: typeSortBy },
    gotoPage: gotoTypePage,
    nextPage: nextTypePage,
    previousPage: previousTypePage,
    canPreviousPage: canTypePreviousPage,
    canNextPage: canTypeNextPage,
    pageOptions: typePageOptions,
    setPageSize: setTypePageSize
  } = useTable(
    {
      columns: typeColumns,
      data: typeData,
      manualPagination: true,
      manualSortBy: true,
      pageCount: typePageCount,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    fetchTypeData({ pageSize: typePageSize, pageIndex: typePageIndex, sortBy: typeSortBy });
  }, [typePageSize, typePageIndex, typeSortBy, typeSearch]);



     
  const [type, settypeShow] = useState(false);
  const typeClose = () => settypeShow(false);
  const typeShow = () => settypeShow(true);
  const [type_name, settype_name] = useState('');

  const handleTypeSubmit = async () => 
    {
      if (!type_name) {
        toast.error('All fields are required!');
        return;
      }
        const payload = {
          type:type_name
        };
      try {
        const response = await fetch(`${apiUrl}type/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        });
    
        if (response.ok) {
          const result = await response.json();
          toast.success('Type created successfully.!');
          fetchTypeData({ pageSize, pageIndex, sortBy});
          settypeShow(false);
          settype_name('');
        } else {
          const error = await response.json();
          toast.error(`Error: ${error.message || 'Unable to create Type'}`);
        }
      } catch (err) {
        console.error('Error:', err);
        toast.error('Failed to connect to the server. Please try again later.');
      }
    };


  const [etype, setetypeShow] = useState(false);
  const etypeClose = () => setetypeShow(false);
  const [etype_name, setetype_name] = useState('');
  const [etype_id, setetype_id] = useState('');

    const editCol = async(id) =>
    {
      setetypeShow(true);
      try {
        const response = await fetch(
          `${apiUrl}type/edit/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
          }
        );
        const result = await response.json();
        setetype_name(result.data.type);
        setetype_id(result.data.id);
      } catch (error) {
        console.error('Type fetch error:', error);
      } 
      
    }

    const deleteCol = async (id) => {
      const result = await Swal.fire({
        title: 'Delete this item?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });
    
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${apiUrl}type/delete/${id}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (res.ok) {
            fetchTypeData({ pageSize, pageIndex, sortBy});
            Swal.fire('Deleted!', data.message || 'Item has been deleted.', 'success');
          } else {
            Swal.fire('Error', data.message || 'Failed to delete item.', 'error');
          }
        } catch (error) {
          Swal.fire('Error', 'Something went wrong. Try again.', 'error');
        }
      }
    };
    
    

    const handleeTypeSubmit = async() =>
    {
        if (!etype_name || !etype_id) {
          alert('All fields are required!');
          return;
        }
          const payload = {
            id:etype_id,
            type:etype_name
          };
        try {
          const response = await fetch(`${base_url}type/update`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(payload),
          });
      
          if (response.ok) {
            const result = await response.json();
            toast.success('Type Updated successfully.!');
            fetchTypeData({ pageSize, pageIndex, sortBy});
            setetypeShow(false);
            setetype_name('');
            setetype_id('');
          } else {
            const error = await response.json();
            toast.error(`Error: ${error.message || 'Unable to Update Type'}`);
          }
        } catch (err) {
          console.error('Error:', err);
          toast.error('Failed to connect to the server. Please try again later.');
        }
    }




// category table
  const [catData, setcatData] = useState([]);
  const [catLoading, setcatLoading] = useState(false);
  const [catPageCount, setcatPageCount] = useState(0);
  const [catSearch, setcatsearch] = useState('');

  const fetchcatData = async ({ pageSize, pageIndex, sortBy }) => {
    setcatLoading(true);
    const sortColumn = sortBy.length > 0 ? sortBy[0].id : 'id';
    const sortOrder = sortBy.length > 0 && sortBy[0].desc ? 'desc' : 'asc';
    const orderBy = `${sortColumn} ${sortOrder}`;

    try {
      const response = await fetch(
        `${apiUrl}category/list?start=${pageIndex * pageSize}&limit=${pageSize}&search=${catSearch}&order_by=${orderBy}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );
      const result = await response.json();
      setcatData(result.data || []);
      setcatPageCount(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error('Category list fetch error:', error);
      setcatData([]);
    } finally {
      setcatLoading(false);
    }
  };

  const catColumns = useMemo(
    () => [
      {
        Header: 'SL',
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: 'Category',
        accessor: 'category',
      },
      {
        Header: () => <FaBars />,
        id: 'actions', 
        Cell: ({ row }) => {
          const id = row.original.id;
      
          return (
            <div className="flex gap-5">
                <FaEdit className="ms-2 pointer text-primary" onClick={() => editcat(id)} />

                <FaTrash className="ms-2 pointer text-danger" onClick={() => deletecat(id)}/>
            </div>
          );
        },
        disableSortBy: true,
      }
    ],
    []
  );

  const {
    getTableProps: getcatTableProps,
    getTableBodyProps: getcatTableBodyProps,
    headerGroups: catHeaderGroups,
    prepareRow: preparecatRow,
    page: catPage,
    state: { pageIndex: catPageIndex, pageSize: catPageSize, sortBy: catSortBy },
    gotoPage: gotocatPage,
    nextPage: nextcatPage,
    previousPage: previouscatPage,
    canPreviousPage: cancatPreviousPage,
    canNextPage: cancatNextPage,
    pageOptions: catPageOptions,
    setPageSize: setcatPageSize
  } = useTable(
    {
      columns: catColumns,
      data: catData,
      manualPagination: true,
      manualSortBy: true,
      pageCount: catPageCount,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    fetchcatData({ pageSize: catPageSize, pageIndex: catPageIndex, sortBy: catSortBy });
  }, [catPageSize, catPageIndex, catSortBy, catSearch]);



     
  const [cat, setcatShow] = useState(false);
  const catClose = () => setcatShow(false);
  const catShow = () => setcatShow(true);
  const [cat_name, setcat_name] = useState('');

  const handlecatSubmit = async () => 
    {
      if (!cat_name) {
        toast.error('All fields are required!');
        return;
      }
        const payload = {
          category:cat_name
        };
      try {
        const response = await fetch(`${apiUrl}category/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        });
    
        if (response.ok) {
          const result = await response.json();
          toast.success('Category created successfully.!');
          fetchcatData({ pageSize, pageIndex, sortBy});
          setcatShow(false);
          setcat_name('');
        } else {
          const error = await response.json();
          toast.error(`Error: ${error.message || 'Duplicate Category.!'}`);
        }
      } catch (err) {
        console.error('Error:', err);
        toast.error('Failed to connect to the server. Please try again later.');
      }
    };


  const [ecat, setecatShow] = useState(false);
  const ecatClose = () => setecatShow(false);
  const [ecat_name, setecat_name] = useState('');
  const [ecat_id, setecat_id] = useState('');

    const editcat = async(id) =>
    {
      setecatShow(true);
      try {
        const response = await fetch(
          `${apiUrl}category/edit/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
          }
        );
        const result = await response.json();
        setecat_name(result.data.category);
        setecat_id(result.data.id);
      } catch (error) {
        console.error('Category fetch error:', error);
      } 
      
    }

    const deletecat = async (id) => {
      const result = await Swal.fire({
        title: 'Delete this item?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });
    
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${apiUrl}category/delete/${id}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (res.ok) {
            fetchcatData({ pageSize, pageIndex, sortBy});
            Swal.fire('Deleted!', data.message || 'Item has been deleted.', 'success');
          } else {
            Swal.fire('Error', data.message || 'Failed to delete item.', 'error');
          }
        } catch (error) {
          Swal.fire('Error', 'Something went wrong. Try again.', 'error');
        }
      }
    };
    
    

    const handleecatSubmit = async() =>
    {
        if (!ecat_name || !ecat_id) {
          alert('All fields are required!');
          return;
        }
          const payload = {
            id:ecat_id,
            category:ecat_name
          };
        try {
          const response = await fetch(`${base_url}category/update`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(payload),
          });
      
          if (response.ok) {
            const result = await response.json();
            toast.success('Category Updated successfully.!');
            fetchcatData({ pageSize, pageIndex, sortBy});
            setecatShow(false);
            setecat_name('');
            setecat_id('');
          } else {
            const error = await response.json();
            toast.error(`Error: ${error.message || 'Unable to Update Category'}`);
          }
        } catch (err) {
          console.error('Error:', err);
          toast.error('Failed to connect to the server. Please try again later.');
        }
    }



  // brand table
  const [brandData, setbrandData] = useState([]);
  const [brandLoading, setbrandLoading] = useState(false);
  const [brandPageCount, setbrandPageCount] = useState(0);
  const [brandSearch, setbrandsearch] = useState('');

  const fetchbrandData = async ({ pageSize, pageIndex, sortBy }) => {
    setbrandLoading(true);
    const sortColumn = sortBy.length > 0 ? sortBy[0].id : 'id';
    const sortOrder = sortBy.length > 0 && sortBy[0].desc ? 'desc' : 'asc';
    const orderBy = `${sortColumn} ${sortOrder}`;

    try {
      const response = await fetch(
        `${apiUrl}brand/list?start=${pageIndex * pageSize}&limit=${pageSize}&search=${brandSearch}&order_by=${orderBy}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );
      const result = await response.json();
      setbrandData(result.data || []);
      setbrandPageCount(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error('brand list fetch error:', error);
      setbrandData([]);
    } finally {
      setbrandLoading(false);
    }
  };

  const brandColumns = useMemo(
    () => [
      {
        Header: 'SL',
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: 'Brand',
        accessor: 'brand',
      },
      {
        Header: () => <FaBars />,
        id: 'actions', 
        Cell: ({ row }) => {
          const id = row.original.id;
      
          return (
            <div className="flex gap-5">
                <FaEdit className="ms-2 pointer text-primary" onClick={() => editbrand(id)} />

                <FaTrash className="ms-2 pointer text-danger" onClick={() => deletebrand(id)}/>
            </div>
          );
        },
        disableSortBy: true,
      }
    ],
    []
  );

  const {
    getTableProps: getbrandTableProps,
    getTableBodyProps: getbrandTableBodyProps,
    headerGroups: brandHeaderGroups,
    prepareRow: preparebrandRow,
    page: brandPage,
    state: { pageIndex: brandPageIndex, pageSize: brandPageSize, sortBy: brandSortBy },
    gotoPage: gotobrandPage,
    nextPage: nextbrandPage,
    previousPage: previousbrandPage,
    canPreviousPage: canbrandPreviousPage,
    canNextPage: canbrandNextPage,
    pageOptions: brandPageOptions,
    setPageSize: setbrandPageSize
  } = useTable(
    {
      columns: brandColumns,
      data: brandData,
      manualPagination: true,
      manualSortBy: true,
      pageCount: brandPageCount,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    fetchbrandData({ pageSize: brandPageSize, pageIndex: brandPageIndex, sortBy: brandSortBy });
  }, [brandPageSize, brandPageIndex, brandSortBy, brandSearch]);



     
  const [brand, setbrandShow] = useState(false);
  const brandClose = () => setbrandShow(false);
  const brandShow = () => setbrandShow(true);
  const [brand_name, setbrand_name] = useState('');

  const handlebrandSubmit = async () => 
    {
      if (!brand_name) {
        toast.error('All fields are required!');
        return;
      }
        const payload = {
          brand:brand_name
        };
      try {
        const response = await fetch(`${apiUrl}brand/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        });
    
        if (response.ok) {
          const result = await response.json();
          toast.success('Brand created successfully.!');
          fetchbrandData({ pageSize, pageIndex, sortBy});
          setbrandShow(false);
          setbrand_name('');
        } else {
          const error = await response.json();
          toast.error(`Error: ${error.message || 'Duplicate Brand.!'}`);
        }
      } catch (err) {
        console.error('Error:', err);
        toast.error('Failed to connect to the server. Please try again later.');
      }
    };


  const [ebrand, setebrandShow] = useState(false);
  const ebrandClose = () => setebrandShow(false);
  const [ebrand_name, setebrand_name] = useState('');
  const [ebrand_id, setebrand_id] = useState('');

    const editbrand = async(id) =>
    {
      setebrandShow(true);
      try {
        const response = await fetch(
          `${apiUrl}brand/edit/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
          }
        );
        const result = await response.json();
        setebrand_name(result.data.brand);
        setebrand_id(result.data.id);
      } catch (error) {
        console.error('Brand fetch error:', error);
      } 
      
    }

    const deletebrand = async (id) => {
      const result = await Swal.fire({
        title: 'Delete this item?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });
    
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${apiUrl}brand/delete/${id}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (res.ok) {
            fetchbrandData({ pageSize, pageIndex, sortBy});
            Swal.fire('Deleted!', data.message || 'Item has been deleted.', 'success');
          } else {
            Swal.fire('Error', data.message || 'Failed to delete item.', 'error');
          }
        } catch (error) {
          Swal.fire('Error', 'Something went wrong. Try again.', 'error');
        }
      }
    };
    
    

    const handleebrandSubmit = async() =>
    {
        if (!ebrand_name || !ebrand_id) {
          alert('All fields are required!');
          return;
        }
          const payload = {
            id:ebrand_id,
            brand:ebrand_name
          };
        try {
          const response = await fetch(`${base_url}brand/update`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(payload),
          });
      
          if (response.ok) {
            const result = await response.json();
            toast.success('Brand Updated successfully.!');
            fetchbrandData({ pageSize, pageIndex, sortBy});
            setebrandShow(false);
            setebrand_name('');
            setebrand_id('');
          } else {
            const error = await response.json();
            toast.error(`Error: ${error.message || 'Unable to Update Brand'}`);
          }
        } catch (err) {
          console.error('Error:', err);
          toast.error('Failed to connect to the server. Please try again later.');
        }
    }

  return (
    <>
    <CRow className='mb-2'>



    <CCol md={4}>
    <CCard>
    <CCardHeader className='bg-secondary text-light'>
     Asset category
    </CCardHeader>
    <CCardBody>
                <input
                  type="search"
                  onChange={(e) => setcatsearch(e.target.value)}
                  className="form-control form-control-sm m-1 float-end w-auto"
                  placeholder='Search'
                />
                <CButtonGroup role="group" aria-label="Basic example">
                <CButton className="btn btn-sm btn-primary w-auto m-1" onClick={catShow}> New </CButton>
                </CButtonGroup>


              <CTable striped bordered hover size="sm" variant="dark" {...getcatTableProps()} style={{ fontSize: '0.75rem' }}>
                <CTableHead color="secondary">
                  {catHeaderGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                          {column.render('Header')}
                          <span>
                            {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </CTableHead>
                <tbody {...getcatTableBodyProps()}>
                  {catPage.map((row) => {
                    preparecatRow(row);
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

              <div className="mt-2">
                <button onClick={() => gotocatPage(0)} disabled={!cancatPreviousPage} className="mb-3 bg-secondary float-end w-auto">{'<<'}</button>
                <button onClick={() => previouscatPage()} disabled={!cancatPreviousPage} className="mb-3 bg-secondary float-end w-auto">{'<'}</button>
                <button onClick={() => nextcatPage()} disabled={!cancatNextPage} className="mb-3 bg-secondary float-end w-auto">{'>'}</button>
                <button onClick={() => gotocatPage(catPageCount - 1)} disabled={!cancatNextPage} className="mb-3 bg-secondary float-end w-auto">{'>>'}</button>
              </div>
          </CCardBody>
    </CCard>
    </CCol>


    <CCol md={4}>
    <CCard>

    <CCardHeader className='bg-secondary text-light'>
         Asset Type
        </CCardHeader>
        <CCardBody>
                {/* <input
                  type="search"
                  onChange={(e) => setsearch(e.target.value)}
                  className="form-control form-control-sm m-1 float-end w-auto"
                  placeholder='Search'
                /> */}
                <CButtonGroup role="group" aria-label="Basic example">
                <CButton className="btn btn-sm btn-primary w-auto m-1" onClick={typeShow}> New </CButton>
                </CButtonGroup>


              <CTable striped bordered hover size="sm" variant="dark" {...getTypeTableProps()} style={{ fontSize: '0.75rem' }}>
                <CTableHead color="secondary">
                  {typeHeaderGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                          {column.render('Header')}
                          <span>
                            {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </CTableHead>
                <tbody {...getTypeTableBodyProps()}>
                  {typePage.map((row) => {
                    prepareTypeRow(row);
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

              <div className="mt-2">
                <button onClick={() => gotoTypePage(0)} disabled={!canTypePreviousPage} className="mb-3 bg-secondary float-end w-auto">{'<<'}</button>
                <button onClick={() => previousTypePage()} disabled={!canTypePreviousPage} className="mb-3 bg-secondary float-end w-auto">{'<'}</button>
                <button onClick={() => nextTypePage()} disabled={!canTypeNextPage} className="mb-3 bg-secondary float-end w-auto">{'>'}</button>
                <button onClick={() => gotoTypePage(typePageCount - 1)} disabled={!canTypeNextPage} className="mb-3 bg-secondary float-end w-auto">{'>>'}</button>
              </div>
          </CCardBody>
      </CCard>
    </CCol>


    <CCol md={4}>
    <CCard>
    <CCardHeader className='bg-secondary text-light'>
     Asset Brand
    </CCardHeader>
       <CCardBody>
                <input
                  type="search"
                  onChange={(e) => setbrandsearch(e.target.value)}
                  className="form-control form-control-sm m-1 float-end w-auto"
                  placeholder='Search'
                />
                <CButtonGroup role="group" aria-label="Basic example">
                <CButton className="btn btn-sm btn-primary w-auto m-1" onClick={brandShow}> New </CButton>
                </CButtonGroup>


              <CTable striped bordered hover size="sm" variant="dark" {...getbrandTableProps()} style={{ fontSize: '0.75rem' }}>
                <CTableHead color="secondary">
                  {brandHeaderGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                          {column.render('Header')}
                          <span>
                            {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </CTableHead>
                <tbody {...getbrandTableBodyProps()}>
                  {brandPage.map((row) => {
                    preparebrandRow(row);
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

              <div className="mt-2">
                <button onClick={() => gotobrandPage(0)} disabled={!canbrandPreviousPage} className="mb-3 bg-secondary float-end w-auto">{'<<'}</button>
                <button onClick={() => previousbrandPage()} disabled={!canbrandPreviousPage} className="mb-3 bg-secondary float-end w-auto">{'<'}</button>
                <button onClick={() => nextbrandPage()} disabled={!canbrandNextPage} className="mb-3 bg-secondary float-end w-auto">{'>'}</button>
                <button onClick={() => gotobrandPage(brandPageCount - 1)} disabled={!canbrandNextPage} className="mb-3 bg-secondary float-end w-auto">{'>>'}</button>
              </div>
          </CCardBody>
    </CCard>
    </CCol>
    </CRow>

    <CRow>
    <CCol md={12}>
    <CCard>
    <CCardHeader className='bg-secondary text-light'>
     Asset Model
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
    </CCol>

    </CRow>





{/* TYpe  create */}
    <CModal
        visible={type}
        onClose={() => typeClose()}
        aria-labelledby="NewProcessing"
        >
        <CModalHeader className='bg-secondary'>
          <CModalTitle id="NewProcessing">New Type</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
          <CCol md={12}>
              <CFormLabel className="col-form-label">
               Type Name
              </CFormLabel>
              <CFormInput type="text" size="sm"
              onChange={(e) => settype_name(e.target.value)} 
              placeholder="Type Name" className='mb-2' />
            <div className="d-flex justify-content-center mt-4">
            <CButton className="btn btn-sm btn-success w-100" size="xl" onClick={handleTypeSubmit}> Add </CButton>
            </div>
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>



      <CModal
        visible={etype}
        onClose={() => etypeClose()}
        aria-labelledby="NewProcessing"
        >
        <CModalHeader className='bg-secondary'>
          <CModalTitle id="NewProcessing">{etype_name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
          <CCol md={12}>
              <CFormLabel className="col-form-label">
               Type Name
              </CFormLabel>
              <CFormInput type="text" size="sm"
              value = {etype_name}
              onChange={(e) => setetype_name(e.target.value)} 
              placeholder="Type Name" className='mb-2' />
            <div className="d-flex justify-content-center mt-4">
            <CButton className="btn btn-sm btn-success w-100" size="xl" onClick={handleeTypeSubmit}> Update </CButton>
            </div>
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>



{/* Category  create */}
<CModal
        visible={cat}
        onClose={() => catClose()}
        aria-labelledby="NewProcessing"
        >
        <CModalHeader className='bg-secondary'>
          <CModalTitle id="NewProcessing">New Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
          <CCol md={12}>
              <CFormLabel className="col-form-label">
              Category Name
              </CFormLabel>
              <CFormInput type="text" size="sm"
              onChange={(e) => setcat_name(e.target.value)} 
              placeholder="Category Name" className='mb-2' />
            <div className="d-flex justify-content-center mt-4">
            <CButton className="btn btn-sm btn-success w-100" size="xl" onClick={handlecatSubmit}> Add </CButton>
            </div>
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>



      <CModal
        visible={ecat}
        onClose={() => ecatClose()}
        aria-labelledby="NewProcessing"
        >
        <CModalHeader className='bg-secondary'>
          <CModalTitle id="NewProcessing">{ecat_name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
          <CCol md={12}>
              <CFormLabel className="col-form-label">
               Category Name
              </CFormLabel>
              <CFormInput type="text" size="sm"
              value = {ecat_name}
              onChange={(e) => setecat_name(e.target.value)} 
              placeholder="Type Name" className='mb-2' />
            <div className="d-flex justify-content-center mt-4">
            <CButton className="btn btn-sm btn-success w-100" size="xl" onClick={handleecatSubmit}> Update </CButton>
            </div>
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>




      {/* Brand  create */}
      <CModal
        visible={brand}
        onClose={() => brandClose()}
        aria-labelledby="NewProcessing"
        >
        <CModalHeader className='bg-secondary'>
          <CModalTitle id="NewProcessing">New Brand</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
          <CCol md={12}>
              <CFormLabel className="col-form-label">
              Brand Name
              </CFormLabel>
              <CFormInput type="text" size="sm"
              onChange={(e) => setbrand_name(e.target.value)} 
              placeholder="Brand Name" className='mb-2' />
            <div className="d-flex justify-content-center mt-4">
            <CButton className="btn btn-sm btn-success w-100" size="xl" onClick={handlebrandSubmit}> Add </CButton>
            </div>
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>



      <CModal
        visible={ebrand}
        onClose={() => ebrandClose()}
        aria-labelledby="NewProcessing"
        >
        <CModalHeader className='bg-secondary'>
          <CModalTitle id="NewProcessing">{ebrand_name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
          <CCol md={12}>
              <CFormLabel className="col-form-label">
               Brand Name
              </CFormLabel>
              <CFormInput type="text" size="sm"
              value = {ebrand_name}
              onChange={(e) => setebrand_name(e.target.value)} 
              placeholder="Type Name" className='mb-2' />
            <div className="d-flex justify-content-center mt-4">
            <CButton className="btn btn-sm btn-success w-100" size="xl" onClick={handleebrandSubmit}> Update </CButton>
            </div>
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>


{/* Model  create */}
      <CModal
        visible={show}
        onClose={() => handleClose()}
        aria-labelledby="NewProcessing"
        >
        <CModalHeader className='bg-secondary'>
          <CModalTitle id="NewProcessing">New Model</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
          <CCol md={12}>


              <CFormLabel htmlFor="" className="col-form-label">
                Select Category
                </CFormLabel>
                <Select options={categoryoption} isMulti={false} placeholder="Select Category" size="sm" className='mb-2' 
                styles={customStyles}
                onChange={(e) => setcategoryid(e?.value)}
                />

               <CFormLabel htmlFor="" className="col-form-label">
                Select Brand
                </CFormLabel>
                <Select options={brandoption} isMulti={false} placeholder="Select Brand" size="sm" className='mb-2' 
                styles={customStyles}
                onChange={(e) => setbrandid(e?.value)}
                />

                
              <CFormLabel className="col-form-label">
              Model Name
              </CFormLabel>
              <CFormInput type="text" size="sm"
              onChange={(e) => setmodel_name(e.target.value)} 
              placeholder="model Name" className='mb-2' />




            <div className="d-flex justify-content-center mt-4">
            <CButton className="btn btn-sm btn-success w-100" size="xl" onClick={handleSubmit}> Add </CButton>
            </div>
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>



      <CModal
        visible={updateshow}
        onClose={() => handleEClose()}
        aria-labelledby="NewProcessing"
        >
        <CModalHeader className='bg-secondary'>
          <CModalTitle id="NewProcessing">{emodel}</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CRow>
          <CCol md={12}>

              <CFormLabel htmlFor="" className="col-form-label">
                Select Category
                </CFormLabel>
                <Select options={categoryoption} isMulti={false} placeholder="Select Category" size="sm" className='mb-2' 
                styles={customStyles}
                value={categoryoption.find(option => option.value === ecategoryid)}
                onChange={(e) => setecategoryid(e?.value)}
                />

               <CFormLabel htmlFor="" className="col-form-label">
                Select Brand
                </CFormLabel>
                <Select options={brandoption} isMulti={false} placeholder="Select Brand" size="sm" className='mb-2' 
                styles={customStyles}
                value={brandoption.find(option => option.value === ebrandid)}
                onChange={(e) => setebrandid(e?.value)}
                />

              <CFormLabel className="col-form-label">
              Model Name
              </CFormLabel>
              <CFormInput type="text" size="sm"
               value = {emodel}
              onChange={(e) => setemodel(e.target.value)} 
              placeholder="model Name" className='mb-2' />

            <div className="d-flex justify-content-center mt-4">
            <CButton className="btn btn-sm btn-success w-100" size="xl" onClick={handlemodelSubmit}> Update </CButton>
            </div>
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>



    </>
  )
}

export default Generalmaster
