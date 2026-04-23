import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface EmergencyButtonProps {
  name: string;
  number: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export function EmergencyButton({
  name,
  number,
  description,
  icon,
  color,
  onPress,
}: EmergencyButtonProps) {
  const colors = useColors();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: color,
          borderRadius: colors.radius,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <View style={styles.iconWrap}>
        <Feather name={icon as any} size={24} color="#ffffff" />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
      </View>
      <View style={styles.numberWrap}>
        <Text style={styles.number}>{number}</Text>
        <Feather name="phone" size={16} color="#ffffff" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
  },
  description: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.7)",
  },
  numberWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
  },
  number: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
  },
});
