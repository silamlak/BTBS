import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle, User, MapPin, CreditCard, Clock } from "lucide-react";
import { cancelBookingFun, getBookingFun } from "../../features/booking/bookingApi";
import { useLocation } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

const MyBooking = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get("search");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["booking"],
    queryFn: () => getBookingFun(search),
    enabled: !!search,
  });

  console.log(data);
const mutation = useMutation({
  mutationFn: cancelBookingFun,
  onSuccess: (data) => {
    console.log(data);
    console.log(data);
  }
});
  const handleCancel = () => {
    console.log("Cancel clicked");
    mutation.mutate(data?._id);
  };
   if (isLoading)
     return (
       <div className="w-full flex justify-center p-6">
         {" "}
         <Loader />{" "}
       </div>
     );
   if (isError) {
     return <ErrorMessage error={error} />;
   }
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-white dark:bg-slate-900 shadow-lg rounded-lg max-w-xl mx-auto"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer mb-6 flex justify-between items-center p-4 border rounded-md bg-gray-100 dark:bg-gray-800 hover:shadow-md transition"
        >
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-blue-500" />
            <h3 className="text-lg font-medium">{data?.schedule?.from}</h3>
          </div>
          <h3 className="text-lg font-medium">➡</h3>
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-red-500" />
            <h3 className="text-lg font-medium">{data?.schedule?.to}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-red-500" />
            <h3 className="text-lg font-medium">
              {formatDate(data?.schedule?.schedule_date)}
            </h3>
          </div>
        </motion.div>

        <div className="space-y-4">
          {data?.booking?.passengers?.map((passenger, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex justify-between items-center p-4 bg-gray-100 dark:bg-slate-800 rounded-lg shadow-md"
            >
              <div className="flex items-center gap-3">
                <User className="text-gray-700 dark:text-gray-300" size={24} />
                <span className="text-gray-800 dark:text-gray-100 font-medium">
                  {passenger.first_name} ({passenger.type})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle
                  className="text-green-500 dark:text-green-400"
                  size={20}
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Seat {data?.booking?.seats[index].seatNo}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 p-4 bg-gray-200 dark:bg-slate-700 rounded-lg shadow-md">
          <div className="flex items-center gap-2">
            <CreditCard
              className="text-gray-800 dark:text-gray-300"
              size={24}
            />
            <span className="text-gray-800 dark:text-gray-100 font-medium">
              Total Payment
            </span>
          </div>
          <span className="text-gray-900 dark:text-gray-200 font-semibold text-lg">
            {data?.total_price}
          </span>
        </div>
        {/* 
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-6 p-3 bg-lime-500 text-white font-semibold rounded-lg shadow-lg hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700"
          onClick={handleBooking}
          disabled={bookIsLoading || seatIsLoading}
        >
          {bookIsLoading || seatIsLoading ? <Loader /> : "Confirm Booking"}
        </motion.button> */}
      </motion.div>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default MyBooking;
