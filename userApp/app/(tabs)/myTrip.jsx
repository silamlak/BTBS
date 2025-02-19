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
import { useColorScheme } from "nativewind";

const MyTrip = () => {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [myBooking, setMyBooking] = useState();
  const { colorScheme } = useColorScheme();

  const iconColor = colorScheme === "dark" ? "#e4e4e4" : "#111418";
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
    <View className="flex-1 bg-white dark:bg-slate-800">
      <View className="flex-row bg-white dark:bg-slate-900 items-center justify-between p-4 shadow-slate-900 dark:shadow-slate-100 shadow-xl pb-2">
        <View className="flex-shrink-0 flex items-center text-[#0e141b] dark:text-[#e4e4e4]">
          <FontAwesome name="info-circle" size={20} color={iconColor} />
        </View>
        <Text className="text-[#0e141b] dark:text-[#e4e4e4] text-xl font-bold text-center flex-1">
          Habesha Bus
        </Text>
        <View className="w-12 flex items-center justify-end">
          <TouchableOpacity className="flex items-center justify-center w-12 h-12 rounded-full bg-transparent text-[#0e141b] dark:text-[#e4e4e4] p-0">
            <FontAwesome name="cogs" size={20} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>

      {myBooking && (
        <TouchableOpacity
          className="bg-white p-4 rounded-3xl mb-4 shadow-md"
          onPress={() => onDetailPage(myBooking?.myBooking?._id)}
        >
          <View className="flex flex-row justify-between gap-2 items-center">
            <View className="flex flex-row justify-between gap-2 items-center">
              <FontAwesome name="bus" size={30} color={iconColor} />
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
        onPress={() => setModalVisible(true)}
        className="absolute bottom-6 right-6 p-4 rounded-full bg-lime-500"
      >
        <View className="flex justify-center items-center w-6 h-6">
          <View className="absolute w-6 h-1 bg-white rounded-xl" />
          <View className="absolute h-6 w-1 bg-white rounded-xl" />
        </View>
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
