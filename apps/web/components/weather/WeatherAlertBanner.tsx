"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ALERT_ICONS: Record<string, string> = {
  rain: "🌧",
  storm: "⛈",
  extreme_heat: "🥵",
  snow: "❄",
};

interface Props {
  alert: {
    id: string;
    tripId: string;
    dayId: string;
    alertType: string;
    forecastCode: number;
    weatherLabel: string | null;
  };
  dayNumber: number;
  date: string;
  theme: string;
}

export function WeatherAlertBanner({ alert, dayNumber, date, theme }: Props) {
  const router = useRouter();
  const [rewriting, setRewriting] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  const busy = rewriting || dismissing;

  async function handleRewrite() {
    setRewriting(true);
    try {
      const res = await fetch("/api/itinerary/rewrite-day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: alert.tripId,
          dayId: alert.dayId,
          forecastCode: alert.forecastCode,
          weatherLabel: alert.weatherLabel ?? undefined,
        }),
      });
      if (res.ok) {
        await fetch(`/api/weather/dismiss/${alert.id}`, { method: "POST" });
        router.refresh();
      }
    } finally {
      setRewriting(false);
    }
  }

  async function handleDismiss() {
    setDismissing(true);
    try {
      await fetch(`/api/weather/dismiss/${alert.id}`, { method: "POST" });
      router.refresh();
    } finally {
      setDismissing(false);
    }
  }

  const icon = ALERT_ICONS[alert.alertType] ?? "⚠";

  function formatDate(d: string) {
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-container rounded-3xl p-6 shadow-xl text-white">
      {/* Decorative icon */}
      <span
        className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-white/10 select-none pointer-events-none"
        aria-hidden
      >
        thunderstorm
      </span>

      <div className="relative flex items-start gap-4">
        <span className="material-symbols-outlined text-[32px] text-tertiary-fixed mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
          warning
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-headline font-bold text-lg leading-snug">
            Day {dayNumber} — {formatDate(date)}
          </p>
          <p className="text-blue-100 text-sm font-medium mt-0.5">{theme}</p>
          {alert.weatherLabel && (
            <p className="text-blue-100/80 text-sm mt-1">{alert.weatherLabel}</p>
          )}
        </div>
      </div>

      <div className="relative flex items-center gap-3 mt-5">
        <button
          onClick={handleRewrite}
          disabled={busy}
          className="bg-tertiary-fixed hover:bg-tertiary-fixed-dim disabled:opacity-50 text-on-tertiary-fixed text-sm font-headline font-bold rounded-full px-5 py-2 transition"
        >
          {rewriting ? "Rewriting…" : "Adjust Plan"}
        </button>
        <button
          onClick={handleDismiss}
          disabled={busy}
          className="text-white/70 hover:text-white disabled:opacity-50 text-sm font-medium transition px-3 py-2"
        >
          {dismissing ? "…" : "Dismiss"}
        </button>
      </div>
    </div>
  );
}
