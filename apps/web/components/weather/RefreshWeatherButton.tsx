"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  tripId: string;
}

export function RefreshWeatherButton({ tripId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stale, setStale] = useState(false);

  async function handleCheck() {
    setLoading(true);
    setStale(false);
    try {
      const res = await fetch(`/api/weather/check/${tripId}`);
      if (res.ok) {
        const data = (await res.json()) as { stale?: boolean };
        if (data.stale) setStale(true);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCheck}
        disabled={loading}
        className="text-xs font-medium text-slate-300 hover:text-white disabled:opacity-50 border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition"
      >
        {loading ? "Checking…" : "↻ Refresh Weather"}
      </button>
      {stale && (
        <span className="text-xs text-slate-500">
          Forecast unavailable (out of range)
        </span>
      )}
    </div>
  );
}
