import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { useFontSizes } from "@/hooks/useFontSizes";

interface ProcedureCardProps {
  title: string;
  category: string;
  icon: string;
  color: string;
  stepsCount: number;
  onPress: () => void;
}

export const ProcedureCard = React.memo(function ProcedureCard({ title, category, icon, color, stepsCount, onPress }: ProcedureCardProps) {
  const colors = useColors();
  const fonts = useFontSizes();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.95 : 1,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: color + "15" }]}>
        <Feather name={icon as any} size={20} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.foreground, fontSize: fonts.base }]}>{title}</Text>
        <View style={styles.meta}>
          <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.badgeText, { color: colors.mutedForeground, fontSize: fonts.xs }]}>{category}</Text>
          </View>
          <Text style={[styles.steps, { color: colors.mutedForeground, fontSize: fonts.xs }]}>
            {stepsCount} steps
          </Text>
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontFamily: "Inter_600SemiBold",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  badgeText: {
    fontFamily: "Inter_500Medium",
  },
  steps: {
    fontFamily: "Inter_400Regular",
  },
});
