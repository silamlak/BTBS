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
import img1 from "../../assets/images/habesha1.png";
import img2 from "../../assets/images/chapa.png";
import img3 from "../../assets/images/24.jpg";
import img4 from "../../assets/images/price.jpg";

export default function index() {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#e4e4e4" : "#111418";

  return (
    <View className="flex-1 bg-white dark:bg-slate-800">
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
            <Link href='/profile'><FontAwesome name="cogs" size={20} color={iconColor} /></Link>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="relative" scrollEventThrottle={16}>
        <View className="bg-slate-5 px-4 mt-4">
          <Image
            source={img1} // Removed uri object wrapper
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
              Search for schedule
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
                text: "Best prices",
                img: img4,
              },
              {
                text: "Easy payments",
                img: img2,
              },
              {
                text: "24/7 support",
                img: img3,
              },
            ].map((item, index) => (
              <View key={index} className="mr-3 w-40">
                <Image
                  source={item.img} // Removed uri object wrapper
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
              © 2025 HabeshaBus.com. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
