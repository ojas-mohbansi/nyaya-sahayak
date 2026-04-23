import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

export const TILE_BASE_PATH = (FileSystem.documentDirectory ?? "") + "tiles/";

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

function getTilesForIndiaBbox(zoom: number): TileCoord[] {
  const LAT_MIN = 6.5,
    LAT_MAX = 37.5,
    LNG_MIN = 67.0,
    LNG_MAX = 99.0;
  const xMin = lngToTileX(LNG_MIN, zoom);
  const xMax = lngToTileX(LNG_MAX, zoom);
  const yMin = latToTileY(LAT_MAX, zoom);
  const yMax = latToTileY(LAT_MIN, zoom);
  const tiles: TileCoord[] = [];
  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      tiles.push({ z: zoom, x, y });
    }
  }
  return tiles;
}

export function estimateTileCount(minZoom: number, maxZoom: number): number {
  let count = 0;
  for (let z = minZoom; z <= maxZoom; z++) {
    count += getTilesForIndiaBbox(z).length;
  }
  return count;
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
  signal?: { cancelled: boolean }
): Promise<{ downloaded: number; failed: number; total: number }> {
  if (Platform.OS === "web") return { downloaded: 0, failed: 0, total: 0 };

  const allTiles: TileCoord[] = [];
  for (let z = minZoom; z <= maxZoom; z++) {
    allTiles.push(...getTilesForIndiaBbox(z));
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
}
