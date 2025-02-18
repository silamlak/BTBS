import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { GetMyBookingDetailFun } from "../../feature/booking/bookingApi";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

const MyBookingDetail = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myBookingDetail", id],
    queryFn: () => GetMyBookingDetailFun(id),
    enabled: !!id,
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading booking details.</Text>;

  return (
    <View>
      {/* Header */}
      <View className="flex justify-center gap-4 p-4 items-end flex-row mb-6 bg-white shadow shadow-black">
        <FontAwesome name="bus" size={24} color="lime" />
        <Text className="text-xl font-semibold mt-2">Ticket Detail</Text>
      </View>

      {/* Ticket Details */}
      <View className="p-4">
        <View className="mt-4 p-4 bg-white rounded-sm">
          <Text className="text-lg text-gray-400 font-semibold mb-2">
            Confirmed Ticket
          </Text>
          {data && (
            <TouchableOpacity className="">
              <View className="flex flex-row justify-between gap-2 items-center">
                <Text className="text-xl font-semibold mb-2">
                  {data?.schedule?.from}
                </Text>
                <FontAwesome5 name="arrow-right" size={16} color="gray" />
                <Text className="text-xl font-semibold mb-2">
                  {data?.schedule?.to}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Passengers List */}
        <View className="mt-4 p-4 bg-white rounded-sm">
          <Text className="text-lg text-gray-400 font-semibold">
            Passengers:
          </Text>
          {data?.myBooking?.passengers?.map((passenger, index) => (
            <View
              key={index}
              className="p-4 flex flex-row justify-between my-1 rounded-sm shadow-sm"
            >
              <View className="flex flex-row gap-2">
                <Text className="text-gray-600 font-medium text-2xl">
                  {passenger?.first_name}
                </Text>
                <Text className="text-gray-600 font-medium text-2xl">
                  {passenger?.last_name}
                </Text>
              </View>
              <Text className="text-gray-600 font-medium text-xl">
                Seat: {data?.myBooking?.seats[index].seatNo}
              </Text>
            </View>
          ))}
        </View>

        <View className="mt-4 p-4 bg-white rounded-sm">
          <Text className="text-lg text-gray-400 font-semibold">Payment</Text>
          <View className="p-4 flex flex-row justify-between my-1 rounded-sm shadow-sm">
            <Text className="text-gray-600 font-medium text-2xl">
              Total Price
            </Text>

            <Text className="text-gray-600 font-medium text-xl">
              {data?.schedule?.ticket_price}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MyBookingDetail;

const styles = StyleSheet.create({});
