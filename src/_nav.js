import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilLibrary,
  cilGarage,
  cilRecycle,
  cilLoopCircular,
  cilTruck,
  cilGrid,
  cilTrash,
  cilCog,
  cilLayers,
  cilCart,
  cilRoom,
  cilHouse,
  cibBuffer,
  cibMega,
  cibC,
  cilCarAlt,
  cilTablet,
  cilFolderOpen,
  cibTodoist
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilGrid} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Vehicles operation',
  },
  {
    component: CNavGroup,
    name: 'Vehicle',
    to: '#',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Vehicle Inventory',
        to: '/vehicle_inventory',
      },
      {
        component: CNavItem,
        name: 'Trailer Inventory',
        to: '/trailerinventory',
      }, 
      {
        component: CNavItem,
        name: 'Spares Inventory',
        to: '/spareinventory',
      },  
      {
        component: CNavItem,
        name: 'Vehicle Trailer Assign',
        to: '/trailerassign',
      }, 
      {
        component: CNavItem,
        name: 'Vehicle Spare Assign',
        to: '/spareasign',
      },
      {
        component: CNavItem,
        name: 'Tyreassign',
        to: '/tyreassign',
      },
     
    ]
  },

  {
    component: CNavGroup,
    name: 'Service',
    to: '#',
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
    items: [
          {
            component: CNavItem,
            name: 'jobcard',
            to: '/jobcard',
          },
          {
            component: CNavItem,
            name: 'Vehicle Service',
            to: '/vehicleservice',
          },
          {
            component: CNavItem,
            name: 'Vehicle Condemnation',
            to: '/vehiclecondemn',
          },
          {
            component: CNavItem,
            name: 'Spare Service',
            to: '/spareservice',
          },
          {
            component: CNavItem,
            name: 'Spare Condemnation',
            to: '/sparecondemn',
          },
          {
            component: CNavItem,
            name: 'Trailer Service',
            to: '/trailerservice',
          },
          {
            component: CNavItem,
            name: 'Trailer Condemnation',
            to: '/trailercondemn',
          },
    ]
  },

  {
    component: CNavTitle,
    name: 'Tools',
  },
  {
    component: CNavGroup,
    name: 'Tools',
    to: '#',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    items: [
            {
              component: CNavItem,
              name: 'Tools Inventory',
              to: '/toolinventory',
            },
            {
              component: CNavItem,
              name: 'Tool Box',
              to: '/processin',
            }
          ]
    },

    {
      component: CNavTitle,
      name: 'Transactions',
    },
    {
      component: CNavGroup,
      name: 'Transactions',
      to: '#',
      icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
      items: [
          {
            component: CNavItem,
            name: 'Inward',
            to: '/inward',
          },
          {
            component: CNavItem,
            name: 'Dispatch',
            to: '/processin',
          },
         ]
    },
  


  {
    component: CNavTitle,
    name: 'Master',
  },

    {
    component: CNavItem,
    name: 'General Master',
    to: '/generalmaster',
    icon: <CIcon icon={cibTodoist} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Tool Rooms',
    to: '/toolrooms',
    icon: <CIcon icon={cilTablet} customClassName="nav-icon" />,
  },
  
  {
    component: CNavItem,
    name: 'Spare Rooms',
    to: '/sparerooms',
    icon: <CIcon icon={cilHouse} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Workshops',
    to: '/workshop',
    icon: <CIcon icon={cilGarage} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Brand',
  //   to: '/processing',
  //   icon: <CIcon icon={cibBuffer} customClassName="nav-icon" />,
  // },

  // {
  //   component: CNavItem,
  //   name: 'Model',
  //   to: '/processing',
  //   icon: <CIcon icon={cibMega} customClassName="nav-icon" />,
  // },




]

export default _nav
