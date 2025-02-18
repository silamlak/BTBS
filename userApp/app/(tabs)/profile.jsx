import { View, Text, Switch, TouchableOpacity, Button } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";
import i18next from "../../services/i18next";

const Profile = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { t } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18next.language;
    const newLang = currentLang === "en" ? "am" : "en";
    i18next.changeLanguage(newLang);
  };

  return (
    <View className="flex-1">
      <View className="flex justify-center gap-4 p-4 items-end flex-row bg-white dark:bg-slate-800 shadow shadow-black">
        <FontAwesome name="bus" size={24} color="lime" />
        <Text className="text-xl font-semibold mt-2">Settings</Text>
      </View>
      <View className="bg-white m-2">
        <View className="flex flex-row justify-between items-center border-b-2 border-slate-300 p-2">
          <View className="flex flex-row justify-between items-center gap-4">
            <FontAwesome name="language" size={24} color="lime" />
            <Text className="text-xl font-bold text-gray-500">
              {t("change")}
            </Text>
          </View>
          <TouchableOpacity
            className="bg-lime-500 p-1 rounded-lg"
            onPress={toggleLanguage}
          >
            <Text className="text-lg font-bold text-white">
              {i18next.language === "en" ? "Amharic" : "English"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-row justify-between items-center p-2">
          <View className="flex flex-row justify-between items-center gap-4">
            <FontAwesome name="adjust" size={24} color="lime" />

            <Text className="text-xl font-bold text-gray-500 ">Theme</Text>
          </View>
          <TouchableOpacity
            className={`flex-row items-center gap-2 justify-between bg-lime-500 p-1 rounded-lg`}
            onPress={toggleColorScheme}
          >
            <Text className="text-lg font-bold text-white">
              {colorScheme === "dark" ? "Light Mode" : "Dark Mode"}
            </Text>
            <FontAwesome
              name="adjust" // Adjust icon for theme toggle
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;
