import { View, Text, Button, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  setSelectedSeat,
  setSelectedPassengerIndex,
  setSeats,
  setBusId,
} from "../../feature/booking/bookingSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getSeatFun, totalSeatFun } from "../../feature/booking/bookingApi";

const seatSelection = () => {
  const params = useLocalSearchParams();

  const dispatch = useDispatch();
  const router = useRouter();

  const {
    passengerData,
    seats,
    selectedPassengerIndex,
    selectedSeats,
    scheduleId,
  } = useSelector((state) => state.booking);
  const [totalPass, setTotalPass] = useState();

  const query = {
    adults: parseInt(params.adults, 10) || 0,
    children: parseInt(params.children, 10) || 0,
    fromPlace: params.from || "",
    toPlace: params.to || "",
    travelDate: params.date || "",
  };

  useEffect(() => {
    const passengers = query.adults + query.children;
    setTotalPass(passengers);
    if (seats.length === 0) {
      const initialSeats = [];
      for (let i = 0; i < passengers; i++) {
        initialSeats.push({
          name: passengerData[i].firs_name,
          seatId: passengerData[i].id,
          seatNo: i === selectedSeats[i] ? selectedSeats[i] : "",
        });
      }
      dispatch(setSeats(initialSeats));
    }
  }, [dispatch]);

  const { data: getTotalSeats = [] } = useQuery({
    queryKey: ["get_total_seat"],
    queryFn: () => totalSeatFun({ totalPass, scheduleId }),
    enabled: !!totalPass,
  });
  console.log(getTotalSeats);

  useEffect(() => {
    if (getTotalSeats) {
      dispatch(setBusId({ bus_id: getTotalSeats._id }));
    }
  }, [getTotalSeats]);

  const { data: takenSeats = [] } = useQuery({
    queryKey: ["seat"],
    queryFn: () => getSeatFun({ scheduleId, bus_id: getTotalSeats._id }),
    enabled: !!getTotalSeats.seating_capacity,
  });

  const handleSeatClick = (seatNumber) => {
    if (!takenSeats.includes(seatNumber)) {
      dispatch(
        setSelectedSeat({
          passengerIndex: selectedPassengerIndex,
          seatNumber,
        })
      );
    }
  };

  const handlePassengerClick = (index) => {
    dispatch(setSelectedPassengerIndex(index));
  };

  const handleSeatSubmit = () => {
    router.push(
      `/payment?from=${query.fromPlace}&to=${query.toPlace}&date=${query.travelDate}&adults=${query.adults}&children=${query.children}`
    );
  };

  const allPassengerInfoFilled = () => {
    return seats?.length > 0 && seats.every((s) => s.seatNo);
  };

  const seatsPerRow = 4;
  const lastRowSeats = 5;
  const totalSeats = getTotalSeats?.seating_capacity || 60;
  const rows = Math.ceil((totalSeats - lastRowSeats) / seatsPerRow) + 1;

  const renderPassengerButtons = () => (
    <View className="flex flex-row flex-wrap gap-3 mb-6">
      {passengerData.map((passenger, index) => (
        <TouchableOpacity
          key={index}
          className={`px-4 py-2 border rounded-lg shadow-md ${
            selectedPassengerIndex === index
              ? "bg-lime-500 dark:bg-lime-600 border-lime-600 text-white"
              : "bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          }`}
          onPress={() => handlePassengerClick(index)}
        >
          <Text
            className={`text-base font-semibold ${
              selectedPassengerIndex === index
                ? "text-white"
                : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {passenger.type === "adult"
              ? `Adult ${index + 1}`
              : `Child ${index + 1}`}
            {selectedPassengerIndex === index && ` (Selected)`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSeatMap = () => {
    const seatNumbers = [];
    for (let i = 2; i <= totalSeats; i += 4) {
      seatNumbers.push(i);
    }

    return (
      <View className="flex flex-col gap-6 mb-6">
        {Array.from({ length: rows }).map((_, rowIndex) => {
          const isLastRow = rowIndex === rows - 1;
          const seatCount = isLastRow ? lastRowSeats : seatsPerRow;
          const startSeat = isLastRow
            ? totalSeats - lastRowSeats + 1
            : rowIndex * seatsPerRow + 1;

          return (
            <View key={rowIndex} className="flex flex-row justify-center gap-4">
              {[...Array(seatCount)].map((_, seatIndex) => {
                const seatNumber = startSeat + seatIndex;
                if (seatNumber > totalSeats) return null;

                const isTaken = takenSeats.some(
                  (seat) => seat.seat_no === seatNumber
                );
                const occupiedByPassenger = selectedSeats[seatNumber];
                const isSpecialSeat = seatNumbers.includes(seatNumber);

                return (
                  <TouchableOpacity
                    key={seatNumber}
                    className={`w-14 h-14 relative rounded-lg flex items-center justify-center shadow-md border ${
                      isTaken
                        ? "bg-red-500 dark:bg-red-600 border-red-600 text-white"
                        : occupiedByPassenger !== undefined
                        ? "bg-lime-500 dark:bg-lime-600 border-lime-600 text-white"
                        : "bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    }`}
                    onPress={() => !isTaken && handleSeatClick(seatNumber)}
                    disabled={isTaken}
                  >
                    {!isTaken && occupiedByPassenger == undefined && (
                      <View className="absolute -right-1 bottom-[6px] h-1/2 w-2 rounded-2xl bg-white dark:bg-gray-300 border border-gray-300 dark:border-gray-700" />
                    )}
                    {!isTaken && occupiedByPassenger == undefined && (
                      <View className="absolute -left-1 bottom-[6px] h-1/2 w-2 rounded-2xl bg-white dark:bg-gray-300 border border-gray-300 dark:border-gray-700" />
                    )}
                    {!isTaken && occupiedByPassenger == undefined && (
                      <View className="absolute bottom-0 h-2 w-full rounded-b-lg bg-white dark:bg-gray-300 border-t border-gray-300 dark:border-gray-700" />
                    )}
                    <Text className="text-center text-sm font-medium text-gray-800 dark:text-gray-200">
                      {isTaken
                        ? "Taken"
                        : occupiedByPassenger !== undefined
                        ? `P${occupiedByPassenger + 1}`
                        : isSpecialSeat
                        ? `${seatNumber}`
                        : `${seatNumber}`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-900 p-4">
      <Text className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
        Seat Selection
      </Text>
      {renderPassengerButtons()}
      {renderSeatMap()}
      {allPassengerInfoFilled && (
        <TouchableOpacity
          className="bg-lime-500 dark:bg-lime-600 p-3 mb-10 rounded-lg shadow-md active:bg-lime-600 dark:active:bg-lime-700"
          onPress={handleSeatSubmit}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Submit
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default seatSelection;
