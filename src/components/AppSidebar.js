import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import * as icons from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
const BASE = import.meta.env.VITE_BASE_URL;

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [navigation, setNavigation] = useState([])

  useEffect(() => {
   const authToken = JSON.parse(sessionStorage.getItem('authToken')) || '';
    fetch(`${BASE}menu/menus`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        }
      })
      .then((res) => res.json())
      .then((data) => {
        const parsed = data.map((item) => transformItem(item))
        setNavigation(parsed)
      })
      .catch((err) => console.error(err))
  }, [])

  const transformItem = (item) => {
    if (item.icon) {
      item.icon = <CIcon icon={icons[item.icon.icon]} customClassName={item.icon.customClassName} />
    }

    if (item.items) {
      item.items = item.items.map((sub) => transformItem(sub))
    }

    if (item.component === 'CNavItem') item.component = CNavItem
    if (item.component === 'CNavGroup') item.component = CNavGroup
    if (item.component === 'CNavTitle') item.component = CNavTitle

    return item
  }

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <h1>AMS APP</h1>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      <AppSidebarNav items={navigation} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
