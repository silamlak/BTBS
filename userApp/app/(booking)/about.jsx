import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "nativewind"; // Import hook to detect color scheme
import { useTranslation } from "react-i18next";
import i18next from "../../services/i18next";
import { Link } from "expo-router";
export default function About() {
  const { colorScheme } = useColorScheme(); // Get the current color scheme (light or dark)

  // Conditional colors for icons
  const iconColor = colorScheme === "dark" ? "#e4e4e4" : "#111418";
  const { t } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18next.language;
    const newLang = currentLang === "en" ? "am" : "en";
    i18next.changeLanguage(newLang);
  };
  return (
    <View className="bg-white dark:bg-[#1e1e1e]">
      <View className="flex-row items-center justify-between p-4 shadow-slate-900 shadow pb-2">
        <View className="flex-shrink-0 flex items-center text-[#0e141b] dark:text-[#e4e4e4]">
          <FontAwesome name="info-circle" size={20} color={iconColor} />
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
      <ScrollView className="bg-white dark:bg-[#1e1e1e] p-4">
        {/* App Features Section */}
        <Text className="text-[#111418] dark:text-[#e4e4e4] text-[22px] font-bold">
          {t("about")}
        </Text>
        <View className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 py-4">
          <View className="bg-white dark:bg-[#2a2a2a] p-4 rounded-lg border border-[#dce0e5] dark:border-[#333333]">
            <FontAwesome name="mobile" size={30} color={iconColor} />
            <View className="flex-col gap-1">
              <Text className="text-[#111418] dark:text-[#e4e4e4] text-base font-bold">
                {t("eticket")}
              </Text>
              <Text className="text-[#637588] dark:text-[#9e9e9e] text-sm">
                {t("instant")}
              </Text>
            </View>
          </View>

          <View className="bg-white dark:bg-[#2a2a2a] p-4 rounded-lg border border-[#dce0e5] dark:border-[#333333]">
            <FontAwesome name="rocket" size={30} color={iconColor} />
            <View className="flex-col gap-1">
              <Text className="text-[#111418] dark:text-[#e4e4e4] text-base font-bold">
                {t("fastservice")}
              </Text>
              <Text className="text-[#637588] dark:text-[#9e9e9e] text-sm">
                {t("quick")}
              </Text>
            </View>
          </View>

          <View className="bg-white dark:bg-[#2a2a2a] p-4 rounded-lg border border-[#dce0e5] dark:border-[#333333]">
            <FontAwesome name="headphones" size={30} color={iconColor} />
            <View className="flex-col gap-1">
              <Text className="text-[#111418] dark:text-[#e4e4e4] text-base font-bold">
                {t("24")}
              </Text>
              <Text className="text-[#637588] dark:text-[#9e9e9e] text-sm">
                {t("available")}
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-[#111418] dark:text-[#e4e4e4] text-[22px] font-bold pt-5">
          {t("contactus")}
        </Text>
        <View className="flex-row items-center gap-4 bg-white dark:bg-[#2a2a2a] px-4 min-h-14 justify-between">
          <Text className="text-[#111418] dark:text-[#e4e4e4] text-base flex-1">
            {t("email")}
          </Text>
          <Text className="text-[#111418] dark:text-[#e4e4e4] text-base">
            support@habeshabus.com
          </Text>
        </View>
        <View className="flex-row items-center gap-4 bg-white dark:bg-[#2a2a2a] px-4 min-h-14 justify-between">
          <Text className="text-[#111418] dark:text-[#e4e4e4] text-base flex-1">
            {t("phone")}
          </Text>
          <Text className="text-[#111418] dark:text-[#e4e4e4] text-base">
            (+251) 9 2773 4504
          </Text>
        </View>
        <View className="flex-row items-center gap-4 bg-white dark:bg-[#2a2a2a] px-4 min-h-14 justify-between">
          <Text className="text-[#111418] dark:text-[#e4e4e4] text-base flex-1">
            {t("adress")}
          </Text>
          <Text className="text-[#111418] dark:text-[#e4e4e4] text-base">
            123 Rwanda St., Addis Ababa
          </Text>
        </View>

        <Text className="text-[#111418] dark:text-[#e4e4e4] text-[22px] font-bold px-4 pt-5">
          {t("legal")}
        </Text>
        <View className="flex-row items-center gap-4 bg-white dark:bg-[#2a2a2a] px-4 min-h-14 justify-between">
          <Text className="text-[#111418] dark:text-[#e4e4e4] text-base flex-1">
            {t("privacy")}
          </Text>
          <FontAwesome name="arrow-right" size={20} color={iconColor} />
        </View>
        <View className="flex-row items-center gap-4 bg-white dark:bg-[#2a2a2a] px-4 min-h-14 justify-between">
          <Text className="text-[#111418] dark:text-[#e4e4e4] text-base flex-1">
            {t("term")}
          </Text>
          <FontAwesome name="arrow-right" size={20} color={iconColor} />
        </View>

        <Text className="text-[#637588] dark:text-[#9e9e9e] text-sm text-center pb-3 pt-1 px-4">
          Version 1.0.0
        </Text>

        <View className="px-5 py-10">
          <Text className="text-[#637588] dark:text-[#9e9e9e] text-base text-center">
            © 2021 Bus.com. All rights reserved
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
