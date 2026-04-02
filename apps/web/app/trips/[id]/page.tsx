import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getTripById } from "@/lib/db/trips";
import { getDaysByTrip, getDayWithItems } from "@/lib/db/itinerary";
import { runWeatherCheck } from "@/lib/weather/check";
import { getActiveAlertsByTrip } from "@/lib/db/weather";
import { GenerateItineraryButton } from "@/components/itinerary/GenerateItineraryButton";
import { DayCard } from "@/components/itinerary/DayCard";
import { WeatherAlertBanner } from "@/components/weather/WeatherAlertBanner";
import { RefreshWeatherButton } from "@/components/weather/RefreshWeatherButton";

type Props = { params: Promise<{ id: string }> };

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  active: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

function label(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Trip ${id} — RouteCrafted` };
}

export default async function TripDetailPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;
  const trip = await getTripById(id, session.user.id);
  if (!trip) notFound();

  // Auto-check weather on every page open (idempotent, cached forecast)
  const [days, alerts] = await Promise.all([
    getDaysByTrip(id),
    runWeatherCheck(id, session.user.id)
      .then(() => getActiveAlertsByTrip(id))
      .catch(() => getActiveAlertsByTrip(id)),
  ]);

  // Fetch item counts for each day
  const dayCounts = await Promise.all(
    days.map(async (day) => {
      const full = await getDayWithItems(id, day.dayNumber);
      return { dayId: day.id, count: full?.items.length ?? 0 };
    }),
  );
  const countMap = new Map(dayCounts.map((d) => [d.dayId, d.count]));

  const nights =
    Math.round(
      (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
        86_400_000,
    ) || 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-8"
        >
          ← Back to dashboard
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{trip.destination}</h1>
            <p className="text-blue-300 mt-1">{trip.country}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`shrink-0 text-sm font-medium px-3 py-1.5 rounded-full border ${STATUS_STYLES[trip.status] ?? STATUS_STYLES.draft}`}
            >
              {label(trip.status)}
            </span>
            {days.length > 0 && <RefreshWeatherButton tripId={id} />}
          </div>
        </div>

        {/* Dates */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Dates
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Departure</p>
              <p className="text-white font-medium">{formatDate(trip.startDate)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Return</p>
              <p className="text-white font-medium">{formatDate(trip.endDate)}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-blue-300">{nights} night{nights !== 1 ? "s" : ""}</p>
        </div>

        {/* Trip preferences */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Preferences
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { key: "Budget", val: trip.budgetRange },
              { key: "Style", val: trip.travelStyle },
              { key: "Group", val: trip.groupType },
              { key: "Pacing", val: trip.pacing },
            ].map(({ key, val }) => (
              <div key={key}>
                <p className="text-xs text-slate-500 mb-1">{key}</p>
                <p className="text-white font-medium">{label(val)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <div className="mb-4 space-y-3">
            {alerts.map((alert) => (
              <WeatherAlertBanner
                key={alert.id}
                alert={{
                  id: alert.id,
                  tripId: alert.tripId,
                  dayId: alert.dayId,
                  alertType: alert.alertType,
                  forecastCode: alert.forecastCode,
                  weatherLabel: alert.weatherLabel,
                }}
                dayNumber={alert.dayNumber}
                date={alert.date}
                theme={alert.theme}
              />
            ))}
          </div>
        )}

        {/* Itinerary section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {days.length === 0 ? (
            <div className="text-center">
              <div className="text-4xl mb-3">🤖</div>
              <h2 className="text-lg font-semibold text-white mb-2">
                Ready to plan your trip?
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Our AI will generate a day-by-day itinerary tailored to your preferences.
              </p>
              <GenerateItineraryButton tripId={id} />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Itinerary — {days.length} day{days.length !== 1 ? "s" : ""}
                </h2>
                <GenerateItineraryButton tripId={id} />
              </div>
              <div className="space-y-3">
                {days.map((day) => (
                  <DayCard
                    key={day.id}
                    tripId={id}
                    dayNumber={day.dayNumber}
                    date={day.date}
                    theme={day.theme}
                    summary={day.summary}
                    itemCount={countMap.get(day.id) ?? 0}
                    weatherLabel={day.weatherLabel}
                    rewrittenAt={day.rewrittenAt}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
