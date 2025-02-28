import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { GetMyBookingFun } from "../../feature/booking/bookingApi";
import { usePathname, router, Link } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import i18next from "../../services/i18next";
import { useTranslation } from "react-i18next";

const MyTrip = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [myBooking, setMyBooking] = useState();
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18next.language;
    const newLang = currentLang === "en" ? "am" : "en";
    i18next.changeLanguage(newLang);
  };
  const iconColor = colorScheme === "dark" ? "#e4e4e4" : "#111418";
  const mutation = useMutation({
    mutationFn: GetMyBookingFun,
    onSuccess: (data) => {
      console.log(data);
      setMyBooking(data);
    },
  });

  const handleSubmit = () => {
    mutation.mutate(inputValue);
    setModalVisible(false);
  };

  const onDetailPage = (id) => {
    router.push(`/myBookingDetail?id=${id}`);
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-800">
      <View className="flex-row bg-white dark:bg-slate-900 items-center justify-between p-4 shadow-slate-900 dark:shadow-slate-100 shadow-xl pb-2">
        <View className="flex-shrink-0 flex items-center text-[#0e141b] dark:text-[#e4e4e4]">
          <Link href="/about">
            <FontAwesome name="info-circle" size={20} color={iconColor} />
          </Link>
        </View>
        <Text className="text-[#0e141b] dark:text-[#e4e4e4] text-xl font-bold text-center flex-1">
          {t("habeshabus")}
        </Text>
        <View className="w-12 flex items-center justify-end">
          <TouchableOpacity className="flex items-center justify-center w-12 h-12 rounded-full bg-transparent text-[#0e141b] dark:text-[#e4e4e4] p-0">
            <Link href="/profile">
              <FontAwesome name="cogs" size={20} color={iconColor} />
            </Link>
          </TouchableOpacity>
        </View>
      </View>

      {myBooking && (
        <TouchableOpacity
          className="bg-slate-200 m-4 dark:bg-gray-700 p-4 rounded-2xl mb-4 shadow-md dark:shadow-gray-900"
          onPress={() => onDetailPage(myBooking?.myBooking?._id)}
        >
          <View className="flex-row justify-between items-center">
            {/* Journey Details */}
            <View className="flex-row items-center space-x-3">
              <View className="bg-lime-100 dark:bg-lime-900/30 p-2 rounded-full">
                <FontAwesome
                  name="bus"
                  size={24}
                  color={iconColor || "#84cc16"} // Lime green default
                />
              </View>
              <View>
                <View className="flex-row items-center space-x-2">
                  <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {myBooking?.schedule?.from}
                  </Text>
                  <View className="bg-lime-200 dark:bg-lime-800/50 px-2 py-1 rounded-full">
                    <Text className="text-xs font-medium text-lime-800 dark:text-lime-200">
                      TO
                    </Text>
                  </View>
                  <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {myBooking?.schedule?.to}
                  </Text>
                </View>
              </View>
            </View>

            {/* Price Section */}
            <View className="items-end">
              <View className="flex-row items-baseline">
                <Text className="text-2xl font-bold text-lime-600 dark:text-lime-400">
                  {myBooking?.schedule?.ticket_price}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                  ETB
                </Text>
              </View>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                Per ticket
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
        {/* Overlay */}
        <View className="flex-1 justify-center items-center bg-black/60">
          {/* Animated Modal Content */}
          <Animated.View
            entering={FadeInUp.duration(300)}
            exiting={FadeOutDown.duration(200)}
            className="w-11/12 max-w-md bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <Text className="text-2xl font-bold mb-5 text-gray-800 dark:text-white">
              Enter Details
            </Text>

            {/* Input */}
            <TextInput
              className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-lg mb-5 text-lg shadow-sm focus:border-lime-500 focus:ring-2 focus:ring-lime-500"
              placeholder="Enter something..."
              placeholderTextColor="#888 dark:#a0a0a0"
              value={inputValue}
              onChangeText={setInputValue}
            />

            {/* Search Button */}
            <TouchableOpacity
              className="bg-lime-500 p-3 rounded-lg shadow-md active:bg-lime-600 transition-all"
              onPress={() => handleSubmit()}
            >
              <Text className="text-white text-center font-semibold text-xl">
                Search
              </Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              className="mt-4 bg-red-500 dark:bg-gray-700 p-2 rounded-lg shadow-md active:bg-red-600 dark:active:bg-gray-600 transition-all"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Close
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default MyTrip;

const styles = StyleSheet.create({});
