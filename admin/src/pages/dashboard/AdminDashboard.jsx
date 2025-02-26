import Description from "../../components/homeComponent/Description";
import Charts from "../../components/homeComponent/Charts";
import Radar from "../../components/homeComponent/graphs/Radar";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const isAuth = useSelector((state) => state.auth.user);
  return (
    <div>
      <section className="flex items-center justify-between w-full p-4 rounded-xl bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 dark:bg-gradient-to-r dark:from-orange-200 dark:to-gray-500">
        <div className="">
          <h1 className="text-2xl text-slate-100 mb-4">
            Welcome to Habesha BTBS Admin Dashboard
          </h1>
          <h2 className="text-md text-slate-100 max-w-xl">
            We're excited to have you on board! This dashboard gives you a
            complete overview of your ongoing bus operations.
          </h2>
        </div>
        <div>
          <p className="text-xl text-slate-100 mb-4">{isAuth?.first_name}</p>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
