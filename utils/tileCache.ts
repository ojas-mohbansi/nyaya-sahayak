import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

export const TILE_BASE_PATH = (FileSystem.documentDirectory ?? "") + "tiles/";

const LAST_DOWNLOADED_AT_KEY = "tileCache:lastDownloadedAt";
const LAST_DOWNLOADED_REGION_KEY = "tileCache:lastDownloadedRegion";

export async function getLastDownloadedAt(): Promise<number | null> {
  try {
    const v = await AsyncStorage.getItem(LAST_DOWNLOADED_AT_KEY);
    if (!v) return null;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export async function getLastDownloadedRegion(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LAST_DOWNLOADED_REGION_KEY);
  } catch {
    return null;
  }
}

async function setLastDownloadedAt(region?: string | null): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_DOWNLOADED_AT_KEY, String(Date.now()));
    if (region) {
      await AsyncStorage.setItem(LAST_DOWNLOADED_REGION_KEY, region);
    }
  } catch {}
}

// Average compressed size of one OSM PNG tile (~25 KB).
export const AVG_TILE_BYTES = 25 * 1024;

export function estimateDownloadBytes(tileCount: number): number {
  return tileCount * AVG_TILE_BYTES;
}

export async function getFreeDiskBytes(): Promise<number | null> {
  if (Platform.OS === "web") return null;
  try {
    const fn = (FileSystem as any).getFreeDiskStorageAsync;
    if (typeof fn !== "function") return null;
    const bytes: number = await fn();
    return Number.isFinite(bytes) ? bytes : null;
  } catch {
    return null;
  }
}

async function clearLastDownloadedAt(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LAST_DOWNLOADED_AT_KEY);
    await AsyncStorage.removeItem(LAST_DOWNLOADED_REGION_KEY);
  } catch {}
}

function lngToTileX(lng: number, zoom: number): number {
  return Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
}

function latToTileY(lat: number, zoom: number): number {
  const rad = (lat * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  );
}

export interface TileCoord {
  z: number;
  x: number;
  y: number;
}

export interface BBox {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

const INDIA_BBOX: BBox = {
  latMin: 6.5,
  latMax: 37.5,
  lngMin: 67.0,
  lngMax: 99.0,
};

export const REGION_BBOX: Record<string, BBox> = {
  Delhi:           { latMin: 28.4,  latMax: 28.95, lngMin: 76.8,  lngMax: 77.45 },
  Maharashtra:     { latMin: 15.6,  latMax: 22.1,  lngMin: 72.6,  lngMax: 80.9  },
  Karnataka:       { latMin: 11.6,  latMax: 18.5,  lngMin: 74.0,  lngMax: 78.7  },
  "Tamil Nadu":    { latMin: 8.0,   latMax: 13.6,  lngMin: 76.2,  lngMax: 80.4  },
  Telangana:       { latMin: 15.8,  latMax: 19.9,  lngMin: 77.2,  lngMax: 81.4  },
  Rajasthan:       { latMin: 22.0,  latMax: 28.3,  lngMin: 68.1,  lngMax: 74.5  },
  "Madhya Pradesh":{ latMin: 23.0,  latMax: 27.5,  lngMin: 77.0,  lngMax: 84.5  },
  "Andhra Pradesh":{ latMin: 17.0,  latMax: 20.0,  lngMin: 81.0,  lngMax: 85.0  },
  Jharkhand:       { latMin: 22.0,  latMax: 27.2,  lngMin: 84.0,  lngMax: 87.5  },
  Chhattisgarh:    { latMin: 20.0,  latMax: 26.5,  lngMin: 81.7,  lngMax: 84.4  },
  "West Bengal":   { latMin: 23.6,  latMax: 27.5,  lngMin: 85.5,  lngMax: 88.2  },
  "Uttar Pradesh": { latMin: 26.0,  latMax: 28.4,  lngMin: 77.4,  lngMax: 84.6  },
  Punjab:          { latMin: 28.9,  latMax: 32.5,  lngMin: 73.9,  lngMax: 77.8  },
  Uttarakhand:     { latMin: 28.9,  latMax: 31.5,  lngMin: 77.6,  lngMax: 81.0  },
};

export function getRegionBBox(region?: string | null): BBox {
  if (region && REGION_BBOX[region]) return REGION_BBOX[region];
  return INDIA_BBOX;
}

function getTilesForBBox(bbox: BBox, zoom: number): TileCoord[] {
  const xMin = lngToTileX(bbox.lngMin, zoom);
  const xMax = lngToTileX(bbox.lngMax, zoom);
  const yMin = latToTileY(bbox.latMax, zoom);
  const yMax = latToTileY(bbox.latMin, zoom);
  const tiles: TileCoord[] = [];
  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      tiles.push({ z: zoom, x, y });
    }
  }
  return tiles;
}

export function estimateTileCount(
  minZoom: number,
  maxZoom: number,
  region?: string | null
): number {
  const bbox = getRegionBBox(region);
  let count = 0;
  for (let z = minZoom; z <= maxZoom; z++) {
    count += getTilesForBBox(bbox, z).length;
  }
  return count;
}

