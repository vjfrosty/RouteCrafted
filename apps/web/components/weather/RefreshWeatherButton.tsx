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
        className="flex items-center gap-1.5 text-xs font-label font-semibold text-on-surface-variant hover:text-primary disabled:opacity-50 bg-surface-container-low hover:bg-surface-container-high rounded-full px-4 py-2 transition"
      >
        <span className={`material-symbols-outlined text-[16px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
        {loading ? "Checking…" : "Refresh Weather"}
      </button>
      {stale && (
        <span className="text-xs font-label text-on-surface-variant">
          Forecast out of range
        </span>
      )}
    </div>
  );
}
