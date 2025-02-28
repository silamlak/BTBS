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
import { useTranslation } from "react-i18next";
import i18next from "../../services/i18next";

export default function index() {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#e4e4e4" : "#111418";
  const { t } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18next.language;
    const newLang = currentLang === "en" ? "am" : "en";
    i18next.changeLanguage(newLang);
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

      <ScrollView className="relative" scrollEventThrottle={16}>
        <View className="bg-slate-5 px-4 mt-4">
          <Image source={img1} className="w-full h-56 rounded-xl" />

          <Text className="text-center text-[#0e141b] dark:text-[#e4e4e4] text-2xl font-bold mt-5">
            {t("slogan")}
          </Text>

          <View className="flex flex-row items-center bg-[#e7edf3] dark:bg-slate-600 rounded-xl mt-4 px-4 h-12">
            <FontAwesome name="search" size={24} color={iconColor} />
            <TextInput
              placeholder={t("input")}
              className="flex-1 ml-2 text-[#0e141b] dark:text-[#e4e4e4] text-base"
            />
          </View>

          <TouchableOpacity className="bg-lime-500 rounded-full h-12 flex items-center justify-center mt-4">
            <Link
              href="book"
              className="text-white w-full text-center font-bold text-xl"
            >
              {t("link")}
            </Link>
          </TouchableOpacity>

          <Text className="text-lg font-bold text-[#0e141b] dark:text-[#e4e4e4] mt-6">
            {t("why")}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
          >
            <View className="mr-3 w-40">
              <Image source={img4} className="w-full h-40 rounded-xl" />
              <Text className="text-center text-[#0e141b] dark:text-[#e4e4e4] text-base font-medium mt-2">
                {t("price")}
              </Text>
            </View>

            <View className="mr-3 w-40">
              <Image source={img2} className="w-full h-40 rounded-xl" />
              <Text className="text-center text-[#0e141b] dark:text-[#e4e4e4] text-base font-medium mt-2">
                {t("payment")}
              </Text>
            </View>

            <View className="mr-3 w-40">
              <Image source={img3} className="w-full h-40 rounded-xl" />
              <Text className="text-center text-[#0e141b] dark:text-[#e4e4e4] text-base font-medium mt-2">
                {t("service")}
              </Text>
            </View>
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
