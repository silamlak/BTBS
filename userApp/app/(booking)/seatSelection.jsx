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

  // Parse the parameters
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

  const seatsPerRow = 4;
  const lastRowSeats = 5;
  const totalSeats = getTotalSeats?.seating_capacity || 60;
  const rows = Math.ceil((totalSeats - lastRowSeats) / seatsPerRow) + 1;

  const renderPassengerButtons = () => (
    <View className="flex flex-row flex-wrap gap-4 mb-4">
      {passengerData.map((passenger, index) => (
        <TouchableOpacity
          key={index}
          className={`p-2 border rounded-md ${
            selectedPassengerIndex === index
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          }`}
          onPress={() => handlePassengerClick(index)}
        >
          <Text className="text-base">
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
  // Generate the array of custom seat numbers: 2, 6, 10, 14, ...
  const seatNumbers = [];
  for (let i = 2; i <= totalSeats; i += 4) {
    seatNumbers.push(i);
  }

  return (
    <View className="flex flex-col gap-4 mb-4">
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

              // Determine if the seat number is one of the special numbers (2, 6, 10, ...)
              const isSpecialSeat = seatNumbers.includes(seatNumber);

              return (
                <TouchableOpacity
                  key={seatNumber}
                  className={`${
                    isSpecialSeat ? "mr-10" : ""
                  } w-12 h-12 relative rounded-md flex items-center justify-center cursor-pointer
                  ${
                    isTaken
                      ? "bg-red-500 text-white cursor-not-allowed"
                      : occupiedByPassenger !== undefined
                      ? "bg-lime-500 text-white"
                      : "hover:bg-gray-300 bg-gray-300"
                  }`}
                  onPress={() => !isTaken && handleSeatClick(seatNumber)}
                  disabled={isTaken}
                >
                  {!isTaken && occupiedByPassenger == undefined && (
                    <View className="absolute -right-1 bottom-[6px] h-1/2 w-2 rounded-2xl bg-white border"></View>
                  )}
                  {!isTaken && occupiedByPassenger == undefined && (
                    <View className="absolute -left-1 bottom-[6px] h-1/2 w-2 rounded-2xl bg-white border"></View>
                  )}
                  {!isTaken && occupiedByPassenger == undefined && (
                    <View className="absolute bottom-0 h-2 w-full rounded-2xl bg-white border"></View>
                  )}

                  <Text className="text-center">
                    {isTaken
                      ? "Taken"
                      : occupiedByPassenger !== undefined
                      ? `P${occupiedByPassenger + 1}`
                      : isSpecialSeat
                      ? `${seatNumber} `
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
    <ScrollView className="p-4">
      <Text className="text-lg font-semibold text-slate-800 mb-4">
        Seat Selection
      </Text>
      {renderPassengerButtons()}
      {renderSeatMap()}
      <Button title="Submit" onPress={handleSeatSubmit} />
    </ScrollView>
  );
};

export default seatSelection;
