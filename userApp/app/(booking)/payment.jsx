import React, { useState } from "react";
import { View, Text, TextInput, Button, Linking } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { bookingFun, seatFun } from "../../feature/booking/bookingApi";
import { useRouter } from "expo-router";
import { clearAll } from "../../feature/booking/bookingSlice";

const payment = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    passengerData,
    selectedPassengerIndex,
    selectedSeats,
    seats,
    busId,
    scheduleId,
  } = useSelector((state) => state.booking);

  const seatData = seats.map((seat) => ({
    seat_no: seat.seatNo,
  }));

  const bookingData = {
    busId,
    scheduleId,
    passengers: passengerData,
    seats,
  };

  console.log(bookingData);

  const { mutate: seatMutate } = useMutation({
    mutationFn: seatFun,
    onSuccess: (data) => {
      dispatch(clearAll());
      router.push("/book"); // Navigate to category after success
    },
  });

  const { mutate: bookMutate } = useMutation({
    mutationFn: bookingFun,
    onSuccess: (data) => {
      const updatedData = seatData.map((s, i) => ({
        ...s,
        bookId: data?.booked?._id,
        scheduleId,
        bus_id: busId,
      }));
      seatMutate(updatedData);
    },
  });

  const handleBooking = () => {
    bookMutate(bookingData);
  };

   const [form, setForm] = useState({
     amount: "",
     currency: "",
     email: "",
     first_name: "",
     last_name: "",
     phone_number: "",
   });

   const tx_ref = `${form.first_name}-${Date.now()}`;

   const handleInputChange = (name, value) => {
     setForm((prevForm) => ({
       ...prevForm,
       [name]: value,
     }));
   };

   const handleSubmit = async () => {

     try {
       const response = await fetch("http://10.10.34.68:8000/accept-payment", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           ...form,
           tx_ref,
         }),
       });

       const data = await response.json();
       console.log(data)
       if (data.data && data.data.checkout_url) {
         Linking.openURL(data.data.checkout_url);
       }

       // Reset form after successful submission
      //  setForm({
      //    amount: "",
      //    currency: "",
      //    email: "",
      //    first_name: "",
      //    last_name: "",
      //    phone_number: "",
      //    tx_ref,
      //  });
     } catch (error) {
       console.log("Error", error);
     }
   };

  return (
    <View className="p-4">
      <View className="px-6 py-8 bg-white">
        <Text className="text-lg font-bold mb-2">Amount:</Text>
        <TextInput
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
          placeholder="Amount"
          value={form.amount}
          onChangeText={(value) => handleInputChange("amount", value)}
        />

        <Text className="text-lg font-bold mb-2">Currency:</Text>
        <TextInput
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
          placeholder="Currency"
          value={form.currency}
          onChangeText={(value) => handleInputChange("currency", value)}
        />

        <Text className="text-lg font-bold mb-2">Email:</Text>
        <TextInput
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
          placeholder="Email"
          value={form.email}
          onChangeText={(value) => handleInputChange("email", value)}
        />

        <Text className="text-lg font-bold mb-2">First Name:</Text>
        <TextInput
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
          placeholder="First Name"
          value={form.first_name}
          onChangeText={(value) => handleInputChange("first_name", value)}
        />

        <Text className="text-lg font-bold mb-2">Last Name:</Text>
        <TextInput
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
          placeholder="Last Name"
          value={form.last_name}
          onChangeText={(value) => handleInputChange("last_name", value)}
        />

        <Text className="text-lg font-bold mb-2">Phone Number:</Text>
        <TextInput
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
          placeholder="Phone Number"
          value={form.phone_number}
          onChangeText={(value) => handleInputChange("phone_number", value)}
        />

        <Button
          title="Submit"
          onPress={handleSubmit}
          color="#4CAF50" // You can use Tailwind color if you customize NativeWind settings for React Native
        />
      </View>
      <Text className="text-xl font-semibold text-slate-800 mb-4">Payment</Text>
      <Text className="mb-4">
        Please review your booking before proceeding.
      </Text>
      {/* <Button title="Book Now" onPress={handleBooking} /> */}
    </View>
  );
};

export default payment;
