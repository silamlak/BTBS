import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import {
  setPassengerData,
  setSelectedPassengerIndex,
  updatePassenger,
  setAdults,
  setChildren,
  deletePassengerData,
} from "../../feature/booking/bookingSlice";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";
import i18next from "../../services/i18next";
const PassengerInfo = () => {
  // Use `useLocalSearchParams` to get query parameters
  const params = useLocalSearchParams();
  const router = useRouter();
  const { search } = router;
  const { adults, children, passengerData, selectedPassengerIndex } =
    useSelector((state) => state.booking);
  const dispatch = useDispatch();
    const { colorScheme } = useColorScheme();
    const iconColor = colorScheme === "dark" ? "#e4e4e4" : "#111418";
      const { t } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18next.language;
    const newLang = currentLang === "en" ? "am" : "en";
    i18next.changeLanguage(newLang);
  }
  const [loading, setLoading] = useState(false);

  // Function to generate OTP
  const generateOTP = () => {
    const otpLength = 6;
    const newOtp = Array.from({ length: otpLength }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    return newOtp;
  };

  // Parse the parameters
  const query = {
    adults: parseInt(params.adults, 10) || 0,
    children: parseInt(params.children, 10) || 0,
    fromPlace: params.from || "",
    toPlace: params.to || "",
    travelDate: params.date || "",
  };

  useEffect(() => {
    if (
      query.adults !== passengerData.filter((p) => p.type === "adult").length
    ) {
      dispatch(setAdults(query.adults));
    }
    if (
      query.children !== passengerData.filter((p) => p.type === "child").length
    ) {
      dispatch(setChildren(query.children));
    }

    // Initialize passenger data if empty
    if (passengerData.length === 0) {
      const initialPassengerData = [];
      for (let i = 0; i < query.adults; i++) {
        const code = generateOTP();
        initialPassengerData.push({
          type: "adult",
          first_name: "",
          last_name: "",
          gender: "",
          email: "",
          phone: "",
          seat: "",
          id: code,
        });
      }
      for (let i = 0; i < query.children; i++) {
        const code = generateOTP();
        initialPassengerData.push({
          type: "child",
          first_name: "",
          last_name: "",
          gender: "",
          seat: "",
          id: code,
        });
      }
      dispatch(setPassengerData(initialPassengerData));
    }

    // Set the default selected passenger
    if (query.adults + query.children > 0 && selectedPassengerIndex === null) {
      dispatch(setSelectedPassengerIndex(0));
    }
  }, [search, dispatch, passengerData, selectedPassengerIndex]);

  const handleInputChange = (index, field, value) => {
    dispatch(updatePassenger({ index, field, value }));
  };

  const handlePassengerClick = (index) => {
    if (index >= 0 && index < passengerData.length) {
      dispatch(setSelectedPassengerIndex(index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // console.log("Passenger Info Submitted:", passengerData);
    router.push(
      `/seatSelection?from=${query.fromPlace}&to=${query.toPlace}&date=${query.travelDate}&adults=${query.adults}&children=${query.children}`
    );

    setLoading(false);
  };

  // Check if all passenger information is filled
  const allPassengerInfoFilled = () => {
    return (
      passengerData?.length > 0 &&
      passengerData.every((p) => p.first_name && p.last_name && p.gender)
    );
  };

  if (query.adults + query.children === 0) {
    return <Text>No passengers to fill information for.</Text>;
  }

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row bg-white dark:bg-slate-900 items-center justify-between p-4 shadow-lg shadow-gray-500 dark:shadow-gray-800">
        <TouchableOpacity className="p-2">
          <Link href="/about">
            <FontAwesome name="info-circle" size={24} color={iconColor} />
          </Link>
        </TouchableOpacity>
        <Text className="text-[#0e141b] dark:text-[#e4e4e4] text-2xl font-bold text-center flex-1">
          {t("habeshabus")}
        </Text>
        <TouchableOpacity className="p-2">
          <Link href="/profile">
            <FontAwesome name="cogs" size={24} color={iconColor} />
          </Link>
        </TouchableOpacity>
      </View>

      <ScrollView className="p-4">
        {/* Passenger Tabs */}
        {adults + children > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-3 pb-4"
          >
            {passengerData.map((passenger, index) => (
              <TouchableOpacity
                key={index}
                className={`px-4 py-2 rounded-lg shadow-md ${
                  selectedPassengerIndex === index
                    ? "bg-lime-500 dark:bg-lime-600 border-lime-600 text-white"
                    : "bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                }`}
                onPress={() => handlePassengerClick(index)}
              >
                <Text
                  className={`text-base font-semibold ${
                    selectedPassengerIndex === index
                      ? "text-white"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {passenger.type === "adult" ? "Adult" : "Child"} {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Passenger Form */}
        {selectedPassengerIndex !== null &&
          selectedPassengerIndex >= 0 &&
          selectedPassengerIndex < passengerData.length && (
            <View className="mt-4 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-md shadow-gray-300 dark:shadow-gray-700">
              <Text className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                {passengerData[selectedPassengerIndex].type === "adult"
                  ? `Adult ${selectedPassengerIndex + 1}`
                  : `Child ${selectedPassengerIndex + 1}`}
              </Text>

              {/* First Name */}
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </Text>
              <TextInput
                className="border border-gray-300 dark:border-gray-700 p-3 mb-4 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                placeholder="First Name"
                value={passengerData[selectedPassengerIndex].first_name}
                onChangeText={(value) =>
                  handleInputChange(selectedPassengerIndex, "first_name", value)
                }
              />

              {/* Last Name */}
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </Text>
              <TextInput
                className="border border-gray-300 dark:border-gray-700 p-3 mb-4 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                placeholder="Last Name"
                value={passengerData[selectedPassengerIndex].last_name}
                onChangeText={(value) =>
                  handleInputChange(selectedPassengerIndex, "last_name", value)
                }
              />

              {/* Gender */}
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </Text>
              <View className="flex-row gap-4 mb-4">
                {["Male", "Female"].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    className={`flex-row items-center px-4 py-2 border rounded-lg shadow-sm ${
                      passengerData[selectedPassengerIndex].gender === gender
                        ? "border-lime-500 bg-lime-50 dark:border-lime-600 dark:bg-lime-900"
                        : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                    }`}
                    onPress={() =>
                      handleInputChange(
                        selectedPassengerIndex,
                        "gender",
                        gender
                      )
                    }
                  >
                    <View
                      className={`w-5 h-5 rounded-full border mr-2 ${
                        passengerData[selectedPassengerIndex].gender === gender
                          ? "border-lime-500 bg-lime-500 dark:border-lime-600 dark:bg-lime-600"
                          : "border-gray-400 dark:border-gray-600"
                      }`}
                    />
                    <Text className="text-gray-700 dark:text-gray-200">
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Phone (Adults Only) */}
              {passengerData[selectedPassengerIndex].type === "adult" && (
                <>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </Text>
                  <TextInput
                    className="border border-gray-300 dark:border-gray-700 p-3 mb-4 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                    placeholder="Phone"
                    keyboardType="numeric"
                    value={passengerData[selectedPassengerIndex].phone}
                    onChangeText={(value) =>
                      handleInputChange(selectedPassengerIndex, "phone", value)
                    }
                  />
                </>
              )}

              {/* Email (Adults Only) */}
              {passengerData[selectedPassengerIndex].type === "adult" && (
                <>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </Text>
                  <TextInput
                    className="border border-gray-300 dark:border-gray-700 p-3 mb-4 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                    placeholder="Email"
                    keyboardType="email-address"
                    value={passengerData[selectedPassengerIndex].email}
                    onChangeText={(value) =>
                      handleInputChange(selectedPassengerIndex, "email", value)
                    }
                  />
                </>
              )}

              {/* Submit Button */}
              {allPassengerInfoFilled() && (
                <TouchableOpacity
                  className={`bg-lime-500 dark:bg-lime-600 p-3 rounded-lg shadow-md ${
                    loading
                      ? "opacity-50"
                      : "active:bg-lime-600 dark:active:bg-lime-700"
                  }`}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Text className="text-white text-center font-semibold text-lg">
                    {loading ? "Submitting..." : "Submit"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
      </ScrollView>
    </View>
  );
};

export default PassengerInfo;
