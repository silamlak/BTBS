import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { clearAll } from "../../features/book/bookSlice";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

const Booking = () => {
  const dispatch = useDispatch();
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const locations = [
    "Addis Ababa",
    "Dire Dawa",
    "Mekelle",
    "Bahir Dar",
    "Hawassa",
    "Adama",
    "Gondar",
    "Jimma",
    "Harar",
    "Dessie",
    "Shashamane",
    "Arba Minch",
    "Debre Markos",
    "Sodo",
    "Nekemte",
    "Hosaena",
  ];
  const navigate = useNavigate();
  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [passengers, setPassengers] = useState({
    adult: 1,
    child: 0,
  });
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);


  const totalPassengers = passengers.adult + passengers.child;

  // Maximum number of children allowed based on adult count
  const getMaxChildren = (adultCount) => {
    if (adultCount === 6) return 1; // 6 adults, no children allowed
    if (adultCount === 5) return 2; // 5 adults, 1 child allowed
    // if (adultCount > 4) return 3;
    return 3; // Otherwise, max 3 children
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
    dispatch(clearAll());
    if (fromPlace && toPlace && travelDate && totalPassengers > 0) {
      // Redirect to the search page with the combined search inputs and date as query parameters
      navigate(
        `/search?from=${fromPlace}&to=${toPlace}&date=${travelDate}&adults=${passengers.adult}&children=${passengers.child}`
      );
    }
  };
  const swapPlaces = () => {
    setFromPlace(toPlace);
    setToPlace(fromPlace);
  };
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-lg mx-auto mt-10">
      <h2 className="text-gray-900 dark:text-white text-xl font-semibold mb-4 text-center">
        Book Your Trip
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
        {/* From input */}
        <div className="relative">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg w-full flex justify-between items-center"
              onClick={() => setShowFromDropdown(!showFromDropdown)}
            >
              {fromPlace || "From"}
              {showFromDropdown ? <ChevronUp /> : <ChevronDown />}
            </button>
            <button
              type="button"
              onClick={swapPlaces}
              className="p-2 bg-gray-300 dark:bg-gray-700 rounded-lg"
            >
              <RefreshCw size={20} />
            </button>
          </div>
          {showFromDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg mt-2 w-full"
            >
              {locations.map((location) => (
                <div
                  key={location}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer rounded-md"
                  onClick={() => {
                    if (location !== toPlace) {
                      setFromPlace(location);
                      setShowFromDropdown(false);
                    }
                  }}
                >
                  {location}
                </div>
              ))}
            </motion.div>
          )}
        </div>
        {/* To input */}
        <div className="relative">
          <button
            type="button"
            className="p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg w-full flex justify-between items-center"
            onClick={() => setShowToDropdown(!showToDropdown)}
          >
            {toPlace || "To"}
            {showToDropdown ? <ChevronUp /> : <ChevronDown />}
          </button>
          {showToDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg mt-2 w-full"
            >
              {locations.map((location) => (
                <div
                  key={location}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer rounded-md"
                  onClick={() => {
                    if (location !== fromPlace) {
                      setToPlace(location);
                      setShowToDropdown(false);
                    }
                  }}
                >
                  {location}
                </div>
              ))}
            </motion.div>
          )}
        </div>
        {/* Date input */}
        <input
          type="date"
          value={travelDate}
          onChange={(e) => setTravelDate(e.target.value)}
          className="p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {/* Passengers dropdown */}
        <div className="relative">
          <button
            type="button"
            className="p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg w-full flex justify-between items-center"
            onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
          >
            {`Passengers: ${totalPassengers} (Adults: ${passengers.adult}, Children: ${passengers.child})`}
            {showPassengerDropdown ? <ChevronUp /> : <ChevronDown />}
          </button>
          {showPassengerDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg mt-2 w-full"
            >
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm dark:text-white">Adults</label>
                <input
                  type="number"
                  value={passengers.adult}
                  min="1"
                  max="6"
                  onChange={(e) =>
                    handlePassengerChange("adult", e.target.value)
                  }
                  className="p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg w-16"
                />
              </div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm dark:text-white">Children</label>
                <input
                  type="number"
                  value={passengers.child}
                  min="0"
                  max="4"
                  onChange={(e) =>
                    handlePassengerChange("child", e.target.value)
                  }
                  className="p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg w-16"
                />
              </div>
              <button
                type="button"
                className="mt-4 bg-blue-600 text-white p-2 rounded-lg w-full hover:bg-blue-700"
                onClick={() => setShowPassengerDropdown(false)}
              >
                Confirm
              </button>
            </motion.div>
          )}
        </div>
        {/* Submit button */}
        <button
          type="submit"
          className="bg-lime-500 hover:bg-lime-600 transition text-white p-3 rounded-lg"
        >
          Search Buses
        </button>
      </form>
    </div>
  );
};

export default Booking;
