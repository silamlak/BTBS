import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getBookingSearchFun } from "../../feature/booking/bookingApi";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  setScheduleId,
  setSchedulePrice,
} from "../../feature/booking/bookingSlice";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";
import i18next from "../../services/i18next";
const SearchResults = () => {
    const { colorScheme } = useColorScheme();
    const iconColor = colorScheme === "dark" ? "#e4e4e4" : "#111418";
      const { t } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18next.language;
    const newLang = currentLang === "en" ? "am" : "en";
    i18next.changeLanguage(newLang);
  }

  const { query } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  // Fetch data using useQuery hook
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["searchResults", query],
    queryFn: () => getBookingSearchFun(query),
  });

  console.log(data);

  const formatScheduleDate = (date) => moment(date).format("MMM Do YYYY");

  const goToPassengerInfo = (id, ticket_price) => {
    dispatch(setSchedulePrice(ticket_price));
    dispatch(setScheduleId({ id }));
    router.push(`/passengerInfo?${query}`);
  };

  return (
    <View className="bg-gray-100 dark:bg-gray-900 flex-1">
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

      {/* Schedule List */}
      <ScrollView className="p-4">
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-lg font-medium text-gray-600 dark:text-gray-400">
              Loading Schedules...
            </Text>
          </View>
        ) : isError ? (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-lg font-medium text-red-500 dark:text-red-400">
              Error: {error?.message || "Something went wrong"}
            </Text>
          </View>
        ) : data?.length > 0 ? (
          data.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl mb-4 shadow-md shadow-gray-300 dark:shadow-gray-700 active:bg-gray-50 dark:active:bg-gray-700"
              onPress={() => goToPassengerInfo(item._id, item.ticket_price)}
            >
              <View className="flex flex-row justify-between items-center">
                {/* Left: Route Info */}
                <View className="flex flex-row items-center space-x-4">
                  <FontAwesome name="bus" size={36} color="#84cc16" />
                  <View className="flex flex-col">
                    <View className="flex flex-row items-center space-x-2">
                      <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                        {item.from}
                      </Text>
                      <Text className="text-sm font-medium text-white bg-lime-500 dark:bg-lime-600 px-2 py-1 rounded-full">
                        To
                      </Text>
                      <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                        {item.to}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Right: Price */}
                <View className="flex flex-col items-end">
                  <Text className="text-2xl font-bold text-lime-500 dark:text-lime-400">
                    {item?.ticket_price || "N/A"}
                  </Text>
                  <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    ETB
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-lg font-medium text-gray-600 dark:text-gray-400">
              No schedules available
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchResults;
