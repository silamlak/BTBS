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
} from "react-native";
import React, { useState } from "react";
import { usePathname, router } from "expo-router";

const Book = () => {
  const pathname = usePathname();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState({ adult: 1, child: 0 });
  const [showPassengerModal, setShowPassengerModal] = useState(false);

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

  const handleSubmit = () => {
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
                onChangeText={setFrom}
              />
            </View>

            {/* To Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2">To</Text>
              <TextInput
                className="border border-gray-300 p-3 rounded-lg"
                placeholder="Enter destination location"
                value={to}
                onChangeText={setTo}
              />
            </View>

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
            <View className="mb-4">
              <Text className="text-gray-700 mb-2">Passengers</Text>
              <TouchableOpacity
                className="border border-gray-300 p-3 rounded-lg"
                onPress={() => setShowPassengerModal(true)}
              >
                <Text>{`Passengers: ${totalPassengers} (Adults: ${passengers.adult}, Children: ${passengers.child})`}</Text>
              </TouchableOpacity>
            </View>

            {/* Passenger Modal */}
            <Modal
              visible={showPassengerModal}
              transparent={true}
              animationType="slide"
            >
              <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                <View className="bg-white p-6 rounded-lg w-3/4">
                  <Text className="text-lg font-bold mb-4">
                    Select Passengers
                  </Text>

                  {/* Adult Picker */}
                  <View className="flex-row justify-between items-center mb-4">
                    <Text>Adults</Text>
                    <View className="flex-row items-center">
                      <TouchableOpacity
                        className="bg-gray-300 p-2 rounded-lg"
                        onPress={() => handlePassengerDecrement("adult")}
                      >
                        <Text>-</Text>
                      </TouchableOpacity>
                      <Text className="mx-3 text-lg">{passengers.adult}</Text>
                      <TouchableOpacity
                        className="bg-gray-300 p-2 rounded-lg"
                        onPress={() => handlePassengerIncrement("adult")}
                      >
                        <Text>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Child Picker */}
                  <View className="flex-row justify-between items-center mb-4">
                    <Text>Children (Below 7)</Text>
                    <View className="flex-row items-center">
                      <TouchableOpacity
                        className="bg-gray-300 p-2 rounded-lg"
                        onPress={() => handlePassengerDecrement("child")}
                      >
                        <Text>-</Text>
                      </TouchableOpacity>
                      <Text className="mx-3 text-lg">{passengers.child}</Text>
                      <TouchableOpacity
                        className="bg-gray-300 p-2 rounded-lg"
                        onPress={() => handlePassengerIncrement("child")}
                      >
                        <Text>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Button
                    title="Confirm"
                    onPress={() => setShowPassengerModal(false)}
                  />
                </View>
              </View>
            </Modal>

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
