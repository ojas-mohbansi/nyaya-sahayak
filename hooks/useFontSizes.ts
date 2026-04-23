import { useAppSettings } from "@/context/AppSettingsContext";

export interface FontSizes {
  xs: number;
  sm: number;
  base: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

const SIZE_MAP: Record<"Small" | "Medium" | "Large", FontSizes> = {
  Small: { xs: 10, sm: 11, base: 13, md: 13, lg: 15, xl: 18, xxl: 22 },
  Medium: { xs: 11, sm: 12, base: 15, md: 15, lg: 17, xl: 20, xxl: 24 },
  Large: { xs: 13, sm: 14, base: 17, md: 17, lg: 19, xl: 22, xxl: 26 },
};

export function useFontSizes(): FontSizes {
  const { settings } = useAppSettings();
  return SIZE_MAP[settings.textSize] ?? SIZE_MAP.Medium;
}
