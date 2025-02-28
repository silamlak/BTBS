import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";
import i18next from "../../services/i18next";
import { Link } from "expo-router";

const Profile = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { t } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18next.language;
    const newLang = currentLang === "en" ? "am" : "en";
    i18next.changeLanguage(newLang);
  };

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
          {t("habeshabus")}
        </Text>
        <View className="w-12 flex items-center justify-end">
          <TouchableOpacity className="flex items-center justify-center w-12 h-12 rounded-full bg-transparent text-[#0e141b] dark:text-[#e4e4e4] p-0">
            <FontAwesome name="cogs" size={20} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="bg-white dark:bg-slate-900 m-2">
        {/* Language Section */}
        <View className="flex flex-row justify-between items-center border-b-2 border-slate-300 dark:border-[#444] p-2">
          <View className="flex flex-row justify-between items-center gap-4">
            <FontAwesome name="language" size={24} color={iconColor} />
            <Text className="text-xl font-bold text-gray-500 dark:text-[#e4e4e4]">
              {t("change")}
            </Text>
          </View>
          <TouchableOpacity
            className="text-sm font-medium leading-normal flex items-center justify-center rounded-xl border px-4 h-11 text-[#111418] border-[#dce0e5] dark:text-[#e4e4e4] dark:border-[#4a4a4a]"
            onPress={toggleLanguage}
          >
            <Text className="text-md dark:text-slate-100 font-bold ">
              {i18next.language === "en" ? "Amharic" : "English"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Theme Section */}
        <View className="flex flex-row justify-between items-center p-2">
          <View className="flex flex-row justify-between items-center gap-4">
            <FontAwesome name="adjust" size={24} color={iconColor} />
            <Text className="text-xl font-bold text-gray-500 dark:text-[#e4e4e4]">
              Theme
            </Text>
          </View>
          <TouchableOpacity
            className={`flex-row items-center gap-2 justify-between text-sm font-medium leading-normal flex rounded-xl border px-4 h-11 text-[#111418] border-[#dce0e5] dark:text-[#e4e4e4] dark:border-[#4a4a4a]`}
            onPress={toggleColorScheme}
          >
            <Text className="text-md font-bold dark:text-slate-100">
              {colorScheme === "dark" ? "Light Mode" : "Dark Mode"}
            </Text>
            <FontAwesome name="adjust" size={20} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;
