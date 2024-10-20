import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedSeat,
  setSelectedPassengerIndex,
} from "../../features/catagorie/catagorieSlice";

const SeatSelection = () => {
  const dispatch = useDispatch();
  const { passengerData, selectedPassengerIndex, selectedSeats } = useSelector(
    (state) => state.catagorie
  );

  // Handle seat selection
  const handleSeatClick = (seatNumber) => {
    dispatch(
      setSelectedSeat({ passengerIndex: selectedPassengerIndex, seatNumber })
    );
  };

  // Handle passenger selection
  const handlePassengerClick = (index) => {
    dispatch(setSelectedPassengerIndex(index));
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
      {Array.from({ length: 10 }, (_, index) => {
        const seatNumber = index + 1;
        const occupiedByPassenger = selectedSeats[seatNumber];

        return (
          <div
            key={index}
            className={`p-4 border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 ${
              occupiedByPassenger !== undefined ? "bg-green-500 text-white" : ""
            } ${
              occupiedByPassenger === selectedPassengerIndex
                ? "ring-2 ring-blue-500"
                : ""
            }`}
            onClick={() => handleSeatClick(seatNumber)}
          >
            {occupiedByPassenger !== undefined
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
    </div>
  );
};

export default SeatSelection;
