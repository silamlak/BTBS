import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Link, useLocalSearchParams, router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { useColorScheme } from "nativewind";
import {
  setPassengerData,
  setSelectedPassengerIndex,
  updatePassenger,
  setAdults,
  setChildren,
  clearAll,
} from "../../feature/booking/bookingSlice";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { updateBookingPassengerFun } from "../../feature/booking/bookingApi";
import { FontAwesome } from "@expo/vector-icons";
const editPassenger = () => {
  const dispatch = useDispatch();
  const { search } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const { adults, children, passengerData, selectedPassengerIndex } =
    useSelector((state) => state.booking);
  useEffect(() => {
    if (!passengerData) {
      router.push("/book");
    }
  }, [passengerData]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const iconColor = colorScheme === "dark" ? "#e4e4e4" : "#111418";

  console.log(search, passengerData, selectedPassengerIndex);
  useEffect(() => {
    let adults, children;

    if (adults !== passengerData?.filter((p) => p.type === "adult").length) {
      dispatch(setAdults(adults));
    }
    if (children !== passengerData?.filter((p) => p.type === "child").length) {
      dispatch(setChildren(children));
    }

    if (adults + children > 0 && selectedPassengerIndex === null) {
      dispatch(setSelectedPassengerIndex(0));
    }
  }, [search, dispatch, passengerData, selectedPassengerIndex]);

  const handleInputChange = (index, field, value) => {
    dispatch(updatePassenger({ index, field, value }));
  };

  const handlePassengerClick = (index) => {
    if (index >= 0 && index < passengerData?.length) {
      dispatch(setSelectedPassengerIndex(index));
    }
  };

  const mutation = useMutation({
    mutationFn: updateBookingPassengerFun,
    onSuccess: (data) => {
      console.log(data);
      router.replace(`/myBookingDetail?id=${search}`);
      dispatch(clearAll());
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(search, passengerData)
    mutation.mutate({ id: search, data: passengerData });
  };

  const allPassengerInfoFilled = () => {
    return (
      passengerData?.length > 0 &&
      passengerData?.every(
        (p) =>
          p.first_name &&
          p.last_name &&
          p.gender &&
          (p.type === "adult" ? p.email && p.phone : true)
      )
    );
  };
  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      <View className="flex-row bg-white dark:bg-slate-900 items-center justify-between p-4 shadow-slate-900 dark:shadow-slate-100 shadow-xl pb-2">
        <View className="flex-shrink-0 flex items-center">
          <Link href="/about">
            <FontAwesome
              name="info-circle"
              size={20}
              color={iconColor}
              className="dark:text-[#e4e4e4]"
            />
          </Link>
        </View>
        <Text className="text-[#0e141b] dark:text-[#e4e4e4] text-xl font-bold text-center flex-1">
          {t("habeshabus")}
        </Text>
        <View className="w-12 flex items-center justify-end">
          <TouchableOpacity className="flex items-center justify-center w-12 h-12 rounded-full bg-transparent p-0">
            <Link href="/profile">
              <FontAwesome
                name="cogs"
                size={20}
                color={iconColor}
                className="dark:text-[#e4e4e4]"
              />
            </Link>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
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
                    ? "bg-lime-500 dark:bg-lime-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
                onPress={() => handlePassengerClick(index)}
              >
                <Text
                  className={`font-semibold ${
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
            <View className="mt-4 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
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

export default editPassenger;

const styles = StyleSheet.create({});
