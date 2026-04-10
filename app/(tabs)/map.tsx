import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  FlatList,
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
import { loadCachedOffices, getOfficesForRegion } from "@/utils/regionalOfficesCache";

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

  const displayOffices = regionalOffices.filter(
    (o) => selectedType === "all" || o.type === selectedType
  );

  const regionLabel = region === "All"
    ? (settings.language === "Hindi" ? "सभी क्षेत्र" : "All regions")
    : region;

  const markerColors: Record<string, string> = {
    collector: "#2d3e50",
    tehsildar: "#b07d2a",
    "legal-aid": "#2d7a4f",
    police: "#783232",
    "women-helpline": "#ef4444",
  };

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
            <Text style={[styles.headerTitle, { fontSize: fs.xl }]}>{t.whereToGo}</Text>
            <View style={styles.regionRow}>
              <Feather name="map-pin" size={11} color="rgba(255,255,255,0.5)" />
              <Text style={[styles.regionLabel, { fontSize: fs.xs }]}>{regionLabel}</Text>
            </View>
          </View>
          <Pressable
            onPress={() => setShowList(!showList)}
            style={[styles.toggleBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}
          >
            <Feather name={showList ? "map" : "list"} size={18} color="#fff" />
          </Pressable>
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
                backgroundColor: selectedType === item.id ? colors.navy : "transparent",
                borderColor: selectedType === item.id ? colors.navy : colors.border,
              },
            ]}
          >
            <Feather
              name={item.icon as any}
              size={14}
              color={selectedType === item.id ? "#fff" : colors.mutedForeground}
            />
            <Text
              style={[
                styles.chipText,
                { color: selectedType === item.id ? "#fff" : colors.mutedForeground },
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
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <OfficeCard office={item} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="map-pin" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground, fontSize: fs.base }]}>
                {settings.language === "Hindi"
                  ? "इस क्षेत्र में कोई कार्यालय नहीं मिला"
                  : "No offices found in your region"}
              </Text>
              <Text style={[styles.emptySubText, { color: colors.mutedForeground, fontSize: fs.sm }]}>
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
          />
          <View
            style={[
              styles.officeCount,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Feather name="map-pin" size={14} color={colors.primary} />
            <Text style={[styles.officeCountText, { color: colors.foreground, fontSize: fs.sm }]}>
              {displayOffices.length}{" "}
              {settings.language === "Hindi" ? "कार्यालय" : "offices"}
            </Text>
          </View>
        </View>
      )}
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
    bottom: 100,
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
});
