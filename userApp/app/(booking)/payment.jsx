import { View, Text, Button, Alert } from "react-native";
import React from "react";
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

    return (
      <View className="p-4">
        <Text className="text-xl font-semibold text-slate-800 mb-4">
          Payment
        </Text>
        <Text className="mb-4">
          Please review your booking before proceeding.
        </Text>
        <Button title="Book Now" onPress={handleBooking} />
      </View>
    );

};

export default payment;
