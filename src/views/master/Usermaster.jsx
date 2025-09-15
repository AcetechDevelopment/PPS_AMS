import React, { useState, useEffect, useMemo } from 'react';
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
  CImage,
} from '@coreui/react'
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useTable, usePagination, useSortBy } from 'react-table';
import { Table, Card, Modal, Button, Form, FloatingLabel } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';
import Select from 'react-select';
const BASE = import.meta.env.VITE_BASE_URL;


const ReactSwal = withReactContent(Swal);
const User = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role_id, setrole_id] = useState('');
  const [group_id, setgroup_id] = useState('');
  const [id, setid] = useState('');
  const [roleoptions, setroleoptions] = useState([])
  const [selectedrole, setselectedrole] = useState("")

  const authToken = JSON.parse(sessionStorage.getItem('authToken')) || '';



  const handleSubmit = async () => {
    if (!name || !mobile || !email || !password || !confirmPassword || !role_id) {
      toast.error('All fields are required!');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    const payload = {
      name,
      email,
      password,
      role_id,
      mobile
    };
    try {
      const response = await fetch(`${BASE}auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('User created successfully!');
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
        toast.error(`Error: ${error.message || 'Unable to register user'}`);
      }
    } catch (err) {
      toast.error('Failed to connect to the server. Please try again later.');
    }
  };




  const fetchData = async ({ pageSize, pageIndex, sortBy, search }) => {
    setLoading(true);
    const sortColumn = sortBy.length > 0 ? sortBy[0].id : 'id';
    const sortOrder = sortBy.length > 0 && sortBy[0].desc ? 'desc' : 'asc';

    try {
      const response = await fetch(
        `${BASE}auth/userlist?pageSize=${pageSize}&pageIndex=${pageIndex + 1}&sortBy=${sortColumn}&sortOrder=${sortOrder}&search=${search}`,
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
      setData(result.data);
      setPageCount(result.pageCount);
    } catch (error) {
      toast.error('Error fetching data:', error);
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
        const response = await fetch(`${BASE}auth/delete_user/${userId}`, {
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

          fetchData({ pageSize, pageIndex, sortBy, search });
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
      const response = await fetch(`${BASE}auth/update_user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const ddata = data;
        setid(ddata.id);
        setName(ddata.name);
        setEmail(ddata.email);
        setMobile(ddata.mobile);
        setrole_id(ddata.role_id);
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

  const getrolelist = async () => {
    console.log("getrolelist")
    try {
      const response = await fetch(`${BASE}permission/role`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        }
      })
      if (response.ok) {
        const result = await response.json();
        console.log(result)
        const roledatas = result?.map(item => ({
          value: item.role_id,
          label: item.name
        }));
        setroleoptions(roledatas)
      }


      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    }
    catch (err) {
      console.error('Error:', err);
      ReactSwal.fire({
        title: 'Error',
        text: 'Failed to connect to the server. Please try again later.',
        icon: 'error',
      });
    }

  }
  const handleUpdate = async () => {
    if (!name || !email || (role_id === null || role_id === undefined || role_id === '') || !mobile) {
      toast.error('All fields are required!');
      return;
    }

    const payload = {
      id,
      name,
      email,
      role_id,
      mobile
    };


    try {
      const response = await fetch(`${BASE}auth/update_user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('User Updated successfully!');
        fetchData({ pageSize, pageIndex, sortBy, search });
        setupdateShow(false);
        setName('');
        setUsername('');
        setEmail('');
        setMobile('');
        setPassword('');
        setConfirmPassword('');
        setgroup_id('');
      } else {
        const error = await response.json();
        toast.error(`Error: ${error.message || 'Unable to register user'}`);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to connect to the server. Please try again later.');
    }
  };

  const roleMap = {
    0: "Super Admin",
    1: "Admin",
    2: "Manager",
    3: "Team Lead",
    4: "Engineer",
    5: "User Admin",
    6: "User",
  };
  console.log(role_id)
  console.log(roleoptions)
  const columns = useMemo(
    () => [
      {
        Header: 'SL',
        Cell: ({ row }) => row.index + 1 + (pageIndex * pageSize)
      },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Mobile', accessor: 'mobile' },
      {
        Header: 'Role', accessor: 'role_id',
        Cell: ({ value }) =>{
         const option= roleoptions.find((item)=>(item.value===value))
         return option?option.label:"unknown"
        } 
      },
      {
        Header: 'Action',
        Cell: ({ row }) => (
          <>
            <FaEdit className="text-primary pointer" onClick={() => edit_user(row.original.id)} style={{ marginRight: '10px', marginLeft: '10px' }} />
            <FaTrash className="text-danger pointer" onClick={() => delete_user(row.original.id)} />
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
    fetchData({ pageSize, pageIndex, sortBy, search });getrolelist()
  }, [pageSize, pageIndex, sortBy, search]);



  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [updateshow, setupdateShow] = useState(false);
  const handleEClose = () => setupdateShow(false);
 console.log(selectedrole)

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className='bg-secondary text-light'>
          User form
        </CCardHeader>

        <CCardBody>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="form-control form-control-sm mb-1 float-end w-auto"
          />

          <button className="mb-1 btn btn-sm btn-info w-auto" onClick={handleShow}> Add </button>

          <CTable striped bordered hover size="sm" variant="dark" {...getTableProps()}>
            <thead>
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
            </thead>
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
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className='mb-3 float-end w-auto'>
              {'<<'}
            </button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage} className='mb-3 float-end w-auto'>
              {'<'}
            </button>
            <button onClick={() => nextPage()} disabled={!canNextPage} className='mb-3 float-end w-auto'>
              {'>'}
            </button>
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className='mb-3 float-end w-auto'>
              {'>>'}
            </button>
          </div>

        </CCardBody>


      </CCard>


      {/* create */}

      <Modal show={show} onHide={handleClose} border="danger">
        <Modal.Header closeButton className='bg-secondary'>
          <Modal.Title className='text-light'>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body className=''>
          <Form>
            <Form.Control
              size="sm"
              type="text"
              placeholder="Name"
              className="mb-2 "
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Form.Control
              size="sm"
              type="tel"
              placeholder="Mobile Number"
              className="mb-2 "
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <Form.Control
              size="sm"
              type="email"
              placeholder="Email"
              className="mb-2 "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Form.Control
              size="sm"
              type="password"
              placeholder="Password"
              className="mb-2 "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Control
              size="sm"
              type="text"
              placeholder="Confirm-Password"
              className="mb-2 "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {/* <Form.Select
                size="sm"
                className="mb-2"
                value={group_id}
                onChange={(e) => setrole_id(e.target.value)}
              >
                <option selected value="">
                  Select Role
                </option>
                <option value="1">Admin</option>
                <option value="2">Manager</option>
                <option value="3">Team Lead</option>
                <option value="4">Engineer</option>
                <option value="5">User Admin</option>
                <option value="6">User</option>
              </Form.Select> */}

            <Select options={roleoptions} onChange={(selectedOption) => {
              setrole_id(selectedOption.label)
            }} />
          </Form>

        </Modal.Body>
        <Modal.Footer >
          <Button variant="secondary" className="btn btn-sm " onClick={handleClose}>
            Close
          </Button>
          <Button className="btn btn-sm btn-primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>



      {/* edit */}
      <Modal show={updateshow} onHide={handleEClose} border="danger">
        <Modal.Header closeButton className='bg-secondary'>
          <Modal.Title className='text-light'>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              size="sm"
              type="text"
              placeholder="Name"
              className="mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Form.Control
              size="sm"
              type="tel"
              placeholder="Mobile Number"
              className="mb-2"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <Form.Control
              size="sm"
              type="email"
              placeholder="Email"
              className="mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* <Form.Select
              size="sm"
              className="mb-2"
              value={role_id}
              onChange={(e) => setrole_id(e.target.value)}
            >
              <option selected value="">
                Select Role
              </option>
              <option value="1">Admin</option>
              <option value="2">Manager</option>
              <option value="3">Team Lead</option>
              <option value="4">Engineer</option>
              <option value="5">User Admin</option>
              <option value="6">User</option>
            </Form.Select>
             */}
             {/* <Select/> */}
             
            <Select options={roleoptions} 
            value={roleoptions.find((option) => option.value === role_id)}
            onChange={(selectedOption) => {
              setrole_id(selectedOption.value)
            }} />
          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="btn btn-sm btn-info" onClick={handleEClose}>
            Close
          </Button>
          <Button variant="primary" className="btn btn-sm btn-success" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>



    </>
  );
};

export default User;
