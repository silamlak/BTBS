import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getSingleCustomerFun } from "../../features/customer/customerApi";
import { useParams } from "react-router-dom";
import { FaRegSave } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Loader from "../../components/Loader";

const SingleCustomer = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["singleOrder", id],
    queryFn: () => getSingleCustomerFun(id),
    enabled: !!id,
  });
  return (
    <div>
      {isError && error && (
        <div className="p-2 flex bg-red-500 text-white rounded">
          <p>{error?.data || "Something Went Wrong"}</p>
        </div>
      )}
      {isLoading && !isError && !error && (
        <div className="w-full flex justify-center">
          <Loader />
        </div>
      )}
      {!isLoading && !isError && !error && (
        <div>
          <div className="rounded-xl border max-w-4xl bg: bg-slate-50 dark:bg-slate-900 shadow-md p-6">
            <p className="text-slate-800 dark:text-slate-100 text-lg font-semibold max-sm:text-md">
              Identity
            </p>

            <div className=" m-3 grid grid-cols-3 my-4 text-slate-800 dark:text-slate-100">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-[13px]">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    disabled
                    value={`${data?.first_name} ${data?.father_name}`}
                    className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-fit rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-[13px]">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    disabled
                    value={data?.email}
                    className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-fit rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-[13px]">
                    Phone
                  </label>
                  <input
                    id="email"
                    type="email"
                    disabled
                    value={data?.ethPhone}
                    className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-fit rounded"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-normal">reference</p>
                <p className="text-md font-semibold">GASHG122</p>
              </div>
              <div>
                <div className="flex flex-col">
                  <label htmlFor="date" className="text-[13px]">
                    Registerd Date
                  </label>
                  <input
                    id="date"
                    type="text"
                    disabled
                    value={new Date(data?.createdAt).toLocaleDateString()}
                    className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-fit rounded"
                  />
                </div>
              </div>
            </div>

            <p className="text-slate-800 dark:text-slate-100 text-lg font-semibold max-sm:text-md">
              Price Info
            </p>
            <div className=" m-3 grid grid-cols-3 mt-2 text-slate-800 dark:text-slate-100">
              <div>
                <div>
                  <p className="text-sm font-normal">Total Price</p>
                  <p className="text-md font-semibold">
                    {data?.total_price} <span className="text-sm">ETB</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-14 flex justify-between items-center bg-slate-100 rounded-xl dark:bg-slate-800 p-5">
              <button className="flex p-2 text-blue-400 dark:text-orange-400 bg-slate-200 dark:bg-slate-900 gap-3 rounded-md items-center">
                <p className="text-bold">Save</p>
                <FaRegSave />
              </button>
              <button className="flex p-2 text-red-500 bg-slate-200 dark:bg-slate-900 gap-3 rounded-md items-center">
                <p>Delete</p>
                <MdDeleteOutline />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleCustomer;
