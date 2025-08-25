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
import { useTable, usePagination, useSortBy } from 'react-table';
import { useMemo } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
const Toolsbox= () => 
    
    
{
    const [pageCount, setPageCount] = useState(0);
    
     const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
      const columns = useMemo(
          () => [
            { Header: 'SL', accessor: 'id', disableSortBy: true, },
            { Header: 'Toolbox id', accessor: 'vehicle_number' },
            { Header: 'Toolsbox Name', accessor: 'type' },
           
            {
              Header: () => <div  style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem' }}><FaTrash/>  
              <FaEdit/></div>,
              accessor: 'net_wt1',
              disableSortBy: true,
            },
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
     
    
return(
    <>
    <CCard className="mb-4">
            <CCardHeader className='bg-secondary text-light'>
             Tool Inventory
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
                              <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
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
                                     <td {...cell.getCellProps()} style={{ textAlign: 'center', verticalAlign: 'middle' }}>{cell.render('Cell')}</td>
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
    </>
)
}

export default Toolsbox