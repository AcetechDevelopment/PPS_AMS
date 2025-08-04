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

    //object for storing room details
    const room_items = {
        room_id: "",
        room_name: "",
        no_of_racks: "",
        columns_rack: "",
        location: ""
    }
    const [toolitems, settoolitems] = useState(room_items)

    const { isNumberKey } = useContext(Sharedcontext)


    const handleClose = () => {
        setShow(false)
        settoolitems(room_items);

    }
    const handleShow = () => setShow(true);
    const [selectedtype, setSelectedtype] = useState(null);
    const columns = useMemo(
        () => [

            { Header: 'ToolRooms', accessor: 'id', disableSortBy: true, },
            { Header: 'RoomId', accessor: 'vehicle_number' },
            { Header: 'RoomName', accessor: 'type' },
            { Header: ' No of Racks', accessor: 'brand' },
            { Header: 'Column per Rack', accessor: 'model' },
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
    const [selectjobcard,setjobcard] = [{ value: 'internal', label: 'internal' }, { value: 'external', label: 'external' },]

    //dynamically updating the state
    const handletoolitem = (e) => {
        const { name, value } = e.target
        settoolitems((pre) => ({ ...pre, [name]: value }))
    }

    //useEffect to understand values of room_items
    useEffect(() => { console.log(toolitems) }, [toolitems])
     const categoryoption=["internal","external"]
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
                    <CModalTitle id="NewProcessing">Tool Rooms</CModalTitle>
                </CModalHeader>
                <CModalBody>

                    <CRow>

                        <CCol md={12}>

                            <CFormLabel className="col-form-label">
                                Job Card type
                            </CFormLabel>
                            <Select options={selectjobcard} isMulti={false} placeholder="Select jobcard type" size="sm"
                             className='mb-2 small-select'
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
                                RoomName
                            </CFormLabel>
                            <input
                                type="text"
                                className="form-control form-control-sm mb-2 small-select"
                                placeholder="Roomname"
                                value={toolitems.room_name}
                                onChange={handletoolitem}
                                name="room_name"
                            />


                            <CFormLabel className="col-form-label">
                                No of Racks
                            </CFormLabel>
                            <input
                                type="text"
                                className="form-control form-control-sm mb-2 small-select"
                                placeholder="No.of.racks"
                                value={toolitems.no_of_racks}
                                onChange={handletoolitem}
                                name="no_of_racks"
                                onKeyDown={(e) => isNumberKey(e)}
                            />


                            <CFormLabel className="col-form-label">
                                Columns per Rack
                            </CFormLabel>
                            <input
                                type="text"
                                className="form-control form-control-sm mb-2 small-select"
                                placeholder="Columns per rack"
                                value={toolitems.columns_rack}
                                onChange={handletoolitem}
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
                                value={toolitems.location}
                                onChange={handletoolitem}
                                name="location"
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