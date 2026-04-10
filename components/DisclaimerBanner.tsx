import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

export function DisclaimerBanner() {
  const colors = useColors();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.goldLight, borderRadius: colors.radius },
      ]}
    >
      <Feather name="info" size={16} color={colors.warn} />
      <Text style={[styles.text, { color: colors.warn }]}>
        This app provides legal information only, not legal advice. Always consult a qualified
        lawyer for specific legal matters.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    marginHorizontal: 20,
  },
  text: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
});
