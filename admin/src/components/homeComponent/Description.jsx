import {
  FaRoute,
  FaUserCog,
  FaBus,
  FaUserTie,
  FaTicketAlt,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

import { useQuery } from "@tanstack/react-query";
import { getDashboardAdminCountFun } from "../../features/dashboard/dashboardApi";
import { TotalError, TotalSkeleton } from "../skeleton/Skeletons";
import { AiOutlineSchedule } from "react-icons/ai";

const Description = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["each_totals"],
    queryFn: getDashboardAdminCountFun,
    retry: 1,
    refetchInterval: 60000, // refetch every minute
    retryDelay: 60000,
  });
  console.log(data);

  const constants = [
    {
      icon: FaUserCog,
      title: "Total HR",
      total: data?.totalHr,
    },
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
    {
      icon: FaRoute,
      title: "Total Routes",
      total: data?.totalRoutes,
    },
    {
      icon: AiOutlineSchedule,
      title: "Total Schedule",
      total: data?.totalSchedules,
    },
    {
      icon: MdLocationOn,
      title: "Total Station",
      total: data?.totalStation,
    },
  ];

  if (isLoading && !isError && !error) {
    return <TotalSkeleton />;
  }

  if (isError && error) {
    return <TotalError error={error} />;
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
        </div>
      ))}
    </div>
  );
};

export default Description;
