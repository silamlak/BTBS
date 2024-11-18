import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setPassengerData,
  setSelectedPassengerIndex,
  updatePassenger,
  setAdults,
  setChildren,
  clearAll,
} from "../../features/catagorie/catagorieSlice";

const PassengerInfo = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const generateOTP = () => {
    const otpLength = 6; // Change this to generate OTPs of different lengths
    const newOtp = Array.from(
      { length: otpLength },
      () => Math.floor(Math.random() * 10) // Random digit between 0-9
    ).join("");
    return newOtp
  };
  const { adults, children, passengerData, selectedPassengerIndex } =
    useSelector((state) => state.catagorie);
  console.log(adults, children, passengerData, selectedPassengerIndex);

  const [loading, setLoading] = useState(false);

  // Function to parse query parameters
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

  // Fetch and set initial data
  // dispatch(clearAll());
  useEffect(() => {
    const { adults, children } = getQueryParams(location.search);

    if (adults !== passengerData.filter((p) => p.type === "adult").length) {
      dispatch(setAdults(adults));
    }
    if (children !== passengerData.filter((p) => p.type === "child").length) {
      dispatch(setChildren(children));
    }

    // Initialize passenger data only if not already set
    if (passengerData.length === 0) {
      const initialPassengerData = [];
      for (let i = 0; i < adults; i++) {
        const code = generateOTP();
        initialPassengerData.push({
          type: "adult",
          name: "",
          age: "",
          seat: '',
          id: code,
        });
      }
      for (let i = 0; i < children; i++) {
        const codes = generateOTP();

        initialPassengerData.push({
          type: "child",
          name: "",
          age: "",
          seat: "",
          id: codes,
        });
      }
      dispatch(setPassengerData(initialPassengerData));
    }

    // Set default selected passenger
    if (adults + children > 0 && selectedPassengerIndex === null) {
      dispatch(setSelectedPassengerIndex(0));
    }
  }, [location.search, dispatch, passengerData, selectedPassengerIndex]);

  // Handle input changes
  const handleInputChange = (index, field, value) => {
    dispatch(updatePassenger({ index, field, value }));
  };

  // Handle passenger selection
  const handlePassengerClick = (index) => {
    if (index >= 0 && index < passengerData.length) {
      dispatch(setSelectedPassengerIndex(index));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const { fromPlace, toPlace, travelDate } = getQueryParams(location.search);

    console.log("Passenger Info Submitted:", passengerData);
    navigate(
      `/seat?from=${fromPlace}&to=${toPlace}&date=${travelDate}&adults=${adults}&children=${children}`
    );

    setLoading(false);
  };

  // Check if all passenger information is filled
  const allPassengerInfoFilled = () => {
    return (
      passengerData?.length > 0 && passengerData.every((p) => p.name && p.age)
    );
  };

  if (adults + children === 0) {
    return <div>No passengers to fill information for.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-slate-800 dark:text-slate-100 text-lg font-semibold mb-4">
        Passenger Information
      </h2>

      {adults + children > 1 && (
        <div className="flex flex-wrap gap-4">
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
            </button>
          ))}
        </div>
      )}

      {selectedPassengerIndex !== null &&
        selectedPassengerIndex >= 0 &&
        selectedPassengerIndex < passengerData.length && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="border p-4 rounded-md shadow-md">
              <h3 className="font-semibold">
                {passengerData[selectedPassengerIndex].type === "adult"
                  ? `Adult ${selectedPassengerIndex + 1}`
                  : `Child ${selectedPassengerIndex + 1}`}
              </h3>
              <div className="mt-2">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={passengerData[selectedPassengerIndex].name}
                  onChange={(e) =>
                    handleInputChange(
                      selectedPassengerIndex,
                      "name",
                      e.target.value
                    )
                  }
                  className="p-2 border border-gray-300 dark:bg-slate-800 dark:text-white rounded-md w-full"
                  required
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium">Age</label>
                <input
                  type="number"
                  value={passengerData[selectedPassengerIndex].age}
                  onChange={(e) =>
                    handleInputChange(
                      selectedPassengerIndex,
                      "age",
                      e.target.value
                    )
                  }
                  className="p-2 border border-gray-300 dark:bg-slate-800 dark:text-white rounded-md w-full"
                  min="0"
                  max="120"
                  required
                />
              </div>
            </div>

            {allPassengerInfoFilled() && (
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            )}
          </form>
        )}
    </div>
  );
};

export default PassengerInfo;
