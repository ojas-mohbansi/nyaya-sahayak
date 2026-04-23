import AsyncStorage from "@react-native-async-storage/async-storage";
import { offices, type Office } from "@/data/offices";

const CACHE_KEY = "nyaya_regional_offices";
const REGION_KEY = "nyaya_cached_region";

export function getOfficesForRegion(region: string): Office[] {
  if (!region || region === "All") return offices;
  return offices.filter((o) => o.state === region);
}

export async function saveRegionalOffices(region: string): Promise<void> {
  const subset = getOfficesForRegion(region);
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(subset));
  await AsyncStorage.setItem(REGION_KEY, region);
}

/**
 * Load offices for a specific region. Falls back to the in-memory dataset
 * when no cache exists, and always filters by the requested region so pins
 * and lists only ever show offices that belong to it.
 */
export async function loadCachedOffices(region?: string): Promise<Office[] | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    const cachedRegion = await AsyncStorage.getItem(REGION_KEY);
    let pool: Office[] | null = null;
    if (raw) {
      pool = JSON.parse(raw) as Office[];
    }

    // No region requested: return whatever we have (cache or full list).
    if (!region) return pool;

    // If the cache was saved for the same region (or for "All"), reuse it
    // but always re-filter by the requested region for safety.
    if (pool && (cachedRegion === region || cachedRegion === "All")) {
      return region === "All" ? pool : pool.filter((o) => o.state === region);
    }

    // Cache is missing or stale for this region — derive from full dataset.
    return getOfficesForRegion(region);
  } catch {
    return getOfficesForRegion(region ?? "All");
  }
}

export async function getCachedRegion(): Promise<string | null> {
  return AsyncStorage.getItem(REGION_KEY);
}
