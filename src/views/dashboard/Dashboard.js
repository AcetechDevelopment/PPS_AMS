import React, {useMemo,useState} from 'react'
import classNames from 'classnames'
import { useTable, usePagination, useSortBy } from 'react-table';
import { FaBars } from 'react-icons/fa';

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
   CTableCaption,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import { useEffect } from 'react';

const Dashboard = () => {
   const [data, setData] = useState([]);
   const [pageCount, setPageCount] = useState(0);
    const[totalNumbers,settotalNumbers]=useState({})
    const[selectedValue,setselectedValue]=useState("")
    const[selectedMonth,setselectedMonth]=useState("")
    const BASE = import.meta.env.VITE_BASE_URL;
    const authToken = JSON.parse(sessionStorage.getItem('authToken')) || '';
   
    const getTotalNumbers=async()=>{
     try {
      console.log("try")
      const response = await fetch(`${BASE}options/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if(response.ok){
      const data=await response.json()
      console.log("response")
      console.log(data)
      settotalNumbers(data)
      }
      
   }
  catch(err)
  {
    console.log(err.message)
  }
}
useEffect(()=>{{
  console.log("effect run")
  getTotalNumbers()
}},[])
  
  
  const progressExample = [
    { title: 'Insurance', value: '29', percent: 0, color: 'success' },
    { title: 'FC', value: '24', percent: 0, color: 'info' },
    { title: 'PUC', value: '78', percent: 0, color: 'warning' },
    { title: 'Green', value: '22', percent: 0, color: 'danger' },
    { title: 'Driver', value: '12', percent:0, color: 'primary' },
    { title: 'Fuel', value: '4', percent: 0, color: 'primary' },
  ]
//  const progress_calculated=progressExample.map((prev)=>({...prev,percent:prev.value/50*100}))
  const progressExample1 = [
      { title: 'Tools', value: '29',  color: 'success' },
      { title: 'Spare', value: '24',color: 'info' },
      { title: 'Tyre', value: '78',  color: 'warning' },
      { title: 'Oil', value: '22',color: 'danger' },
  ]


  
  const materialColumns = useMemo(
  () => [
    { Header: 'Material Name', accessor: 'vehicle_number' },
    { Header: 'HSN', accessor: 'type' },
    { Header: 'Available', accessor: 'engine_number' },
  ],
  []
);


  const {
  getTableProps: getMaterialTableProps,
  getTableBodyProps: getMaterialBodyProps,
  headerGroups: materialHeaderGroups,
  prepareRow: prepareMaterialRow,
  page: materialPage,
  canPreviousPage: canMaterialPreviousPage,
  canNextPage: canMaterialNextPage,
  pageOptions: materialPageOptions,
  pageCount: materialPageCount,
  gotoPage: gotoMaterialPage,
  nextPage: nextMaterialPage,
  previousPage: previousMaterialPage,
  setPageSize: setMaterialPageSize,
  state: { pageIndex: materialPageIndex, pageSize: materialPageSize, sortBy: materialSortBy },
} = useTable(
  {
    columns: materialColumns,
    data,
    initialState: { pageIndex: 0 },
    manualPagination: true,
    pageCount,
    manualSortBy: true,
    autoResetPage: false,
    autoResetSortBy: false,
    // fetchData,
  },
  useSortBy,
  usePagination
);

 const initial_vehDetails={
    vehicle_number:"",
    category:"",
    expiry_date:""

  }
  const[vehicleDetails,setvehicleDetails]=useState(initial_vehDetails)

   const columns = useMemo(
      () => [
        { Header: 'SL', accessor: 'id', disableSortBy: true, },
        { Header: 'Vehicle Number', accessor: 'vehicle_number' },
        { Header: 'Category', accessor: 'category' },
        { Header: 'Expiry Date', accessor: 'expiry_date' },
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
          // fetchData,
        },
        useSortBy,
        usePagination
      );

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'India', flag: cifIn },
      usage: {
        value: 74,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cibCcStripe },
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'France', flag: cifFr },
      usage: {
        value: 98,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cibCcPaypal },
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Spain', flag: cifEs },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Poland', flag: cifPl },
      usage: {
        value: 43,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cibCcAmex },
      activity: 'Last week',
    },
  ]
 const handleclick=(value)=>{
  setselectedValue(value)
  fetchdata(value)
 } 
const handlemonth=(value)=>{
 setselectedMonth(value)
 }
  const fetchdata=(value)=>{
     console.log(value)
    
  }
  return (
    <>

  {totalNumbers&&<WidgetsDropdown className="mb-4" item={totalNumbers}  />}

 <CRow>
 <CCol sm={4}>
   <CCard className="mb-4">
        <CCardBody>
          <CRow className="mb-4">
            <CCol sm={7}>
              <h4 id="traffic" className="card-title mb-0">
                Shortage
              </h4>
            </CCol>
             <CCol sm={5} className="d-none d-md-block">
              
              <CButtonGroup className="float-end me-3">
                {['Today', 'Month'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={selectedMonth===value}
                    onClick={()=>handlemonth(value)}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
                <CTable striped bordered hover size="sm" variant="dark" {...getMaterialTableProps()} style={{ fontSize: '0.75rem' }}>
                  <CTableHead color="secondary">
                    {materialHeaderGroups.map((headerGroup) => (
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
                  <tbody {...getMaterialBodyProps()}>
                    {materialPage.map((row) => {
                      prepareMaterialRow(row);
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




        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 4 }}
            className="mb-2 text-center"
          >
            {progressExample1.map((item, index, items) => (
              <CCol
                className={classNames({
                  'd-none d-xl-block': index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value}
                </div>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
 </CCol>

  <CCol sm={8}>
    <CCard className="mb-4">
        <CCardBody>
          <CRow className="mb-4">
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Notifications
              </h4>
            </CCol>

            <CCol sm={7} className="d-none d-md-block">
              
              <CButtonGroup className="float-end me-3">
                {['FC', 'Insurance', 'PUC', 'Driver', 'Green', 'Fuel'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={selectedValue === value}
                    onClick={()=>handleclick(value)}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
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



        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 6 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={classNames({
                  'd-none d-xl-block': index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value} ({item.percent}%)
                </div>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>

  </CCol>

 </CRow>
      


    </>
  )
}

export default Dashboard
