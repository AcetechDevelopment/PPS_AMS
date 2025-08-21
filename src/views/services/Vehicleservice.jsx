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
  CTableHead,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell,
  CFormInput,
  CInputGroup,
  CRow,
  CCol,
  CFormLabel,
} from '@coreui/react'
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useTable, usePagination, useSortBy } from 'react-table';
import { useMemo } from 'react';
import { FaTrash, FaEdit, FaBars, FaEye, FaUserCog, FaClipboardCheck } from 'react-icons/fa';


const Vehicleservice = () => {
  const [pageCount, setPageCount] = useState(0);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [view, setview] = useState(false)
  const [assign, setassign] = useState(false)
  const [status, setstatus] = useState(false)
  const [currentid, setcurrentid] = useState(null)

  const handleClose = () => {
    setShow(false)

  }

  const handleShow = () => setShow(true);

  const handleviewshow = (id) => {
    
    setcurrentid(id)
    setview(true)
  }
  const handleviewclose = (id) => {

    setview(false)
  }
  const handleassignshow = (id) => {
    setcurrentid(id)
    setassign(true)
    console.log(assign)
  }
  const handleassignclose = () => { setassign(false) }
  const handlestatusshow = (id) => {
    setcurrentid(id)
    setstatus(true)
    console.log("status")
  }
  const handlestatusclose = () => { setstatus(false) }

  const [datas, setDatas] = useState([
    { id: 1, fault: 'puncture', engineer: ' person1' },
    { id: 2, fault: 'steering', engineer: ' person2' },
    { id: 3, fault: 'engine', engineer: ' person3' }
  ]);



  const columns = useMemo(
    () => [
      {
        Header: 'Vehicle No',
        accessor: 'id',
      },
      {
        Header: 'Type of Fault',
        accessor: 'fault',
      },
      {
        Header: 'service Engineer',
        accessor: 'engineer',
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => (
          <div className="d-flex gap-4 justify-content-center">
            <FaEye
              className="text-info"
              style={{ cursor: "pointer" }}
              title="View Details"
              onClick={() => handleviewshow(row.original.id)}
              size={20}
            />
            <FaUserCog
              className="text-warning"
              style={{ cursor: "pointer" }}
              title="Assign Engineer"
              onClick={() => handleassignshow(row.original.id)}
              size={20}
            />
            <FaClipboardCheck
              className="text-success"
              style={{ cursor: "pointer" }}
              title="Change Status"
              onClick={() => handlestatusshow(row.original.id)}
              size={20}
            />
          </div>
        ),
      },
    ],
    [datas]
  );

  const [repairdetails,setrepairdetails] =useState([
    { date: 1, fault: "Puncture",desc:"...", engineer: "Person1" },
    { date: 2, fault: "steering",desc:"...", engineer: "Person2" },
    { date: 3, fault: "engine",desc:"...", engineer: "Person3" },
   
  ]);
  const historyColumns = useMemo(
    () => [
      { Header: "Date", accessor: "date" },
      { Header: "fault", accessor: "fault" },
      { Header: "Description", accessor: "desc" },
      { Header: "Engineer", accessor: "engineer" },
    ],
    []
  );
 const historyTable = useTable({ columns: historyColumns, data: repairdetails });


  const fetchData = async ({ pageSize, pageIndex, sortBy, search, todate, location }) => {
    setLoading(true);
    const sortColumn = sortBy.length > 0 ? sortBy[0].id : 'id';
    const sortOrder = sortBy.length > 0 && sortBy[0].desc ? 'desc' : 'asc';

    const orderBy = `${sortColumn} ${sortOrder}`;

    const pageSizee = 15;
    const pageindex = pageIndex * pageSizee;



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
      const tot = Math.round(result.total * 1 / 15)
      setPageCount(tot);

    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,
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
      data: datas,
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

  const engineerlist = [{ label: "engineer 1", value: "engineer 1" },
  { label: "engineer 2", value: "engineer 2" },
  { label: "engineer 3", value: "engineer 3" },
  { label: "engineer 4", value: "engineer 4" }]

  const [engineer, setengineer] = useState("")

  const statuslist = [{ label: "pending", value: "pending" },
  { label: "postponed", value: "postponed" },
  { label: "completed", value: "completed" },
  { label: "condemnation", value: "condemnation" }]

  const [statusTobe, setstatusTobe] = useState("")
  return (
    <>
      <CCard className="mb-4">

        <CCardHeader className='bg-secondary text-light'>
          Vehicle Service
        </CCardHeader>

        <CCardBody>
          <input
            type="search"
            onChange={(e) => setsearch(e.target.value)}
            className="form-control form-control-sm m-1 float-end w-auto"
            placeholder='Search'
          />

          <CButtonGroup role="group" aria-label="Basic example" >
            <CButton className="btn btn-sm btn-secondary w-auto" onClick={handleShow}> Excel </CButton>
            <CButton className="btn btn-sm btn-secondary w-auto" onClick={handleShow}> PDF </CButton>
            <CButton className="btn btn-sm btn-secondary w-auto" onClick={handleShow}> Print </CButton>
          </CButtonGroup>


          <CTable striped bordered hover size="sm" variant="dark" {...getTableProps()} style={{ fontSize: '0.75rem', marginTop: "20px" }}>
            <CTableHead color="secondary">
              {headerGroups.map((headerGroup) => (

                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th{...column.getHeaderProps(column.getSortByToggleProps())} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
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
              {rows.map((row, rowIndex) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (

                      <td {...cell.getCellProps()} style={{ textAlign: "center" }}>

                        {cell.render("Cell")}
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

      <CModal
        alignment="center"
        scrollable
        visible={show}
        size="md"
        onClose={() => handleClose()}
        aria-labelledby="NewProcessing"
      >
        <CModalHeader className='bg-secondary'>
          <CModalTitle id="NewProcessing">Vehicle Condemnation</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CRow>
            <CCol md={12}>

              <CFormLabel className="col-form-label">
                vehicle No
              </CFormLabel>
              <input
                type="text"
                className="form-control form-control-sm mb-2 small-select"
                placeholder="Vehicle No"
              />
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>

      {view &&
        <CModal
          alignment="center"
          scrollable
          visible={view}
          size="md"
          onClose={() => handleviewclose()}
          aria-labelledby="NewProcessing"
        >
          <CModalHeader className='bg-secondary'>
            <CModalTitle id="NewProcessing">View Job card details</CModalTitle>
          </CModalHeader>

          <CModalBody>
            <CRow>
              <CCol md={12}>

                <CFormLabel className="col-form-label">
                  vehicle No
                </CFormLabel>
                <input
                  type="text"
                  className="form-control form-control-sm mb-2 small-select"
                  placeholder="Vehicle No"
                  value={currentid}
                  readOnly
                />

                <CFormLabel className="col-form-label">
                  Jobcard Id
                </CFormLabel>
                <input
                  type="text"
                  className="form-control form-control-sm mb-2 small-select"
                  placeholder="Vehicle No"
                />
              </CCol>
            </CRow>
          </CModalBody>
        </CModal>
        }

      {assign &&
        <CModal
          alignment="center"
          visible={assign}
          size="xl"
        
          onClose={() => handleassignclose()}
          aria-labelledby="NewProcessing"
        >
          <CModalHeader className='bg-secondary'>
            <CModalTitle id="NewProcessing">Assign Technician</CModalTitle>
          </CModalHeader>

          <CModalBody>
            <CRow>
              <CCol md={6}>
                <CFormLabel className="col-form-label">
                  Select Engineer
                </CFormLabel>
                <Select options={engineerlist} isMulti={false} placeholder="Select jobcard type"
                  size="sm"
                  className='mb-2 small-select'
                  classNamePrefix="custom-select"
                  value={engineer}
                  onChange={(selectedOption) => setengineer(selectedOption)}
                />
                </CCol>

                <CCol md={6}>
                <CFormLabel className="col-form-label">
                  History of Repairs
                </CFormLabel>
                 <CTable striped bordered hover size="sm" {...historyTable.getTableProps()}>
        <CTableHead>
          {historyTable.headerGroups.map((headerGroup) => (
            <CTableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <CTableHeaderCell {...column.getHeaderProps()}>
                  {column.render("Header")}
                </CTableHeaderCell>
              ))}
            </CTableRow>
          ))}
        </CTableHead>
        <CTableBody {...historyTable.getTableBodyProps()}>
          {historyTable.rows.map((row) => {
            historyTable.prepareRow(row);
            return (
              <CTableRow {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <CTableDataCell {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </CTableDataCell>
                ))}
              </CTableRow>
            );
          })}
        </CTableBody>
      </CTable>
                </CCol>
                <div className="d-flex justify-content-between " style={{ marginTop: "20px" }}>
                  <CButton color="secondary" style={{ minWidth: "100px" }}>
                    Reject
                  </CButton>
                  <CButton color="secondary" style={{ minWidth: "100px" }}>
                    Approve
                  </CButton>
                </div>
              
            </CRow>
          </CModalBody>
        </CModal>
        }

      {status &&
        <CModal
          alignment="center"
          scrollable
          visible={status}
          size="md"
          onClose={() => handlestatusclose()}
          aria-labelledby="NewProcessing"
        >
          <CModalHeader className='bg-secondary'>
            <CModalTitle id="NewProcessing">check Status</CModalTitle>
          </CModalHeader>

          <CModalBody>
            <CRow>
              <CCol md={12}>

                <CFormLabel className="col-form-label">
                  vehicle No
                </CFormLabel>
                <input
                  type="text"
                  className="form-control form-control-sm mb-2 small-select"
                  placeholder="Vehicle No"
                  value={currentid ?? ""}
                  readOnly
                />

                <CFormLabel className="col-form-label">
                  Set status
                </CFormLabel>
                <Select options={statuslist} isMulti={false} placeholder="Set the Status"
                  size="sm"
                  className='mb-2 small-select'
                  classNamePrefix="custom-select"
                  value={statusTobe}
                  onChange={(selectedOption) => setstatusTobe(selectedOption)}
                />

                <CFormLabel className="col-form-label">
                  Remarks
                </CFormLabel>
                <textarea
                  type="text"
                  className="form-control form-control-sm mb-2 small-select"
                  placeholder="Vehicle No"

                />

                <CFormLabel className="col-form-label">
                  Action taken
                </CFormLabel>
                <textarea
                  type="text"
                  className="form-control form-control-sm mb-2 small-select"
                  placeholder="Vehicle No"

                />


              </CCol>
            </CRow>
          </CModalBody>


        </CModal>}

    </>
  )
}


export default Vehicleservice