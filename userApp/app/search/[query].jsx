import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getBookingSearchFun } from "../../feature/booking/bookingApi";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setScheduleId } from "../../feature/booking/bookingSlice";

const SearchResults = () => {
  const { query } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  // Fetch data using useQuery hook
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["searchResults", query],
    queryFn: () => getBookingSearchFun(query),
  });

  // Function to format the `schedule` date field
  const formatScheduleDate = (date) => moment(date).format("MMM Do YYYY");

  // Function to navigate to the Passenger Info screen
  const goToPassengerInfo = (id, bus_id) => {
    dispatch(setScheduleId({ id }));
    router.push(`/passengerInfo?${query}`);
  };

  return (
    <View className="p-4 bg-gray-100 flex-1">
      <Text className="text-xl font-bold mb-4">
        Search results for: {query}
      </Text>

      {isLoading ? (
        <Text className="text-lg text-gray-600">Loading...</Text>
      ) : isError ? (
        <Text className="text-lg text-red-500">Error: {error.message}</Text>
      ) : (
        data?.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white p-4 rounded-lg mb-4 shadow-md"
            onPress={() => goToPassengerInfo(item._id, item.bus_id)}
          >
            {/* Display 'from' and 'to' strings */}
            <Text className="text-lg mb-2">From: {item.from}</Text>
            <Text className="text-lg mb-2">To: {item.to}</Text>
            {/* Format the 'schedule' date */}
            <Text className="text-lg">
              Schedule: {formatScheduleDate(item.schedule)}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

export default SearchResults;
