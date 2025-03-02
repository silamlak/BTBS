import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getBookingSearchFun,
  listBookingSearchFun,
} from "../../features/book/bookApi";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { AlertCircle, Bus, Calendar, MapPin } from "lucide-react";
import { setScheduleId, setSchedulePrice } from "../../features/book/bookSlice";
const formatDate = (dateString) => {
  if (!dateString) return;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(new Date(dateString));
};
const RescheduleSearch = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["searchResults", id],
    queryFn: () => listBookingSearchFun(id),
    enabled: !!id,
  });

  console.log(data);

  const goToPassangerInfo = (id) => {
    dispatch(setScheduleId({id}));
    navigate(`/reschedule/seat?id=${id}`);
  };

  if (isLoading && !data)
    return (
      <div className="w-full flex justify-center p-6">
        {" "}
        <Loader />{" "}
      </div>
    );

  if (isError) {
    console.log(error);
    return <ErrorMessage error={error} />;
  }
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-2xl mx-auto mt-10">
      <div className="grid gap-4">
        {data?.length > 0 ? (
          data?.map((result, index) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => goToPassangerInfo(result._id)}
              key={index}
              className="cursor-pointer dark:text-slate-100 flex justify-between items-center p-4 border rounded-md bg-gray-100 dark:bg-gray-800 hover:shadow-md transition"
            >
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-blue-500" />
                <h3 className="text-lg font-medium">{result?.from}</h3>
              </div>
              <h3 className="text-lg font-medium">➡</h3>
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-red-500" />
                <h3 className="text-lg font-medium">{result?.to}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {result.description}
              </p>
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-red-500" />
                <h3 className="text-lg font-medium">
                  {formatDate(result?.schedule_date)}
                </h3>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <AlertCircle size={20} /> No results found.
          </div>
        )}
      </div>
    </div>
  );
};

export default RescheduleSearch;
