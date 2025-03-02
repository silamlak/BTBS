import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Armchair, X, CheckCircle } from "lucide-react";
import Loader from "../../components/Loader";
import {
  setSelectedSeat,
  setSelectedPassengerIndex,
  setSeats,
  setBusId,
} from "../../features/book/bookSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getSeatFun, totalSeatFun } from "../../features/booking/bookingApi";
import ErrorMessage from "../../components/ErrorMessage";

const SeatSelection = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    passengerData,
    seats,
    selectedPassengerIndex,
    selectedSeats,
    scheduleId,
  } = useSelector((state) => state.book);
  const [totalPass, setTotalPass] = useState();

  useEffect(() => {
    if (passengerData?.length === 0 || !scheduleId) {
      navigate("/booking");
    }
  }, [navigate, passengerData?.length, scheduleId]);

  const getQueryParams = (search) => {
    const params = new URLSearchParams(search);
    return {
      adults: parseInt(params.get("adults"), 10) || 0,
      children: parseInt(params.get("children"), 10) || 0,
      fromPlace: params.get("from"),
      toPlace: params.get("to"),
      travelDate: params.get("date"),
    };
  };

  useEffect(() => {
    const { adults, children } = getQueryParams(location.search);
    const passengers = adults + children;
    setTotalPass(passengers);
    if (seats.length === 0) {
      const initialSeats = [];
      for (let i = 0; i < passengers; i++) {
        initialSeats.push({
          name: passengerData[i].name,
          seatId: passengerData[i].id,
          seatNo: i === selectedSeats[i] ? selectedSeats[i] : "",
        });
      }
      dispatch(setSeats(initialSeats));
    }
  }, [dispatch, location.search, passengerData, seats.length, selectedSeats]);

  const { data: getTotalSeats = [], isLoading: totalSeatLoading } = useQuery({
    queryKey: ["get_total_seat"],
    queryFn: () => totalSeatFun({ totalPass, scheduleId }),
    enabled: !!totalPass,
  });

  useEffect(() => {
    if (getTotalSeats) {
      dispatch(setBusId({ bus_id: getTotalSeats._id }));
    }
  }, [getTotalSeats, dispatch]);

  const {
    data: takenSeats = [],
    isLoading: takenSeatLoading,
    isError: takenSeatError,
    error,
  } = useQuery({
    queryKey: ["seat"],
    queryFn: () => getSeatFun({ scheduleId, bus_id: getTotalSeats._id }),
    enabled: !!getTotalSeats.seating_capacity,
  });
  const handleSeatClick = (seatNumber) => {
    if (!takenSeats.includes(seatNumber)) {
      dispatch(
        setSelectedSeat({ passengerIndex: selectedPassengerIndex, seatNumber })
      );
    }
  };

  // Handle passenger selection
  const handlePassengerClick = (index) => {
    dispatch(setSelectedPassengerIndex(index));
  };

  const handleSeatSubmit = () => {
    const { fromPlace, toPlace, travelDate, adults, children } = getQueryParams(
      location.search
    );
    navigate(
      `/payment?from=${fromPlace}&to=${toPlace}&date=${travelDate}&adults=${adults}&children=${children}`
    );
  };

  const allPassengerInfoFilled = () => {
    return seats?.length > 0 && seats.every((s) => s.seatNo);
  };

  if (totalSeatLoading || takenSeatLoading)
    return (
      <div className="w-full flex justify-center p-6">
        {" "}
        <Loader />{" "}
      </div>
    );
  if (takenSeatError) {
    return <ErrorMessage error={error} />;
  }

  const renderPassengerButtons = () => (
    <div className="flex flex-wrap gap-4 mb-4">
      {passengerData?.map((passenger, index) => (
        <button
          key={index}
          className={`p-2 border rounded-md ${
            selectedPassengerIndex === index
              ? "bg-lime-500 text-white"
              : "bg-gray-300 dark:bg-slate-800 dark:text-slate-100"
          }`}
          onClick={() => handlePassengerClick(index)}
        >
          {passenger?.type === "adult"
            ? `Adult ${index + 1}`
            : `Child ${index + 1}`}
          {selectedPassengerIndex === index && ` (Selected)`}
        </button>
      ))}
    </div>
  );

  const renderSeatMap = () => {
    const seatsPerRow = 4;
    const totalSeats = getTotalSeats?.seating_capacity || 0;
    const totalRows = Math.ceil(totalSeats / seatsPerRow);

    return (
      <div className="flex justify-center">
        <div className="grid grid-cols-4 gap-2 md:gap-4 mb-4">
          {Array.from({ length: totalSeats }, (_, index) => {
            const seatNumber = index + 1;
            const isTaken = takenSeats.some(
              (seat) => seat.seat_no === seatNumber
            );
            const occupiedByPassenger = selectedSeats[seatNumber];

            const isLastRow = Math.ceil(seatNumber / seatsPerRow) === totalRows;

            return (
              <motion.div
                key={index}
                className={`relative flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all
                ${
                  isTaken
                    ? "bg-red-500 text-white cursor-not-allowed dark:bg-red-600"
                    : occupiedByPassenger !== undefined
                    ? "bg-green-500 text-white dark:bg-green-600"
                    : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                }
                ${
                  occupiedByPassenger === selectedPassengerIndex
                    ? "ring-2 ring-blue-500"
                    : ""
                }
                ${seatNumber % 4 === 2 && !isLastRow ? "mr-6" : ""} 
              `}
                whileHover={{ scale: isTaken ? 1 : 1.1 }}
                onClick={() => !isTaken && handleSeatClick(seatNumber)}
              >
                {isTaken ? (
                  <X size={24} className="text-white dark:text-gray-200" />
                ) : occupiedByPassenger !== undefined ? (
                  <CheckCircle
                    size={24}
                    className="text-white dark:text-gray-200"
                  />
                ) : (
                  <Armchair
                    size={24}
                    className="text-gray-700 dark:text-gray-300"
                  />
                )}
                <span className="absolute bottom-1 text-xs text-gray-700 dark:text-gray-300">
                  {isTaken
                    ? "Taken"
                    : occupiedByPassenger !== undefined
                    ? `P${occupiedByPassenger + 1}`
                    : `S${seatNumber}`}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <div className="p-4">
      <h2 className="text-slate-800 dark:text-slate-100 text-lg font-semibold mb-4">
        Seat Selection
      </h2>
      {renderPassengerButtons()}
      {renderSeatMap()}
      {allPassengerInfoFilled() && (
        <button
          className="bg-lime-500 hover:bg-lime-600 text-white p-2 mb-10 rounded-md transition-all"
          onClick={handleSeatSubmit}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default SeatSelection;
