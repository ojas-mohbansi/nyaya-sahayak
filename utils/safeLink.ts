import { Alert, Linking, Platform } from "react-native";

/**
 * Open an external URL while gracefully handling devices where no app can
 * handle the scheme (e.g. a tablet with no dialer for `tel:`, or a kiosk
 * device with no browser). Surfaces a friendly alert instead of throwing.
 */
export async function safeOpenURL(
  url: string,
  friendlyLabel?: string
): Promise<boolean> {
  try {
    if (Platform.OS !== "web") {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert(
          "Can't open this link",
          friendlyLabel
            ? `No app on this device can open ${friendlyLabel}.`
            : "No app on this device can open this link."
        );
        return false;
      }
    }
    await Linking.openURL(url);
    return true;
  } catch {
    Alert.alert(
      "Couldn't open link",
      friendlyLabel
        ? `Something went wrong opening ${friendlyLabel}. Please try again.`
        : "Something went wrong. Please try again."
    );
    return false;
  }
}
