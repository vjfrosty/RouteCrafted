const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

interface PushPayload {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: "default" | null;
}

export async function sendPushNotification(payload: PushPayload): Promise<void> {
  if (!payload.to || !payload.to.startsWith("ExponentPushToken[")) {
    // Not a valid Expo push token — skip silently
    return;
  }

  const res = await fetch(EXPO_PUSH_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      sound: payload.sound ?? "default",
    }),
  });

  if (!res.ok) {
    // Log but don't throw — push failures must never break the main flow
    console.warn("[expo-push] Failed to send push notification:", await res.text());
  }
}

export async function sendWeatherPush(
  expoPushToken: string,
  destination: string,
  weatherLabel: string,
  tripId: string
): Promise<void> {
  await sendPushNotification({
    to: expoPushToken,
    title: `⚠️ Weather alert — ${destination}`,
    body: `${weatherLabel} expected. Tap to view replan options.`,
    data: { tripId },
  });
}
