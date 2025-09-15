import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'

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

// Map string names from backend to icons
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

// Map string names to CoreUI components
const componentMap = {
  CNavItem,
  CNavGroup,
  CNavTitle,
}
export default function SidebarNavLoader() {
  const authToken = JSON.parse(sessionStorage.getItem('authToken')) || ''
  const apiUrl = import.meta.env.VITE_API_URL;
  const [items, setItems] = useState([])

  useEffect(() => {
    fetch(`${apiUrl}menu/menu`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const processed = data.map(processItem)
        setItems(processed)
      })
      .catch((err) => console.error('Failed to load menu:', err))
  }, [])

  // Recursive function to process icon and component
  function processItem(item) {
    const newItem = { ...item }

    // Map icon string to <CIcon />
    if (newItem.icon && iconMap[newItem.icon]) {
      newItem.icon = <CIcon icon={iconMap[newItem.icon]} customClassName="nav-icon" />
    }

    // Map component string to React component
    if (newItem.component && componentMap[newItem.component]) {
      newItem.component = componentMap[newItem.component]
    }

    // Recursively process child items
    if (newItem.items && newItem.items.length > 0) {
      newItem.items = newItem.items.map((child) => processItem(child))
    }

    return newItem
  }

  return <AppSidebarNav items={items} />
}
