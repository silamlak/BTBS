import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const navigate = useNavigate();
  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [passengers, setPassengers] = useState({
    adult: 1,
    child: 0,
  });
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);

  // Calculate the total number of passengers
  const totalPassengers = passengers.adult + passengers.child;

  // Maximum number of children allowed based on adult count
  const getMaxChildren = (adultCount) => {
    if (adultCount === 6) return 0; // 6 adults, no children allowed
    if (adultCount === 5) return 1; // 5 adults, 1 child allowed
    if (adultCount > 3) return 2; // Above 3 adults, max 2 children
    return 2; // Otherwise, max 3 children
  };

  const handlePassengerChange = (type, value) => {
    const newValue = parseInt(value);
    if (type === "adult") {
      const maxChildren = getMaxChildren(newValue);
      setPassengers((prev) => ({
        adult: newValue,
        child: Math.min(prev.child, maxChildren), // Adjust child count if necessary
      }));
    } else if (type === "child") {
      const maxChildren = getMaxChildren(passengers.adult);
      if (
        newValue <= maxChildren &&
        totalPassengers - passengers.child + newValue <= 6
      ) {
        setPassengers((prev) => ({
          ...prev,
          child: newValue,
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fromPlace && toPlace && travelDate && totalPassengers > 0) {
      // Redirect to the search page with the combined search inputs and date as query parameters
      navigate(
        `/search?from=${fromPlace}&to=${toPlace}&date=${travelDate}&adults=${passengers.adult}&children=${passengers.child}`
      );
    }
  };

  return (
    <div className="p-4">
      <div className="flex w-full items-center justify-between p-2">
        <h2 className="text-slate-800 dark:text-slate-100 text-lg max-sm:text-sm font-semibold">
          Booking
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-4">
        {/* From input */}
        <input
          type="text"
          placeholder="From"
          value={fromPlace}
          onChange={(e) => setFromPlace(e.target.value)}
          className="p-2 border border-gray-300 dark:bg-slate-800 dark:text-white rounded-md"
          required
        />
        {/* To input */}
        <input
          type="text"
          placeholder="To"
          value={toPlace}
          onChange={(e) => setToPlace(e.target.value)}
          className="p-2 border border-gray-300 dark:bg-slate-800 dark:text-white rounded-md"
          required
        />
        {/* Date input */}
        <input
          type="date"
          value={travelDate}
          onChange={(e) => setTravelDate(e.target.value)}
          className="p-2 border border-gray-300 dark:bg-slate-800 dark:text-white rounded-md"
          required
        />
        {/* Number of Passengers input */}
        <div className="relative">
          <button
            type="button"
            className="p-2 border border-gray-300 dark:bg-slate-800 dark:text-white rounded-md w-full text-left"
            onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
          >
            {`Passengers: ${totalPassengers} (Adults: ${passengers.adult}, Children <7: ${passengers.child})`}
          </button>

          {showPassengerDropdown && (
            <div className="absolute bg-white dark:bg-slate-800 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-md mt-2 w-full">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm">Adults</label>
                <input
                  type="number"
                  value={passengers.adult}
                  min="1"
                  max="6"
                  onChange={(e) =>
                    handlePassengerChange("adult", e.target.value)
                  }
                  className="p-2 border border-gray-300 dark:bg-slate-800 dark:text-white rounded-md w-16"
                />
              </div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm">Children (below 7)</label>
                <input
                  type="number"
                  value={passengers.child}
                  min="0"
                  max={getMaxChildren(passengers.adult)}
                  onChange={(e) =>
                    handlePassengerChange("child", e.target.value)
                  }
                  className="p-2 border border-gray-300 dark:bg-slate-800 dark:text-white rounded-md w-16"
                />
              </div>
              <button
                type="button"
                className="mt-4 bg-blue-500 text-white p-2 rounded-md w-full"
                onClick={() => setShowPassengerDropdown(false)}
              >
                Confirm
              </button>
            </div>
          )}
        </div>
        {/* Submit button */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default Booking;
