import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Linking, Modal } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { bookingFun, seatFun } from "../../feature/booking/bookingApi";
import { useRouter } from "expo-router";
import { clearAll } from "../../feature/booking/bookingSlice";
import { WebView } from "react-native-webview";

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
    schedulePrice,
  } = useSelector((state) => state.booking);
  const [totalPrice, setTotalPrice] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(null);

  const openInAppBrowser = () => {
    if (data?.data?.checkout_url) {
      setCheckoutUrl(data.data.checkout_url);
      setModalVisible(true);
    }
  };
  const seatData = seats.map((seat) => ({
    seat_no: seat.seatNo,
  }));

  const bookingData = {
    busId,
    scheduleId,
    passengers: passengerData,
    seats,
    total_price: totalPrice,
  };

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

  const calculatePayment = () => {
    console.log(schedulePrice);
    let totalPayment = schedulePrice;
    let adults = 0;
    let children = 0;
    passengerData.forEach((passenger) => {
      if (passenger.type === "adult") {
        adults++;
      } else if (passenger.type === "child") {
        children++;
      }
    });
    console.log(adults);
    if ((adults === 1 && children === 0) || (adults === 1 && children === 1)) {
      totalPayment = 1 * totalPayment;
    } else if (adults === 1 && children === 2) {
      totalPayment = 2 * totalPayment;
    } else if (adults === 1 && children === 3) {
      totalPayment = 2 * totalPayment;
    } else if (
      (adults === 2 && children === 0) ||
      (adults === 2 && children === 1) ||
      (adults === 2 && children === 2)
    ) {
      totalPayment = 2 * totalPayment;
    } else if (adults === 2 && children === 3) {
      totalPayment = 3 * totalPayment;
    } else if (
      (adults === 3 && children === 0) ||
      (adults === 3 && children === 1) ||
      (adults === 3 && children === 2) ||
      (adults === 3 && children === 3)
    ) {
      totalPayment = 3 * totalPayment;
    } else if (
      (adults === 4 && children === 0) ||
      (adults === 4 && children === 1) ||
      (adults === 4 && children === 2) ||
      (adults === 4 && children === 3)
    ) {
      totalPayment = 4 * totalPayment;
    } else if (
      (adults === 5 && children === 0) ||
      (adults === 5 && children === 1) ||
      (adults === 5 && children === 2)
    ) {
      totalPayment = 5 * totalPayment;
    } else if (
      (adults === 6 && children === 0) ||
      (adults === 6 && children === 1)
    ) {
      totalPayment = 6 * totalPayment;
    } else {
      totalPayment = adults * totalPayment;
    }
    return totalPayment;
  };

  useEffect(() => {
    const newTotal = calculatePayment();
    if (newTotal !== totalPrice) {
      setTotalPrice(newTotal);
    }
  }, [passengerData, schedulePrice]);

  const handleBooking = () => {
    bookMutate(bookingData);
  };

  const [form, setForm] = useState({
    amount: schedulePrice,
    currency: "ETB",
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
      handleBooking();
      const response = await fetch("http://10.10.34.20:8000/accept-payment", {
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
      console.log(data);
      if (data.data && data.data.checkout_url) {
        setCheckoutUrl(data.data.checkout_url);
        setModalVisible(true);
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
      <Modal visible={modalVisible} animationType="slide">
        <View className="flex-1">
          <Button title="Close" onPress={() => setModalVisible(false)} />
          {checkoutUrl && <WebView source={{ uri: checkoutUrl }} />}
        </View>
      </Modal>
      <View className="px-6 py-8 bg-white">
        <Text className="text-lg font-bold mb-2">Amount:</Text>
        <TextInput
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
          placeholder="Amount"
          value={form.amount}
          editable={false}
          onChangeText={(value) => handleInputChange("amount", value)}
        />

        <Text className="text-lg font-bold mb-2">Currency:</Text>
        <TextInput
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
          placeholder="Currency"
          value={form.currency}
          editable={false}
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
