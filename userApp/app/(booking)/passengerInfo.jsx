import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import {
  setPassengerData,
  setSelectedPassengerIndex,
  updatePassenger,
  setAdults,
  setChildren,
  deletePassengerData,
} from "../../feature/booking/bookingSlice";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const PassengerInfo = () => {
  // Use `useLocalSearchParams` to get query parameters
  const params = useLocalSearchParams();
  const router = useRouter();
  const { search } = router;
  const { adults, children, passengerData, selectedPassengerIndex } =
    useSelector((state) => state.booking);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Function to generate OTP
  const generateOTP = () => {
    const otpLength = 6;
    const newOtp = Array.from({ length: otpLength }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    return newOtp;
  };

  // Parse the parameters
  const query = {
    adults: parseInt(params.adults, 10) || 0,
    children: parseInt(params.children, 10) || 0,
    fromPlace: params.from || "",
    toPlace: params.to || "",
    travelDate: params.date || "",
  };

  useEffect(() => {
    if (
      query.adults !== passengerData.filter((p) => p.type === "adult").length
    ) {
      dispatch(setAdults(query.adults));
    }
    if (
      query.children !== passengerData.filter((p) => p.type === "child").length
    ) {
      dispatch(setChildren(query.children));
    }

    // Initialize passenger data if empty
    if (passengerData.length === 0) {
      const initialPassengerData = [];
      for (let i = 0; i < query.adults; i++) {
        const code = generateOTP();
        initialPassengerData.push({
          type: "adult",
          first_name: "",
          last_name: "",
          gender: "",
          email: "",
          phone: "",
          seat: "",
          id: code,
        });
      }
      for (let i = 0; i < query.children; i++) {
        const code = generateOTP();
        initialPassengerData.push({
          type: "child",
          first_name: "",
          last_name: "",
          gender: "",
          seat: "",
          id: code,
        });
      }
      dispatch(setPassengerData(initialPassengerData));
    }

    // Set the default selected passenger
    if (query.adults + query.children > 0 && selectedPassengerIndex === null) {
      dispatch(setSelectedPassengerIndex(0));
    }
  }, [search, dispatch, passengerData, selectedPassengerIndex]);

  const handleInputChange = (index, field, value) => {
    dispatch(updatePassenger({ index, field, value }));
  };

  const handlePassengerClick = (index) => {
    if (index >= 0 && index < passengerData.length) {
      dispatch(setSelectedPassengerIndex(index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // console.log("Passenger Info Submitted:", passengerData);
    router.push(
      `/seatSelection?from=${query.fromPlace}&to=${query.toPlace}&date=${query.travelDate}&adults=${query.adults}&children=${query.children}`
    );

    setLoading(false);
  };

  // Check if all passenger information is filled
  const allPassengerInfoFilled = () => {
    return (
      passengerData?.length > 0 &&
      passengerData.every((p) => p.first_name && p.last_name && p.gender)
    );
  };

  if (query.adults + query.children === 0) {
    return <Text>No passengers to fill information for.</Text>;
  }

  return (
    <View className="">
      <View className="flex justify-center gap-4 p-4 items-end flex-row mb-4 bg-white shadow shadow-black">
        <FontAwesome name="bus" size={24} color="lime" />
        <Text className="text-xl font-semibold mt-2">Passenger Info</Text>
      </View>
      <View className="p-4">
        {adults + children > 1 && (
          <ScrollView horizontal className="flex-row flex-wrap gap-3 pb-2">
            {passengerData.map((passenger, index) => (
              <TouchableOpacity
                key={index}
                className={`px-4 py-2 rounded-lg ${
                  selectedPassengerIndex === index
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }`}
                onPress={() => handlePassengerClick(index)}
              >
                <Text className={`text-white font-semibold`}>
                  {passenger.type === "adult"
                    ? "Adult Passenger"
                    : "Child Passenger"}{" "}
                  {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {selectedPassengerIndex !== null &&
          selectedPassengerIndex >= 0 &&
          selectedPassengerIndex < passengerData.length && (
            <View className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
              <Text className="text-xl font-semibold mb-3">
                {passengerData[selectedPassengerIndex].type === "adult"
                  ? `Adult Passenger ${selectedPassengerIndex + 1}`
                  : `Child Passenger ${selectedPassengerIndex + 1}`}
              </Text>
              <Text className="text-lg font-semibold mb-2">First Name</Text>
              <TextInput
                className="border border-gray-300 p-2 mb-3 rounded"
                placeholder="First Name"
                value={passengerData[selectedPassengerIndex].first_name}
                onChangeText={(value) =>
                  handleInputChange(selectedPassengerIndex, "first_name", value)
                }
              />
              <Text className="text-lg font-semibold mb-2">Last Name</Text>
              <TextInput
                className="border border-gray-300 p-2 mb-3 rounded"
                placeholder="Last Name"
                value={passengerData[selectedPassengerIndex].last_name}
                onChangeText={(value) =>
                  handleInputChange(selectedPassengerIndex, "last_name", value)
                }
              />

              <Text className="text-lg font-semibold mb-2">Gender</Text>
              <View className="flex flex-row gap-4 mb-3">
                {["Male", "Female"].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    className={`flex-row items-center px-4 py-2 border rounded-lg ${
                      passengerData[selectedPassengerIndex].gender === gender
                        ? "border-blue-500 bg-blue-100"
                        : "border-gray-300"
                    }`}
                    onPress={() =>
                      handleInputChange(
                        selectedPassengerIndex,
                        "gender",
                        gender
                      )
                    }
                  >
                    <View
                      className={`w-5 h-5 rounded-full border ${
                        passengerData[selectedPassengerIndex].gender === gender
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-400"
                      } mr-2`}
                    />
                    <Text className="text-gray-700">{gender}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {passengerData[selectedPassengerIndex].type === "adult" && (
                <View>
                  <Text className="text-lg font-semibold mb-2">Phone</Text>
                  <TextInput
                    className="border border-gray-300 p-2 mb-3 rounded"
                    placeholder="Phone"
                    keyboardType="numeric"
                    value={passengerData[selectedPassengerIndex].phone}
                    onChangeText={(value) =>
                      handleInputChange(selectedPassengerIndex, "phone", value)
                    }
                  />
                </View>
              )}

              {passengerData[selectedPassengerIndex].type === "adult" && (
                <View>
                  <Text className="text-lg font-semibold mb-2">Email</Text>
                  <TextInput
                    className="border border-gray-300 p-2 mb-3 rounded"
                    placeholder="email"
                    keyboardType="email"
                    value={passengerData[selectedPassengerIndex].email}
                    onChangeText={(value) =>
                      handleInputChange(selectedPassengerIndex, "email", value)
                    }
                  />
                </View>
              )}

              {allPassengerInfoFilled() && (
                <Button
                  className="bg-lime-500"
                  title={loading ? "Submitting..." : "Submit"}
                  onPress={handleSubmit}
                  disabled={loading}
                />
              )}
            </View>
          )}
      </View>
    </View>
  );
};

export default PassengerInfo;
