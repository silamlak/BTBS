import React, { useState } from "react";
import { svg1 } from "../../assets/svg/svg";
import Description from "../../components/homeComponent/Description";
import Charts from "../../components/homeComponent/Charts";
import Radar from "../../components/homeComponent/graphs/Radar";
import Customer from "../../components/homeComponent/tables/Customer";
import Pending from "../../components/homeComponent/tables/Pending";

const Home = () => {
  return (
    <div>
      <section className="flex items-center justify-between w-full p-4 rounded-xl bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 dark:bg-gradient-to-r dark:from-orange-200 dark:to-gray-500">
        <div className="">
          <h1 className="text-2xl text-slate-100 mb-4">
            Welcome to Etsub Printing and Advertising Dashboard
          </h1>
          <h2 className="text-md text-slate-100 max-w-xl">
            We're thrilled to have you on board! This dashboard provides you
            with a comprehensive view of your ongoing projects, advertising
            campaigns, and recent updates.
          </h2>
        </div>
        <div>
          <img src={svg1} className="h-[150px]" />
        </div>
      </section>
      <div>
        <Description />
        <div className="grid w-full gap-4 grid-cols-2 max-lg:grid-cols-1 mt-4">
          <div className="">
            <Charts />
          </div>
          <div className="">
            <Radar />
          </div>
        </div>
        <div className="grid grid-cols-2 max-xl:grid-cols-1 gap-4">
          <Customer />
          <Pending />
        </div>
      </div>
    </div>
  );
};

export default Home;
