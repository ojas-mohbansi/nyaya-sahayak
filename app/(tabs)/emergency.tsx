import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { safeOpenURL } from "@/utils/safeLink";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmergencyButton } from "@/components/EmergencyButton";
import { useColors } from "@/hooks/useColors";
import { useEmergencyContacts } from "@/context/EmergencyContactsContext";
import { emergencyServices } from "@/data/emergencyServices";

export default function EmergencyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [locationText, setLocationText] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const { customContacts, addContact, removeContact } = useEmergencyContacts();

  const getLocation = async (): Promise<string> => {
    try {
      if (Platform.OS === "web") {
        return new Promise((resolve) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) =>
                resolve(`${pos.coords.latitude.toFixed(4)},${pos.coords.longitude.toFixed(4)}`),
              () => resolve("Location unavailable"),
            );
          } else {
            resolve("Location unavailable");
          }
        });
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return "Location permission denied";
      const loc = await Location.getCurrentPositionAsync({});
      return `${loc.coords.latitude.toFixed(4)},${loc.coords.longitude.toFixed(4)}`;
    } catch {
      return "Location unavailable";
    }
  };

  const handleEmergencyCall = async (number: string, name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    if (Platform.OS === "web") {
      safeOpenURL(`tel:${number}`, "the dialer");
      return;
    }

    Alert.alert(`Call ${name}?`, `Dial ${number} now. Your location will be shared.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call Now",
        style: "destructive",
        onPress: async () => {
          const loc = await getLocation();
          setLocationText(loc);
          safeOpenURL(`tel:${number}`, "the dialer");
        },
      },
    ]);
  };

  const handleSOS = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    if (Platform.OS === "web") {
      safeOpenURL("tel:100", "the dialer");
      return;
    }

    Alert.alert("SOS Emergency", "This will call Police (100) and share your location. Continue?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "CALL NOW",
        style: "destructive",
        onPress: async () => {
          const loc = await getLocation();
          setLocationText(loc);
          safeOpenURL("tel:100", "the dialer");
        },
      },
    ]);
  };

  const handleSaveContact = () => {
    if (!newName.trim() || !newPhone.trim()) {
      Alert.alert("Missing Info", "Please enter both a name and a phone number.");
      return;
    }
    addContact(newName, newPhone);
    setNewName("");
    setNewPhone("");
    setShowAddForm(false);
  };

  const handleRemoveContact = (id: string, name: string) => {
    Alert.alert("Remove Contact", `Remove ${name} from emergency contacts?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => removeContact(id) },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.burgundy,
            paddingTop: (Platform.OS === "web" ? 67 : insets.top) + 16,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerIconWrap}>
            <Feather name="alert-triangle" size={20} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>Emergency</Text>
          <View style={{ flex: 1 }} />
          <Pressable
            onPress={() => router.push("/settings" as any)}
            style={styles.headerBtn}
            hitSlop={8}
            accessibilityLabel="Settings"
          >
            <Feather name="settings" size={20} color="#fff" />
          </Pressable>
        </View>
        <Text style={styles.headerSub}>One-tap emergency assistance</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* SOS Button */}
        <Pressable
          onPress={handleSOS}
          style={({ pressed }) => [
            styles.sosBtn,
            {
              backgroundColor: "#ef4444",
              borderRadius: colors.radius + 4,
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            },
          ]}
        >
          <View style={styles.sosIconWrap}>
            <Feather name="alert-circle" size={32} color="#fff" />
          </View>
          <View style={styles.sosTextWrap}>
            <Text style={styles.sosTitle}>SOS Emergency</Text>
            <Text style={styles.sosDesc}>Tap to call Police (100) with auto-location</Text>
          </View>
        </Pressable>

        {locationText && (
          <View
            style={[
              styles.locationBanner,
              { backgroundColor: colors.goldLight, borderRadius: colors.radius },
            ]}
          >
            <Feather name="map-pin" size={14} color={colors.warn} />
            <Text style={[styles.locationText, { color: colors.warn }]}>📍 {locationText}</Text>
          </View>
        )}

        {/* Emergency Helplines */}
        <Text style={[styles.sectionTitle, { color: colors.navy }]}>Emergency Helplines</Text>

        {emergencyServices.map((service) => (
          <EmergencyButton
            key={service.id}
            name={service.name}
            number={service.number}
            description={service.description}
            icon={service.icon}
            color={service.color}
            onPress={() => handleEmergencyCall(service.number, service.name)}
          />
        ))}

        {/* Personal Emergency Contacts */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: colors.navy, marginTop: 0 }]}>
            My Emergency Contacts
          </Text>
          <Pressable
            onPress={() => setShowAddForm((v) => !v)}
            style={({ pressed }) => [
              styles.addBtn,
              { backgroundColor: colors.navy, opacity: pressed ? 0.8 : 1, borderRadius: 8 },
            ]}
          >
            <Feather name={showAddForm ? "x" : "plus"} size={14} color="#fff" />
            <Text style={styles.addBtnText}>{showAddForm ? "Cancel" : "Add"}</Text>
          </Pressable>
        </View>

        {showAddForm && (
          <View
            style={[
              styles.addForm,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Contact name"
              placeholderTextColor={colors.mutedForeground}
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.foreground,
                  backgroundColor: colors.background,
                },
              ]}
            />
            <TextInput
              value={newPhone}
              onChangeText={setNewPhone}
              placeholder="Phone number"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="phone-pad"
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.foreground,
                  backgroundColor: colors.background,
                },
              ]}
            />
            <Pressable
              onPress={handleSaveContact}
              style={({ pressed }) => [
                styles.saveBtn,
                { backgroundColor: colors.success, opacity: pressed ? 0.85 : 1, borderRadius: 8 },
              ]}
            >
              <Feather name="check" size={16} color="#fff" />
              <Text style={styles.saveBtnText}>Save Contact</Text>
            </Pressable>
          </View>
        )}

        {customContacts.length > 0
          ? customContacts.map((contact) => (
              <View
                key={contact.id}
                style={[
                  styles.contactCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <View style={[styles.contactIcon, { backgroundColor: colors.navy + "18" }]}>
                  <Feather name="user" size={20} color={colors.navy} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.contactName, { color: colors.foreground }]}>
                    {contact.name}
                  </Text>
                  <Text style={[styles.contactPhone, { color: colors.mutedForeground }]}>
                    {contact.phone}
                  </Text>
                </View>
                <Pressable
                  onPress={() => handleEmergencyCall(contact.phone, contact.name)}
                  style={[styles.callBtn, { backgroundColor: colors.success }]}
                >
                  <Feather name="phone" size={16} color="#fff" />
                </Pressable>
                <Pressable
                  onPress={() => handleRemoveContact(contact.id, contact.name)}
                  style={[styles.callBtn, { backgroundColor: colors.destructive }]}
                >
                  <Feather name="trash-2" size={16} color="#fff" />
                </Pressable>
              </View>
            ))
          : !showAddForm && (
              <Pressable
                onPress={() => setShowAddForm(true)}
                style={[
                  styles.emptyContactsCard,
                  {
                    backgroundColor: colors.secondary,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <Feather name="user-plus" size={24} color={colors.mutedForeground} />
                <Text style={[styles.emptyContactsText, { color: colors.mutedForeground }]}>
                  Add trusted contacts to call in an emergency
                </Text>
              </Pressable>
            )}

        {/* Info Card */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Feather name="info" size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            All emergency numbers are toll-free and available 24/7 across India. Your location is
            shared only when you make an emergency call.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
  },
  headerSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.7)",
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  sosBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  sosIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  sosTextWrap: { flex: 1 },
  sosTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  sosDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  locationBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginTop: 8,
    marginBottom: 4,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  addForm: {
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  saveBtnText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  contactName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  contactPhone: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContactsCard: {
    borderWidth: 1,
    borderStyle: "dashed",
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  emptyContactsText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
});
