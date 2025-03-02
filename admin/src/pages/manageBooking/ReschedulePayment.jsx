import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle, User, MapPin, CreditCard, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { bookingFun, rescheduleBookingFun, seatFun } from "../../features/booking/bookingApi";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { setConfirmation } from "../../features/book/bookSlice";

const ReschedulePayment = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
  const [cCode, setCCode] = useState(0);
  const { passengerData, seats, busId, scheduleId, schedulePrice, bookId } =
    useSelector((state) => state.book);

  useEffect(() => {
    if (passengerData?.length === 0 || seats?.length === 0 || !scheduleId) {
      navigate("/booking");
    }
  }, [navigate, passengerData?.length, seats?.length, scheduleId]);

  const seatData = [];
  for (let i = 0; i < seats.length; i++) {
    seatData.push({
      seat_no: seats[i].seatNo,
    });
  }
  const bookingData = {
    busId,
    scheduleId,
    seats,
    total_price: schedulePrice + 500,
  };

  const { mutate: seatMutate, isPending: seatIsLoading } = useMutation({
    mutationFn: seatFun,
    onSuccess: (data) => {
      console.log(data.msg);
      navigate(`/reschedule/success/${cCode}`);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: bookMutate, isPending: bookIsLoading } = useMutation({
    mutationFn: rescheduleBookingFun,
    onSuccess: (data) => {
      console.log(data.booked);
      dispatch(setConfirmation(data?.booked?.confirmationCode));
      setCCode(data?.booked?.confirmationCode);
      const updatedData = seatData.map((s, i) => {
        return {
          ...s,
          bookId: data?.booked?._id,
          scheduleId,
          bus_id: busId,
        };
      });
      seatMutate(updatedData);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const handleBooking = () => {
    bookMutate({ id: bookId, bookingData });
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white dark:bg-slate-900 shadow-lg rounded-lg max-w-xl mx-auto"
    >
      {/* <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer dark:text-slate-100 mb-6 flex justify-between items-center p-4 border rounded-md bg-gray-100 dark:bg-gray-800 hover:shadow-md transition"
      >
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-blue-500" />
          <h3 className="text-lg font-medium">{fromPlace}</h3>
        </div>
        <h3 className="text-lg font-medium">➡</h3>
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-red-500" />
          <h3 className="text-lg font-medium">{toPlace}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-red-500" />
          <h3 className="text-lg font-medium">{travelDate}</h3>
        </div>
      </motion.div> */}

      <div className="space-y-4">
        {passengerData?.map((passenger, index) => (
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
                Seat {seats[index].seatNo}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6 p-4 bg-gray-200 dark:bg-slate-700 rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <CreditCard className="text-gray-800 dark:text-gray-300" size={24} />
          <span className="text-gray-800 dark:text-gray-100 font-medium">
            Total Payment
          </span>
        </div>
        <span className="text-gray-900 dark:text-gray-200 font-semibold text-lg">
          
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full mt-6 p-3 bg-lime-500 text-white font-semibold rounded-lg shadow-lg hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700"
        onClick={handleBooking}
        disabled={bookIsLoading || seatIsLoading}
      >
        {bookIsLoading || seatIsLoading ? <Loader /> : "Confirm Booking"}
      </motion.button>
    </motion.div>
  );
};

export default ReschedulePayment;
