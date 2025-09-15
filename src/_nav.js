// SidebarNavLoader.js
import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilGarage,
  cilTruck,
  cilGrid,
  cilCog,
  cilLayers,
  cilPeople,
  cilTablet,
  cilFolderOpen,
  cilHouse,
  cibTodoist,
} from '@coreui/icons'
import { AppSidebarNav } from './AppSidebarNav'

// Map icon names (from Laravel JSON) to CoreUI icons
const iconMap = {
  cilGarage,
  cilTruck,
  cilGrid,
  cilCog,
  cilLayers,
  cilPeople,
  cilTablet,
  cilFolderOpen,
  cilHouse,
  cibTodoist,
}

const SidebarNavLoader = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    fetch('https://ams.thepremierprecision.com/api/auth/menu') // 👈 API route
      .then((res) => res.json())
      .then((data) => {
        const processed = data.map(processItem)
        setItems(processed)
      })
      .catch((err) => console.error('Menu load failed:', err))
  }, [])

  // Replace string with real <CIcon />
  function processItem(item) {
    if (item.icon && iconMap[item.icon]) {
      item.icon = <CIcon icon={iconMap[item.icon]} customClassName="nav-icon" />
    }
    if (item.items) {
      item.items = item.items.map(processItem)
    }
    return item
  }

  return <AppSidebarNav items={items} />
}

export default SidebarNavLoader
