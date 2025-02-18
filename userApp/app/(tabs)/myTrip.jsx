import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";

const MyTrip = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const totalSeats = 60;
  const seatsPerRow = 4;
  const lastRowSeats = 5;
  const rows = Math.ceil((totalSeats - lastRowSeats) / seatsPerRow) + 1;
  const spaceAfterSeats = [
    2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 58,
  ];

  const toggleSeat = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((seat) => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerStyle={{ alignItems: "center", padding: 16 }}
    >
      <Text className="text-lg font-bold mb-4">Select Your Seat</Text>
      <View className="flex flex-col gap-2">
        {[...Array(rows)].map((_, rowIndex) => {
          let isLastRow = rowIndex === rows - 1;
          let seatCount = isLastRow ? lastRowSeats : seatsPerRow;
          let startSeat = isLastRow
            ? totalSeats - lastRowSeats + 1
            : rowIndex * seatsPerRow + 1;

          return (
            <View key={rowIndex} className="flex flex-row gap-4">
              {[...Array(seatCount)].map((_, seatIndex) => {
                let seatNumber = startSeat + seatIndex;
                if (seatNumber > totalSeats) return null;

                let isSelected = selectedSeats.includes(seatNumber);

                return (
                  <>
                    <TouchableOpacity
                      key={seatNumber}
                      className={`w-12 h-12 rounded-md flex items-center justify-center ${
                        isSelected ? "bg-green-500" : "bg-gray-300"
                      }`}
                      onPress={() => toggleSeat(seatNumber)}
                    >
                      <Text className="text-white font-bold">{seatNumber}</Text>
                    </TouchableOpacity>
                    {!isLastRow && spaceAfterSeats.includes(seatNumber) && (
                      <View className="w-12" />
                    )}
                  </>
                );
              })}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default MyTrip;
