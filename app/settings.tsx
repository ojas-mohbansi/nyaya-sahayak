import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useFontSizes } from "@/hooks/useFontSizes";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppSettings } from "@/context/AppSettingsContext";
import { rightsCategories } from "@/data/rights";
import { SUPPORTED_LANGUAGES, UPCOMING_LANGUAGES } from "@/data/translations";
import { saveRegionalOffices } from "@/utils/regionalOfficesCache";
import { safeOpenURL } from "@/utils/safeLink";

const DAILY_TIP_ID = "nyaya-daily-tip";

const REGIONS = [
  "All",
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "Rajasthan",
  "Madhya Pradesh",
  "Andhra Pradesh",
  "Uttar Pradesh",
  "West Bengal",
  "Punjab",
  "Uttarakhand",
  "Jharkhand",
  "Chhattisgarh",
];

const allRightsTips: string[] = rightsCategories.flatMap((cat) =>
  cat.items.map((item) => `${item.title}: ${item.summary}`),
);

async function scheduleDaily() {
  await Notifications.cancelScheduledNotificationAsync(DAILY_TIP_ID).catch(() => {});
  const tip = allRightsTips[Math.floor(Math.random() * allRightsTips.length)];
  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_TIP_ID,
    content: {
      title: "Your Daily Legal Tip",
      body: tip,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 0,
    },
  });
}

