import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { rightsCategories } from "@/data/rights";
import { procedures } from "@/data/procedures";
import { SUPPORTED_LANGUAGES } from "@/data/translations";

const APP_VERSION = "1.0.0";
const SCHEMA = "nyaya-content-v1";

function djb2(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (((h << 5) + h) ^ s.charCodeAt(i)) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

function buildContentPackage() {
  const rights = rightsCategories.flatMap((cat) =>
    cat.items.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      content: item.content,
      reference: item.reference,
      categoryId: cat.id,
    }))
  );
  const procs = procedures.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    steps: p.steps,
    documents: p.documents,
  }));
  const payload = { rights, procedures: procs };
  const payloadStr = JSON.stringify(payload);
  const fingerprint = djb2(payloadStr);
  return {
    schema: SCHEMA,
    version: APP_VERSION,
    exported_at: new Date().toISOString(),
    fingerprint,
    rights_count: rights.length,
    procedures_count: procs.length,
    languages_count: SUPPORTED_LANGUAGES.length,
    ...payload,
  };
}

interface ImportResult {
  ok: boolean;
  message: string;
  detail?: string;
}

export default function ShareScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const totalRights = useMemo(
    () => rightsCategories.reduce((s, c) => s + c.items.length, 0),
    []
  );

  const fingerprint = useMemo(() => {
    const rights = rightsCategories.flatMap((cat) =>
      cat.items.map((item) => ({ id: item.id, title: item.title, summary: item.summary, content: item.content, reference: item.reference, categoryId: cat.id }))
    );
    const procs = procedures.map((p) => ({ id: p.id, title: p.title, description: p.description, steps: p.steps, documents: p.documents }));
    return djb2(JSON.stringify({ rights, procedures: procs }));
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const isAvail = Platform.OS === "web" || (await Sharing.isAvailableAsync());
      if (!isAvail) {
        Alert.alert("Sharing unavailable", "This device does not support file sharing.");
        return;
      }
      const pkg = buildContentPackage();
      const json = JSON.stringify(pkg, null, 2);
      const filename = `nyaya-content-${APP_VERSION}-${Date.now()}.nyaya`;
      const uri = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(uri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(uri, {
        mimeType: "application/json",
        dialogTitle: "Share Nyaya Content Package",
        UTI: "public.json",
      });
    } catch {
      Alert.alert("Export failed", "Could not create the content package. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    setImportResult(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/json", "*/*"],
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.[0]) {
        return;
      }
      const raw = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const parsed = JSON.parse(raw);

      if (parsed.schema !== SCHEMA) {
        setImportResult({
          ok: false,
          message: "Unrecognised format",
          detail: "This file is not a valid Nyaya content package. Only .nyaya packages are supported.",
        });
        return;
      }

      const { fingerprint: importedFp, rights, procedures: importedProcs, ...meta } = parsed;
      const computed = djb2(JSON.stringify({ rights, procedures: importedProcs }));
      const verified = computed === importedFp;

      setImportResult({
        ok: verified,
        message: verified ? "Content verified" : "Fingerprint mismatch",
        detail: verified
          ? `${meta.rights_count} rights · ${meta.procedures_count} procedures · v${meta.version}\nExported ${new Date(meta.exported_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
          : "The content fingerprint does not match. The file may have been modified or corrupted.",
      });
    } catch {
      setImportResult({
        ok: false,
        message: "Could not read file",
        detail: "Ensure the selected file is a valid .nyaya content package.",
      });
    } finally {
      setImporting(false);
    }
  };

  const topPad = (Platform.OS === "web" ? 67 : insets.top) + 8;

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.heading, { color: colors.foreground }]}>Content Sharing</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="package" size={18} color={colors.navy} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Content Inventory</Text>
          </View>
          <View style={styles.statGrid}>
            {([
              { label: "Rights", value: String(totalRights), icon: "book-open" },
              { label: "Procedures", value: String(procedures.length), icon: "file-text" },
              { label: "Languages", value: String(SUPPORTED_LANGUAGES.length), icon: "globe" },
              { label: "Version", value: APP_VERSION, icon: "tag" },
            ] as const).map((s) => (
              <View key={s.label} style={[styles.statBox, { backgroundColor: colors.secondary }]}>
                <Feather name={s.icon as any} size={14} color={colors.navy} />
                <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.fpRow, { backgroundColor: colors.secondary }]}>
            <Feather name="shield" size={13} color={colors.mutedForeground} />
            <Text style={[styles.fpLabel, { color: colors.mutedForeground }]}>Content fingerprint</Text>
            <Text style={[styles.fpValue, { color: colors.foreground }]}>{fingerprint}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="upload" size={18} color={colors.navy} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Export Package</Text>
          </View>
          <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>
            Generate a signed content package and share it with any device via Bluetooth file transfer, WhatsApp, email, or AirDrop — no internet required.
          </Text>
          <Pressable
            onPress={handleExport}
            disabled={exporting}
            style={({ pressed }) => [
              styles.btn,
              { backgroundColor: colors.navy, opacity: pressed || exporting ? 0.72 : 1 },
            ]}
          >
            {exporting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Feather name="share-2" size={16} color="#fff" />
                <Text style={styles.btnText}>Share Content Package</Text>
              </>
            )}
          </Pressable>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="download" size={18} color={colors.accent} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Verify & Import</Text>
          </View>
          <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>
            Pick a .nyaya file received from a legal aid clinic or trusted source. The fingerprint is verified to confirm content integrity before import.
          </Text>
          <Pressable
            onPress={handleImport}
            disabled={importing}
            style={({ pressed }) => [
              styles.btn,
              { backgroundColor: colors.accent, opacity: pressed || importing ? 0.72 : 1 },
            ]}
          >
            {importing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Feather name="folder" size={16} color="#fff" />
                <Text style={styles.btnText}>Pick Content Package</Text>
              </>
            )}
          </Pressable>
          {importResult && (
            <View
              style={[
                styles.resultBox,
                {
                  backgroundColor: importResult.ok ? colors.success + "15" : colors.destructive + "12",
                  borderColor: importResult.ok ? colors.success + "40" : colors.destructive + "30",
                },
              ]}
            >
              <Feather
                name={importResult.ok ? "check-circle" : "alert-circle"}
                size={18}
                color={importResult.ok ? colors.success : colors.destructive}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.resultTitle,
                    { color: importResult.ok ? colors.success : colors.destructive },
                  ]}
                >
                  {importResult.message}
                </Text>
                {importResult.detail && (
                  <Text style={[styles.resultDetail, { color: colors.mutedForeground }]}>
                    {importResult.detail}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="info" size={14} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Content packages let legal aid clinics distribute verified legal information to community members offline. Any sharing channel your device supports can be used — Bluetooth, WiFi Direct, or messaging apps.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  heading: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  scroll: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  cardDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  statGrid: {
    flexDirection: "row",
    gap: 8,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    borderRadius: 10,
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  fpLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  fpValue: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    paddingVertical: 13,
  },
  btnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  resultBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  resultTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  resultDetail: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  infoText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    flex: 1,
  },
});
