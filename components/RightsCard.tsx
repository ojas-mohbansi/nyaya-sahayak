import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useBookmarks } from "@/context/BookmarkContext";
import { useColors } from "@/hooks/useColors";
import { useFontSizes } from "@/hooks/useFontSizes";

interface RightsCardProps {
  id: string;
  title: string;
  summary: string;
  reference: string;
  onPress: () => void;
}

export const RightsCard = React.memo(function RightsCard({ id, title, summary, reference, onPress }: RightsCardProps) {
  const colors = useColors();
  const fonts = useFontSizes();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(id);

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
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground, fontSize: fonts.base }]}>{title}</Text>
          <Text style={[styles.summary, { color: colors.mutedForeground, fontSize: fonts.sm }]} numberOfLines={2}>
            {summary}
          </Text>
        </View>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            toggleBookmark(id);
          }}
          hitSlop={12}
        >
          <Feather
            name={bookmarked ? "bookmark" : "bookmark"}
            size={20}
            color={bookmarked ? colors.gold : colors.mutedForeground}
            style={{ opacity: bookmarked ? 1 : 0.4 }}
          />
        </Pressable>
      </View>
      <View style={[styles.refBadge, { backgroundColor: colors.secondary }]}>
        <Text style={[styles.refText, { color: colors.mutedForeground, fontSize: fonts.xs }]} numberOfLines={1}>
          {reference}
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  title: {
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  summary: {
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  refBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  refText: {
    fontFamily: "Inter_500Medium",
  },
});
