import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { CiBadgeDollar, CiShoppingCart } from "react-icons/ci";
import { MdProductionQuantityLimits } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { getEachTotalFun } from "../../features/dashboard/dashboardApi";
import { TotalError, TotalSkeleton } from "../skeleton/Skeletons";

const Description = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["each_totals"],
    queryFn: getEachTotalFun,
    retry: 1,
    refetchInterval: 60000, // refetch every minute
    retryDelay: 60000,
  });

  const constants = [
    {
      icon: CiBadgeDollar,
      title: "Monthly Price",
      total: data?.totalMonthSalary,
      inc: data?.salaryIncrease,
      tl: "Birr",
    },
    {
      icon: MdProductionQuantityLimits,
      title: "Total Quantity",
      total: data?.totalProduct,
      inc: data?.productIncrease,
    },
    {
      icon: CiShoppingCart,
      title: "Total Purchased",
      total: data?.totalPurchased,
      inc: data?.purchasedIncrease,
    },
    {
      icon: LuUsers,
      title: "Total Users",
      total: data?.totalCustomer,
      inc: data?.customerIncrease,
    },
  ];

  if (isLoading && !isError && !error) {
    return <TotalSkeleton />
  }

  if (isError && error) {
    return <TotalError error={error}/>
  }

  return (
    <div className="grid grid-cols-4 max-xl:grid-cols-2 max-sm:grid-cols-1 w-full gap-4 mt-4">
      {constants?.map((tot, i) => (
        <div
          key={i}
          className="flex w-full justify-between gap-2 items-end shadow-md bg-slate-50 dark:bg-slate-900 p-6 rounded-xl"
        >
          <div className="flex flex-col justify-between">
            <span className="p-3 bg-blue-100 dark:bg-orange-100 rounded-full w-fit">
              <tot.icon className="text-blue-600 dark:text-orange-500 text-4xl" />
            </span>
            <div>
              <p className="text-3xl max-sm:2xl text-slate-800 dark:text-slate-100 font-semibold mt-8">
                {tot?.total}{" "}
                <span className="text-sm -ml-[6px]">{tot?.tl}</span>
              </p>
              <p className="font-semibold max-sm:text-sm text-slate-800 dark:text-slate-100 mt-1">
                {tot?.title}
              </p>
            </div>
          </div>
          <div>
            {tot?.inc?.toString().includes("-") ? (
              <div className="flex gap-1 items-center text-red-500">
                <p className="max-sm:text-sm">{tot?.inc}</p>
                <FaArrowDown />
              </div>
            ) : (
              <div className="flex gap-1 items-center text-green-500">
                <p className="max-sm:text-sm">{tot?.inc}</p>
                <FaArrowUp />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Description;
