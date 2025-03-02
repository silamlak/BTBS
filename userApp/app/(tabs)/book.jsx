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
import { useTranslation } from "react-i18next";
import i18next from "../../services/i18next";
const places = [
  "Addis Ababa",
  "Bahir Dar",
  "Gondar",
  "Jimma",
  "Dessie",
  "Arba Minch",
  "Hawassa",
];
import DateTimePicker from "@react-native-community/datetimepicker";
const Book = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPlaceType, setCurrentPlaceType] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#e4e4e4" : "#111418";
  const pathname = usePathname();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(new Date());
  const { t } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18next.language;
    const newLang = currentLang === "en" ? "am" : "en";
    i18next.changeLanguage(newLang);
  };
  const [passengers, setPassengers] = useState({ adult: 1, child: 0 });
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const dispatch = useDispatch();

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  console.log(selectedDate);

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

  const handlePlaceSelect = (selectedPlace) => {
    if (currentPlaceType === "departure" && selectedPlace === to) {
      Alert.alert(
        "Invalid Selection",
        "Departure and Destination cannot be the same."
      );
      return;
    }

    if (currentPlaceType === "destination" && selectedPlace === from) {
      Alert.alert(
        "Invalid Selection",
        "Departure and Destination cannot be the same."
      );
      return;
    }

    if (currentPlaceType === "departure") {
      setFrom(selectedPlace);
    } else {
      setTo(selectedPlace);
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

    // Extract YYYY-MM-DD format from date
    const formattedDate = date.toISOString().split("T")[0];

    const query = `from=${from}&to=${to}&date=${formattedDate}&adults=${passengers.adult}&children=${passengers.child}`;
    router.push(`/search/${query}`);
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={80}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="bg-gray-100 dark:bg-gray-900"
        >
          {/* Header */}
          <View className="flex-row bg-white dark:bg-slate-900 items-center justify-between p-4 shadow-lg shadow-gray-500 dark:shadow-gray-800">
            <TouchableOpacity className="p-2">
              <Link href="/about">
                <FontAwesome name="info-circle" size={24} color={iconColor} />
              </Link>
            </TouchableOpacity>
            <Text className="text-[#0e141b] dark:text-[#e4e4e4] text-2xl font-bold text-center flex-1">
              {t("habeshabus")}
            </Text>
            <TouchableOpacity className="p-2">
              <Link href="/profile">
                <FontAwesome name="cogs" size={24} color={iconColor} />
              </Link>
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View className="p-5">
            {/* From/To Inputs */}
            <View className="flex flex-col items-center space-y-2">
              <View className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
                <Text className="text-lg font-medium text-gray-700 dark:text-gray-300 -mb-2">
                  From
                </Text>
                <TouchableOpacity
                  className="pt-4"
                  onPress={() => {
                    setCurrentPlaceType("departure");
                    setIsModalVisible(true);
                  }}
                >
                  <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                    {from || "Choose Departure Place"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                className="p-3 rounded-full bg-lime-500 dark:bg-lime-600 shadow-md -my-4 z-10 active:bg-lime-600 dark:active:bg-lime-700"
                onPress={handleSwapPlaces}
              >
                <FontAwesome
                  name="exchange"
                  size={22}
                  color="white"
                  style={{ transform: [{ rotate: "90deg" }] }}
                />
              </TouchableOpacity>

              <View className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
                <Text className="text-lg font-medium text-gray-700 dark:text-gray-300 -mb-2">
                  To
                </Text>
                <TouchableOpacity
                  className="pt-4"
                  onPress={() => {
                    setCurrentPlaceType("destination");
                    setIsModalVisible(true);
                  }}
                >
                  <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                    {to || "Choose Destination Place"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Place Selection Modal */}
            <Modal
              visible={isModalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setIsModalVisible(false)}
            >
              <View className="flex-1 justify-center items-center bg-black/60">
                <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-11/12 max-w-md shadow-xl shadow-gray-900 dark:shadow-gray-700 h-3/4">
                  <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-5">
                    Select a Place
                  </Text>
                  <FlatList
                    data={places}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className="p-4 border-b border-gray-200 dark:border-gray-700 active:bg-gray-100 dark:active:bg-gray-700"
                        onPress={() => handlePlaceSelect(item)}
                      >
                        <Text className="text-lg text-gray-700 dark:text-gray-200">
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity
                    className="mt-5 bg-gray-300 dark:bg-gray-700 p-3 rounded-lg shadow-md active:bg-gray-400 dark:active:bg-gray-600"
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text className="text-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Date Picker */}
            <View className="mt-6">
              <Text className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md"
              >
                <Text className="text-lg text-gray-900 dark:text-white">
                  {date.toISOString().split("T")[0]}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  minimumDate={new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>

            {/* Passengers Selector */}
            <View className="mt-6 w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
              <Text className="text-lg font-medium text-gray-700 dark:text-gray-300 -mb-2">
                Passengers
              </Text>
              <TouchableOpacity
                className="pt-4"
                onPress={() => setShowPassengerModal(true)}
              >
                <Text className="text-xl font-semibold text-gray-900 dark:text-white">
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
                <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-11/12 max-w-md shadow-xl shadow-gray-900 dark:shadow-gray-700">
                  <Text className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">
                    Select Passengers
                  </Text>
                  {[
                    { label: "Adults", key: "adult" },
                    { label: "Children (Below 7)", key: "child" },
                  ].map(({ label, key }) => (
                    <View
                      key={key}
                      className="flex-row justify-between items-center mb-6"
                    >
                      <Text className="text-lg font-medium text-gray-700 dark:text-gray-200">
                        {label}
                      </Text>
                      <View className="flex-row items-center space-x-3">
                        <TouchableOpacity
                          className="bg-gray-300 dark:bg-gray-700 py-2 px-4 rounded-full shadow-md active:bg-gray-400 dark:active:bg-gray-600"
                          onPress={() => handlePassengerDecrement(key)}
                        >
                          <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            -
                          </Text>
                        </TouchableOpacity>
                        <Text className="text-xl font-semibold text-gray-900 dark:text-white w-10 text-center">
                          {passengers[key]}
                        </Text>
                        <TouchableOpacity
                          className="bg-gray-300 dark:bg-gray-700 py-2 px-4 rounded-full shadow-md active:bg-gray-400 dark:active:bg-gray-600"
                          onPress={() => handlePassengerIncrement(key)}
                        >
                          <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            +
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                  <TouchableOpacity
                    className="bg-lime-500 dark:bg-lime-600 py-3 rounded-xl shadow-md mt-6 active:bg-lime-600 dark:active:bg-lime-700"
                    onPress={() => setShowPassengerModal(false)}
                  >
                    <Text className="text-center text-lg font-semibold text-white">
                      Confirm
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-lime-500 dark:bg-lime-600 p-4 mt-8 rounded-xl shadow-lg active:bg-lime-600 dark:active:bg-lime-700"
            >
              <Text className="text-center text-2xl font-bold text-white">
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Book;
