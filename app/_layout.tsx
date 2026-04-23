import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

import featherFontBase64 from "@/constants/featherFontBase64";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppSettingsProvider } from "@/context/AppSettingsContext";
import { BookmarkProvider } from "@/context/BookmarkContext";
import { EmergencyContactsProvider } from "@/context/EmergencyContactsContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { initSearchDb } from "@/utils/searchDb";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false, headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, animation: "fade" }} />
      <Stack.Screen name="search" options={{ headerShown: false, animation: "fade" }} />
      <Stack.Screen name="bookmarks" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="category/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="rights/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="procedure/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="share" options={{ headerShown: false }} />
      <Stack.Screen name="developer" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    // Feather icon font — embed as base64 data URI on web so it is
    // completely self-contained and never requires a network request.
    feather: Platform.OS === "web"
      ? (featherFontBase64 as any)
      : require("../assets/fonts/Feather.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      initSearchDb().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppSettingsProvider>
            <BookmarkProvider>
              <RecentlyViewedProvider>
                <EmergencyContactsProvider>
                  <GestureHandlerRootView>
                    <RootLayoutNav />
                  </GestureHandlerRootView>
                </EmergencyContactsProvider>
              </RecentlyViewedProvider>
            </BookmarkProvider>
          </AppSettingsProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
