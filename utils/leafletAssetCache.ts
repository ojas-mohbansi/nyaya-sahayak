import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

const LEAFLET_VERSION = "1.9.4";
const LEAFLET_JS_URL = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
const LEAFLET_CSS_URL = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;

const LEAFLET_DIR = (FileSystem.documentDirectory ?? "") + "leaflet/";
const LEAFLET_JS_PATH = LEAFLET_DIR + `leaflet-${LEAFLET_VERSION}.js`;
const LEAFLET_CSS_PATH = LEAFLET_DIR + `leaflet-${LEAFLET_VERSION}.css`;

export interface LeafletAssets {
  js: string | null;
  css: string | null;
}

let memoCache: LeafletAssets | null = null;
let inflight: Promise<LeafletAssets> | null = null;

async function readIfExists(path: string): Promise<string | null> {
  try {
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) return null;
    return await FileSystem.readAsStringAsync(path);
  } catch {
    return null;
  }
}

async function downloadToString(url: string, path: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "NyayaSahayak/1.0" },
    });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text) return null;
    await FileSystem.makeDirectoryAsync(LEAFLET_DIR, { intermediates: true });
    await FileSystem.writeAsStringAsync(path, text);
    return text;
  } catch {
    return null;
  }
}

/**
 * Returns cached Leaflet JS and CSS as strings so the map WebView can inline
 * them and work fully offline. On first call (online), the assets are
 * downloaded once and stored on the device; subsequent calls read from disk.
 *
 * Web returns nulls — the web preview already loads Leaflet from the CDN and
 * has no on-device file system to cache to.
 */
export async function ensureLeafletAssets(): Promise<LeafletAssets> {
  if (Platform.OS === "web") return { js: null, css: null };
  if (memoCache && memoCache.js && memoCache.css) return memoCache;
  if (inflight) return inflight;

  inflight = (async () => {
    let js = await readIfExists(LEAFLET_JS_PATH);
    let css = await readIfExists(LEAFLET_CSS_PATH);
    if (!js) js = await downloadToString(LEAFLET_JS_URL, LEAFLET_JS_PATH);
    if (!css) css = await downloadToString(LEAFLET_CSS_URL, LEAFLET_CSS_PATH);
    memoCache = { js, css };
    return memoCache;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

export async function clearLeafletAssets(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await FileSystem.deleteAsync(LEAFLET_DIR, { idempotent: true });
  } catch {}
  memoCache = null;
}
