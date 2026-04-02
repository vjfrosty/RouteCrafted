import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { weatherAlerts, itineraryDays, trips } from "@/lib/db/schema";

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getActiveAlertsByTrip(tripId: string) {
  return db
    .select({
      id: weatherAlerts.id,
      tripId: weatherAlerts.tripId,
      dayId: weatherAlerts.dayId,
      alertType: weatherAlerts.alertType,
      forecastCode: weatherAlerts.forecastCode,
      alertedAt: weatherAlerts.alertedAt,
      dismissed: weatherAlerts.dismissed,
      rewriteAccepted: weatherAlerts.rewriteAccepted,
      dayNumber: itineraryDays.dayNumber,
      date: itineraryDays.date,
      theme: itineraryDays.theme,
      weatherLabel: itineraryDays.weatherLabel,
    })
    .from(weatherAlerts)
    .innerJoin(itineraryDays, eq(weatherAlerts.dayId, itineraryDays.id))
    .where(
      and(eq(weatherAlerts.tripId, tripId), eq(weatherAlerts.dismissed, false)),
    )
    .orderBy(itineraryDays.dayNumber);
}

// Returns { [tripId]: count } for all non-dismissed alerts owned by the user
export async function getAlertCountsByUser(
  userId: string,
): Promise<Record<string, number>> {
  const rows = await db
    .select({ tripId: weatherAlerts.tripId })
    .from(weatherAlerts)
    .innerJoin(trips, eq(weatherAlerts.tripId, trips.id))
    .where(and(eq(trips.userId, userId), eq(weatherAlerts.dismissed, false)));

  const counts: Record<string, number> = {};
  for (const row of rows) {
    counts[row.tripId] = (counts[row.tripId] ?? 0) + 1;
  }
  return counts;
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function createWeatherAlert(data: {
  tripId: string;
  dayId: string;
  alertType: string;
  forecastCode: number;
}) {
  // Idempotency: skip if a non-dismissed alert already exists for this day
  const existing = await db
    .select({ id: weatherAlerts.id })
    .from(weatherAlerts)
    .where(
      and(eq(weatherAlerts.dayId, data.dayId), eq(weatherAlerts.dismissed, false)),
    )
    .limit(1);

  if (existing.length > 0) return null;

  const rows = await db.insert(weatherAlerts).values(data).returning();
  return rows[0] ?? null;
}

export async function dismissAlert(alertId: string, userId: string) {
  // Ownership check: alert → trip → user
  const [alert] = await db
    .select({ id: weatherAlerts.id })
    .from(weatherAlerts)
    .innerJoin(trips, eq(weatherAlerts.tripId, trips.id))
    .where(and(eq(weatherAlerts.id, alertId), eq(trips.userId, userId)))
    .limit(1);

  if (!alert) return null;

  const rows = await db
    .update(weatherAlerts)
    .set({ dismissed: true })
    .where(eq(weatherAlerts.id, alertId))
    .returning();

  return rows[0] ?? null;
}
