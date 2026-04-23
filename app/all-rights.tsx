import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RightsCard } from "@/components/RightsCard";
import { useColors } from "@/hooks/useColors";
import { rightsCategories } from "@/data/rights";

interface FlatRight {
  id: string;
  title: string;
  summary: string;
  reference: string;
  categoryId: string;
  categoryTitle: string;
}

const ALL_RIGHTS: FlatRight[] = rightsCategories.flatMap((cat) =>
  cat.items.map((item) => ({
    ...item,
    categoryId: cat.id,
    categoryTitle: cat.title,
  })),
);

const FILTER_LABELS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  ...rightsCategories.map((cat) => ({ id: cat.id, label: cat.title })),
];

export default function AllRightsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filtered = useMemo(() => {
    return ALL_RIGHTS.filter((item) => {
      const matchesCat = selectedCategory === "all" || item.categoryId === selectedCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.reference.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: (Platform.OS === "web" ? 67 : insets.top) + 12,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Know Your Rights</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {filtered.length} of {ALL_RIGHTS.length} rights
          </Text>
        </View>
      </View>

      {/* Search */}
      <View
        style={[styles.searchWrap, { borderColor: colors.border, backgroundColor: colors.card }]}
      >
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search rights..."
          placeholderTextColor={colors.mutedForeground}
          style={[styles.searchInput, { color: colors.foreground }]}
          clearButtonMode="while-editing"
          autoFocus
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")} hitSlop={8}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {/* Category Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
      >
        {FILTER_LABELS.map((f) => (
          <Pressable
            key={f.id}
            onPress={() => setSelectedCategory(f.id)}
            style={[
              styles.chip,
              {
                backgroundColor: selectedCategory === f.id ? colors.navy : "transparent",
                borderColor: selectedCategory === f.id ? colors.navy : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: selectedCategory === f.id ? "#fff" : colors.mutedForeground,
                },
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Rights List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <RightsCard
            id={item.id}
            title={item.title}
            summary={item.summary}
            reference={item.reference}
            onPress={() =>
              router.push({
                pathname: "/rights/[id]",
                params: { id: item.id, categoryId: item.categoryId },
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Feather name="book-open" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No rights found{search.trim() ? ` for "${search}"` : ""}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 14,
    gap: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  headerSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    padding: 0,
  },
  filterScroll: {
    flexGrow: 0,
    marginBottom: 8,
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  list: {
    padding: 16,
    gap: 10,
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
});
