import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface CategoryCardProps {
  title: string;
  icon: string;
  color: string;
  itemCount: number;
  onPress: () => void;
}

export function CategoryCard({ title, icon, color, itemCount, onPress }: CategoryCardProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: color + "15" }]}>
        <Feather name={icon as any} size={22} color={color} />
      </View>
      <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
        {title}
      </Text>
      <Text style={[styles.count, { color: colors.mutedForeground }]}>
        {itemCount} {itemCount === 1 ? "article" : "articles"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 20,
  },
  count: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
