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
import { ProcedureCard } from "@/components/ProcedureCard";
import { useBookmarks } from "@/context/BookmarkContext";
import { useColors } from "@/hooks/useColors";
import { rightsCategories } from "@/data/rights";
import { procedures } from "@/data/procedures";

type FilterType = "all" | "rights" | "procedures";

export default function BookmarksScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookmarks, procedureBookmarks } = useBookmarks();
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [sortAZ, setSortAZ] = useState(false);

  const bookmarkedRights = useMemo(() => {
    return rightsCategories
      .flatMap((cat) =>
        cat.items
          .filter((item) => bookmarks.includes(item.id))
          .map((item) => ({ ...item, categoryId: cat.id, kind: "right" as const }))
      )
      .filter((item) => !search.trim() || item.title.toLowerCase().includes(search.toLowerCase()));
  }, [bookmarks, search]);

  const bookmarkedProcedures = useMemo(() => {
    return procedures
      .filter((p) => procedureBookmarks.includes(p.id))
      .map((p) => ({ ...p, kind: "procedure" as const }))
      .filter((p) => !search.trim() || p.title.toLowerCase().includes(search.toLowerCase()));
  }, [procedureBookmarks, search]);

  type RightItem = typeof bookmarkedRights[number];
  type ProcItem = typeof bookmarkedProcedures[number];
  type CombinedItem = RightItem | ProcItem;

  const combinedItems: CombinedItem[] = useMemo(() => {
    let items: CombinedItem[] = [];
    if (filter === "all" || filter === "rights") items = [...items, ...bookmarkedRights];
    if (filter === "all" || filter === "procedures") items = [...items, ...bookmarkedProcedures];
    if (sortAZ) items = [...items].sort((a, b) => a.title.localeCompare(b.title));
    return items;
  }, [filter, bookmarkedRights, bookmarkedProcedures, sortAZ]);

  const FILTERS: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "rights", label: "Rights" },
    { id: "procedures", label: "Procedures" },
  ];

  const totalCount = bookmarks.length + procedureBookmarks.length;

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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Bookmarks {totalCount > 0 ? `(${totalCount})` : ""}
        </Text>
        <Pressable
          onPress={() => setSortAZ((v) => !v)}
          hitSlop={8}
          style={[
            styles.sortBtn,
            {
              backgroundColor: sortAZ ? colors.navy : colors.secondary,
              borderColor: sortAZ ? colors.navy : colors.border,
            },
          ]}
        >
          <Feather name="bar-chart-2" size={13} color={sortAZ ? "#fff" : colors.mutedForeground} />
          <Text style={[styles.sortBtnText, { color: sortAZ ? "#fff" : colors.mutedForeground }]}>
            A–Z
          </Text>
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search bookmarks..."
          placeholderTextColor={colors.mutedForeground}
          style={[styles.searchInput, { color: colors.foreground }]}
          clearButtonMode="while-editing"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")} hitSlop={8}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f.id}
            onPress={() => setFilter(f.id)}
            style={[
              styles.chip,
              {
                backgroundColor: filter === f.id ? colors.navy : "transparent",
                borderColor: filter === f.id ? colors.navy : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: filter === f.id ? "#fff" : colors.mutedForeground },
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* List */}
      <FlatList
        data={combinedItems}
        keyExtractor={(item) => `${item.kind}-${item.id}`}
        contentContainerStyle={[styles.list, { paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          if (item.kind === "right") {
            return (
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
            );
          }
          return (
            <ProcedureCard
              title={item.title}
              category={item.category}
              icon={item.icon}
              color={item.color}
              stepsCount={item.steps.length}
              onPress={() =>
                router.push({
                  pathname: "/procedure/[id]",
                  params: { id: item.id },
                })
              }
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Feather name="bookmark" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.mutedForeground }]}>
              {search.trim() ? `No results for "${search}"` : "No bookmarks yet"}
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {search.trim()
                ? "Try a different search term"
                : "Tap the bookmark icon on any right or procedure to save it here"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sortBtnText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
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
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  list: {
    padding: 16,
    gap: 10,
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
});
