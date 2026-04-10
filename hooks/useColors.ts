import { useColorScheme } from "react-native";

import colors from "@/constants/colors";
import { useAppSettings } from "@/context/AppSettingsContext";

/**
 * Returns the design tokens for the current color scheme.
 *
 * Priority: highContrast > app-level darkMode setting > system color scheme.
 */
export function useColors() {
  const scheme = useColorScheme();
  const { settings } = useAppSettings();

  let palette: typeof colors.light;
  if (settings.highContrast) {
    palette = colors.highContrast;
  } else {
    const isDark = settings.darkMode ?? scheme === "dark";
    palette = isDark ? colors.dark : colors.light;
  }

  return { ...palette, radius: colors.radius };
}
