import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  setSelectedSeat,
  setSelectedPassengerIndex,
  setSeats,
} from "../../features/catagorie/catagorieSlice";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import { getSeatFun } from "../../features/booking/bookingApi";

// SeatSelection Component
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
  } = useSelector((state) => state.catagorie);

  // Fetch taken seats
  const { data: takenSeats = [] } = useQuery({
    queryKey: ["seat"],
    queryFn: () => getSeatFun(scheduleId),
  });

  // Helper function to get query parameters
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
console.log(selectedSeats)
  useEffect(() => {
    const { adults, children } = getQueryParams(location.search);
    const passengers = adults + children;
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
  }, [dispatch]);

  // Handle seat selection
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

  // Render passengers as buttons
  const renderPassengerButtons = () => (
    <div className="flex flex-wrap gap-4 mb-4">
      {passengerData.map((passenger, index) => (
        <button
          key={index}
          className={`p-2 border rounded-md ${
            selectedPassengerIndex === index
              ? "bg-blue-500 text-white"
              : "bg-gray-300 dark:bg-slate-800"
          }`}
          onClick={() => handlePassengerClick(index)}
        >
          {passenger.type === "adult"
            ? `Adult ${index + 1}`
            : `Child ${index + 1}`}
          {selectedPassengerIndex === index && ` (Selected)`}
        </button>
      ))}
    </div>
  );

  // Render seat map with passenger numbers
  const renderSeatMap = () => (
    <div className="grid grid-cols-5 gap-4 mb-4">
      {Array.from({ length: 40 }, (_, index) => {
        const seatNumber = index + 1;
        const isTaken = takenSeats.some((seat) => seat.seat_no === seatNumber); 
        const occupiedByPassenger = selectedSeats[seatNumber];

        return (
          <div
            key={index}
            className={`p-4 border rounded-md flex items-center justify-center cursor-pointer 
              ${
                isTaken
                  ? "bg-red-500 text-white cursor-not-allowed" // Taken seat style
                  : occupiedByPassenger !== undefined
                  ? "bg-green-500 text-white" // Occupied by current passengers
                  : "hover:bg-gray-200 dark:hover:bg-gray-800"
              } 
              ${
                occupiedByPassenger === selectedPassengerIndex
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
            onClick={() => !isTaken && handleSeatClick(seatNumber)}
          >
            {isTaken
              ? "Taken"
              : occupiedByPassenger !== undefined
              ? `P${occupiedByPassenger + 1}`
              : `Seat ${seatNumber}`}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-slate-800 dark:text-slate-100 text-lg font-semibold mb-4">
        Seat Selection
      </h2>
      {renderPassengerButtons()}
      {renderSeatMap()}
      <button onClick={handleSeatSubmit}>Submit</button>
    </div>
  );
};

export default SeatSelection;
