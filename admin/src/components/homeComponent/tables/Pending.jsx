import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getPendingOrdersFun } from "../../../features/dashboard/dashboardApi";
import { TableError, TableSkeleton } from "../../skeleton/Skeletons";

const Pending = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["pending_samples"],
    queryFn: getPendingOrdersFun,
    retry: 1,
    refetchInterval: 60000, // refetch every minute
    retryDelay: 60000,
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError && error) {
    return <TableError error={error} />;
  }

  if (isError && error) {
    return (
      <div className="w-full mt-10 p-6 bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Error</h2>
        <p>{error.data || "An unexpected error occurred."}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-md mt-4 max-xl:mt-0">
        <div className="border-b">
          <h1 className="p-4 text-xl max-sm:text-lg font-semibold text-slate-800 dark:text-slate-100">
            Pending Orders
          </h1>
        </div>
        <div className="mx-3 py-3">
          <table className="w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr className="uppercase text-slate-800 dark:text-slate-100 text-sm">
                <th className="py-2 text-start px-4 border-b">Name</th>
                <th className="py-2 text-start px-4 border-b">Date</th>
                <th className="py-2 max-sm:hidden text-start px-4 border-b">
                  Money
                </th>
                <th className="py-2 text-start px-4 border-b">Item</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr
                  key={index}
                  className="text-slate-800 text-sm dark:text-slate-100 font-medium"
                >
                  <td className="py-3 px-4 border-b">
                    {item?.user?.first_name} {item?.user?.last_name}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {new Date(item?.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 max-sm:hidden border-b text-blue-500 dark:text-orange-400">
                    {item?.totalPrice}
                  </td>
                  <td className="py-3 px-4 border-b">{item?.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pending;
