import React, { useState } from 'react'
import Switcher from '../Switcher'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { MdClose, MdLogout, MdMenu, MdOutlineDashboard } from "react-icons/md";
import { AiOutlineUser } from 'react-icons/ai';
import { FiFolder, FiMessageSquare, FiShoppingCart } from 'react-icons/fi';
import { TbReportAnalytics } from 'react-icons/tb';
import { Link } from 'react-router-dom';
const Navbar = () => {
  const dispatch = useDispatch()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const user = useSelector((state) => state.auth.user);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
       const hrs = [
         { name: "dashboard", link: "/", icon: MdOutlineDashboard },
         { name: "Orders", link: "/orders", icon: AiOutlineUser },
         { name: "Create Product", link: "/product/create", icon: FiFolder },
         { name: "BusOperator", link: "/bus-operator", icon: FiShoppingCart },
         { name: "Drivers", link: "/drivers", icon: FiShoppingCart },
         { name: "Buses", link: "/buses", icon: FiShoppingCart },
         { name: "Tso", link: "/tso", icon: FiShoppingCart },
       ];
       const bos = [
         { name: "dashboard", link: "/", icon: MdOutlineDashboard },
         { name: "Orders", link: "/orders", icon: AiOutlineUser },
         { name: "Station", link: "/station", icon: AiOutlineUser },
         { name: "Route", link: "/route", icon: AiOutlineUser },
         { name: "Schedule", link: "/schedule", icon: AiOutlineUser },
       ];
       const tsos = [
         { name: "dashboard", link: "/", icon: MdOutlineDashboard },
         { name: "Orders", link: "/orders", icon: AiOutlineUser },
         { name: "Booking", link: "/categorie", icon: FiMessageSquare },
         {
           name: "Get Booking",
           link: "/search-booking",
           icon: TbReportAnalytics,
           margin: true,
         },
       ];

       const menuItems =
         user?.role === "hr"
           ? hrs
           : user?.role === "bo"
           ? bos
           : user?.role === "tso"
           ? tsos
           : [];
  return (
    <div className="sticky top-0 right-0 z-50">
      <div className="border-b-2 border-blue-500 dark:border-orange-500">
        <div className="flex max-lg:justify-between items-center justify-end w-full p-2 py-4 bg-slate-50 dark:bg-slate-950">
          <button
            className="text-slate-800 dark:text-slate-100 lg:hidden"
            onClick={toggleSidebar}
          >
            <MdMenu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Switcher />
            <button
              className="px-2 text-slate-800 dark:text-slate-100"
              onClick={() => dispatch(logout())}
            >
              <MdLogout />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-slate-50 dark:bg-slate-950 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 lg:hidden overflow-y-auto`}
      >
        <div className="flex justify-between items-center p-[14px] border-b-2 border-blue-500 dark:border-orange-500">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Menu
          </h2>
          <button onClick={toggleSidebar}>
            <MdClose size={24} className="text-slate-900 dark:text-slate-100" />
          </button>
        </div>
        <nav className="p-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name} className="mb-4">
                <Link
                  to={item.link}
                  className="block text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md p-2 transition-colors duration-200"
                  onClick={toggleSidebar}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}

export default Navbar
