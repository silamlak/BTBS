import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getBookingSearchFun } from "../../feature/booking/bookingApi";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setScheduleId } from "../../feature/booking/bookingSlice";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

const SearchResults = () => {
  const { query, to } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  // Fetch data using useQuery hook
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["searchResults", query],
    queryFn: () => getBookingSearchFun(query),
  });

  console.log(data);

  // Function to format the `schedule` date field
  const formatScheduleDate = (date) => moment(date).format("MMM Do YYYY");

  // Function to navigate to the Passenger Info screen
  const goToPassengerInfo = (id, bus_id) => {
    dispatch(setScheduleId({ id }));
    router.push(`/passengerInfo?${query}`);
  };

  return (
    <View className="bg-gray-100 flex-1">
      {/* Title */}
      <View className="flex justify-center gap-4 p-4 items-end flex-row mb-6 bg-white shadow shadow-black">
        <FontAwesome name="bus" size={24} color="lime" />
        <Text className="text-xl font-semibold mt-2">Select Schedule</Text>
      </View>

      <View className="p-4">
        {isLoading ? (
          <Text className="text-lg text-gray-600">Loading...</Text>
        ) : isError ? (
          <Text className="text-lg text-red-500">Error: {error.message}</Text>
        ) : (
          data?.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white p-4 rounded-3xl mb-4 shadow-md"
              onPress={() => goToPassengerInfo(item._id, item.bus_id)}
            >
              <View className="flex flex-row justify-between gap-2 items-center">
                <View className="flex flex-row justify-between gap-2 items-center">
                  <FontAwesome name="bus" size={34} color="lime" />
                  <View className="flex flex-row justify-between gap-2 items-center">
                    <Text className="text-xl font-semibold mb-2">
                      {item.from}
                    </Text>
                    <Text className="text-sm p-2 rounded-full bg-lime-300 font-semibold mb-2">
                      To
                    </Text>
                    {/* <FontAwesome5 name="arrow-right" size={16} color="gray" /> */}
                    <Text className="text-xl font-semibold mb-2">
                      {item.to}
                    </Text>
                  </View>
                </View>
                <View className="p-4  flex flex-col items-center">
                  <Text className="text-3xl text-lime-500 font-semibold">
                    {item?.ticket_price}
                  </Text>
                  <Text className="text-md text-gray-500 -mt-2 font-semibold">
                    ETB
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
};

export default SearchResults;
