import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  CheckCircle,
  User,
  MapPin,
  CreditCard,
  Clock,
  Edit,
  XCircle,
  Armchair,
  BookOpen,
} from "lucide-react";
import {
  cancelBookingFun,
  getBookingFun,
} from "../../features/booking/bookingApi";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  clearAll,
  setBusId,
  setPassengerData,
  setScheduleId,
  setSeats,
} from "../../features/book/bookSlice";

const formatDate = (dateString) => {
  if (!dateString) return;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

const MyBooking = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
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
      toast.success(data.msg);
      navigate("/search-booking");
    },
  });

  const handleCancel = () => {
    console.log("Cancel clicked");
    mutation.mutate(data?.booking?._id);
  };

  const handlePassengerEdit = () => {
    if (data) {
      dispatch(setPassengerData(data?.booking?.passengers));
    }
    navigate(`/my-booking/edit/passenger?search=${data?.booking?._id}`);
  };

  const handleSeatEdit = () => {
    dispatch(clearAll());
    if (data) {
      dispatch(setPassengerData(data?.booking?.passengers));
      dispatch(setSeats(data?.booking?.seats));
      console.log(data?.booking?.scheduleId);
      dispatch(setScheduleId({ id: data?.booking?.scheduleId }));
      dispatch(setBusId({ bus_id: data?.booking?.busId }));
    }
    navigate(`/my-booking/edit/seat?search=${data?.booking?._id}`);
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

  console.log(data);

  return (
    <div>
      {!data?.booking && !isLoading && !isError && (
        <motion.div
          className="flex flex-col justify-center items-center bg-gray-100 dark:bg-slate-800 p-6 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BookOpen
            size={48}
            className="text-gray-500 dark:text-gray-400 mb-4"
          />
          <span className="text-lg text-gray-700 dark:text-gray-300">
            No booking available
          </span>
        </motion.div>
      )}
      {data?.booking && (
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
              <h3 className="text-lg font-medium dark:text-slate-100">
                {data?.schedule?.from}
              </h3>
            </div>
            <h3 className="text-lg font-medium">➡</h3>
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-red-500" />
              <h3 className="text-lg font-medium dark:text-slate-100">
                {data?.schedule?.to}
              </h3>
            </div>
            {data && (
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-red-500" />
                <h3 className="text-lg font-medium dark:text-slate-100">
                  {formatDate(data?.schedule?.schedule_date)}
                </h3>
              </div>
            )}
          </motion.div>

          <div className="space-y-4">
            {data?.booking?.passengers?.map((passenger, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex justify-between items-center p-4 bg-gray-100 dark:bg-slate-800 rounded-lg shadow-md"
              >
                <div className="flex items-center gap-3">
                  <User
                    className="text-gray-700 dark:text-gray-300"
                    size={24}
                  />
                  <span className="text-gray-800 dark:text-gray-100 font-medium">
                    {passenger.first_name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-800 dark:text-gray-100 font-medium">
                      {passenger.last_name}
                    </span>
                  </div>
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
              {data?.booking?.total_price}
            </span>
          </div>

          <div className="flex justify-between items-center mt-6 p-4 bg-gray-200 dark:bg-slate-700 rounded-lg shadow-md">
            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
            >
              <XCircle size={20} />
              <span>Cancel</span>
            </button>

            {/* Edit Passenger Button */}
            <button
              onClick={handlePassengerEdit}
              className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600"
            >
              <Edit size={20} />
              <span>Edit Passenger</span>
            </button>

            {/* Edit Seat Button */}
            <button
              onClick={handleSeatEdit}
              className="flex items-center space-x-2 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-600"
            >
              <Armchair size={20} />
              <span>Edit Seat</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MyBooking;
