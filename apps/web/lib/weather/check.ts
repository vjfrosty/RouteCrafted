import { getForecast, classifyAlert } from "@/lib/weather/open-meteo";
import { getDaysByTrip, updateDay } from "@/lib/db/itinerary";
import { createWeatherAlert } from "@/lib/db/weather";
import { getTripById } from "@/lib/db/trips";
import { getUserById } from "@/lib/db/users";
import { sendWeatherPush } from "@/lib/notifications/expo-push";

export interface WeatherCheckResult {
  newAlerts: number;
  stale: boolean;
}

/**
 * Core weather-check logic.
 * Called directly from server components (no HTTP self-call) AND from the
 * GET /api/weather/check/[tripId] route handler.
 */
export async function runWeatherCheck(
  tripId: string,
  userId: string,
): Promise<WeatherCheckResult> {
  const trip = await getTripById(tripId, userId);
  if (!trip?.lat || !trip?.long) return { newAlerts: 0, stale: true };

  const [days, forecast] = await Promise.all([
    getDaysByTrip(tripId),
    getForecast(trip.lat, trip.long, trip.startDate, trip.endDate).catch(
      () => [],
    ),
  ]);

  if (!forecast.length || !days.length) return { newAlerts: 0, stale: true };

  // Index forecast by date for O(1) lookups
  const forecastMap = new Map(forecast.map((f) => [f.date, f]));

  let newAlerts = 0;

  await Promise.all(
    days.map(async (day) => {
      const fc = forecastMap.get(day.date);
      if (!fc) return;

      const alert = classifyAlert(fc.weatherCode, fc.maxTempC);
      if (!alert) return;

      // Update weatherCode + weatherLabel on the day row
      await updateDay(day.id, {
        weatherCode: fc.weatherCode,
        weatherLabel: alert.label,
        weatherAlerted: true,
      });

      // Insert alert row (idempotent — skips if one already exists for this day)
      const created = await createWeatherAlert({
        tripId,
        dayId: day.id,
        alertType: alert.alertType,
        forecastCode: fc.weatherCode,
      });

      if (created) {
        newAlerts++;
        // Fire-and-forget push notification if owner has a token
        getUserById(trip.userId)
          .then((owner) => {
            if (owner?.expoPushToken) {
              sendWeatherPush(
                owner.expoPushToken,
                trip.destination,
                alert.label,
                tripId,
              ).catch(() => {});
            }
          })
          .catch(() => {});
      }
    }),
  );

  return { newAlerts, stale: false };
}
