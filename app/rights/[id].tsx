import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBookmarks } from "@/context/BookmarkContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useColors } from "@/hooks/useColors";
import { rightsCategories } from "@/data/rights";

function showToast(msg: string) {
  if (Platform.OS === "android") {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  }
}

export default function RightsDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id, categoryId } = useLocalSearchParams<{ id: string; categoryId: string }>();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { addRecentItem } = useRecentlyViewed();
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const category = rightsCategories.find((c) => c.id === categoryId);
  const item = category?.items.find((i) => i.id === id);

  useEffect(() => {
    if (item && category) {
      addRecentItem({ id: item.id, title: item.title, type: "right", categoryId: category.id });
    }
    return () => {
      Speech.stop();
    };
  }, [item?.id]);

  if (!item || !category) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Pressable onPress={() => router.back()} style={{ padding: 20 }} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={{ color: colors.foreground, textAlign: "center", marginTop: 60 }}>
          Content not found
        </Text>
      </View>
    );
  }

  const bookmarked = isBookmarked(item.id);

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleBookmark(item.id);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: item.title,
        message: `${item.title} (${item.reference})\n\n${item.summary}\n\nVia Nyaya Sahayak`,
      });
    } catch {}
  };

  const handleWhatsApp = async () => {
    const text = encodeURIComponent(
      `*${item.title}*\n_${item.reference}_\n\n${item.summary}\n\n${item.content.slice(0, 500)}...\n\nVia Nyaya Sahayak`
    );
    const url = `https://wa.me/?text=${text}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(`https://web.whatsapp.com/send?text=${text}`);
      }
    } catch {}
  };

  const handleCopy = async () => {
    const fullText = `${item.title} (${item.reference})\n\n${item.summary}\n\n${item.content}`;
    await Clipboard.setStringAsync(fullText);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    showToast("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleListen = async () => {
    if (speaking) {
      await Speech.stop();
      setSpeaking(false);
      return;
    }
    const textToRead = `${item.title}. ${item.summary}. ${item.content.replace(/\n/g, ". ")}`;
    setSpeaking(true);
    Speech.speak(textToRead, {
      language: "en-IN",
      rate: 0.9,
      onDone: () => setSpeaking(false),
      onError: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: category.color,
            paddingTop: (Platform.OS === "web" ? 67 : insets.top) + 12,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable onPress={handleListen} style={styles.backBtn} hitSlop={12}>
              <Feather
                name={speaking ? "pause-circle" : "volume-2"}
                size={19}
                color={speaking ? "#c8aa78" : "rgba(255,255,255,0.7)"}
              />
            </Pressable>
            <Pressable onPress={handleCopy} style={styles.backBtn} hitSlop={12}>
              <Feather
                name={copied ? "check" : "copy"}
                size={18}
                color={copied ? "#c8aa78" : "rgba(255,255,255,0.7)"}
              />
            </Pressable>
            <Pressable onPress={handleWhatsApp} style={styles.backBtn} hitSlop={12}>
              <Feather name="message-circle" size={19} color="rgba(255,255,255,0.7)" />
            </Pressable>
            <Pressable onPress={handleShare} style={styles.backBtn} hitSlop={12}>
              <Feather name="share-2" size={19} color="rgba(255,255,255,0.7)" />
            </Pressable>
            <Pressable onPress={handleBookmark} style={styles.backBtn} hitSlop={12}>
              <Feather
                name="bookmark"
                size={22}
                color={bookmarked ? "#c8aa78" : "rgba(255,255,255,0.5)"}
              />
            </Pressable>
          </View>
        </View>
        <Text style={styles.categoryLabel}>{category.title}</Text>
        <Text style={styles.headerTitle}>{item.title}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.refBadge,
            { backgroundColor: category.color + "15", borderRadius: colors.radius },
          ]}
        >
          <Feather name="book-open" size={14} color={category.color} />
          <Text style={[styles.refText, { color: category.color }]}>{item.reference}</Text>
        </View>

        <Text style={[styles.summary, { color: colors.mutedForeground }]}>{item.summary}</Text>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {item.content.split("\n\n").map((paragraph, idx) => (
          <Text key={idx} style={[styles.paragraph, { color: colors.foreground }]}>
            {paragraph}
          </Text>
        ))}

        {/* Action Buttons Row */}
        <View style={styles.actionRow}>
          <Pressable
            onPress={handleListen}
            style={({ pressed }) => [
              styles.actionBtn,
              {
                backgroundColor: speaking ? category.color + "20" : colors.secondary,
                borderColor: speaking ? category.color : colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Feather
              name={speaking ? "pause-circle" : "volume-2"}
              size={14}
              color={speaking ? category.color : colors.mutedForeground}
            />
            <Text style={[styles.actionBtnText, { color: speaking ? category.color : colors.mutedForeground }]}>
              {speaking ? "Stop" : "Listen"}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleCopy}
            style={({ pressed }) => [
              styles.actionBtn,
              {
                backgroundColor: copied ? colors.success + "20" : colors.secondary,
                borderColor: copied ? colors.success : colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Feather name={copied ? "check" : "copy"} size={14} color={copied ? colors.success : colors.mutedForeground} />
            <Text style={[styles.actionBtnText, { color: copied ? colors.success : colors.mutedForeground }]}>
              {copied ? "Copied!" : "Copy"}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleWhatsApp}
            style={({ pressed }) => [
              styles.actionBtn,
              {
                backgroundColor: "#25D36620",
                borderColor: "#25D366",
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Feather name="message-circle" size={14} color="#25D366" />
            <Text style={[styles.actionBtnText, { color: "#25D366" }]}>WhatsApp</Text>
          </Pressable>

          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [
              styles.actionBtn,
              {
                backgroundColor: colors.secondary,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Feather name="share-2" size={14} color={colors.mutedForeground} />
            <Text style={[styles.actionBtnText, { color: colors.mutedForeground }]}>Share</Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.disclaimer,
            { backgroundColor: colors.goldLight, borderRadius: colors.radius },
          ]}
        >
          <Feather name="info" size={14} color={colors.warn} />
          <Text style={[styles.disclaimerText, { color: colors.warn }]}>
            This is general legal information, not legal advice. Consult a lawyer for your specific situation.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  backBtn: {
    padding: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  refBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    alignSelf: "flex-start",
  },
  refText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  summary: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    lineHeight: 22,
  },
  divider: {
    height: 1,
  },
  paragraph: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
  actionRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
    flexWrap: "wrap",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    minWidth: 70,
  },
  actionBtnText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  disclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    marginTop: 4,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
});
