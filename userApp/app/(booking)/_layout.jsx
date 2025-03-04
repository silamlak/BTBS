import { View, Text, StatusBar } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const BookingLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="passengerInfo"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="payment"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="routeList"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="seatSelection"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="myBookingDetail"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="editPassenger"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="editSeat"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      {/* <StatusBar backgroundColor="#161622" style="light" /> */}
    </>
  );
};

export default BookingLayout;
