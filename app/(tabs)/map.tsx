import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LeafletMap } from "@/components/LeafletMap";
import { OfficeCard } from "@/components/OfficeCard";
import { useColors } from "@/hooks/useColors";
import { useFontSizes } from "@/hooks/useFontSizes";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppSettings } from "@/context/AppSettingsContext";
import { officeTypes, type Office } from "@/data/offices";
import {
  loadCachedOffices,
  getOfficesForRegion,
} from "@/utils/regionalOfficesCache";
import {
  estimateTileCount,
  downloadOfflineTiles,
  getCachedTileCount,
  clearTileCache,
} from "@/utils/tileCache";

const DOWNLOAD_PRESETS = [
  { label: "Overview (zoom 5–7)", minZoom: 5, maxZoom: 7 },
  { label: "Standard (zoom 5–8)", minZoom: 5, maxZoom: 8 },
  { label: "Detailed (zoom 5–9)", minZoom: 5, maxZoom: 9 },
] as const;

export default function MapScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const fs = useFontSizes();
  const t = useTranslation();
  const { settings } = useAppSettings();

  const [selectedType, setSelectedType] = useState("all");
  const [showList, setShowList] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [regionalOffices, setRegionalOffices] = useState<Office[]>([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [cachedTileCount, setCachedTileCount] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState<{
    downloaded: number;
    total: number;
    failed: number;
  } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const cancelRef = useRef({ cancelled: false });

  const region = settings.region ?? "All";

  useEffect(() => {
    (async () => {
      const cached = await loadCachedOffices();
      if (cached && cached.length > 0) {
        setRegionalOffices(cached);
      } else {
        setRegionalOffices(getOfficesForRegion(region));
      }
    })();
  }, [region]);

  useEffect(() => {
    if (Platform.OS === "web") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          },
          () => {},
          { timeout: 5000, maximumAge: 60000 }
        );
      }
    } else {
      (async () => {
        try {
          const { status } = await Location.getForegroundPermissionsAsync();
          if (status === "granted") {
            const loc = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Low,
            });
            setUserLocation({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });
          }
        } catch {}
      })();
    }
  }, []);

  const refreshCacheStats = useCallback(async () => {
    if (Platform.OS !== "web") {
      const count = await getCachedTileCount();
      setCachedTileCount(count);
    }
  }, []);

  useEffect(() => {
    refreshCacheStats();
  }, [refreshCacheStats]);

  const handleDownload = useCallback(
    async (minZoom: number, maxZoom: number) => {
      if (isDownloading) return;
      cancelRef.current = { cancelled: false };
      setIsDownloading(true);
      setDownloadProgress({ downloaded: 0, total: 0, failed: 0 });

      try {
        await downloadOfflineTiles(
          minZoom,
          maxZoom,
          (downloaded, total, failed) => {
            setDownloadProgress({ downloaded, total, failed });
          },
          cancelRef.current
        );
        await refreshCacheStats();
        setDownloadProgress(null);
        setIsDownloading(false);
        Alert.alert(
          "Download Complete",
          "Offline map tiles have been saved to your device."
        );
      } catch {
        setIsDownloading(false);
        setDownloadProgress(null);
      }
    },
    [isDownloading, refreshCacheStats]
  );

  const handleClearCache = useCallback(async () => {
    Alert.alert(
      "Clear Map Cache",
      "This will delete all downloaded map tiles. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearTileCache();
            await refreshCacheStats();
          },
        },
      ]
    );
  }, [refreshCacheStats]);

  const displayOffices = regionalOffices.filter(
    (o) => selectedType === "all" || o.type === selectedType
  );

  const regionLabel =
    region === "All"
      ? settings.language === "Hindi"
        ? "सभी क्षेत्र"
        : "All regions"
      : region;

  const markerColors: Record<string, string> = {
    collector: "#2d3e50",
    tehsildar: "#b07d2a",
    "legal-aid": "#2d7a4f",
    police: "#783232",
    "women-helpline": "#ef4444",
  };

  const progressPct =
    downloadProgress && downloadProgress.total > 0
      ? Math.round((downloadProgress.downloaded / downloadProgress.total) * 100)
      : 0;

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
            <Text style={[styles.headerTitle, { fontSize: fs.xl }]}>
              {t.whereToGo}
            </Text>
            <View style={styles.regionRow}>
              <Feather
                name="map-pin"
                size={11}
                color="rgba(255,255,255,0.5)"
              />
              <Text style={[styles.regionLabel, { fontSize: fs.xs }]}>
                {regionLabel}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            {Platform.OS !== "web" && (
              <Pressable
                onPress={() => setShowDownloadModal(true)}
                style={[
                  styles.toggleBtn,
                  { backgroundColor: "rgba(255,255,255,0.15)" },
                ]}
              >
                <Feather name="download" size={18} color="#fff" />
              </Pressable>
            )}
            <Pressable
              onPress={() => setShowList(!showList)}
              style={[
                styles.toggleBtn,
                { backgroundColor: "rgba(255,255,255,0.15)" },
              ]}
            >
              <Feather name={showList ? "map" : "list"} size={18} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>

      <FlatList
        horizontal
        data={officeTypes}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelectedType(item.id)}
            style={[
              styles.chip,
              {
                backgroundColor:
                  selectedType === item.id ? colors.navy : "transparent",
                borderColor:
                  selectedType === item.id ? colors.navy : colors.border,
              },
            ]}
          >
            <Feather
              name={item.icon as any}
              size={14}
              color={
                selectedType === item.id ? "#fff" : colors.mutedForeground
              }
            />
            <Text
              style={[
                styles.chipText,
                {
                  color:
                    selectedType === item.id ? "#fff" : colors.mutedForeground,
                },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        )}
      />

      {showList || displayOffices.length === 0 ? (
        <FlatList
          data={displayOffices}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <OfficeCard office={item} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather
                name="map-pin"
                size={48}
                color={colors.mutedForeground}
              />
              <Text
                style={[
                  styles.emptyText,
                  {
                    color: colors.mutedForeground,
                    fontSize: fs.base,
                  },
                ]}
              >
                {settings.language === "Hindi"
                  ? "इस क्षेत्र में कोई कार्यालय नहीं मिला"
                  : "No offices found in your region"}
              </Text>
              <Text
                style={[
                  styles.emptySubText,
                  {
                    color: colors.mutedForeground,
                    fontSize: fs.sm,
                  },
                ]}
              >
                {settings.language === "Hindi"
                  ? "सेटिंग्स में अपना क्षेत्र बदलें"
                  : "Change your region in Settings"}
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.mapContainer}>
          <LeafletMap
            offices={displayOffices}
            userLocation={userLocation}
            markerColors={markerColors}
            onFallback={() => setShowList(true)}
            offlineTilesAvailable={cachedTileCount > 0}
          />
          <View
            style={[
              styles.officeCount,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                bottom: (Platform.OS === "web" ? 34 : insets.bottom) + 16,
              },
            ]}
          >
            <Feather name="map-pin" size={14} color={colors.primary} />
            <Text
              style={[
                styles.officeCountText,
                { color: colors.foreground, fontSize: fs.sm },
              ]}
            >
              {displayOffices.length}{" "}
              {settings.language === "Hindi" ? "कार्यालय" : "offices"}
            </Text>
          </View>
        </View>
      )}

      {/* Offline Map Download Modal */}
      <Modal
        visible={showDownloadModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          if (!isDownloading) setShowDownloadModal(false);
        }}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View
            style={[styles.modalHeader, { borderBottomColor: colors.border }]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: colors.foreground, fontSize: fs.lg },
              ]}
            >
              Offline Map Tiles
            </Text>
            {!isDownloading && (
              <Pressable onPress={() => setShowDownloadModal(false)}>
                <Feather name="x" size={22} color={colors.mutedForeground} />
              </Pressable>
            )}
          </View>

          <View style={styles.modalContent}>
            {/* Cache stats */}
            <View
              style={[
                styles.statsCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="database" size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.statsLabel,
                    { color: colors.mutedForeground, fontSize: fs.xs },
                  ]}
                >
                  Cached tiles
                </Text>
                <Text
                  style={[
                    styles.statsValue,
                    { color: colors.foreground, fontSize: fs.base },
                  ]}
                >
                  {cachedTileCount.toLocaleString()} tiles
                  {cachedTileCount > 0
                    ? ` (~${Math.round((cachedTileCount * 25) / 1024)} MB)`
                    : ""}
                </Text>
              </View>
              {cachedTileCount > 0 && !isDownloading && (
                <Pressable onPress={handleClearCache}>
                  <Feather name="trash-2" size={18} color="#ef4444" />
                </Pressable>
              )}
            </View>

            {/* Progress bar */}
            {isDownloading && downloadProgress && (
              <View
                style={[
                  styles.progressCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.progressHeader}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text
                    style={[
                      styles.progressLabel,
                      { color: colors.foreground, fontSize: fs.sm },
                    ]}
                  >
                    Downloading… {progressPct}%
                  </Text>
                </View>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: colors.primary,
                        width: `${progressPct}%` as any,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.progressSubLabel,
                    {
                      color: colors.mutedForeground,
                      fontSize: fs.xs,
                    },
                  ]}
                >
                  {downloadProgress.downloaded} / {downloadProgress.total}{" "}
                  tiles
                  {downloadProgress.failed > 0
                    ? ` (${downloadProgress.failed} failed)`
                    : ""}
                </Text>
                <Pressable
                  onPress={() => {
                    cancelRef.current.cancelled = true;
                  }}
                  style={[
                    styles.cancelBtn,
                    { borderColor: colors.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.cancelBtnText,
                      { color: colors.mutedForeground, fontSize: fs.sm },
                    ]}
                  >
                    Cancel
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Download presets */}
            {!isDownloading && (
              <>
                <Text
                  style={[
                    styles.sectionLabel,
                    {
                      color: colors.mutedForeground,
                      fontSize: fs.xs,
                    },
                  ]}
                >
                  DOWNLOAD INDIA MAP TILES
                </Text>
                {DOWNLOAD_PRESETS.map((preset) => {
                  const count = estimateTileCount(
                    preset.minZoom,
                    preset.maxZoom
                  );
                  const sizeMb = Math.round((count * 25) / 1024);
                  return (
                    <Pressable
                      key={preset.label}
                      onPress={() =>
                        handleDownload(preset.minZoom, preset.maxZoom)
                      }
                      style={[
                        styles.presetBtn,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.presetLabel,
                            {
                              color: colors.foreground,
                              fontSize: fs.sm,
                            },
                          ]}
                        >
                          {preset.label}
                        </Text>
                        <Text
                          style={[
                            styles.presetMeta,
                            {
                              color: colors.mutedForeground,
                              fontSize: fs.xs,
                            },
                          ]}
                        >
                          ~{count} tiles · ~{sizeMb} MB
                        </Text>
                      </View>
                      <Feather
                        name="download"
                        size={18}
                        color={colors.primary}
                      />
                    </Pressable>
                  );
                })}

                <Text
                  style={[
                    styles.infoNote,
                    {
                      color: colors.mutedForeground,
                      fontSize: fs.xs,
                    },
                  ]}
                >
                  Tiles are downloaded from OpenStreetMap and stored on your
                  device for offline use. Higher zoom levels show more detail
                  but require more storage.
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
  },
  regionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  regionLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.5)",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  toggleBtn: {
    padding: 10,
    borderRadius: 10,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  chipText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  officeCount: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    ...Platform.select({
      web: { boxShadow: "0 2px 8px rgba(0,0,0,0.15)" } as object,
      default: {
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
    }),
  },
  officeCountText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 10,
    paddingTop: 4,
  },
  empty: {
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
  emptySubText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontFamily: "Inter_700Bold",
  },
  modalContent: {
    padding: 20,
    gap: 12,
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statsLabel: {
    fontFamily: "Inter_400Regular",
  },
  statsValue: {
    fontFamily: "Inter_600SemiBold",
    marginTop: 2,
  },
  progressCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressLabel: {
    fontFamily: "Inter_600SemiBold",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  progressSubLabel: {
    fontFamily: "Inter_400Regular",
  },
  cancelBtn: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 4,
  },
  cancelBtnText: {
    fontFamily: "Inter_500Medium",
  },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    marginTop: 8,
  },
  presetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  presetLabel: {
    fontFamily: "Inter_600SemiBold",
  },
  presetMeta: {
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  infoNote: {
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    marginTop: 4,
  },
});
