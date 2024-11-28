import { Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { getBookingSearchFun } from "../../feature/booking/bookingApi";
import { useQuery } from "@tanstack/react-query";

const SearchResults = () => {
  const { query } = useLocalSearchParams();
  console.log(query);

  // Ensure query is enabled only when on mobile
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["searchResults", query],
    queryFn: () => getBookingSearchFun(query),
    enabled: !!query && Platform.OS === "mobile", // Make sure this runs only in mobile
  });

  return (
    <View>
      <Text>Search results for: {query}</Text>
      {/* Render data if available */}
      {isLoading ? (
        <Text>Loading...</Text>
      ) : isError ? (
        <Text>Error: {error.message}</Text>
      ) : (
        <Text>{JSON.stringify(data)}</Text>
      )}
    </View>
  );
};

export default SearchResults;
