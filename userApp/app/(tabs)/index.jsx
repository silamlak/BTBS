import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";

export default function index() {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#e4e4e4" : "#111418";


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

      <ScrollView className="relative" scrollEventThrottle={16}>
        <View className="bg-slate-5 px-4 mt-4">
          <Image
            source={{
              uri: "https://cdn.usegalileo.ai/sdxl10/32a1ff90-c222-4c3f-8e23-13fd5cbfda64.png",
            }}
            className="w-full h-56 rounded-xl"
          />

          <Text className="text-center text-[#0e141b] dark:text-[#e4e4e4] text-2xl font-bold mt-5">
            Bus travel made simple
          </Text>

          <View className="flex flex-row items-center bg-[#e7edf3] dark:bg-slate-600 rounded-xl mt-4 px-4 h-12">
            <FontAwesome name="search" size={24} color={iconColor} />
            <TextInput
              placeholder="From, to, dates, passengers"
              className="flex-1 ml-2 text-[#0e141b] dark:text-[#e4e4e4] text-base"
            />
          </View>

          <TouchableOpacity className="bg-lime-500 rounded-full h-12 flex items-center justify-center mt-4">
            <Link
              href="book"
              className="text-white w-full text-center font-bold text-xl"
            >
              Search for buses
            </Link>
          </TouchableOpacity>

          <Text className="text-lg font-bold text-[#0e141b] dark:text-[#e4e4e4] mt-6">
            Why book with us?
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
          >
            {[
              {
                text: "Lowest prices",
                img: "https://cdn.usegalileo.ai/sdxl10/e3c6d20b-4660-4917-81b9-1753ef40dde8.png",
              },
              {
                text: "Easy payments",
                img: "https://cdn.usegalileo.ai/sdxl10/4b4eb904-859d-47e9-a020-570e19b022a2.png",
              },
              {
                text: "24/7 support",
                img: "https://cdn.usegalileo.ai/sdxl10/9ec7315d-bca5-4861-b2e5-b2a3dfa18a5d.png",
              },
            ].map((item, index) => (
              <View key={index} className="mr-3 w-40">
                <Image
                  source={{ uri: item.img }}
                  className="w-full h-40 rounded-xl"
                />
                <Text className="text-center text-[#0e141b] dark:text-[#e4e4e4] text-base font-medium mt-2">
                  {item.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View className="items-center mt-6 mb-6">
            <Text className="text-[#4e7397] text-base">
              © 2022 Bus.com. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