function tilesForRegions(
  minZoom: number,
  maxZoom: number,
  regions: string[]
): TileCoord[] {
  const seen = new Set<string>();
  const out: TileCoord[] = [];
  const list = regions.length > 0 ? regions : [""];
  for (const r of list) {
    const bbox = getRegionBBox(r || null);
    for (let z = minZoom; z <= maxZoom; z++) {
      for (const t of getTilesForBBox(bbox, z)) {
        const key = `${t.z}/${t.x}/${t.y}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(t);
      }
    }
  }
  return out;
}

export function estimateTileCountForRegions(
  minZoom: number,
  maxZoom: number,
  regions: string[]
): number {
  return tilesForRegions(minZoom, maxZoom, regions).length;
}

export function getOfflineTileUrlTemplate(): string {
  return TILE_BASE_PATH + "{z}/{x}/{y}.png";
}

function tilePath(z: number, x: number, y: number): string {
  return `${TILE_BASE_PATH}${z}/${x}/${y}.png`;
}

export async function isTileCached(
  z: number,
  x: number,
  y: number
): Promise<boolean> {
  if (Platform.OS === "web") return false;
  try {
    const info = await FileSystem.getInfoAsync(tilePath(z, x, y));
    return info.exists;
  } catch {
    return false;
  }
}

export async function getCachedTileBase64(
  z: number,
  x: number,
  y: number
): Promise<string | null> {
  if (Platform.OS === "web") return null;
  try {
    const path = tilePath(z, x, y);
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) return null;
    const base64 = await FileSystem.readAsStringAsync(path, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/png;base64,${base64}`;
  } catch {
    return null;
  }
}

export async function fetchAndCacheTile(
  z: number,
  x: number,
  y: number
): Promise<string | null> {
  if (Platform.OS === "web") return null;
  try {
    const dir = `${TILE_BASE_PATH}${z}/${x}/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const path = tilePath(z, x, y);
    const url = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
    const result = await FileSystem.downloadAsync(url, path, {
      headers: { "User-Agent": "NyayaSahayak/1.0" },
    });
    if (result.status === 200) {
      const base64 = await FileSystem.readAsStringAsync(path, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/png;base64,${base64}`;
    }
    return null;
  } catch {
    return null;
  }
}

export async function downloadOfflineTiles(
  minZoom: number,
  maxZoom: number,
  onProgress: (downloaded: number, total: number, failed: number) => void,
  signal?: { cancelled: boolean },
  region?: string | null
): Promise<{ downloaded: number; failed: number; total: number }> {
  if (Platform.OS === "web") return { downloaded: 0, failed: 0, total: 0 };

  const bbox = getRegionBBox(region);
  const allTiles: TileCoord[] = [];
  for (let z = minZoom; z <= maxZoom; z++) {
    allTiles.push(...getTilesForBBox(bbox, z));
  }

  let downloaded = 0;
  let failed = 0;
  const total = allTiles.length;

  for (const tile of allTiles) {
    if (signal?.cancelled) break;
    const cached = await isTileCached(tile.z, tile.x, tile.y);
    if (!cached) {
      const result = await fetchAndCacheTile(tile.z, tile.x, tile.y);
      if (result) downloaded++;
      else failed++;
    } else {
      downloaded++;
    }
    onProgress(downloaded, total, failed);
    await new Promise((r) => setTimeout(r, 10));
  }

  if (!signal?.cancelled && downloaded > 0) {
    await setLastDownloadedAt(region ?? null);
  }

  return { downloaded, failed, total };
}

export async function downloadOfflineTilesForRegions(
  minZoom: number,
  maxZoom: number,
  regions: string[],
  onProgress: (downloaded: number, total: number, failed: number) => void,
  signal?: { cancelled: boolean }
): Promise<{ downloaded: number; failed: number; total: number }> {
  if (Platform.OS === "web") return { downloaded: 0, failed: 0, total: 0 };

  const allTiles = tilesForRegions(minZoom, maxZoom, regions);
  let downloaded = 0;
  let failed = 0;
  const total = allTiles.length;

  for (const tile of allTiles) {
    if (signal?.cancelled) break;
    const cached = await isTileCached(tile.z, tile.x, tile.y);
    if (!cached) {
      const result = await fetchAndCacheTile(tile.z, tile.x, tile.y);
      if (result) downloaded++;
      else failed++;
    } else {
      downloaded++;
    }
    onProgress(downloaded, total, failed);
    await new Promise((r) => setTimeout(r, 10));
  }

  if (!signal?.cancelled && downloaded > 0) {
    const label =
      regions.length === 0
        ? null
        : regions.length === 1
        ? regions[0]
        : `${regions.length} regions`;
    await setLastDownloadedAt(label);
  }

  return { downloaded, failed, total };
}

export async function getCachedTileCount(): Promise<number> {
  if (Platform.OS === "web") return 0;
  try {
    const info = await FileSystem.getInfoAsync(TILE_BASE_PATH);
    if (!info.exists) return 0;
    let count = 0;
    const zDirs = await FileSystem.readDirectoryAsync(TILE_BASE_PATH);
    for (const z of zDirs) {
      try {
        const xDirs = await FileSystem.readDirectoryAsync(`${TILE_BASE_PATH}${z}/`);
        for (const x of xDirs) {
          try {
            const files = await FileSystem.readDirectoryAsync(
              `${TILE_BASE_PATH}${z}/${x}/`
            );
            count += files.filter((f) => f.endsWith(".png")).length;
          } catch {}
        }
      } catch {}
    }
    return count;
  } catch {
    return 0;
  }
}

export async function clearTileCache(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await FileSystem.deleteAsync(TILE_BASE_PATH, { idempotent: true });
  } catch {}
  await clearLastDownloadedAt();
}
