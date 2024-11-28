import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { router, usePathname } from "expo-router";
const Book = () => {
  const pathname = usePathname();
  //  const [query, setQuery] = useState(initialQuery || "");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengerNo, setPassengerNo] = useState("1");

  const navigation = useNavigation();

  const handleSubmit = () => {
    // if (!from || !to || !date) {
    //   Alert.alert("Error", "Please fill all fields before submitting.");
    //   return;
    // }

    // Construct query parameters
    const query = `from=${from}&to=${to}&date=${date}&passengers=${passengerNo}`;
    if (pathname.startsWith("/search")) router.setParams({ query });
    router.push(
      `/search/from=${from}&to=${to}&date=${date}&passengers=${passengerNo}`
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="p-4 bg-white h-full">
            {/* Title */}
            <Text className="text-xl font-bold text-center mb-4">
              Book Your Trip
            </Text>

            {/* From Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2">From</Text>
              <TextInput
                className="border border-gray-300 p-3 rounded-lg"
                placeholder="Enter departure location"
                value={from}
                onChangeText={(text) => setFrom(text)}
              />
            </View>

            {/* To Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2">To</Text>
              <TextInput
                className="border border-gray-300 p-3 rounded-lg"
                placeholder="Enter destination location"
                value={to}
                onChangeText={(text) => setTo(text)}
              />
            </View>

            {/* Date Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2">Date</Text>
              <TextInput
                className="border border-gray-300 p-3 rounded-lg"
                placeholder="Enter travel date (YYYY-MM-DD)"
                value={date}
                onChangeText={(text) => setDate(text)}
              />
            </View>

            {/* Passenger Picker */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2">Number of Passengers</Text>
              <View className="border border-gray-300 rounded-lg">
                <Picker
                  selectedValue={passengerNo}
                  onValueChange={(itemValue) => setPassengerNo(itemValue)}
                >
                  <Picker.Item label="1" value="1" />
                  <Picker.Item label="2" value="2" />
                  <Picker.Item label="3" value="3" />
                  <Picker.Item label="4" value="4" />
                </Picker>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-blue-500 p-4 rounded-lg"
            >
              <Text className="text-center text-white font-bold">Book Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Book;
