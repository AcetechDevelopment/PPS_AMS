import { element } from 'prop-types'
import React from 'react'

const processing = React.lazy(() => import('./views/processing'))
const negativewaste = React.lazy(() => import('./views/negativewaste'))
const inward = React.lazy(() => import('./views/Inward'))
const process_list = React.lazy(() => import('./views/processinglist'))
const negativelist = React.lazy(() => import('./views/Negativelist'))
const dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))


// master

const Usermaster=React.lazy(() => import('./views/master/Usermaster'))
const Profile=React.lazy(()=>import("./views/master/Profile"))


const Generalmaster = React.lazy(() => import('./views/master/general_master'))
const Toolmaster = React.lazy(() => import('./views/master/Toolrooms'))
const toolinventory = React.lazy(() => import('./views/master/ToolsInventory'))
const Sparerooms = React.lazy(() => import('./views/master/Sparerooms'))
const workshop = React.lazy(() => import('./views/master/Workshop'))
const toolsbox=React.lazy(()=>import('./views/master/Toolsbox'))


// inventory
const VehicleInventory = React.lazy(() => import('./views/Vehicles/VehicleInventory'))
const TrilerInventory = React.lazy(() => import('./views/Vehicles/TrailerInventory'))
const SpareInventory = React.lazy(() => import('./views/Vehicles/SpareInventory'))
const TrailerAssign = React.lazy(() => import('./views/Vehicles/Trailerassign'))
const Spareassign = React.lazy(() => import('./views/Vehicles/Spareassign'))
const Tyreassign = React.lazy(() => import('./views/Vehicles/Tyreassign'))


//services
const Jobcard = React.lazy(() => import('./views/services/Jobcard'))
const VehicleService = React.lazy(() => import('./views/services/Vehicleservice'))
const VehicleCondemn = React.lazy(() => import('./views/services/Vehiclecondemn'))
const Spareservice = React.lazy(() => import('./views/services/Spareservice'))
const Sparecondemn = React.lazy(() => import('./views/services/Sparecondemn'))
const Trailerservice = React.lazy(() => import('./views/services/Trailerservice'))
const Trailercondemn = React.lazy(() => import('./views/services/Trailercondemn'))

const routes = [
   { path: '/dashboard', exact: true, name: 'Home', element: dashboard },
   { path: '/processing', name: 'Processing', element: processing },
   { path: '/trailerinventory', name: 'TrilerInventory', element: TrilerInventory },
   { path: '/spareinventory', name: 'SpareInventory', element: SpareInventory },
   { path: '/trailerassign', name: 'TrailerAssign', element: TrailerAssign },
   { path: '/spareasign', name: 'Spareassign', element: Spareassign },
   { path: '/tyreassign', name: 'Tyreassign', element: Tyreassign },

    {path:"/usermaster",name:"Usermaster",element:Usermaster},
    {path:"/profile",name:"Profile",element:Profile},


   { path: '/processlist', name: 'Processing', element: process_list },
   { path: '/neglist', name: 'negativewaste', element: negativelist },

   { path: '/vehicle_inventory', name: 'Vehicle Inventory', element: VehicleInventory },
   { path: '/generalmaster', name: 'General', element: Generalmaster },
   { path: '/toolrooms', name: 'General', element: Toolmaster },
   { path: '/toolinventory', name: 'General', element: toolinventory },
   { path: '/sparerooms', name: 'General', element: Sparerooms },
   { path: '/workshop', name: 'General', element: workshop },
   { path: '/toolsbox', name: 'General', element: toolsbox },

   { path: '/jobcard', name: 'jobcard', element: Jobcard },
   { path: '/vehicleservice', name: 'Vehicle Service', element: VehicleService },
   { path: '/vehiclecondemn', name: 'Vehicle Condemnation', element: VehicleCondemn },
   { path: '/spareservice', name: 'Spare Service', element: Spareservice },
   { path: '/sparecondemn', name: 'Spare Condemnation ', element: Sparecondemn },
   { path: '/trailerservice', name: 'Trailer Service', element: Trailerservice },
   { path: '/trailercondemn', name: 'Tailer Condemnation ', element: Trailercondemn },
   
   { path: '/inward', name: 'Inward', element: inward },
]

export default routes
