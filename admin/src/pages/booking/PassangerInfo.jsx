import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setPassengerData,
  setSelectedPassengerIndex,
  updatePassenger,
  setAdults,
  setChildren,
} from "../../features/catagorie/catagorieSlice";

const PassengerInfo = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    adults,
    children,
    passengerData,
    selectedPassengerIndex,
  } = useSelector((state) => state.catagorie);

      const getSearchParams = (query) => {
        return new URLSearchParams(query);
      };

  const searchParams = getSearchParams(location.search);
  const fromPlace = searchParams.get("from");
  const toPlace = searchParams.get("to");
  const travelDate = searchParams.get("date");
  const adult = searchParams.get("adults");
  const childs = searchParams.get("children");

  // Function to extract query parameters from the URL
  const getQueryParams = (search) => {
    const params = new URLSearchParams(search);
    return {
      adults: parseInt(params.get("adults"), 10) || 0,
      children: parseInt(params.get("children"), 10) || 0,
    };
  };

  // Fetch the number of adults and children from the URL
  useEffect(() => {
    const { adults, children } = getQueryParams(location.search);

    dispatch(setAdults(adults));
    dispatch(setChildren(children));

    // Initialize passenger data
    const initialPassengerData = [];
    for (let i = 0; i < adults; i++) {
      initialPassengerData.push({ type: "adult", name: "", age: "" });
    }
    for (let i = 0; i < children; i++) {
      initialPassengerData.push({ type: "child", name: "", age: "" });
    }
    // dispatch(setPassengerData(initialPassengerData));

    // Automatically select the first passenger if there are any
    if (adults + children > 0) {
      dispatch(setSelectedPassengerIndex(0)); // Select first passenger by default
    }
  }, [location.search, dispatch]);

  // Handle input changes for name and age
  const handleInputChange = (index, field, value) => {
    dispatch(updatePassenger({ index, field, value }));
  };

  // Handle passenger selection
  const handlePassengerClick = (index) => {
    dispatch(setSelectedPassengerIndex(index)); // Set the selected passenger index to show the form
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Passenger Info Submitted:", passengerData);
     navigate(
       `/seat?from=${fromPlace}&to=${toPlace}&date=${travelDate}&adults=${adult}&children=${childs}`
     );
  };

  // Function to check if all passenger information is filled
  const allPassengerInfoFilled = () => {
    return passengerData.every((passenger) => passenger.name && passenger.age);
  };

  // If there are no passengers, do not render anything
  if (adults + children === 0) {
    return <div>No passengers to fill information for.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-slate-800 dark:text-slate-100 text-lg font-semibold mb-4">
        Passenger Information
      </h2>

      {/* Only show the passenger buttons if there is more than one passenger */}
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

      {/* Input form for the selected passenger */}
      {selectedPassengerIndex !== null && passengerData.length > 0 && (
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
                required
              />
            </div>
          </div>

          {/* Conditionally render the submit button */}
          {allPassengerInfoFilled() && (
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default PassengerInfo;
