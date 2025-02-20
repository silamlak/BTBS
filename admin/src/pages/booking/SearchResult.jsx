import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookingSearchFun } from "../../features/catagorie/catagorieApi";
import { useDispatch } from "react-redux";
import { setScheduleId, setSchedulePrice } from "../../features/catagorie/catagorieSlice";
import { motion } from "framer-motion";
import { Bus, MapPin, Calendar, AlertCircle } from "lucide-react";

const SearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const getSearchParams = (query) => {
    return new URLSearchParams(query);
  };

  const searchParams = getSearchParams(location.search);
  const fromPlace = searchParams.get("from");
  const toPlace = searchParams.get("to");
  const travelDate = searchParams.get("date");
  const adults = searchParams.get("adults");
  const childs = searchParams.get("children");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["searchResults", fromPlace, toPlace, travelDate],
    queryFn: () => getBookingSearchFun( fromPlace, toPlace, travelDate ),
    enabled: !!fromPlace && !!toPlace && !!travelDate,
  });

  console.log(data)
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  const goToPassangerInfo = (id, ticket_price) => {
    dispatch(setScheduleId({ id }));
    dispatch(setSchedulePrice(ticket_price));
    navigate(
      `/passenger?from=${fromPlace}&to=${toPlace}&date=${travelDate}&adults=${adults}&children=${childs}`
    );
  };

  console.log(data)

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-2xl mx-auto mt-10">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
        <Calendar size={20} /> Search Results for {fromPlace} to {toPlace} on{" "}
        {travelDate}
      </h2>
      <div className="grid gap-4">
        {data?.length > 0 ? (
          data?.map((result, index) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => goToPassangerInfo(result._id, result.ticket_price)}
              key={index}
              className="cursor-pointer flex justify-between items-center p-4 border rounded-md bg-gray-100 dark:bg-gray-800 hover:shadow-md transition"
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
              <Bus size={24} className="text-green-500" />
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

export default SearchResult;
