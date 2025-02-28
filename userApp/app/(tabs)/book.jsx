import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  Alert,
  TextInput,
  Button,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { usePathname, router, Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import {
  clearAll,
  deletePassengerData,
} from "../../feature/booking/bookingSlice";
import { useColorScheme } from "nativewind";
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
const Book = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPlaceType, setCurrentPlaceType] = useState(null);
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#e4e4e4" : "#111418";
  const pathname = usePathname();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState({ adult: 1, child: 0 });
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const dispatch = useDispatch();

  const totalPassengers = passengers.adult + passengers.child;

  const getMaxChildren = (adultCount) => {
    if (adultCount === 6) return 0;
    if (adultCount === 5) return 1;
    if (adultCount > 3) return 2;
    return 2;
  };

  const handlePassengerIncrement = (type) => {
    if (type === "adult" && passengers.adult < 6) {
      const maxChildren = getMaxChildren(passengers.adult + 1);
      setPassengers((prev) => ({
        adult: prev.adult + 1,
        child: Math.min(prev.child, maxChildren),
      }));
    } else if (type === "child") {
      const maxChildren = getMaxChildren(passengers.adult);
      if (passengers.child < maxChildren && totalPassengers < 6) {
        setPassengers((prev) => ({
          ...prev,
          child: prev.child + 1,
        }));
      }
    }
  };

  const handlePassengerDecrement = (type) => {
    if (type === "adult" && passengers.adult > 1) {
      const maxChildren = getMaxChildren(passengers.adult - 1);
      setPassengers((prev) => ({
        adult: prev.adult - 1,
        child: Math.min(prev.child, maxChildren),
      }));
    } else if (type === "child" && passengers.child > 0) {
      setPassengers((prev) => ({
        ...prev,
        child: prev.child - 1,
      }));
    }
  };

  const handlePlaceSelect = (place) => {
    if (currentPlaceType === "departure") {
      setFrom(place);
    } else {
      setTo(place);
    }
    setIsModalVisible(false);
  };

  const handleSwapPlaces = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSubmit = () => {
    dispatch(clearAll());
    if (!from || !to || !date) {
      Alert.alert("Error", "Please fill all fields before booking.");
      return;
    }

    const query = `from=${from}&to=${to}&date=${date}&adults=${passengers.adult}&children=${passengers.child}`;
    router.push(`/search/${query}`);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={80}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="bg-gray-100 h-full">
            {/* Title */}
            <View className="flex-row bg-white dark:bg-slate-900 items-center justify-between p-4 shadow-slate-900 dark:shadow-slate-100 shadow-xl pb-2">
              <View className="flex-shrink-0 flex items-center text-[#0e141b] dark:text-[#e4e4e4]">
                <Link href="/about">
                  <FontAwesome name="info-circle" size={20} color={iconColor} />
                </Link>
              </View>
              <Text className="text-[#0e141b] dark:text-[#e4e4e4] text-xl font-bold text-center flex-1">
                Habesha Bus
              </Text>
              <View className="w-12 flex items-center justify-end">
                <TouchableOpacity className="flex items-center justify-center w-12 h-12 rounded-full bg-transparent text-[#0e141b] dark:text-[#e4e4e4] p-0">
                  <Link href="/profile">
                    <FontAwesome name="cogs" size={20} color={iconColor} />
                  </Link>
                </TouchableOpacity>
              </View>
            </View>

            <View className="p-4">
              {/* modal inputs  */}
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
                      {from ? from : "Choose Departure Place"}
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
                  <Text className="text-lg -mb-4 ml-2 text-gray-600 text-md">
                    To
                  </Text>
                  <TouchableOpacity
                    className="p-4"
                    onPress={() => {
                      setCurrentPlaceType("destination");
                      setIsModalVisible(true);
                    }}
                  >
                    <Text className="text-lg font-semibold text-gray-700">
                      {to ? to : "Choose Destination Place"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
              >
                <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                  <View className="bg-white p-6 rounded-lg w-4/5 h-3/4">
                    <Text className="text-xl font-semibold mb-4">
                      Select a Place
                    </Text>

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
                      <Text className="text-center text-lg text-gray-700">
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* Date Input */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2">Date</Text>
                <TextInput
                  className="border border-gray-300 p-3 rounded-lg"
                  placeholder="Enter travel date (YYYY-MM-DD)"
                  value={date}
                  onChangeText={setDate}
                />
              </View>

              {/* Passengers Selector */}
              <View className="w-full bg-white">
                <Text className="text-lg -mb-4 ml-2">Passengers</Text>
                <TouchableOpacity
                  className="p-4"
                  onPress={() => setShowPassengerModal(true)}
                >
                  <Text className="text-gray-800 text-lg font-semibold">
                    {`Passengers: ${
                      passengers.adult + passengers.child
                    } (Adults: ${passengers.adult}, Children: ${
                      passengers.child
                    })`}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Passenger Modal */}
              <Modal
                visible={showPassengerModal}
                transparent
                animationType="slide"
              >
                <View className="flex-1 justify-center items-center bg-black/60">
                  <View className="bg-white p-6 rounded-2xl w-4/5 shadow-lg shadow-gray-900">
                    <Text className="text-2xl font-bold text-center mb-6 text-gray-800">
                      Select Passengers
                    </Text>

                    {/* Passenger Picker */}
                    {[
                      { label: "Adults", key: "adult" },
                      { label: "Children (Below 7)", key: "child" },
                    ].map(({ label, key }) => (
                      <View
                        key={key}
                        className="flex-row justify-between items-center mb-6"
                      >
                        <Text className="text-lg text-gray-700">{label}</Text>
                        <View className="flex-row items-center">
                          <TouchableOpacity
                            className="bg-gray-300 py-1 px-4 rounded-lg active:bg-gray-400"
                            onPress={() => handlePassengerDecrement(key)}
                          >
                            <Text className="text-2xl font-bold text-gray-800">
                              -
                            </Text>
                          </TouchableOpacity>
                          <Text className="mx-4 text-lg font-semibold text-gray-900">
                            {passengers[key]}
                          </Text>
                          <TouchableOpacity
                            className="bg-gray-300 py-1 px-4 rounded-lg active:bg-gray-400"
                            onPress={() => handlePassengerIncrement(key)}
                          >
                            <Text className="text-2xl font-bold text-gray-800">
                              +
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}

                    <TouchableOpacity
                      className="bg-lime-500 py-3 rounded-xl mt-4 active:bg-blue-700"
                      onPress={() => setShowPassengerModal(false)}
                    >
                      <Text className="text-center text-white text-lg font-semibold">
                        Confirm
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-lime-500 p-2 mt-6 rounded-lg"
              >
                <Text className="text-center text-2xl text-white font-bold">
                  Book Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Book;
