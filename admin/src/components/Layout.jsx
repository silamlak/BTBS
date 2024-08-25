import React from 'react'
import Navbar from './navbar/Navbar'
import Sidebar from './sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
      <div>
        <Sidebar />
        <div>
            <Navbar />
            <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
