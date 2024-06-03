import React from 'react'
import Sidebar from 'components/Sidebar'
import { Outlet } from 'react-router-dom'
import { ContextProvider } from 'context'

import './index.less'

const Layout: React.FC = () => {
  return (
    <ContextProvider>
      <div className="ym-layout">
        <Sidebar />
        <div className="ym-main">
          <Outlet />
        </div>
      </div>
    </ContextProvider>
  )
}

export default Layout
