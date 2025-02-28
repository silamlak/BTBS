import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Link, useLocalSearchParams, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { GetMyBookingDetailFun } from "../../feature/booking/bookingApi";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import i18next from "../../services/i18next";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "nativewind";
import { useDispatch } from "react-redux";
import {
  clearAll,
  setBusId,
  setPassengerData,
  setScheduleId,
  setSeats,
} from "../../feature/booking/bookingSlice";

const MyBookingDetail = () => {
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myBookingDetail", id],
    queryFn: () => GetMyBookingDetailFun(id),
    enabled: !!id,
  });
  const { t } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18next.language;
    const newLang = currentLang === "en" ? "am" : "en";
    i18next.changeLanguage(newLang);
  };

  const iconColor = colorScheme === "dark" ? "#e4e4e4" : "#111418";

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 dark:bg-gray-900">
        <Text className="text-xl text-gray-600 dark:text-gray-300">
          Loading your ticket...
        </Text>
      </View>
    );
  }
  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 dark:bg-gray-900">
        <Text className="text-xl text-red-500 dark:text-red-400">
          Oops! Something went wrong.
        </Text>
      </View>
    );
  }

  const handleEditPassengerInfo = () => {
    if (data) {
      console.log(data);
      dispatch(setPassengerData(data?.myBooking?.passengers));
    }
    router.push(`/editPassenger?search=${id}`);
  };

  const handleEditSeatInfo = () => {
    dispatch(clearAll());
    if (data) {
      dispatch(setPassengerData(data?.myBooking?.passengers));
      dispatch(setSeats(data?.myBooking?.seats));
      dispatch(setScheduleId({ id: data?.myBooking?.scheduleId }));
      dispatch(setBusId({ bus_id: data?.myBooking?.busId }));
    }
    router.push(`/editSeat?search=${data?.myBooking?._id}`);
  };

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row bg-white dark:bg-slate-900 items-center justify-between p-4 shadow-slate-900 dark:shadow-slate-100 shadow-xl pb-2">
        <View className="flex-shrink-0 flex items-center">
          <Link href="/about">
            <FontAwesome
              name="info-circle"
              size={20}
              color={iconColor}
              className="dark:text-[#e4e4e4]"
            />
          </Link>
        </View>
        <Text className="text-[#0e141b] dark:text-[#e4e4e4] text-xl font-bold text-center flex-1">
          {t("habeshabus")}
        </Text>
        <View className="w-12 flex items-center justify-end">
          <TouchableOpacity className="flex items-center justify-center w-12 h-12 rounded-full bg-transparent p-0">
            <Link href="/profile">
              <FontAwesome
                name="cogs"
                size={20}
                color={iconColor}
                className="dark:text-[#e4e4e4]"
              />
            </Link>
          </TouchableOpacity>
        </View>
      </View>

      {/* Ticket Header */}
      <View className="bg-lime-500 p-6 pt-12 flex-row justify-between items-center">
        <View className="flex-row items-center space-x-3">
          <View className="bg-white/20 p-2 rounded-full">
            <FontAwesome name="bus" size={28} color="white" />
          </View>
          <Text className="text-2xl font-bold text-white">Ticket Details</Text>
        </View>
        <Text className="text-sm text-white/80">
          Booking {data?.myBooking?.confirmationCode?.slice(-6)}
        </Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 p-4 -mt-4">
        {/* Journey Card */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 shadow-md">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {data?.schedule?.from}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(data?.schedule?.schedule_date).toLocaleDateString()}
              </Text>
            </View>
            <View className="bg-lime-100 dark:bg-lime-900 p-2 rounded-full">
              <FontAwesome5 name="arrow-right" size={18} color="#84cc16" />
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {data?.schedule?.to}
              </Text>
              <Text className="text-sm text-lime-600 dark:text-lime-400 font-medium">
                Confirmed
              </Text>
            </View>
          </View>
        </View>

        {/* Passengers Card */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 shadow-md">
          <Text className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Passengers
          </Text>
          {data?.myBooking?.passengers?.map((passenger, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <View className="flex-row items-center space-x-3">
                <View className="bg-lime-50 dark:bg-lime-900 p-2 rounded-full">
                  <FontAwesome name="user" size={20} color="#84cc16" />
                </View>
                <Text className="text-lg font-medium text-gray-700 dark:text-gray-200">
                  {passenger?.first_name} {passenger?.last_name}
                </Text>
              </View>
              <Text className="text-lg text-gray-600 dark:text-gray-300">
                Seat {data?.myBooking?.seats[index].seatNo}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment Card */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md">
          <Text className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Payment Details
          </Text>
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-lg text-gray-600 dark:text-gray-300">
                Total Price
              </Text>
              <Text className="text-sm text-gray-400 dark:text-gray-500">
                {data?.myBooking?.passengers?.length} ticket(s)
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold text-lime-600 dark:text-lime-400">
                {data?.schedule?.ticket_price *
                  data?.myBooking?.passengers?.length}{" "}
                ETB
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Paid
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row justify-between my-4">
          <TouchableOpacity
            className="bg-lime-500 dark:bg-lime-600 p-3 rounded-lg shadow-md flex-1 mr-2 active:bg-lime-600 dark:active:bg-lime-700"
            onPress={handleEditPassengerInfo}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Edit Passenger Info
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-lime-500 dark:bg-lime-600 p-3 rounded-lg shadow-md flex-1 ml-2 active:bg-lime-600 dark:active:bg-lime-700"
            onPress={handleEditSeatInfo}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Edit Seat Info
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MyBookingDetail;

const styles = StyleSheet.create({});
