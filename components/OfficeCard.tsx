import { Feather } from "@expo/vector-icons";
import { Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import type { Office } from "@/data/offices";

interface OfficeCardProps {
  office: Office;
}

export function OfficeCard({ office }: OfficeCardProps) {
  const colors = useColors();

  const handleCall = () => {
    if (office.phone) {
      Linking.openURL(`tel:${office.phone}`);
    }
  };

  const handleDirections = () => {
    const scheme = Platform.select({
      ios: `maps:0,0?q=${office.latitude},${office.longitude}`,
      android: `geo:${office.latitude},${office.longitude}?q=${office.latitude},${office.longitude}(${encodeURIComponent(office.name)})`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${office.latitude},${office.longitude}`,
    });
    Linking.openURL(scheme);
  };

  const typeColors: Record<string, string> = {
    collector: "#2d3e50",
    tehsildar: "#b07d2a",
    "legal-aid": "#2d7a4f",
    police: "#783232",
    "women-helpline": "#783232",
  };

  return (
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
      <View style={styles.header}>
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: (typeColors[office.type] || colors.primary) + "15" },
          ]}
        >
          <Text style={[styles.typeText, { color: typeColors[office.type] || colors.primary }]}>
            {office.type.replace("-", " ").toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={[styles.name, { color: colors.foreground }]}>{office.name}</Text>
      <Text style={[styles.address, { color: colors.mutedForeground }]}>{office.address}</Text>
      <Text style={[styles.district, { color: colors.mutedForeground }]}>
        {office.district}, {office.state}
      </Text>
      <View style={styles.actions}>
        {office.phone && (
          <Pressable
            onPress={handleCall}
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          >
            <Feather name="phone" size={14} color="#fff" />
            <Text style={styles.actionText}>Call</Text>
          </Pressable>
        )}
        <Pressable
          onPress={handleDirections}
          style={[styles.actionBtn, { backgroundColor: colors.accent }]}
        >
          <Feather name="navigation" size={14} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary }]}>Directions</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  header: {
    flexDirection: "row",
    marginBottom: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  typeText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  address: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  district: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
});
