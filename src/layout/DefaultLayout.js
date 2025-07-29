import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className="wrapper d-flex flex-column min-vh-100 flex-grow-1">
        <AppHeader />
        
        <main className="body flex-grow-1 container-fluid">
          <AppContent />
        </main>

        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
