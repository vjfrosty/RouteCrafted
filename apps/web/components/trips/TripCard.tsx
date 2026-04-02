"use client";

import Link from "next/link";

type Trip = {
  id: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  status: string;
  budgetRange: string;
  travelStyle: string;
  pacing: string;
};

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  active: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

function chipLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDateRange(start: string, end: string) {
  const fmt = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function TripCard({
  trip,
  alertCount = 0,
}: {
  trip: Trip;
  alertCount?: number;
}) {
  return (
    <Link
      href={`/trips/${trip.id}`}
      className="block bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-6 transition group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition">
            {trip.destination}
          </h3>
          <p className="text-sm text-slate-400">{trip.country}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {alertCount > 0 && (
            <span className="text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-2 py-0.5">
              ⚠ {alertCount}
            </span>
          )}
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[trip.status] ?? STATUS_STYLES.draft}`}
          >
            {chipLabel(trip.status)}
          </span>
        </div>
      </div>

      <p className="text-sm text-blue-300 mb-4">
        {formatDateRange(trip.startDate, trip.endDate)}
      </p>

      <div className="flex flex-wrap gap-2">
        {[trip.budgetRange, trip.travelStyle, trip.pacing].map((tag) => (
          <span
            key={tag}
            className="text-xs bg-white/5 border border-white/10 text-slate-300 rounded-full px-3 py-1"
          >
            {chipLabel(tag)}
          </span>
        ))}
      </div>
    </Link>
  );
}
