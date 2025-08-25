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
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useTable, usePagination, useSortBy } from 'react-table';
import { useMemo } from 'react';
import { FaTrash, FaEdit, FaBars } from 'react-icons/fa';
import { useContext } from 'react';
import { Sharedcontext } from '../../components/Context';


const Vehiclecondemn = () => {
    const [pageCount, setPageCount] = useState(0);
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);

    //object for storing room details
    const room_items = {
        room_id: "",
        room_name: "",
        no_of_racks: "",
        columns_rack: "",
        location: ""
    }
    const [spareitems, setspareitems] = useState(room_items)

    //isNumberkey fn shared from context component
    const { isNumberKey } = useContext(Sharedcontext)

    console.log(isNumberKey)
    const handleClose = () => {
        setShow(false)
        setspareitems(room_items);
    }

    const handleShow = () => setShow(true);

    const [selectedtype, setSelectedtype] = useState(null);


    const columns = useMemo(
        () => [

            { Header: 'Vehicle No', accessor: 'id', disableSortBy: true, },
            { Header: 'Type of Fault', accessor: 'vehicle_number' },
            { Header: 'ServiceEngineer', accessor: 'type' },
           
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

    // const edittoolroom = (id) => {
    //     console.log(id);

    // }



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
    const selectoptions = [{ value: 'vehicle', label: 'Vehicle' }, { value: 'trailer', label: 'Trailer' },]

    //dynamically updating the state
    const handlespareitem = (e) => {
        const { name, value } = e.target
        setspareitems((pre) => ({
            ...pre, [name]: value
        }));
    }

    //useEffect to understand values of room_items
    useEffect(() => { console.log(spareitems) }, [spareitems])

   const engineeroptions = [{ value: 'engineer1', label: "engineer1" },
     { value: 'engineer2', label: "engineer2" }]
    return (
        <>
            <CCard className="mb-4">
                <CCardHeader className='bg-secondary text-light'>
                    Vehicle Condemnation
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
                    <CModalTitle id="NewProcessing">Spare rooms</CModalTitle>
                </CModalHeader>

                <CModalBody>
                    <CRow>
                        <CCol md={12}>

                            <CFormLabel className="col-form-label">
                                Vehicle No
                            </CFormLabel>
                            <input
                                type="text"
                                className="form-control form-control-sm mb-2 small-select"
                                placeholder="enter vehicle no"
                                value={spareitems.room_id}
                                onChange={handlespareitem}
                                name="room_id"
                            />

                            <CFormLabel className="col-form-label">
                                Service Engineer
                            </CFormLabel>
                             <Select options={engineeroptions} isMulti={false} placeholder="Select service engineers"
                                        size="sm"
                                        className='mb-2 small-select'
                                        classNamePrefix="custom-select"/>
                                        {/* // value={services}
                                        // onChange={(selectedOption) => {
                                        //     setservic(selectedOption)
                                        // }}
                                    /> */}

                            {/* <CFormLabel className="col-form-label">
                                RoomName
                            </CFormLabel>
                            <input
                                type="text"
                                className="form-control form-control-sm mb-2 small-select"
                                placeholder="RoomName"
                                value={spareitems.room_name}
                                onChange={handlespareitem}
                                name="room_name"
                            />


                            <CFormLabel className="col-form-label">
                                No of Racks
                            </CFormLabel>
                            <input
                                type="text"
                                className="form-control form-control-sm mb-2 small-select no-spinner"
                                placeholder="No of racks"
                                value={spareitems.no_of_racks}
                                onChange={handlespareitem}
                                name="no_of_racks"
                                onKeyDown={(e) => isNumberKey(e)}

                            />


                            <CFormLabel className="col-form-label">
                                Columns per Rack
                            </CFormLabel>
                            <input
                                type="text"
                                className="form-control form-control-sm mb-2 small-select"
                                placeholder="Coumns per rack"
                                value={spareitems.columns_rack}
                                onChange={handlespareitem}
                                name="columns_rack"
                                onKeyDown={(e) => isNumberKey(e)}

                            />


                            <CFormLabel className="col-form-label">
                                Location
                            </CFormLabel>
                            <input
                                type="text"
                                className="form-control form-control-sm mb-2 small-select"
                                placeholder="Location"
                                value={spareitems.location}
                                onChange={handlespareitem}
                                name="location"
                            /> */}

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


export default Vehiclecondemn