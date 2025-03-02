import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { clearAll } from "../../features/book/bookSlice";

const RescheduleSeccess = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { confirmation, passengerData } = useSelector((state) => state.book);
    console.log(confirmation);
    useEffect(() => {
      if (!id || !passengerData) {
        navigate("/search-booking", { replace: true });
      }
    }, [dispatch, id, navigate, confirmation, passengerData]);
    const handleToDashboard = () => {
      dispatch(clearAll());
      navigate("/search-booking");
    };
  return (
    <div className="flex justify-center h-full items-center">
      {confirmation && (
        <motion.div
          className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg text-center max-w-sm w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-green-500 dark:text-green-400 mb-4 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <CheckCircle size={48} />
          </motion.div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Reschedule Booking Successful
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Your booking has been rescheduled. Enjoy your trip!
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Booking ID:{" "}
            <span className="font-bold dark:text-gray-100">{id}</span>
          </p>
          <motion.button
            onClick={handleToDashboard}
            className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition dark:bg-green-600 dark:hover:bg-green-700"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Go to Dashboard
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default RescheduleSeccess;
