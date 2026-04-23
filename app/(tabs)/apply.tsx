import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProcedureCard } from "@/components/ProcedureCard";
import { SearchBar } from "@/components/SearchBar";
import { useColors } from "@/hooks/useColors";
import { useFontSizes } from "@/hooks/useFontSizes";
import { useTranslation } from "@/hooks/useTranslation";
import { procedures } from "@/data/procedures";

const CATEGORIES_EN = ["All", "Legal Services", "Transparency", "Food Security", "Democracy", "Identity", "Social Welfare", "Employment"];
const CATEGORIES_HI = ["सभी", "कानूनी सेवाएं", "पारदर्शिता", "खाद्य सुरक्षा", "लोकतंत्र", "पहचान", "सामाजिक कल्याण", "रोज़गार"];

export default function ApplyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const fs = useFontSizes();
  const t = useTranslation();
  const isHindi = t.tabApply === 'आवेदन';

  const CATEGORIES = isHindi ? CATEGORIES_HI : CATEGORIES_EN;
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCategoryEn = CATEGORIES_EN[selectedCategoryIdx];

  const filtered = procedures.filter((p) => {
    const matchesCategory = selectedCategoryIdx === 0 || p.category === selectedCategoryEn;
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.navy,
            paddingTop: (Platform.OS === "web" ? 67 : insets.top) + 16,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { fontSize: fs.xl }]}>{t.applyFor}</Text>
            <Text style={[styles.headerSub, { fontSize: fs.sm }]}>{t.applyForSub}</Text>
          </View>
          <Pressable
            onPress={() => router.push("/settings" as any)}
            style={styles.headerBtn}
            hitSlop={8}
            accessibilityLabel="Settings"
          >
            <Feather name="settings" size={20} color="rgba(255,255,255,0.85)" />
          </Pressable>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t.searchProcedures}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
      >
        {CATEGORIES.map((cat, idx) => (
          <Pressable
            key={cat}
            onPress={() => setSelectedCategoryIdx(idx)}
            style={[
              styles.chip,
              {
                backgroundColor: selectedCategoryIdx === idx ? colors.navy : "transparent",
                borderColor: selectedCategoryIdx === idx ? colors.navy : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: selectedCategoryIdx === idx ? "#fff" : colors.mutedForeground,
                  fontSize: fs.sm,
                },
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.list, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="inbox" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground, fontSize: fs.base }]}>
              {t.noProceduresFound}
            </Text>
          </View>
        ) : (
          filtered.map((proc) => (
            <ProcedureCard
              key={proc.id}
              title={proc.title}
              category={proc.category}
              icon={proc.icon}
              color={proc.color}
              stepsCount={proc.steps.length}
              onPress={() =>
                router.push({
                  pathname: "/procedure/[id]",
                  params: { id: proc.id },
                })
              }
            />
          ))
        )}
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
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerBtn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
  },
  headerSub: {
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipText: {
    fontFamily: "Inter_500Medium",
  },
  scroll: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    gap: 10,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontFamily: "Inter_500Medium",
  },
});
