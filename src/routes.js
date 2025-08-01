import { element } from 'prop-types'
import React from 'react'

const processing = React.lazy(() => import('./views/processing'))
const negativewaste = React.lazy(() => import('./views/negativewaste'))
const inward = React.lazy(() => import('./views/Inward'))
const process_list = React.lazy(() => import('./views/processinglist'))
const negativelist = React.lazy(() => import('./views/Negativelist'))
const dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))



const VehicleInventory = React.lazy(() => import('./views/Vehicles/VehicleInventory'))
const Generalmaster = React.lazy(() => import('./views/master/general_master'))
const TrilerInventory = React.lazy(() => import('./views/Vehicles/TrailerInventory'))
const SpareInventory = React.lazy(() => import('./views/Vehicles/SpareInventory'))



const routes = [
  { path: '/dashboard', exact: true, name: 'Home', element: dashboard},
  { path: '/processing', name: 'Processing', element: processing },
  { path: '/trailerinventory', name: 'TrilerInventory', element: TrilerInventory },
  { path: '/spareinventory', name: 'SpareInventory', element: SpareInventory },
  { path: '/processlist', name: 'Processing', element: process_list },
  { path: '/neglist', name: 'negativewaste', element: negativelist },

  { path: '/vehicle_inventory', name: 'Vehicle Inventory', element: VehicleInventory },
  { path: '/generalmaster', name: 'General', element: Generalmaster },

  

]

export default routes
