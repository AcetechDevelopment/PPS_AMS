import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
       
      </div>
      <div className="ms-auto">
      <a href="https://acetechindia.in" target="_blank" rel="noopener noreferrer">
        ----
        </a>
        <span className="ms-1">&copy; 2025.</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
