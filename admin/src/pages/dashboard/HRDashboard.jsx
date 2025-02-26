import React from "react";
import { TotalError, TotalSkeleton } from "../../components/skeleton/Skeletons";
import { useQuery } from "@tanstack/react-query";
import { FaUserTie, FaBus, FaTicketAlt, FaUserCog, FaRoute } from "react-icons/fa";
import { MdProductionQuantityLimits, MdLocationOn } from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai";
import { LuUsers } from "react-icons/lu";
import { getDashboardHRCountFun } from "../../features/dashboard/dashboardApi";

const HRDashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["each_totals"],
    queryFn: getDashboardHRCountFun,
    retry: 1,
    refetchInterval: 60000, // refetch every minute
    retryDelay: 60000,
  });

  const constants = [
    {
      icon: FaUserCog,
      title: "Total Bus Opertaor",
      total: data?.totalBo,
    },
    {
      icon: FaBus,
      title: "Total Bus",
      total: data?.totalBus,
    },
    {
      icon: FaUserTie,
      title: "Total Driver",
      total: data?.totalDriver,
    },
    {
      icon: FaTicketAlt,
      title: "Total Ticket Sales Officer",
      total: data?.totalTso,
    },
  ];
  return (
    <div>
      <section className="flex items-center justify-between w-full p-4 rounded-xl bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 dark:bg-gradient-to-r dark:from-orange-200 dark:to-gray-500">
        <div className="">
          <h1 className="text-2xl text-slate-100 mb-4">
            Welcome to Habesha BTBS Dashboard
          </h1>
          <h2 className="text-md text-slate-100 max-w-xl">
            We're excited to have you on board! This dashboard gives you a
            complete overview of your ongoing bus operations.
          </h2>
        </div>
        <div></div>
      </section>
      {isLoading && !isError && !error && <TotalSkeleton />}
      {isError && error && <TotalError error={error} />}
      {!isLoading && !error && data && (
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
                  </p>
                  <p className="font-semibold max-sm:text-sm text-slate-800 dark:text-slate-100 mt-1">
                    {tot?.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HRDashboard;
