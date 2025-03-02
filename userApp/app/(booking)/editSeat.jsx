import {
  ActivityIndicator,
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  setSelectedSeat,
  setSelectedPassengerIndex,
  setBusId,
} from "../../feature/booking/bookingSlice";
import {
  getSeatFun,
  totalSeatFun,
  updateBookingSeatFun,
} from "../../feature/booking/bookingApi";
import { useColorScheme } from "nativewind";

const EditSeat = () => {
  const { search } = useLocalSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    adults,
    children,
    passengerData,
    seats,
    selectedPassengerIndex,
    selectedSeats,
    scheduleId,
    busId
  } = useSelector((state) => state.booking);

  const [alreadyUsedSeat, setAlreadyUsedSeat] = useState([]);
  let totalPass = 1;

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

  const mutation = useMutation({
    mutationFn: updateBookingSeatFun,
    onSuccess: (data) => {
      console.log(data);
      router.replace(`/myBookingDetail?id=${search}`);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleSeatSubmit = () => {
    const seatData = [];
    for (let i = 0; i < seats.length; i++) {
      seatData.push({
        seat_no: seats[i].seatNo,
        _id: seats[i]._id,
      });
    }

    const updatedData = seatData.map((s) => {
      return {
        ...s,
        bookId: search,
        scheduleId,
        bus_id: busId,
      };
    });
    mutation.mutate({ id: search, data: updatedData, seats });
  };

  useEffect(() => {
    const commonSeats = takenSeats
      .map((seat1) => seat1.seat_no)
      .filter((seatNo) => seats.map((seat2) => seat2.seatNo).includes(seatNo));

    setAlreadyUsedSeat(commonSeats);
  }, [takenSeats]);

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
              : "bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200"
          }`}
          onPress={() => handlePassengerClick(index)}
        >
          <Text className="text-base font-semibold">
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
            <View
              key={rowIndex}
              className="flex flex-row justify-center gap-4"
            >
              {[...Array(seatCount)].map((_, seatIndex) => {
                const seatNumber = startSeat + seatIndex;
                if (seatNumber > totalSeats) return null;

                const isTaken = takenSeats.some(
                  (seat) => seat.seat_no === seatNumber
                );
                const occupiedByPassenger = selectedSeats[seatNumber];
                const isSpecialSeat = seatNumbers.includes(seatNumber);
                const isMine = alreadyUsedSeat.includes(seatNumber);

                return (
                  <TouchableOpacity
                    key={seatNumber}
                    className={`w-14 h-14 relative rounded-lg flex items-center justify-center shadow-md border ${
                      isMine
                        ? "bg-lime-500 dark:bg-lime-600 border-lime-600 text-white"
                        : isTaken && !isMine
                        ? "bg-red-500 dark:bg-red-600 border-red-600 text-white"
                        : occupiedByPassenger !== undefined
                        ? "bg-green-500 dark:bg-green-600 border-green-600 text-white"
                        : "bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    }`}
                    onPress={() => !isTaken && handleSeatClick(seatNumber)}
                    disabled={isTaken || isMine}
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
      <TouchableOpacity
        className="bg-lime-500 dark:bg-lime-600 p-3 mb-10 rounded-lg shadow-md active:bg-lime-600 dark:active:bg-lime-700"
        onPress={handleSeatSubmit}
        disabled={mutation.isPending}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {mutation.isPending ? "Submitting..." : "Submit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditSeat;
