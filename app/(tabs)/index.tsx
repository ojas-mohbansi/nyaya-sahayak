import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryCard } from "@/components/CategoryCard";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { SearchBar } from "@/components/SearchBar";
import { SectionHeader } from "@/components/SectionHeader";
import { useBookmarks } from "@/context/BookmarkContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useColors } from "@/hooks/useColors";
import { useFontSizes } from "@/hooks/useFontSizes";
import { useTranslation } from "@/hooks/useTranslation";
import { rightsCategories } from "@/data/rights";
import { procedures } from "@/data/procedures";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const DAILY_RIGHTS = [
  { id: "art21", title: "Right to Life & Liberty", ref: "Article 21", catId: "constitutional" },
  { id: "art14", title: "Right to Equality", ref: "Article 14", catId: "constitutional" },
  { id: "art19", title: "Right to Freedom", ref: "Article 19", catId: "constitutional" },
  { id: "art32", title: "Right to Constitutional Remedies", ref: "Article 32", catId: "constitutional" },
  { id: "rti-basics", title: "Right to Information", ref: "RTI Act 2005", catId: "rti" },
  { id: "cr_007", title: "Right Against Arbitrary Arrest", ref: "Article 22", catId: "constitutional" },
  { id: "dv-rights", title: "Protection from Domestic Violence", ref: "DV Act 2005", catId: "domestic-violence" },
  { id: "workplace-harassment", title: "Right Against Workplace Harassment", ref: "POSH Act 2013", catId: "family" },
  { id: "mgnrega-guarantee", title: "MGNREGA Employment Guarantee", ref: "MGNREGA 2005", catId: "mgnrega" },
  { id: "cyber-crime-rights", title: "Rights of Cybercrime Victims", ref: "IT Act 2000", catId: "cyber" },
];

const TRENDING = ["RTI", "Domestic Violence", "Ration Card", "MGNREGA", "Consumer Rights", "Aadhaar Update"];

