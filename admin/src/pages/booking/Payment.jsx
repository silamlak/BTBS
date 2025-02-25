import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle, User, MapPin, CreditCard, Clock } from "lucide-react";
import { useSelector } from "react-redux";
import { bookingFun, seatFun } from "../../features/booking/bookingApi";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const [cCode, setCCode] = useState(0);
  const { passengerData, seats, busId, scheduleId, schedulePrice } =
    useSelector((state) => state.book);
  const getSearchParams = (query) => {
    return new URLSearchParams(query);
  };

  const searchParams = getSearchParams(location.search);
  const fromPlace = searchParams.get("from");
  const toPlace = searchParams.get("to");
  const travelDate = searchParams.get("date");

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
    passengers: passengerData,
    seats,
    total_price: totalPrice,
  };
  const { mutate: seatMutate, isPending: seatIsLoading } = useMutation({
    mutationFn: seatFun,
    onSuccess: (data) => {
      console.log(data.msg);
      navigate(`/booking/success/${cCode}`);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const { mutate: bookMutate, isPending: bookIsLoading } = useMutation({
    mutationFn: bookingFun,
    onSuccess: (data) => {
      console.log(data.booked);
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
    bookMutate(bookingData);
  };

  const calculatePayment = () => {
    console.log(schedulePrice);
    let totalPayment = schedulePrice;
    let adults = 0;
    let children = 0;
    passengerData.forEach((passenger) => {
      if (passenger.type === "adult") {
        adults++;
      } else if (passenger.type === "child") {
        children++;
      }
    });
    if ((adults === 1 && children === 0) || (adults === 1 && children === 1)) {
      totalPayment = 1 * totalPayment;
    } else if (adults === 1 && children === 2) {
      totalPayment = 2 * totalPayment;
    } else if (adults === 1 && children === 3) {
      totalPayment = 2 * totalPayment;
    } else if (
      (adults === 2 && children === 0) ||
      (adults === 2 && children === 1) ||
      (adults === 2 && children === 2)
    ) {
      totalPayment = 2 * totalPayment;
    } else if (adults === 2 && children === 3) {
      totalPayment = 3 * totalPayment;
    } else if (
      (adults === 3 && children === 0) ||
      (adults === 3 && children === 1) ||
      (adults === 3 && children === 2) ||
      (adults === 3 && children === 3)
    ) {
      totalPayment = 3 * totalPayment;
    } else if (
      (adults === 4 && children === 0) ||
      (adults === 4 && children === 1) ||
      (adults === 4 && children === 2) ||
      (adults === 4 && children === 3)
    ) {
      totalPayment = 4 * totalPayment;
    } else if (
      (adults === 5 && children === 0) ||
      (adults === 5 && children === 1) ||
      (adults === 5 && children === 2)
    ) {
      totalPayment = 5 * totalPayment;
    } else if (
      (adults === 6 && children === 0) ||
      (adults === 6 && children === 1)
    ) {
      totalPayment = 6 * totalPayment;
    } else {
      totalPayment = adults * totalPayment;
    }
    return totalPayment;
  };

  useEffect(() => {
    const newTotal = calculatePayment();
    if (newTotal !== totalPrice) {
      setTotalPrice(newTotal); // Updates state only if value has changed
    }
  }, [passengerData, schedulePrice]);
  console.log(totalPrice);
  return (
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
      </motion.div>

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
          {calculatePayment()}
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

export default Payment;
