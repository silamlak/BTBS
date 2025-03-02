import React from "react";
import { useSelector } from "react-redux";

const AdminProfile = () => {
  const isAuth = useSelector((state) => state.auth.user);
  console.log(isAuth);

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg w-11/12 md:w-1/3 p-6">
        {/* Profile Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            {isAuth?.first_name} {isAuth?.middle_name}
          </h2>
          <p className="text-gray-500 dark:text-gray-300">Administrator</p>
        </div>

        {/* User Info */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-300">
              Email
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-100">
              {isAuth?.email}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-300">
              Phone
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-100">
              {isAuth?.phone}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
