"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBox } from "@mapbox/search-js-react";
import type { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";

const SELECT_CLASS =
  "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const LABEL_CLASS = "block text-sm font-medium text-slate-300 mb-1.5";

export function TripForm() {
  const router = useRouter();
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

  const [destination, setDestination] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState<string | null>(null);
  const [long, setLong] = useState<string | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budgetRange, setBudgetRange] = useState("mid");
  const [travelStyle, setTravelStyle] = useState("cultural");
  const [groupType, setGroupType] = useState("solo");
  const [pacing, setPacing] = useState("moderate");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleRetrieve(res: SearchBoxRetrieveResponse) {
    const feature = res.features[0];
    if (!feature) return;
    setDestination(feature.properties.name);
    const ctx = feature.properties.context as {
      country?: { name: string };
    } | undefined;
    setCountry(ctx?.country?.name ?? "");
    const coords = feature.geometry.coordinates;
    setLat(String(coords[1]));
    setLong(String(coords[0]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!destination) {
      setError("Please select a destination using the search box.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError("Start date must be before end date.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          country,
          lat,
          long,
          startDate,
          endDate,
          budgetRange,
          travelStyle,
          groupType,
          pacing,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Failed to create trip.");
        return;
      }

      const trip = (await res.json()) as { id: string };
      router.push(`/trips/${trip.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
    >
      {/* Destination */}
      <div>
        <label className={LABEL_CLASS}>Destination</label>
        <SearchBox
          accessToken={token}
          onRetrieve={handleRetrieve}
          options={{ language: "en" }}
          theme={{
            variables: {
              colorBackground: "rgba(255,255,255,0.05)",
              colorBackgroundHover: "rgba(255,255,255,0.1)",
              colorText: "#fff",
              colorSecondary: "#94a3b8",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "0.5rem",
              fontFamily: "inherit",
            },
          }}
        />
        {destination && (
          <p className="mt-1.5 text-xs text-blue-400">
            Selected: {destination}{country ? `, ${country}` : ""}
          </p>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLASS}>Start date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className={SELECT_CLASS}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>End date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className={SELECT_CLASS}
          />
        </div>
      </div>

      {/* Preferences grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLASS}>Budget</label>
          <select
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="budget">Budget</option>
            <option value="mid">Mid-range</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        <div>
          <label className={LABEL_CLASS}>Travel style</label>
          <select
            value={travelStyle}
            onChange={(e) => setTravelStyle(e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="cultural">Cultural</option>
            <option value="adventure">Adventure</option>
            <option value="relaxation">Relaxation</option>
            <option value="foodie">Foodie</option>
          </select>
        </div>

        <div>
          <label className={LABEL_CLASS}>Group type</label>
          <select
            value={groupType}
            onChange={(e) => setGroupType(e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="solo">Solo</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
          </select>
        </div>

        <div>
          <label className={LABEL_CLASS}>Pacing</label>
          <select
            value={pacing}
            onChange={(e) => setPacing(e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="relaxed">Relaxed</option>
            <option value="moderate">Moderate</option>
            <option value="packed">Packed</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-6 py-3 transition"
      >
        {loading ? "Creating trip…" : "Create trip"}
      </button>
    </form>
  );
}
