import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getTopUsersFun } from "../../../features/dashboard/dashboardApi";
import { TableError, TableSkeleton } from "../../skeleton/Skeletons";

const Customer = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["top_users"],
    queryFn: getTopUsersFun,
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
  

  return (
    <div>
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-md mt-4">
        <div className="border-b">
          <h1 className="p-4 text-xl max-sm:text-lg font-semibold text-slate-800 dark:text-slate-100">
            User Spending Table
          </h1>
        </div>
        <div className="mx-3 py-3">
          <table className="w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <thead className="bg-slate-100 dark:bg-slate-800 ">
              <tr className="uppercase text-slate-800 dark:text-slate-100 text-sm">
                <th className="py-2 text-start px-4 border-b">Name</th>
                <th className="py-2 text-start px-4 border-b">Phone</th>
                <th className="py-2 text-start px-4 border-b">Spent</th>
                {/* <th className="py-2 max-sm:hidden text-start px-4 border-b">
                  Country
                </th> */}
              </tr>
            </thead>
            <tbody className="">
              {data?.map((item, index) => (
                <tr
                  key={index}
                  className="text-slate-800 text-sm dark:text-slate-100 font-medium"
                >
                  <td className="py-3 px-4 border-b">
                    {item?.first_name} {item?.last_name}
                  </td>
                  <td className="py-3 px-4 border-b font-normal">
                    {item?.ethPhone}
                  </td>
                  <td className="py-3 px-4 border-b text-green-500">
                    {item?.total_price} ETB
                  </td>
                  {/* <td className="py-3 max-sm:hidden px-4 border-b">
                    {item?.email}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customer;
