import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getSalesRevenueFun } from "../../features/dashboard/dashboardApi";
import { ChartError, ChartSkeleton } from "../skeleton/Skeletons";

const Charts = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sales_revenue"],
    queryFn: getSalesRevenueFun,
    retry: 1,
    refetchInterval: 60000, // refetch every minute
    retryDelay: 60000,
  });

  if (isLoading) {
    return <ChartSkeleton />
  }

  if (isError && error) {
    return <ChartError error={error} />
  }
  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-900 shadow-md rounded-xl">
      <h1 className="text-xl max-sm:text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
        Revenue and Sales History
      </h1>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalSales" stroke="#8884d8" />
          <Line type="monotone" dataKey="totalRevenue" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
