import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

const ONBOARDED_KEY = "nyaya_onboarded";

export default function RootIndex() {
  const [destination, setDestination] = useState<"loading" | "onboarding" | "tabs">("loading");

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDED_KEY).then((val) => {
      setDestination(val === "1" ? "tabs" : "onboarding");
    });
  }, []);

  if (destination === "loading") {
    return <View style={{ flex: 1 }} />;
  }

  if (destination === "onboarding") {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
