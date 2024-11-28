import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { persistor, store } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
import "../global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <SafeAreaView className="flex-1 bg-inherit">
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(booking)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="search/[query]"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="+not-found"
                  options={{ headerShown: false }}
                />
              </Stack>
            </SafeAreaView>
            <StatusBar style="auto" />
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </PersistGate>
  );
}
