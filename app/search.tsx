import { Feather } from "@expo/vector-icons";
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SearchBar } from "@/components/SearchBar";
import { useColors } from "@/hooks/useColors";
import { rightsCategories } from "@/data/rights";
import { procedures } from "@/data/procedures";
import { ftsSearch, type FTSResult } from "@/utils/searchDb";

interface SearchResult {
  id: string;
  title: string;
  summary: string;
  type: "right" | "procedure";
  categoryId?: string;
}

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [ftsResults, setFtsResults] = useState<FTSResult[]>([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  /* ── Check voice availability on mount ── */
  useEffect(() => {
    try {
      const avail = ExpoSpeechRecognitionModule.isRecognitionAvailable();
      const result = avail as unknown as boolean | Promise<boolean>;
      if (result && typeof (result as Promise<boolean>).then === "function") {
        (result as Promise<boolean>).then(setVoiceSupported).catch(() => setVoiceSupported(false));
      } else {
        setVoiceSupported(Boolean(result));
      }
    } catch {
      setVoiceSupported(false);
    }
  }, []);

  /* ── Pulse animation while listening ── */
  useEffect(() => {
    if (listening) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.35,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      pulseAnim.setValue(1);
    }
    return () => pulseLoop.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  /* ── Speech recognition events ── */
  useSpeechRecognitionEvent("result", (event) => {
    if (event.results?.[0]?.transcript) {
      setQuery(event.results[0].transcript);
    }
  });

  useSpeechRecognitionEvent("end", () => {
    setListening(false);
  });

  useSpeechRecognitionEvent("error", () => {
    setListening(false);
  });

  /* ── Start / stop voice ── */
  const toggleVoice = useCallback(async () => {
    if (listening) {
      ExpoSpeechRecognitionModule.stop();
      setListening(false);
      return;
    }
    try {
      const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!granted) return;
      ExpoSpeechRecognitionModule.start({
        lang: "en-IN",
        interimResults: true,
        maxAlternatives: 1,
        continuous: false,
      });
      setListening(true);
    } catch {
      setListening(false);
    }
  }, [listening]);

  /* ── SQLite FTS search (with in-memory fallback) ── */
  const allItemsFallback = React.useMemo<SearchResult[]>(() => {
    const items: SearchResult[] = [];
    for (const cat of rightsCategories) {
      for (const item of cat.items) {
        items.push({
          id: item.id,
          title: item.title,
          summary: item.summary,
          type: "right",
          categoryId: cat.id,
        });
      }
    }
    for (const proc of procedures) {
      items.push({ id: proc.id, title: proc.title, summary: proc.description, type: "procedure" });
    }
    return items;
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setFtsResults([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      ftsSearch(q)
        .then((r) => {
          if (!cancelled) setFtsResults(r);
        })
        .catch(() => {
          if (!cancelled) setFtsResults([]);
        });
    }, 120);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const results: SearchResult[] = React.useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    if (ftsResults.length > 0) return ftsResults;
    return allItemsFallback.filter(
      (item) =>
        item.title.toLowerCase().includes(q.toLowerCase()) ||
        item.summary.toLowerCase().includes(q.toLowerCase()),
    );
  }, [query, ftsResults, allItemsFallback]);

  const trending = [
    "RTI",
    "Domestic Violence",
    "Ration Card",
    "MGNREGA",
    "Consumer Rights",
    "Aadhaar Update",
  ];

  const handleResultPress = (result: SearchResult) => {
    if (result.type === "right" && result.categoryId) {
      router.push({
        pathname: "/rights/[id]",
        params: { id: result.id, categoryId: result.categoryId },
      });
    } else {
      router.push({ pathname: "/procedure/[id]", params: { id: result.id } });
    }
  };

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
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <SearchBar value={query} onChangeText={setQuery} autoFocus />
        </View>
        {voiceSupported && (
          <Pressable onPress={toggleVoice} hitSlop={10} style={styles.micBtn}>
            <Animated.View
              style={[
                styles.micRipple,
                {
                  backgroundColor: listening ? colors.error + "25" : "transparent",
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            />
            <Feather
              name="mic"
              size={22}
              color={listening ? colors.error : colors.mutedForeground}
            />
          </Pressable>
        )}
      </View>

      {listening && (
        <View
          style={[
            styles.listeningBanner,
            { backgroundColor: colors.error + "12", borderColor: colors.error + "30" },
          ]}
        >
          <Feather name="mic" size={13} color={colors.error} />
          <Text style={[styles.listeningText, { color: colors.error }]}>Listening… speak now</Text>
          <Pressable onPress={toggleVoice} hitSlop={8}>
            <Feather name="x" size={14} color={colors.error} />
          </Pressable>
        </View>
      )}

      {!query.trim() ? (
        <View style={styles.trendingWrap}>
          <Text style={[styles.trendingTitle, { color: colors.navy }]}>Trending Searches</Text>
          <View style={styles.trendingList}>
            {trending.map((tr) => (
              <Pressable
                key={tr}
                onPress={() => setQuery(tr)}
                style={[
                  styles.trendingChip,
                  { backgroundColor: colors.secondary, borderColor: colors.border },
                ]}
              >
                <Feather name="trending-up" size={12} color={colors.mutedForeground} />
                <Text style={[styles.trendingText, { color: colors.foreground }]}>{tr}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleResultPress(item)}
              style={[
                styles.resultCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <View
                style={[
                  styles.resultIcon,
                  {
                    backgroundColor:
                      item.type === "right" ? colors.navy + "15" : colors.accent + "30",
                  },
                ]}
              >
                <Feather
                  name={item.type === "right" ? "book-open" : "file-text"}
                  size={16}
                  color={item.type === "right" ? colors.navy : colors.accent}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.resultTitle, { color: colors.foreground }]}>{item.title}</Text>
                <Text
                  style={[styles.resultSummary, { color: colors.mutedForeground }]}
                  numberOfLines={2}
                >
                  {item.summary}
                </Text>
              </View>
              <View
                style={[
                  styles.typeBadge,
                  {
                    backgroundColor:
                      item.type === "right" ? colors.navy + "15" : colors.accent + "30",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.typeText,
                    { color: item.type === "right" ? colors.navy : colors.warn },
                  ]}
                >
                  {item.type === "right" ? "Right" : "Procedure"}
                </Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Feather name="search" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No results found for &ldquo;{query}&rdquo;
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 8,
  },
  micBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
  },
  micRipple: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  listeningBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  listeningText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  trendingWrap: { padding: 20 },
  trendingTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  trendingList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  trendingChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  trendingText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  resultsList: { padding: 16, gap: 10 },
  resultCard: {
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  resultIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  resultTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  resultSummary: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  typeText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
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
