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
  CTableHeaderCell,
  CTableRow,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useTable, usePagination, useSortBy } from 'react-table';
import { useMemo } from 'react';
import { useContext } from 'react';
import CreatableSelect from 'react-select/creatable';
import { Sharedcontext } from '../components/Context';




const Inward = () => {
  const [pageCount, setPageCount] = useState(0);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  //isNumberkey fn shared from context component
  const { isNumberKey } = useContext(Sharedcontext)

  console.log(isNumberKey)


  const handleClose = () => {
    setShow(false)
    setinward(null)
    setcompany(null)
    setaddress("")

  }

  const handleShow = () => setShow(true);

  const columns = useMemo(
    () => [

      { Header: 'Type', accessor: 'id', disableSortBy: true, },
      { Header: 'Brand', accessor: 'vehicle_number' },
      { Header: 'Model', accessor: 'type' },
      { Header: ' Serial No', accessor: 'brand' },
      { Header: 'Quantity', accessor: 'model' },
      { Header: 'Actions', accessor: 'actionid' },
    ],
    []
  );



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


  const inward_type = [{ label: "jobcard", value: "jobcard" },
  { label: "new", value: "new" }]
  const [inward, setinward] = useState(null)

  const handleinward = (selectedOption) => {
    setinward(selectedOption)
  }

  const initialoptions = [
    { label: 'OpenAI', value: 'OpenAI', address: "India" },
    { label: 'Google', value: "Google", address: "Norway" },
    { label: 'Microsoft', value: "Microsoft", address: "France" }]

  const [company, setcompany] = useState(null)
  const [allcompanies, setallcompanies] = useState(initialoptions)
  const [address, setaddress] = useState('')

  const handlecompany = (selectedoption) => {
    //if address to be slected from the address
    setcompany(selectedoption)
    setaddress(selectedoption?.address)
  }

  const handleCreate = (inputvalue) => {
    //if address to be typed
    const address = window.prompt(`Enter address for "${inputvalue}"`) || '';
    const newOption = { label: inputvalue, value: inputvalue, address }
    setallcompanies(prev => ([...prev, newOption]))
    setcompany(newOption)
    setaddress(newOption.address)
  }

  console.log(allcompanies)

  //table data

  //rows that is mapped
  const [rows, setRows] = useState([]);

  const [formdata, setformdata] = useState({
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    type: "", brand: "", model: "", serial_no: "", Qty: "", toggled: false
  }
  )

  const addrow = () => {
    if (formdata.type && formdata.brand && formdata.model && formdata.serial_no
      && formdata.Qty) {
      setRows((pre) => ([...pre, formdata]))
      setformdata({
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        type: '',
        brand: '',
        model: '',
        serial_no: '',
        Qty: '',
        toggled: false
      })
    }
    else {
      alert("Please fill in all fields before adding.");
    }
  }

  const deleterow = (id) => {
    setRows((prev) => (prev.filter((item) => (item.id !== id))))
  }

  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
    border: "1px solid #312e2eff"
  };

  const headerStyle = {
    backgroundColor: "#f0f0f0",
    color: "#333",
    padding: "8px",
    border: "1px solid #ccc"
  };

  const cellStyle = {
    padding: "8px",
    border: "1px solid #ccc"
  };

  const btn = {
    border: "none",
    display: "block",
    margin: "0 auto",

  }
  const selectStyle = {
    width: '100%',
    padding: '4px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    outline: "none"
  };

  const inputStyle = {
    width: '100%',
    border: '1px solid #ccc',
    padding: '4px',
    borderRadius: "4px",
    outline: "none"
  }

  const [refrence_id, setrefrence] = useState("")
  const [deliveryno, setdeliveryno] = useState("")

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className='bg-secondary text-light'>
          Inward
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


          <CTable striped bordered hover size="sm" variant="dark" {...getTableProps()} style={{ fontSize: '0.75rem' }}>
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
              {page.map((row) => {
                prepareRow(row);

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
      <style>
        {`
        .custom-modal .modal-body {
          overflow-x: hidden;
        }
      `}
      </style>
      <CModal
        alignment="center"
        className='my-modal custom-modal'
        scrollable
        visible={show}
        size="xl"
        onClose={() => handleClose()}
        aria-labelledby="NewProcessing"
      >
        <CModalHeader className='bg-secondary'>
          <CModalTitle id="NewProcessing">Inward</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CRow>
            <CCol md={12}>

              <CFormLabel className="col-form-label">
                Inward Type
              </CFormLabel>
              <Select options={inward_type}
                isMulti={false}
                placeholder="Select Inward type"
                size="sm"
                className='mb-2 small-select'
                classNamePrefix="custom-select"
                value={inward}
                onChange={handleinward}
              />

              {inward?.label === "jobcard" ? (<>

                <CFormLabel className="col-form-label">
                  Jobcard?DC no
                </CFormLabel>
                <input
                  type="text"
                  value={deliveryno}
                  className="form-control form-control-sm mb-2 small-select"
                  onChange={(e) => setdeliveryno(e.target.value)}
                  placeholder="Jobcard No/DC No"

                />


              </>) : (<>
                <CFormLabel className="col-form-label">
                  Company Name
                </CFormLabel>

                <CreatableSelect
                   //options here it is a state variable
                  options={allcompanies}
                  isMulti={false}
                  placeholder="Select Company Name"
                  size="sm"
                  className='mb-2 small-select'
                  classNamePrefix="custom-select"
                  value={company}
                  onChange={handlecompany}
                  onCreateOption={handleCreate}
                />

                <CFormLabel className="col-form-label">
                  Address
                </CFormLabel>
                <textarea
                  type="text"
                  value={address}
                  className="form-control form-control-sm mb-2 small-select"
                  onChange={handleCreate}
                  placeholder="Address "
                  row={6}

                />


                <CFormLabel className="col-form-label">
                  Refrence Id:
                </CFormLabel>
                <input
                  type="text"
                  className="form-control form-control-sm mb-4 small-select"
                  placeholder="Refrence Id"
                  value={refrence_id}
                  onChange={(e) => setrefrence(e.target.value)}
                  name="columns_rack"
                // onKeyDown={(e) => isNumberKey(e)}

                />
            
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      {/* <th style={headerStyle}>id</th> */}
                      <th style={headerStyle}>Type</th>
                      <th style={headerStyle}>Brand</th>
                      <th style={headerStyle}>Model</th>
                      <th style={headerStyle}>Serial No.</th>
                      <th style={headerStyle}>Qty</th>
                      <th style={headerStyle}>Action</th>
                    </tr>
                  </thead>
                     {/* <div style={{ maxHeight: '150px', overflowY: 'auto' }}> */}
                  <tbody>
                    <tr><td colspan="...">&nbsp;</td></tr>
                    {rows.map(item => (
                      <tr key={item.id}>
                        {/* <td style={cellStyle}>{item.id}</td> */}
                        <td style={cellStyle}>{item.type}</td>
                        <td style={cellStyle}>{item.brand}</td>
                        <td style={cellStyle}>{item.model}</td>
                        <td style={cellStyle}>{item.serial_no}</td>
                        <td style={cellStyle}>{item.Qty}</td>
                        <td style={cellStyle}><button onClick={() => deleterow(item.id)} style={btn}>-</button></td>
                      </tr>
                    ))}</tbody>
                   {/* </div> */}
                  <tfoot>
                    <tr>
                      {/* <td style={cellStyle}>id</td> */}
                      <td style={cellStyle}>
                        <select name="" id="" style={selectStyle}
                          value={formdata.type} onChange={(e) => setformdata({ ...formdata, type: e.target.value })}
                        >
                          <option value="" disabled>Select</option>
                          <option value="a">a</option>
                          <option value="b">b</option>
                          <option value="c">c</option>
                        </select></td>
                      <td style={cellStyle} >
                        <select name="" id="" style={selectStyle}
                          value={formdata.brand} onChange={(e) => setformdata({ ...formdata, brand: e.target.value })}>
                          <option value="" disabled>Select</option>
                          <option value="a">a</option>
                          <option value="b">b</option>
                          <option value="c">c</option>
                        </select>
                      </td>
                      <td style={cellStyle}>
                        <select name="" id="" style={selectStyle}
                          value={formdata.model} onChange={(e) => setformdata({ ...formdata, model: e.target.value })}>
                          <option value="" disabled>Select</option>
                          <option value="a">a</option>
                          <option value="b">b</option>
                          <option value="c">c</option>
                        </select></td>
                      <td style={cellStyle}>
                        <input
                          type="text"
                            placeholder="...enter serial no"
                          style={inputStyle}
                          value={formdata.serial_no}
                          onChange={(e) => setformdata({ ...formdata, serial_no: e.target.value })} />
                      </td>
                      <td style={cellStyle}>
                        <input type="text" name="" id="" style={inputStyle}
                           placeholder="...enter quantity"
                          value={formdata.Qty}
                          onChange={(e) => setformdata({ ...formdata, Qty: e.target.value })}
                          onKeyDown={(e) => isNumberKey(e)}
                        />
                      </td>
                      <td style={cellStyle}><button style={btn} onClick={addrow}>+</button></td>
                    </tr>
                  </tfoot>
                </table> 
                </>)
              }
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary">Receive</CButton>
        </CModalFooter>
      </CModal >

    </>
  )
}


export default Inward