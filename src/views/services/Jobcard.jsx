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
import { useState } from 'react';
import Select from 'react-select';
import { useTable, usePagination, useSortBy } from 'react-table';
import { useMemo } from 'react';
import { FaTrash, FaEdit, FaBars } from 'react-icons/fa';
import { useContext, useEffect } from 'react';
import { Sharedcontext } from '../../components/Context';


const Jobcard = () => {
    const [pageCount, setPageCount] = useState(0);
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);



    const { isNumberKey } = useContext(Sharedcontext)


    const handleClose = () => {
        setShow(false)
        setjobcard(null)
        setvehicleno("")
        setservices(null)
        setspares(null)
        settools(null)
        setDescription("")
        setaddress("")
        setservice_engineer(null)
        setcategory(null)
        setitems(null)
        setservice_station(null)

    }
    const handleShow = () => setShow(true);

    const columns = useMemo(
        () => [

            { Header: 'JobcardId', accessor: 'id', disableSortBy: true, },
            { Header: 'Vehicle no', accessor: 'vehicle_number' },
            { Header: 'Type of Sevice', accessor: 'type' },
            { Header: 'Spares', accessor: 'brand' },
            { Header: 'Tools', accessor: 'model' },
            { Header: 'Location', accessor: 'wheels_count' },

            {
                Header: () => <FaBars />,
                id: 'actions',
                Cell: ({ row }) => {
                    const id = row.original.id;

                    return (
                        <div className="flex gap-5">

                            <FaEdit className="ms-2 pointer text-primary" onClick={() => edittoolroom(id)} />

                            <FaTrash className="ms-2 pointer text-danger" onClick={() => deletetoolroom(id)} />

                        </div>
                    );
                },
                disableSortBy: true,
            },
        ],
        []
    );

    const edittoolroom = (id) => {
        console.log(id);

    }

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

    //select jobcard
    const [jobcard, setjobcard] = useState(null)
    const[jobcardId,setjobId]=useState("")
    const initial_jobcard = [{ label: "internal", value: "internal" }, { label: "external", value: "external" }]


    //select vehiclenumber
    const [vehicleno, setvehicleno] = useState("")

    //select spares type
    const [spares, setspares] = useState(null)
    const initial_spares = [{ label: "battery", value: "battery" }, { label: "brake", value: "brake" }]

    //select tools
    const [tools, settools] = useState(null)
    const initial_tools = [{ label: "toolbox 1", value: "toolbox 1" }, { label: "toolbox 2", value: "toolbox 2" }]

    //select multiple service engineers
    const [service_engineer, setservice_engineer] = useState(null)
    const initial_engineers = [{ label: "engineer1", value: "engineer1" }, { label: "engineer2", value: "engineer2" }]

    const [service_station, setservice_station] = useState(null)
    const initial_stations = [{ label: "station1", value: "station1" }, { label: "station2", value: "station2" }]

    const [tyrespares, settyrespares] = useState("")
    const handlejobcard = (selectedoption) => {
        setjobcard(selectedoption)
    }


    //select service type

    const service_types = [{ label: "vehicle", value: "vehicle" }, { label: "trailer", value: "trailer" }, { label: "spare", value: "spare" }]
    const [services, setservices] = useState(null)

    //select tyres/spares
    const mainoptions = [{ label: "spare", value: "spare" }, { label: "tyre", value: "tyre" }]
    const [category, setcategory] = useState(null)
    const [items, setitems] = useState(null)

    const tyreoptions = [{ value: 'tubeless', label: "tubeless" }, { value: 'bias', label: "bias" }]

    const spareoptions = [{ value: 'brake', label: "brake" }, { value: 'battery', label: "battery" }]

    const [description, setDescription] = useState('')

    const [address, setaddress] = useState('')

    useEffect(() => { console.log(jobcard, vehicleno, spares, tools, service_engineer, tyrespares, category, description, address, items, services) },
        [tyrespares, jobcard, vehicleno, spares, tools, service_engineer, category, description, address, items, services])

    return (
        <>
            <CCard className="mb-4">
                <CCardHeader className='bg-secondary text-light'>
                    Tool Rooms
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

            <CModal
                alignment="center"
                scrollable
                visible={show}
                size="md"
                onClose={() => handleClose()}
                aria-labelledby="NewProcessing"
            >
                <CModalHeader className='bg-secondary'>
                    <CModalTitle id="NewProcessing">Jobcard</CModalTitle>
                </CModalHeader>
                <CModalBody>

                    <CRow>

                        <CCol md={12}>

                            <CFormLabel className="col-form-label">
                                Job Card type
                            </CFormLabel>
                            <Select options={initial_jobcard} isMulti={false} placeholder="Select jobcard type"
                                size="sm"
                                className='mb-2 small-select'
                                classNamePrefix="custom-select"
                                value={jobcard}
                                onChange={handlejobcard}
                            />

                            <CFormLabel className="col-form-label">
                                Jobcard Id
                            </CFormLabel>
                            <input
                                type="text"
                                className="form-control form-control-sm mb-2 small-select"
                                placeholder="Vehicle no"
                                value={jobcardId}
                                onChange={(e) => setjobId(e.target.value)}
                            />
                            <>
                                <CFormLabel className="col-form-label">
                                    Vehicle no
                                </CFormLabel>
                                <input
                                    type="text"
                                    className="form-control form-control-sm mb-2 small-select"
                                    placeholder="Vehicle no"
                                    value={vehicleno}
                                    onChange={(e) => setvehicleno(e.target.value)}
                                />

                                <CFormLabel className="col-form-label">
                                    Select Type of Service
                                </CFormLabel>
                                <Select options={service_types} isMulti={false} placeholder="Select service types"
                                    size="sm"
                                    className='mb-2 small-select'
                                    classNamePrefix="custom-select"
                                    value={services}
                                    onChange={(selectedOption) => {
                                        setservices(selectedOption)
                                    }}
                                />

                                <CFormLabel className="col-form-label">
                                    Select Spares
                                </CFormLabel>
                                <Select options={initial_spares} isMulti={false} placeholder="Select spares"
                                    size="sm"
                                    className='mb-2 small-select'
                                    classNamePrefix="custom-select"
                                    value={spares}
                                    onChange={(selectedOption) => {
                                        setspares(selectedOption)
                                    }}
                                />



                                <CFormLabel className="col-form-label">
                                    Select tools
                                </CFormLabel>
                                <Select options={initial_tools} isMulti={false} placeholder="Select tools"
                                    size="sm"
                                    className='mb-2 small-select'
                                    classNamePrefix="custom-select"
                                    value={tools}
                                    onChange={(selectedOption) => {
                                        settools(selectedOption)
                                    }}
                                />

                                {jobcard?.value === "internal" &&
                                    <>
                                        <CFormLabel className="col-form-label">
                                            Service Engineer
                                        </CFormLabel>
                                        <Select options={initial_engineers} isMulti={true} placeholder="Select Service engineers"
                                            size="sm"
                                            className='mb-2 small-select'
                                            classNamePrefix="custom-select"
                                            value={service_engineer}
                                            onChange={(selectedOption) => {
                                                setservice_engineer(selectedOption)
                                            }}
                                        />
                                    </>}


                                {jobcard?.value === "external" &&
                                    <>
                                        <CFormLabel className="col-form-label">
                                            Service Station
                                        </CFormLabel>
                                        <Select options={initial_stations} isMulti={true} placeholder="Select Service stations"
                                            size="sm"
                                            className='mb-2 small-select'
                                            classNamePrefix="custom-select"
                                            value={service_station}
                                            onChange={(selectedOption) => {
                                                setservice_station(selectedOption)
                                            }}
                                        />
                                    </>}

                                <CFormLabel className="col-form-label">
                                    Spare/ Tyre
                                </CFormLabel>
                                <Select options={mainoptions} isMulti={false} placeholder="Select Spare/Tyre"
                                    size="sm"
                                    className='mb-2 small-select'
                                    classNamePrefix="custom-select"
                                    value={category}
                                    onChange={(selectedOption) => {
                                        setcategory(selectedOption)
                                        setitems(null)
                                    }}
                                />
                            </>

                            {category?.value === "tyre" &&
                                <Select options={tyreoptions} isMulti={false} placeholder="Select tyre type"
                                    size="sm"
                                    className='mb-2 small-select'
                                    classNamePrefix="custom-select"
                                    value={items}
                                    onChange={(selectedOption) => {
                                        setitems(selectedOption)
                                    }}
                                />
                            }

                            {category?.value === "spare" &&
                                <Select options={spareoptions} isMulti={false} placeholder="Select spare type"
                                    size="sm"
                                    className='mb-2 small-select'
                                    classNamePrefix="custom-select"
                                    value={items}
                                    onChange={(selectedOption) => {
                                        setitems(selectedOption)
                                    }}
                                />


                            }
                            {jobcard?.value === "external" && <>
                                <CRow >
                                    <CCol md={6}>
                                        <CFormLabel className="col-form-label">
                                            Address:
                                        </CFormLabel>
                                        <textarea
                                            className="form-control"
                                            placeholder="Enter Address..."
                                            value={address}
                                            onChange={(e) => setaddress(e.target.value)}
                                            rows={4}
                                        />
                                    </CCol>
                                </CRow>
                            </>}



                            <label className="form-label">Description:</label>
                            <textarea
                                className="form-control"
                                placeholder="Enter details..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                            />


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

export default Jobcard