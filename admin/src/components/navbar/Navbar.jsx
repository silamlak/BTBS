import React from 'react'
import Switcher from '../Switcher'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { MdLogout } from "react-icons/md";
const Navbar = () => {
  const dispatch = useDispatch()
  return (
    <div className="sticky top-0 z-50 border-b-2 border-blue-500 dark:border-orange-500">
      <div className="flex justify-end w-full p-2 py-4 bg-slate-50 dark:bg-slate-950">
        <div className='flex items-center gap-2'>
          <Switcher />
          <button
            className="px-2 text-slate-800 dark:text-slate-100"
            onClick={dispatch(logout())}
          >
            <MdLogout />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar
