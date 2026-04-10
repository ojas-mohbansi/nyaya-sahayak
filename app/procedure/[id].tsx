import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EligibilityCalculator } from "@/components/EligibilityCalculator";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useBookmarks } from "@/context/BookmarkContext";
import { useColors } from "@/hooks/useColors";
import { useFontSizes } from "@/hooks/useFontSizes";
import { procedures } from "@/data/procedures";

function showToast(msg: string) {
  if (Platform.OS === "android") {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  }
}

function storageKey(id: string, type: "steps" | "docs") {
  return `nyaya_proc_${type}_${id}`;
}

export default function ProcedureDetailScreen() {
  const colors = useColors();
  const fonts = useFontSizes();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const procedure = procedures.find((p) => p.id === id);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [checkedDocs, setCheckedDocs] = useState<Set<number>>(new Set());
  const [showLetter, setShowLetter] = useState(false);
  const [letterCopied, setLetterCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const { addRecentItem } = useRecentlyViewed();
  const { isProcedureBookmarked, toggleProcedureBookmark } = useBookmarks();

  useEffect(() => {
    if (!procedure) return;
    addRecentItem({ id: procedure.id, title: procedure.title, type: "procedure" });
    AsyncStorage.multiGet([
      storageKey(procedure.id, "steps"),
      storageKey(procedure.id, "docs"),
    ]).then((pairs) => {
      for (const [key, val] of pairs) {
        if (val) {
          try {
            const arr: number[] = JSON.parse(val);
            if (key === storageKey(procedure.id, "steps")) {
              setCompletedSteps(new Set(arr));
            } else {
              setCheckedDocs(new Set(arr));
            }
          } catch {}
        }
      }
    });
  }, [procedure?.id]);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const handleSpeak = () => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    if (!procedure) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const stepsText = procedure.steps
      .map((s, i) => `Step ${i + 1}: ${s.title}. ${s.description}`)
      .join(". ");
    const text = `${procedure.title}. ${procedure.description}. Required documents: ${procedure.documents.join(", ")}. ${stepsText}`;
    setSpeaking(true);
    Speech.speak(text, {
      language: "en-IN",
      rate: 0.9,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  if (!procedure) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Pressable onPress={() => router.back()} style={{ padding: 20 }} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={{ color: colors.foreground, textAlign: "center", marginTop: 60 }}>
          Procedure not found
        </Text>
      </View>
    );
  }

  const bookmarked = isProcedureBookmarked(procedure.id);

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleProcedureBookmark(procedure.id);
  };

  const toggleStep = useCallback(
    (index: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCompletedSteps((prev) => {
        const next = new Set(prev);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        AsyncStorage.setItem(storageKey(procedure.id, "steps"), JSON.stringify([...next]));
        return next;
      });
    },
    [procedure.id]
  );

  const toggleDoc = useCallback(
    (index: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCheckedDocs((prev) => {
        const next = new Set(prev);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        AsyncStorage.setItem(storageKey(procedure.id, "docs"), JSON.stringify([...next]));
        return next;
      });
    },
    [procedure.id]
  );

  const handleReset = () => {
    Alert.alert(
      "Reset Progress",
      "This will clear all step progress and document checklist for this procedure. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setCompletedSteps(new Set());
            setCheckedDocs(new Set());
            AsyncStorage.multiRemove([
              storageKey(procedure.id, "steps"),
              storageKey(procedure.id, "docs"),
            ]);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const handleCopyLetter = async () => {
    if (!procedure.letterTemplate) return;
    await Clipboard.setStringAsync(procedure.letterTemplate);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLetterCopied(true);
    showToast("Letter template copied!");
    setTimeout(() => setLetterCopied(false), 2500);
  };

  const progress =
    procedure.steps.length > 0
      ? (completedSteps.size / procedure.steps.length) * 100
      : 0;
  const docsProgress =
    procedure.documents.length > 0
      ? (checkedDocs.size / procedure.documents.length) * 100
      : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: procedure.color,
            paddingTop: (Platform.OS === "web" ? 67 : insets.top) + 12,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable onPress={handleSpeak} style={styles.backBtn} hitSlop={12}>
              <Feather
                name={speaking ? "volume-x" : "volume-2"}
                size={20}
                color={speaking ? "#c8aa78" : "rgba(255,255,255,0.7)"}
              />
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
        <View style={[styles.categoryBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
          <Text style={styles.categoryText}>{procedure.category}</Text>
        </View>
        <Text style={styles.headerTitle}>{procedure.title}</Text>
        <Text style={[styles.headerDesc, { fontSize: fonts.sm }]}>{procedure.description}</Text>

        <View style={styles.progressWrap}>
          <View style={[styles.progressBar, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` as any, backgroundColor: "#c8aa78" },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {completedSteps.size}/{procedure.steps.length} steps done
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Documents Checklist */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.navy, fontSize: fonts.lg }]}>Required Documents</Text>
          {checkedDocs.size > 0 && (
            <Text style={[styles.sectionBadge, { color: colors.success }]}>
              {checkedDocs.size}/{procedure.documents.length} ready
            </Text>
          )}
        </View>
        <View
          style={[
            styles.docsCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          {procedure.documents.map((doc, idx) => (
            <Pressable
              key={idx}
              onPress={() => toggleDoc(idx)}
              style={({ pressed }) => [styles.docItem, { opacity: pressed ? 0.75 : 1 }]}
            >
              <View
                style={[
                  styles.docCheck,
                  {
                    backgroundColor: checkedDocs.has(idx) ? colors.success : "transparent",
                    borderColor: checkedDocs.has(idx) ? colors.success : colors.border,
                  },
                ]}
              >
                {checkedDocs.has(idx) && <Feather name="check" size={11} color="#fff" />}
              </View>
              <Text
                style={[
                  styles.docText,
                  {
                    color: checkedDocs.has(idx) ? colors.success : colors.foreground,
                    textDecorationLine: checkedDocs.has(idx) ? "line-through" : "none",
                    fontSize: fonts.md,
                  },
                ]}
              >
                {doc}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Letter Template */}
        {procedure.letterTemplate && (
          <>
            <Pressable
              onPress={() => setShowLetter((v) => !v)}
              style={[
                styles.letterToggle,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <Feather name="file-text" size={16} color={colors.navy} />
              <Text style={[styles.letterToggleText, { color: colors.navy }]}>
                {showLetter ? "Hide Letter Template" : "📄 View Auto-Generated Letter Template"}
              </Text>
              <Feather
                name={showLetter ? "chevron-up" : "chevron-down"}
                size={16}
                color={colors.mutedForeground}
              />
            </Pressable>

            {showLetter && (
              <View
                style={[
                  styles.letterCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <Text style={[styles.letterHint, { color: colors.mutedForeground }]}>
                  Replace the [fields in brackets] with your actual information before submitting.
                </Text>
                <Text style={[styles.letterText, { color: colors.foreground }]}>
                  {procedure.letterTemplate}
                </Text>
                <Pressable
                  onPress={handleCopyLetter}
                  style={({ pressed }) => [
                    styles.copyLetterBtn,
                    {
                      backgroundColor: letterCopied ? colors.success : colors.navy,
                      opacity: pressed ? 0.85 : 1,
                      borderRadius: colors.radius,
                    },
                  ]}
                >
                  <Feather
                    name={letterCopied ? "check" : "copy"}
                    size={16}
                    color="#fff"
                  />
                  <Text style={styles.copyLetterBtnText}>
                    {letterCopied ? "Copied!" : "Copy Letter"}
                  </Text>
                </Pressable>
              </View>
            )}
          </>
        )}

        {/* Eligibility Calculator */}
        {procedure.eligibilityType && (
          <EligibilityCalculator
            type={procedure.eligibilityType}
            accentColor={procedure.color}
          />
        )}

        {/* Steps */}
        <Text style={[styles.sectionTitle, { color: colors.navy }]}>Steps</Text>
        {procedure.steps.map((step, idx) => (
          <Pressable
            key={idx}
            onPress={() => toggleStep(idx)}
            style={[
              styles.stepCard,
              {
                backgroundColor: colors.card,
                borderColor: completedSteps.has(idx) ? colors.success : colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <View style={styles.stepHeader}>
              <View
                style={[
                  styles.stepCheck,
                  {
                    backgroundColor: completedSteps.has(idx) ? colors.success : "transparent",
                    borderColor: completedSteps.has(idx) ? colors.success : colors.border,
                  },
                ]}
              >
                {completedSteps.has(idx) ? (
                  <Feather name="check" size={12} color="#fff" />
                ) : (
                  <Text style={[styles.stepNum, { color: colors.mutedForeground }]}>
                    {idx + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepTitle,
                  {
                    color: completedSteps.has(idx) ? colors.success : colors.foreground,
                    textDecorationLine: completedSteps.has(idx) ? "line-through" : "none",
                  },
                ]}
              >
                {step.title}
              </Text>
            </View>
            <Text style={[styles.stepDesc, { color: colors.mutedForeground }]}>
              {step.description}
            </Text>
            {step.tip && (
              <View style={[styles.tipWrap, { backgroundColor: colors.goldLight }]}>
                <Feather name="zap" size={12} color={colors.warn} />
                <Text style={[styles.tipText, { color: colors.warn }]}>{step.tip}</Text>
              </View>
            )}
          </Pressable>
        ))}

        {/* Contact Card */}
        {(procedure.helpline || procedure.website) && (
          <View
            style={[
              styles.contactCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Text style={[styles.contactTitle, { color: colors.navy }]}>Need Help?</Text>
            {procedure.helpline && (
              <Pressable
                onPress={() => Linking.openURL(`tel:${procedure.helpline}`)}
                style={[styles.contactBtn, { backgroundColor: colors.primary }]}
              >
                <Feather name="phone" size={16} color="#fff" />
                <Text style={styles.contactBtnText}>Call {procedure.helpline}</Text>
              </Pressable>
            )}
            {procedure.website && (
              <Pressable
                onPress={() => Linking.openURL(`https://${procedure.website}`)}
                style={[styles.contactBtn, { backgroundColor: colors.accent }]}
              >
                <Feather name="globe" size={16} color={colors.navy} />
                <Text style={[styles.contactBtnText, { color: colors.navy }]}>
                  {procedure.website}
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Reset Progress Button */}
        {(completedSteps.size > 0 || checkedDocs.size > 0) && (
          <Pressable
            onPress={handleReset}
            style={({ pressed }) => [
              styles.resetBtn,
              {
                borderColor: colors.destructive,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Feather name="refresh-ccw" size={14} color={colors.destructive} />
            <Text style={[styles.resetBtnText, { color: colors.destructive }]}>
              Reset Progress
            </Text>
          </Pressable>
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
    gap: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backBtn: {
    padding: 4,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
  },
  headerDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
    lineHeight: 19,
  },
  progressWrap: {
    marginTop: 16,
    gap: 6,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.7)",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  sectionBadge: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  docsCard: {
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  docItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  docCheck: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  docText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  letterToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    padding: 14,
  },
  letterToggleText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  letterCard: {
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  letterHint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  letterText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  copyLetterBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    marginTop: 4,
  },
  copyLetterBtnText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  stepCard: {
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepCheck: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNum: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  stepTitle: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  stepDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    paddingLeft: 40,
  },
  tipWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    marginLeft: 40,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    lineHeight: 17,
  },
  contactCard: {
    borderWidth: 1,
    padding: 16,
    gap: 12,
    marginTop: 4,
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  contactBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 4,
  },
  resetBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
