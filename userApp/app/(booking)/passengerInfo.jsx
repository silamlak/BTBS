import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import {
  setPassengerData,
  setSelectedPassengerIndex,
  updatePassenger,
  setAdults,
  setChildren,
} from "../../feature/booking/bookingSlice";

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
          name: "",
          age: "",
          seat: "",
          id: code,
        });
      }
      for (let i = 0; i < query.children; i++) {
        const code = generateOTP();
        initialPassengerData.push({
          type: "child",
          name: "",
          age: "",
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
      passengerData?.length > 0 && passengerData.every((p) => p.name && p.age)
    );
  };

  if (query.adults + query.children === 0) {
    return <Text>No passengers to fill information for.</Text>;
  }

  return (
    <ScrollView className="p-4 bg-white">
      <Text className="text-lg font-semibold text-slate-800 mb-4">
        Passenger Information
      </Text>

      {adults + children > 1 && (
        <View className="flex flex-wrap gap-4">
          {passengerData.map((passenger, index) => (
            <Button
              key={index}
              title={`${passenger.type === "adult" ? "Adult" : "Child"} ${
                index + 1
              }`}
              onPress={() => handlePassengerClick(index)}
              color={selectedPassengerIndex === index ? "blue" : "gray"}
            />
          ))}
        </View>
      )}

      {selectedPassengerIndex !== null &&
        selectedPassengerIndex >= 0 &&
        selectedPassengerIndex < passengerData.length && (
          <View className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
            <Text className="text-xl font-semibold mb-3">
              {passengerData[selectedPassengerIndex].type === "adult"
                ? `Adult ${selectedPassengerIndex + 1}`
                : `Child ${selectedPassengerIndex + 1}`}
            </Text>

            <TextInput
              style={{
                borderColor: "#ccc",
                borderWidth: 1,
                padding: 10,
                marginBottom: 12,
                borderRadius: 6,
              }}
              placeholder="Name"
              value={passengerData[selectedPassengerIndex].name}
              onChangeText={(value) =>
                handleInputChange(selectedPassengerIndex, "name", value)
              }
            />

            <TextInput
              style={{
                borderColor: "#ccc",
                borderWidth: 1,
                padding: 10,
                marginBottom: 12,
                borderRadius: 6,
              }}
              placeholder="Age"
              value={passengerData[selectedPassengerIndex].age}
              onChangeText={(value) =>
                handleInputChange(selectedPassengerIndex, "age", value)
              }
              keyboardType="numeric"
            />

            {allPassengerInfoFilled() && (
              <Button
                title={loading ? "Submitting..." : "Submit"}
                onPress={handleSubmit}
                disabled={loading}
              />
            )}
          </View>
        )}
    </ScrollView>
  );
};

export default PassengerInfo;
