import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getTripById } from "@/lib/db/trips";

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
          <span
            className={`shrink-0 text-sm font-medium px-3 py-1.5 rounded-full border ${STATUS_STYLES[trip.status] ?? STATUS_STYLES.draft}`}
          >
            {label(trip.status)}
          </span>
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

        {/* Phase 4 placeholder */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">🤖</div>
          <h2 className="text-lg font-semibold text-white mb-2">
            AI itinerary coming soon
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Itinerary generation will be available in the next update.
          </p>
          <button
            disabled
            className="inline-block bg-blue-600/40 text-white/50 font-semibold rounded-lg px-6 py-2.5 cursor-not-allowed"
          >
            Generate itinerary
          </button>
        </div>
      </div>
    </main>
  );
}
