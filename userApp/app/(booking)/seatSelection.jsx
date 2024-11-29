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
            name: passengerData[i].name,
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
            const renderSeatMap = () => (
              <View className="grid grid-cols-5 gap-4 mb-4">
                {Array.from(
                  { length: getTotalSeats?.seating_capacity },
                  (_, index) => {
                    const seatNumber = index + 1;
                    const isTaken = takenSeats.some(
                      (seat) => seat.seat_no === seatNumber
                    );
                    const occupiedByPassenger = selectedSeats[seatNumber];

                    return (
                      <TouchableOpacity
                        key={index}
                        className={`p-4 border rounded-md flex items-center justify-center cursor-pointer
              ${
                isTaken
                  ? "bg-red-500 text-white cursor-not-allowed"
                  : occupiedByPassenger !== undefined
                  ? "bg-green-500 text-white"
                  : "hover:bg-gray-200"
              }`}
                        onPress={() => !isTaken && handleSeatClick(seatNumber)}
                        disabled={isTaken}
                      >
                        <Text className="text-center">
                          {isTaken
                            ? "Taken"
                            : occupiedByPassenger !== undefined
                            ? `P${occupiedByPassenger + 1}`
                            : `Seat ${seatNumber}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>
            );
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


