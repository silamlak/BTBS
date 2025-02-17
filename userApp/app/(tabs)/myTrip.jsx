import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
const places = [
  "Addis Ababa",
  "Dire Dawa",
  "Mekelle",
  "Bahir Dar",
  "Hawassa",
  "Adama",
  "Gondar",
  "Jimma",
  "Harar",
  "Dessie",
  "Shashamane",
  "Arba Minch",
  "Debre Markos",
  "Sodo",
  "Nekemte",
  "Hosaena",
];


const MyTrip = () => {
  const [departurePlace, setDeparturePlace] = useState(null);
  const [destinationPlace, setDestinationPlace] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPlaceType, setCurrentPlaceType] = useState(null); // "departure" or "destination"

  const handlePlaceSelect = (place) => {
    if (currentPlaceType === "departure") {
      setDeparturePlace(place);
    } else {
      setDestinationPlace(place);
    }
    setIsModalVisible(false);
  };

  const handleSwapPlaces = () => {
    const temp = departurePlace;
    setDeparturePlace(destinationPlace);
    setDestinationPlace(temp);
  };

  return (
    <View className="flex-1 p-4 bg-gray-100">
      {/* Header */}
      <View className="items-center mb-6">
        <Text className="text-2xl font-semibold">Trip Details</Text>
      </View>

      <View className="flex flex-col w-full items-center justify-between">
        <View className="w-full bg-white">
          <Text className="text-lg -mb-4 ml-2">From</Text>
          <TouchableOpacity
            className="p-4"
            onPress={() => {
              setCurrentPlaceType("departure");
              setIsModalVisible(true);
            }}
          >
            <Text className="text-lg font-semibold text-gray-700">
              {departurePlace ? departurePlace : "Choose Departure Place"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="p-2 rounded-full z-50 -my-2 bg-lime-500"
          onPress={handleSwapPlaces}
        >
          <FontAwesome
            name="exchange"
            size={20}
            color="white"
            style={{ transform: [{ rotate: "90deg" }] }}
          />
        </TouchableOpacity>
        <View className="w-full bg-white">
          <Text className="text-lg -mb-4 ml-2 text-gray-600 text-md">To</Text>
          <TouchableOpacity
            className="p-4"
            onPress={() => {
              setCurrentPlaceType("destination");
              setIsModalVisible(true);
            }}
          >
            <Text className="text-lg font-semibold text-gray-700">
              {destinationPlace ? destinationPlace : "Choose Destination Place"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal with Places */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-4/5 h-3/4">
            <Text className="text-xl font-semibold mb-4">Select a Place</Text>

            {/* FlatList to display places */}
            <FlatList
              data={places}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="p-3 border-b border-gray-300"
                  onPress={() => handlePlaceSelect(item)}
                >
                  <Text className="text-lg text-gray-700">{item}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              className="mt-4 bg-gray-300 p-3 rounded-lg"
              onPress={() => setIsModalVisible(false)}
            >
              <Text className="text-center text-lg text-gray-700">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyTrip;
