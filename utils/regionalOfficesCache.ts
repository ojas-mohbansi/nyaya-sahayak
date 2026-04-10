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

export async function loadCachedOffices(): Promise<Office[] | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Office[];
  } catch {
    return null;
  }
}

export async function getCachedRegion(): Promise<string | null> {
  return AsyncStorage.getItem(REGION_KEY);
}
