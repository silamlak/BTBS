import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { GetMyBookingFun } from "../../feature/booking/bookingApi";
import { usePathname, router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
const MyTrip = () => {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [myBooking, setMyBooking] = useState();

  const mutation = useMutation({
    mutationFn: GetMyBookingFun,
    onSuccess: (data) => {
      console.log(data);
      setMyBooking(data)
    },
  });

  const handleSubmit = () => {
    mutation.mutate(inputValue);
    setModalVisible(false);
  };

  const onDetailPage = (id) => {
    router.push(`/myBookingDetail?id=${id}`);
  }

  return (
    <View className="flex-1">
      <View className="flex justify-center gap-4 p-4 items-end flex-row mb-6 bg-white shadow shadow-black">
        <FontAwesome name="bus" size={24} color="lime" />
        <Text className="text-xl font-semibold mt-2">My Booking</Text>
      </View>

      {myBooking && (
        <TouchableOpacity
          className="bg-white p-4 rounded-3xl mb-4 shadow-md"
          onPress={() => onDetailPage(myBooking?.myBooking?._id)}
        >
          <View className="flex flex-row justify-between gap-2 items-center">
            <View className="flex flex-row justify-between gap-2 items-center">
              <FontAwesome name="bus" size={34} color="lime" />
              <View className="flex flex-row justify-between gap-2 items-center">
                <Text className="text-xl font-semibold mb-2">
                  {myBooking?.schedule?.from}
                </Text>
                <Text className="text-sm p-2 rounded-full bg-lime-300 font-semibold mb-2">
                  To
                </Text>
                {/* <FontAwesome5 name="arrow-right" size={16} color="gray" /> */}
                <Text className="text-xl font-semibold mb-2">
                  {myBooking?.schedule?.to}
                </Text>
              </View>
            </View>
            <View className="p-4  flex flex-col items-center">
              <Text className="text-3xl text-lime-500 font-semibold">
                {myBooking?.schedule?.ticket_price}
              </Text>
              <Text className="text-md text-gray-500 -mt-2 font-semibold">
                ETB
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Floating Icon Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-lime-500 p-4 rounded-full shadow"
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome name="plus" size={20} color="white" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-3/4 bg-white p-6 rounded-lg shadow-lg">
            <Text className="text-lg font-semibold mb-4">Enter Details</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded mb-4"
              placeholder="Enter something..."
              value={inputValue}
              onChangeText={setInputValue}
            />
            <TouchableOpacity
              className="bg-lime-500 p-2 rounded"
              onPress={() => handleSubmit()}
            >
              <Text className="text-white text-center font-semibold text-2xl">
                Search
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyTrip;

const styles = StyleSheet.create({});
