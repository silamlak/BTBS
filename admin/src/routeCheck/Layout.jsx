import React from 'react'
import Navbar from '../components/navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar';

const Layout = () => {
  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950">
      <div className="flex">
        <div className='sticky top-0 h-full'><Sidebar /></div>
        <div className="flex-1">
          <Navbar />
          <div className='p-3 max-w-[1600px] mx-auto'><Outlet /></div>
        </div>
      </div>
    </div>
  );
}

export default Layout