const QUICK_ACTIONS = [
  { label: "File RTI", sub: "Right to Information", icon: "file-text" as const, color: "#2d3e50", route: "procedure", id: "rti-application" },
  { label: "Women's Help", sub: "Helpline & Rights", icon: "heart" as const, color: "#783232", route: "tab", tab: "emergency" },
  { label: "Find Legal Aid", sub: "Nearest DLSA", icon: "map-pin" as const, color: "#2d7a4f", route: "tab", tab: "map" },
  { label: "Documents", sub: "Aadhaar, Voter ID…", icon: "credit-card" as const, color: "#b07d2a", route: "tab", tab: "apply" },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const fs = useFontSizes();
  const t = useTranslation();
  const { bookmarks } = useBookmarks();
  const { recentItems } = useRecentlyViewed();

  const [rotdIndex, setRotdIndex] = useState(() => new Date().getDate() % DAILY_RIGHTS.length);
  const dailyRight = DAILY_RIGHTS[rotdIndex];

  const rotateROTD = useCallback(() => {
    setRotdIndex((i) => (i + 1) % DAILY_RIGHTS.length);
  }, []);

  const openROTD = () => {
    const cat = rightsCategories.find((c) => c.id === dailyRight.catId);
    if (cat) {
      router.push({
        pathname: "/rights/[id]",
        params: { id: dailyRight.id, categoryId: cat.id },
      });
    }
  };

  const handleQuickAction = (action: typeof QUICK_ACTIONS[number]) => {
    if (action.route === "procedure" && action.id) {
      router.push({ pathname: "/procedure/[id]", params: { id: action.id } });
    } else if (action.route === "tab" && action.tab) {
      router.push(`/(tabs)/${action.tab}` as any);
    }
  };

  const handleTrending = (term: string) => {
    router.push("/search" as any);
  };

  const handleRecentPress = (item: typeof recentItems[number]) => {
    if (item.type === "right" && item.categoryId) {
      router.push({ pathname: "/rights/[id]", params: { id: item.id, categoryId: item.categoryId } });
    } else {
      router.push({ pathname: "/procedure/[id]", params: { id: item.id } });
    }
  };

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.navy, "#1a2a3a", "#3a2222"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.hero,
          { paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 20 },
        ]}
      >
        <View style={styles.heroTop}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.heroGreeting, { fontSize: fs.sm }]}>{t.namaste}</Text>
            <Text style={[styles.heroTitle, { fontSize: fs.xxl }]}>{t.homeTitle}</Text>
            <Text style={[styles.heroTagline, { fontSize: fs.xs }]}>{t.legalLiteracy}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable onPress={() => router.push("/bookmarks")} style={styles.headerBtn} hitSlop={8}>
              <Feather name="bookmark" size={20} color="#fff" />
              {bookmarks.length > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.gold }]}>
                  <Text style={styles.badgeText}>{bookmarks.length}</Text>
                </View>
              )}
            </Pressable>
            <Pressable onPress={() => router.push("/settings" as any)} style={styles.headerBtn} hitSlop={8}>
              <Feather name="settings" size={20} color="rgba(255,255,255,0.7)" />
            </Pressable>
          </View>
        </View>
        <View style={{ paddingTop: 14 }}>
          <SearchBar
            value=""
            onChangeText={() => {}}
            editable={false}
            onPress={() => router.push("/search")}
            placeholder="Search rights, procedures..."
          />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions Grid */}
        <View style={styles.qaGrid}>
          {QUICK_ACTIONS.map((action) => (
            <Pressable
              key={action.label}
              onPress={() => handleQuickAction(action)}
              style={({ pressed }) => [
                styles.qaCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View style={[styles.qaIconWrap, { backgroundColor: action.color + "18" }]}>
                <Feather name={action.icon} size={22} color={action.color} />
              </View>
              <Text style={[styles.qaLabel, { color: colors.foreground }]}>{action.label}</Text>
              <Text style={[styles.qaSub, { color: colors.mutedForeground }]}>{action.sub}</Text>
            </Pressable>
          ))}
        </View>

        {/* Right of the Day */}
        <View style={styles.rotdRow}>
          <Text style={[styles.rotdSectionLabel, { color: colors.navy, fontSize: fs.lg }]}>{t.rightOfTheDay}</Text>
          <Pressable onPress={rotateROTD} hitSlop={8} style={styles.rotateBtn}>
            <Text style={[styles.rotateBtnText, { color: colors.mutedForeground, fontSize: fs.sm }]}>{t.rotate}</Text>
          </Pressable>
        </View>
        <Pressable
          onPress={openROTD}
          style={({ pressed }) => [
            styles.rotdCard,
            {
              backgroundColor: colors.navy,
              borderRadius: colors.radius,
              opacity: pressed ? 0.93 : 1,
            },
          ]}
        >
          <View style={styles.rotdDecor} />
          <Text style={[styles.rotdLabel, { fontSize: fs.xs }]}>{t.featuredRight}</Text>
          <Text style={[styles.rotdTitle, { fontSize: fs.xl }]}>{dailyRight.title}</Text>
          <Text style={[styles.rotdPreview, { fontSize: fs.xs }]}>{t.tapToRead}</Text>
          <Text style={styles.rotdRef}>{dailyRight.ref} → Tap to read more</Text>
          <View style={styles.rotdArrow}>
            <Feather name="arrow-right" size={16} color={colors.gold} />
          </View>
        </Pressable>

        {/* Trending Topics */}
        <SectionHeader title={t.trendingTopics} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendingRow}
        >
          {TRENDING.map((t) => (
            <Pressable
              key={t}
              onPress={() => handleTrending(t)}
              style={({ pressed }) => [
                styles.trendingChip,
                {
                  backgroundColor: colors.secondary,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text style={[styles.trendingText, { color: colors.foreground }]}>🔥 {t}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Recently Viewed */}
        {recentItems.length > 0 && (
          <>
            <SectionHeader title={t.recentlyViewed} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentRow}
            >
              {recentItems.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => handleRecentPress(item)}
                  style={({ pressed }) => [
                    styles.recentCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      borderRadius: colors.radius,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <View style={[styles.recentIcon, { backgroundColor: item.type === "right" ? colors.navy + "18" : colors.gold + "28" }]}>
                    <Feather
                      name={item.type === "right" ? "book-open" : "file-text"}
                      size={16}
                      color={item.type === "right" ? colors.navy : colors.warn}
                    />
                  </View>
                  <Text style={[styles.recentTitle, { color: colors.foreground }]} numberOfLines={2}>{item.title}</Text>
                  <Text style={[styles.recentType, { color: colors.mutedForeground }]}>
                    {item.type === "right" ? "Right" : "Procedure"}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        <DisclaimerBanner />

        {/* Know Your Rights */}
        <SectionHeader
          title={t.knowYourRights}
          actionText="View All →"
          onAction={() => router.push("/all-rights" as any)}
        />
        <View style={styles.grid}>
          {rightsCategories.map((cat) => (
            <View key={cat.id} style={styles.gridItem}>
              <CategoryCard
                title={cat.title}
                icon={cat.icon}
                color={cat.color}
                itemCount={cat.items.length}
                onPress={() =>
                  router.push({
                    pathname: "/category/[id]",
                    params: { id: cat.id },
                  })
                }
              />
            </View>
          ))}
        </View>

        {/* Emergency Bar */}
        <Pressable
          onPress={() => router.push("/(tabs)/emergency" as any)}
          style={({ pressed }) => [
            styles.emergencyBar,
            {
              borderColor: "#f0c0c0",
              borderRadius: colors.radius,
              backgroundColor: pressed ? "#fce8e8" : "#fdf0f0",
            },
          ]}
        >
          <Text style={styles.emergencyEmoji}>🚨</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.emergencyTitle, { color: colors.burgundy, fontSize: fs.sm }]}>{t.emergencyHelplines}</Text>
            <Text style={[styles.emergencySub, { color: colors.mutedForeground, fontSize: fs.xs }]}>Women · Police · Child · NALSA</Text>
          </View>
          <Pressable
            onPress={(e) => {
              e.stopPropagation?.();
              router.push("/(tabs)/emergency" as any);
            }}
            style={[styles.sosBtn, { backgroundColor: colors.burgundy }]}
          >
            <Text style={styles.sosBtnText}>SOS</Text>
          </Pressable>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroGreeting: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Inter_400Regular",
  },
  heroTitle: {
    fontSize: 26,
    color: "#ffffff",
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    marginTop: 2,
  },
  heroTagline: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 4,
    paddingTop: 2,
  },
  headerBtn: {
    padding: 8,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: "#2d3e50",
  },
  scroll: { flex: 1 },
  scrollContent: {
    gap: 0,
    paddingTop: 16,
  },
  qaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  qaCard: {
    width: (SCREEN_WIDTH - 42) / 2,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  qaIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  qaLabel: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  qaSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: -4,
  },
  rotdRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  rotdSectionLabel: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  rotateBtn: { padding: 4 },
  rotateBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  rotdCard: {
    marginHorizontal: 16,
    padding: 20,
    position: "relative",
    overflow: "hidden",
    marginBottom: 20,
  },
  rotdDecor: {
    position: "absolute",
    right: -20,
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(200,170,120,0.12)",
  },
  rotdLabel: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1,
    marginBottom: 6,
  },
  rotdTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  rotdPreview: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.6)",
    marginBottom: 4,
    lineHeight: 17,
  },
  rotdRef: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "#c8aa78",
    marginTop: 6,
  },
  rotdArrow: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  trendingRow: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 8,
  },
  trendingChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
  },
  trendingText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  recentRow: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 10,
  },
  recentCard: {
    width: 140,
    padding: 12,
    borderWidth: 1,
    gap: 8,
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  recentTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 18,
  },
  recentType: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  gridItem: {
    width: (SCREEN_WIDTH - 42) / 2,
  },
  emergencyBar: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
  },
  emergencyEmoji: { fontSize: 24 },
  emergencyTitle: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  emergencySub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  sosBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sosBtnText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
});
