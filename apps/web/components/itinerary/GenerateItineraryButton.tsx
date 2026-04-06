'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GenerateItineraryButton({ tripId }: { tripId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/itinerary/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `Generation failed (${res.status})`);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-center">
      {error && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="inline-flex items-center gap-2 horizon-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-on-primary font-headline font-bold rounded-full px-8 py-4 text-lg transition"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg>
            Generating… (up to 30 seconds)
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            Generate Itinerary
          </>
        )}
      </button>
    </div>
  );
}
