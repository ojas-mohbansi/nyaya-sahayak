import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RightsCard } from "@/components/RightsCard";
import { useColors } from "@/hooks/useColors";
import { rightsCategories } from "@/data/rights";

export default function CategoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = rightsCategories.find((c) => c.id === id);

  if (!category) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground, textAlign: "center", marginTop: 100 }}>
          Category not found
        </Text>
      </View>
    );
  }

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
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </Pressable>
        <View style={styles.headerContent}>
          <View style={styles.headerIconWrap}>
            <Feather name={category.icon as any} size={24} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>{category.title}</Text>
          <Text style={styles.headerCount}>
            {category.items.length} {category.items.length === 1 ? "article" : "articles"}
          </Text>
        </View>
      </View>

      <FlatList
        data={category.items}
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
                params: { id: item.id, categoryId: category.id },
              })
            }
          />
        )}
      />
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
  },
  backBtn: {
    padding: 4,
    marginBottom: 12,
  },
  headerContent: {
    gap: 8,
  },
  headerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
  },
  headerCount: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.6)",
  },
  list: {
    padding: 16,
    gap: 10,
  },
});
