import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";
import { FiMessageSquare, FiFolder, FiShoppingCart } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ theme }) => {
  const location = useLocation();
  const menus = [
    { name: "dashboard", link: "/", icon: MdOutlineDashboard },
    { name: "Orders", link: "/orders", icon: AiOutlineUser },
    { name: "Categorie", link: "/categorie", icon: FiMessageSquare },
    {
      name: "Product",
      link: "/product",
      icon: TbReportAnalytics,
      margin: true,
    },
    { name: "Create Product", link: "/product/create", icon: FiFolder },
    { name: "Customer", link: "/customer", icon: FiShoppingCart },
  ];

  const [open, setOpen] = useState(true);

  return (
    <div className=" z-50">
      <div
        className={`min-h-screen z-50 ${
          open ? "w-56" : "w-[67px]"
        } transition-[width] duration-500 text-gray-100 px-4 bg-slate-50 dark:bg-slate-950`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer text-slate-800 dark:text-slate-100"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 z-50 relative">
          {menus.map((menu, i) => {
            const isActive = location.pathname === menu.link;

            return (
              <Link
                to={menu.link}
                key={i}
                className={`${
                  menu.margin && "mt-5"
                } group flex items-center text-slate-800 dark:text-slate-100 text-sm gap-3.5 font-medium p-2 ${
                  isActive
                    ? `bg-slate-200 dark:bg-slate-800 rounded-md`
                    : "hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md"
                }`}
              >
                <div>{React.createElement(menu.icon, { size: "20" })}</div>
                <h2
                  className={`whitespace-pre transition-[opacity] duration-700 ${
                    !open && "opacity-0 overflow-hidden"
                  }`}
                >
                  {menu.name}
                </h2>
                <h2
                  className={`${
                    open && "hidden"
                  } absolute left-48 bg-${theme}-tooltip font-semibold whitespace-pre text-${theme}-text rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                >
                  {menu.name}
                </h2>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
