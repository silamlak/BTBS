import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getCatagoryDestributionFun } from "../../../features/dashboard/dashboardApi";
import { ChartError, ChartSkeleton } from "../../skeleton/Skeletons";

const Radars = () => {
  const {
    data: d,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["category"],
    queryFn: getCatagoryDestributionFun,
    retry: 1,
    refetchInterval: 60000,
    retryDelay: 60000,
  });

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (isError && error) {
    return <ChartError error={error} />;
  }
  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-md max-md:ml-0 max-md:mt-4">
      <h1 className="text-xl max-sm:text-lg font-semibold text-slate-800 dark:text-slate-100">
        Product Category Sales Distribution
      </h1>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart outerRadius="80%" data={d} className="mx-auto">
          <PolarGrid media={100} />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis angle={30} domain={[0, 3000]} />
          <Radar
            name="totalSales"
            dataKey="totalSales"
            stroke="#8884d8" // Ensure valid color
            fill="#8884d8" // Ensure valid color
            fillOpacity={0.6}
          />
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Radars;
