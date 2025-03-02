import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Linking,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";

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
  const [isGood, setIsGood] = useState(false);

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

  const handleChapa = async () => {
    try {
      const response = await fetch("http://10.10.34.17:8000/accept-payment", {
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
        Linking.openURL(data.data.checkout_url);
        dispatch(clearAll());
        router.push("/book");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const { mutate: seatMutate, isPending } = useMutation({
    mutationFn: seatFun,
    onSuccess: (data) => {
      handleChapa();
    },
  });

  const { mutate: bookMutate, isPending: isP } = useMutation({
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
    bookMutate(bookingData);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-900 p-4">
      {/* Form Card */}
      <View className="px-6 py-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md shadow-gray-300 dark:shadow-gray-700 mb-6">
        <Text className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Payment Details
        </Text>

        {/* Email */}
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm mb-4"
          placeholder="Email"
          value={form.email}
          onChangeText={(value) => handleInputChange("email", value)}
          keyboardType="email-address"
        />

        {/* First Name */}
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          First Name
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm mb-4"
          placeholder="First Name"
          value={form.first_name}
          onChangeText={(value) => handleInputChange("first_name", value)}
        />

        {/* Last Name */}
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Last Name
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm mb-4"
          placeholder="Last Name"
          value={form.last_name}
          onChangeText={(value) => handleInputChange("last_name", value)}
        />

        {/* Phone Number */}
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Phone Number
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm mb-6"
          placeholder="Phone Number"
          value={form.phone_number}
          onChangeText={(value) => handleInputChange("phone_number", value)}
          keyboardType="phone-pad"
        />

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-lime-500 dark:bg-lime-600 p-3 rounded-lg shadow-md active:bg-lime-600 dark:active:bg-lime-700"
          onPress={handleSubmit}
          disabled={isPending || isP}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {isPending || isP ? "Wait..." : "Pay With Chapa"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default payment;
