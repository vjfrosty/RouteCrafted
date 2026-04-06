"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  tripId: string;
  hasItinerary: boolean;
}

export function GeneratePlaceCardsButton({ tripId, hasItinerary }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!hasItinerary) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/places/generate-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(
          (body as { error?: string }).error ?? "Failed to generate cards",
        );
        return;
      }

      router.refresh();
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  if (!hasItinerary) return null;

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
      >
        {loading ? (
          <>
            <span className="animate-spin">⟳</span>
            Generating…
          </>
        ) : (
          <>✦ Generate Place Cards</>
        )}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
