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
    <div className="flex items-start gap-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
      <div className="text-2xl mt-0.5 select-none">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-amber-300 font-semibold text-sm">
          Day {dayNumber} — {formatDate(date)}
        </p>
        <p className="text-white text-sm font-medium mt-0.5">{theme}</p>
        {alert.weatherLabel && (
          <p className="text-amber-200/80 text-sm mt-1">{alert.weatherLabel}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleRewrite}
          disabled={busy}
          className="text-xs font-semibold bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black rounded-lg px-3 py-1.5 transition"
        >
          {rewriting ? "Rewriting…" : "Rewrite Day"}
        </button>
        <button
          onClick={handleDismiss}
          disabled={busy}
          className="text-xs text-slate-400 hover:text-white disabled:opacity-50 transition px-2 py-1.5"
        >
          {dismissing ? "…" : "Dismiss"}
        </button>
      </div>
    </div>
  );
}