async function cancelDaily() {
  await Notifications.cancelScheduledNotificationAsync(DAILY_TIP_ID).catch(() => {});
}

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const fs = useFontSizes();
  const { settings, setSetting } = useAppSettings();
  const t = useTranslation();
  const [regionModalVisible, setRegionModalVisible] = useState(false);

  const isHindi = settings.language === "Hindi";
  const isEnglish = settings.language === "English";

  const appVersion = Constants.expoConfig?.version ?? "1.0.0";
  const buildNumber =
    Platform.OS === "ios"
      ? Constants.expoConfig?.ios?.buildNumber
      : Constants.expoConfig?.android?.versionCode?.toString();
  const appVersionLabel = buildNumber ? `${appVersion} (${buildNumber})` : appVersion;

  const TEXT_SIZES = [
    { key: "Small" as const, label: t.small },
    { key: "Medium" as const, label: t.medium },
    { key: "Large" as const, label: t.large },
  ];

  const handleShare = async () => {
    try {
      await Share.share({
        title: "Nyaya Sahayak",
        message:
          "Know your legal rights! Nyaya Sahayak is a free legal literacy app for India. Download now.",
      });
    } catch {}
  };

  const handleLanguage = (lang: string) => {
    setSetting("language", lang);
  };

  const handleHighContrast = (v: boolean) => {
    setSetting("highContrast", v);
    if (v) setSetting("darkMode", false);
  };

  const handleDarkMode = (v: boolean) => {
    setSetting("darkMode", v);
    if (v) setSetting("highContrast", false);
  };

  const handleNotifications = async (v: boolean) => {
    if (v) {
      if (Platform.OS === "web") {
        Alert.alert(
          isHindi ? "समर्थित नहीं" : "Not Supported",
          isHindi
            ? "वेब पर पुश नोटिफिकेशन समर्थित नहीं हैं।"
            : "Push notifications are not supported on web.",
        );
        return;
      }
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          isHindi ? "अनुमति आवश्यक है" : "Permission Required",
          isHindi
            ? "दैनिक कानूनी टिप प्राप्त करने के लिए कृपया अपने डिवाइस सेटिंग्स में नोटिफिकेशन की अनुमति दें।"
            : "Please allow notifications in your device settings to receive daily legal tips.",
        );
        return;
      }
      await scheduleDaily();
      setSetting("notifications", true);
      Alert.alert(
        isHindi ? "नोटिफिकेशन चालू" : "Notifications Enabled",
        isHindi
          ? "आपको हर दिन सुबह 9:00 बजे दैनिक कानूनी टिप मिलेगी।"
          : "You'll receive a daily legal tip at 9:00 AM.",
      );
    } else {
      await cancelDaily();
      setSetting("notifications", false);
    }
  };

  const handleRegionSelect = (region: string) => {
    setSetting("region", region);
    saveRegionalOffices(region);
    setRegionModalVisible(false);
  };

  const regionLabel =
    settings.region && settings.region !== "All"
      ? settings.region
      : isEnglish
        ? "All regions"
        : isHindi
          ? "सभी क्षेत्र"
          : t.allOffices;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.navy, "#1a2a3a"]}
        style={[styles.header, { paddingTop: (Platform.OS === "web" ? 67 : insets.top) + 12 }]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>{t.settingsTitle}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Display ─────────────────────────────── */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontSize: fs.xs }]}>
          {t.displaySection}
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="moon" size={18} color={colors.navy} />
              <Text style={[styles.rowLabel, { color: colors.foreground, fontSize: fs.base }]}>
                {t.darkMode}
              </Text>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={handleDarkMode}
              trackColor={{ false: colors.border, true: colors.navy }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="eye" size={18} color={colors.navy} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowLabel, { color: colors.foreground, fontSize: fs.base }]}>
                  {t.highContrast}
                </Text>
                <Text style={[styles.rowSub, { color: colors.mutedForeground, fontSize: fs.xs }]}>
                  {t.highContrastSub}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.highContrast}
              onValueChange={handleHighContrast}
              trackColor={{ false: colors.border, true: colors.navy }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.col}>
            <View style={styles.rowLeft}>
              <Feather name="type" size={18} color={colors.navy} />
              <Text style={[styles.rowLabel, { color: colors.foreground, fontSize: fs.base }]}>
                {t.textSize}
              </Text>
            </View>
            <View style={styles.segmentRow}>
              {TEXT_SIZES.map(({ key, label }) => (
                <Pressable
                  key={key}
                  onPress={() => setSetting("textSize", key)}
                  style={[
                    styles.segment,
                    {
                      backgroundColor: settings.textSize === key ? colors.navy : "transparent",
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      {
                        color: settings.textSize === key ? "#fff" : colors.mutedForeground,
                        fontSize: fs.xs,
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* ── Notifications ─────────────────────── */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontSize: fs.xs }]}>
          {t.notificationsSection}
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="bell" size={18} color={colors.navy} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowLabel, { color: colors.foreground, fontSize: fs.base }]}>
                  {t.dailyTip}
                </Text>
                <Text style={[styles.rowSub, { color: colors.mutedForeground, fontSize: fs.xs }]}>
                  {t.dailyTipSub}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={handleNotifications}
              trackColor={{ false: colors.border, true: colors.navy }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* ── Language ──────────────────────────── */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontSize: fs.xs }]}>
          {t.languageSection}
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          {SUPPORTED_LANGUAGES.map((lang, idx) => (
            <React.Fragment key={lang.code}>
              <Pressable
                onPress={() => handleLanguage(lang.code)}
                style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
              >
                <View style={styles.rowLeft}>
                  <Text style={[styles.rowLabel, { color: colors.foreground, fontSize: fs.base }]}>
                    {lang.nativeLabel}
                  </Text>
                  {lang.nativeLabel !== lang.label && (
                    <Text
                      style={[
                        styles.rowSub,
                        { color: colors.mutedForeground, marginTop: 0, fontSize: fs.xs },
                      ]}
                    >
                      {lang.label}
                    </Text>
                  )}
                </View>
                <View style={styles.rowRight}>
                  {settings.language === lang.code && (
                    <Feather name="check" size={18} color={colors.success} />
                  )}
                </View>
              </Pressable>
              {idx < SUPPORTED_LANGUAGES.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              )}
            </React.Fragment>
          ))}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {UPCOMING_LANGUAGES.map((lang, idx) => (
            <React.Fragment key={lang}>
              <View style={[styles.row, { opacity: 0.5 }]}>
                <Text style={[styles.rowLabel, { color: colors.foreground, fontSize: fs.base }]}>
                  {lang}
                </Text>
                <View style={[styles.comingSoonBadge, { backgroundColor: colors.goldLight }]}>
                  <Text style={[styles.comingSoonText, { color: colors.warn, fontSize: fs.xs }]}>
                    {t.comingSoon}
                  </Text>
                </View>
              </View>
              {idx < UPCOMING_LANGUAGES.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* ── Region ────────────────────────────── */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontSize: fs.xs }]}>
          {t.yourRegion}
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Pressable
            onPress={() => setRegionModalVisible(true)}
            style={({ pressed }) => [
              styles.row,
              { paddingVertical: 14, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.rowLeft}>
              <Feather name="map-pin" size={18} color={colors.navy} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowLabel, { color: colors.foreground, fontSize: fs.base }]}>
                  {regionLabel}
                </Text>
                <Text style={[styles.rowSub, { color: colors.mutedForeground, fontSize: fs.xs }]}>
                  {t.regionHelp}
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>
        </View>

        {/* ── About ─────────────────────────────── */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontSize: fs.xs }]}>
          {t.aboutSection}
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={styles.rowLeft}>
              <Feather name="share-2" size={18} color={colors.navy} />
              <Text style={[styles.rowLabel, { color: colors.foreground, fontSize: fs.base }]}>
                {t.shareApp}
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Pressable
            onPress={() => router.push("/share")}
            style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={styles.rowLeft}>
              <Feather name="package" size={18} color={colors.navy} />
              <Text style={[styles.rowLabel, { color: colors.foreground, fontSize: fs.base }]}>
                Content Sharing
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Pressable
            onPress={() => safeOpenURL("https://nalsa.gov.in", "the NALSA website")}
            style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={styles.rowLeft}>
              <Feather name="external-link" size={18} color={colors.navy} />
              <Text style={[styles.rowLabel, { color: colors.foreground, fontSize: fs.base }]}>
                NALSA Website
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Pressable
            onPress={() => safeOpenURL("https://ojas-mohbansi.github.io/nsw/", "the website")}
            style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={styles.rowLeft}>
              <Feather name="globe" size={18} color={colors.navy} />
              <Text style={[styles.rowLabel, { color: colors.foreground, fontSize: fs.base }]}>
                App Website
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Pressable
            onPress={() => router.push("/developer" as any)}
            style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={styles.rowLeft}>
              <Feather name="github" size={18} color={colors.navy} />
              <Text style={[styles.rowLabel, { color: colors.foreground, fontSize: fs.base }]}>
                Meet the Developer
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={[styles.row, { paddingVertical: 14 }]}>
            <View style={styles.rowLeft}>
              <Feather name="info" size={18} color={colors.navy} />
              <Text style={[styles.rowLabel, { color: colors.foreground, fontSize: fs.base }]}>
                {t.versionLabel}
              </Text>
            </View>
            <Text style={[styles.versionText, { color: colors.mutedForeground, fontSize: fs.sm }]}>
              {appVersionLabel}
            </Text>
          </View>
        </View>

        <Text style={[styles.disclaimer, { color: colors.mutedForeground, fontSize: fs.xs }]}>
          {isHindi
            ? "न्याय सहायक केवल सामान्य कानूनी जानकारी प्रदान करता है। यह पेशेवर कानूनी सलाह का विकल्प नहीं है।"
            : "Nyaya Sahayak provides general legal information only. It is not a substitute for professional legal advice. Always consult a qualified lawyer for your specific situation."}
        </Text>
      </ScrollView>

      {/* ── Region Picker Modal ──────────────────── */}
      <Modal
        visible={regionModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRegionModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setRegionModalVisible(false)}>
          <Pressable
            style={[
              styles.modalSheet,
              { backgroundColor: colors.card, paddingBottom: insets.bottom + 8 },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.foreground, fontSize: fs.md }]}>
              {t.selectRegion}
            </Text>
            <Text style={[styles.modalSub, { color: colors.mutedForeground, fontSize: fs.xs }]}>
              {t.regionHelp}
            </Text>
            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              {REGIONS.map((r, idx) => {
                const active = settings.region === r || (!settings.region && r === "All");
                return (
                  <React.Fragment key={r}>
                    <Pressable
                      onPress={() => handleRegionSelect(r)}
                      style={({ pressed }) => [styles.regionRow, { opacity: pressed ? 0.7 : 1 }]}
                    >
                      <Text
                        style={[
                          styles.regionLabel,
                          {
                            color: active ? colors.navy : colors.foreground,
                            fontFamily: active ? "Inter_600SemiBold" : "Inter_400Regular",
                            fontSize: fs.base,
                          },
                        ]}
                      >
                        {r === "All"
                          ? isEnglish
                            ? "All regions"
                            : isHindi
                              ? "सभी क्षेत्र"
                              : t.allOffices
                          : r}
                      </Text>
                      {active && <Feather name="check" size={17} color={colors.success} />}
                    </Pressable>
                    {idx < REGIONS.length - 1 && (
                      <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    )}
                  </React.Fragment>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  scroll: { flex: 1 },
  content: {
    padding: 16,
    gap: 8,
  },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  card: {
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  col: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rowLabel: {
    fontFamily: "Inter_500Medium",
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  segmentRow: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd5c4",
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#ddd5c4",
  },
  segmentText: {
    fontFamily: "Inter_600SemiBold",
  },
  comingSoonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  comingSoonText: {
    fontFamily: "Inter_600SemiBold",
  },
  rowSub: {
    fontFamily: "Inter_400Regular",
    marginTop: 1,
    color: "#888",
  },
  versionText: {
    fontFamily: "Inter_400Regular",
  },
  disclaimer: {
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 16,
    paddingHorizontal: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 0,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: "Inter_700Bold",
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  modalSub: {
    fontFamily: "Inter_400Regular",
    paddingHorizontal: 20,
    marginBottom: 12,
    lineHeight: 17,
  },
  regionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  regionLabel: {
    fontFamily: "Inter_400Regular",
  },
});
