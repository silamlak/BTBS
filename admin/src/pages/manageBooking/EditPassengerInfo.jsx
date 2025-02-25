import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setPassengerData,
  setSelectedPassengerIndex,
  updatePassenger,
  setAdults,
  setChildren,
  clearAll,
} from "../../features/book/bookSlice";
import { motion } from "framer-motion";
import { User, Mail, Phone } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { updateBookingPassengerFun } from "../../features/booking/bookingApi";

const EditPassengerInfo = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const search = params.get("search");
  const { adults, children, passengerData, selectedPassengerIndex } =
    useSelector((state) => state.book);

  useEffect(() => {
    if (!passengerData) {
      navigate("/booking");
    }
  }, [navigate, passengerData]);

  console.log(passengerData, selectedPassengerIndex);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let adults, children;

    if (adults !== passengerData.filter((p) => p.type === "adult").length) {
      dispatch(setAdults(adults));
    }
    if (children !== passengerData.filter((p) => p.type === "child").length) {
      dispatch(setChildren(children));
    }

    if (adults + children > 0 && selectedPassengerIndex === null) {
      dispatch(setSelectedPassengerIndex(0));
    }
  }, [location.search, dispatch, passengerData, selectedPassengerIndex]);

  const handleInputChange = (index, field, value) => {
    dispatch(updatePassenger({ index, field, value }));
  };

  const handlePassengerClick = (index) => {
    if (index >= 0 && index < passengerData.length) {
      dispatch(setSelectedPassengerIndex(index));
    }
  };

  const mutation = useMutation({
    mutationFn: updateBookingPassengerFun,
    onSuccess: (data) => {
      console.log(data);
      navigate(-1, {replace: true})
      dispatch(clearAll());
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(search, passengerData)
    mutation.mutate({ id: search, data: passengerData });
  };

  const allPassengerInfoFilled = () => {
    return (
      passengerData?.length > 0 &&
      passengerData.every(
        (p) =>
          p.first_name &&
          p.last_name &&
          p.gender &&
          (p.type === "adult" ? p.email && p.phone : true)
      )
    );
  };
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-lg mx-auto mt-10">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
        Passenger Information
      </h2>

      {adults + children > 1 && (
        <div className="flex flex-wrap gap-4">
          {passengerData.map((passenger, index) => (
            <button
              key={index}
              className={`p-2 border rounded-md transition-colors ${
                selectedPassengerIndex === index
                  ? "bg-lime-500 text-white"
                  : "bg-gray-300 dark:bg-gray-700 dark:text-white"
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
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-4 mt-4"
          >
            <div className="border dark:border-gray-700 p-4 rounded-md shadow-md">
              <h3 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                <User size={20} />
                {passengerData[selectedPassengerIndex].type === "adult"
                  ? `Adult ${selectedPassengerIndex + 1}`
                  : `Child ${selectedPassengerIndex + 1}`}
              </h3>

              {/* First Name */}
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                  First Name
                </label>
                <div className="flex items-center gap-2 border dark:border-gray-700 p-2 rounded-md">
                  <User size={20} />
                  <input
                    type="text"
                    value={passengerData[selectedPassengerIndex].first_name}
                    onChange={(e) =>
                      handleInputChange(
                        selectedPassengerIndex,
                        "first_name",
                        e.target.value
                      )
                    }
                    className="w-full autofill:bg-black dark:autofill:bg-gray-700 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                  Last Name
                </label>
                <div className="flex items-center gap-2 border dark:border-gray-700 p-2 rounded-md">
                  <User size={20} />
                  <input
                    type="text"
                    value={passengerData[selectedPassengerIndex].last_name}
                    onChange={(e) =>
                      handleInputChange(
                        selectedPassengerIndex,
                        "last_name",
                        e.target.value
                      )
                    }
                    className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Email (Only for Adults) */}
              {passengerData[selectedPassengerIndex].type === "adult" && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                    Email
                  </label>
                  <div className="flex items-center gap-2 border dark:border-gray-700 p-2 rounded-md">
                    <Mail size={20} />
                    <input
                      type="email"
                      value={passengerData[selectedPassengerIndex].email}
                      onChange={(e) =>
                        handleInputChange(
                          selectedPassengerIndex,
                          "email",
                          e.target.value
                        )
                      }
                      className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Phone Number (Only for Adults) */}
              {passengerData[selectedPassengerIndex].type === "adult" && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2 border dark:border-gray-700 p-2 rounded-md">
                    <Phone size={20} />
                    <input
                      type="tel"
                      value={passengerData[selectedPassengerIndex].phone}
                      onChange={(e) =>
                        handleInputChange(
                          selectedPassengerIndex,
                          "phone",
                          e.target.value
                        )
                      }
                      className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Gender */}
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                  Gender
                </label>
                <div className="flex items-center gap-2 border dark:border-gray-700 p-2 rounded-md">
                  <User size={20} />
                  <select
                    value={passengerData[selectedPassengerIndex].gender}
                    onChange={(e) =>
                      handleInputChange(
                        selectedPassengerIndex,
                        "gender",
                        e.target.value
                      )
                    }
                    className="w-full bg-transparent outline-none dark:bg-gray-900 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            {allPassengerInfoFilled() && (
              <button
                type="submit"
                className="bg-lime-500 hover:bg-lime-600 text-white p-2 rounded-md transition-all"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Submitting..." : "Submit"}
              </button>
            )}
          </motion.form>
        )}
    </div>
  );
};

export default EditPassengerInfo;
