import { Tabs } from "expo-router";
import React from "react";
import { Image, Platform, StatusBar, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";
import icons from "../../constants/icons";
import { useColorScheme } from "nativewind";

const TabIcon = ({ icon, color, name, focused }) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#161622" : "#fff";
  return (
    <View className="flex items-center justify-center gap-1">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-8 h-8"
      />
      <Text
        className={`text-nowrap ${
          focused ? "font-psemibold" : "font-pregular"
        } text-[10px] -mt-2`}
        style={{
          color: focused ? Colors.primary : color,
          fontWeight: focused ? "600" : "400",
        }}
      >
        {name}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 48,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 5,
          },
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="book"
          options={{
            title: "Book",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.book}
                color={color}
                name="Book"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="myTrip"
          options={{
            title: "My-Trip",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.myTrip}
                color={color}
                name="Trip"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
      {/* <StatusBar backgroundColor="#252534" barStyle="light-content" /> */}
    </>
  );
}
