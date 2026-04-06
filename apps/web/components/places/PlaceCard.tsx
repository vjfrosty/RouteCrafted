"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PlaceCardData {
  id: string;
  tripId: string;
  name: string;
  category: string;
  verdict: string;
  summary: string;
  worthItReasons: string[];
  skipItReasons: string[];
  bestFor: string;
  costLevel: string;
  timeNeeded: string;
  imageUrl: string | null;
  flagged: boolean;
}

const VERDICT_STYLES: Record<string, { label: string; classes: string }> = {
  worth_it: {
    label: "Worth It ✓",
    classes: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  },
  skip_it: {
    label: "Skip It ✗",
    classes: "bg-red-500/20 text-red-300 border border-red-500/30",
  },
  depends: {
    label: "Depends",
    classes: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  },
};

const COST_ICONS: Record<string, string> = {
  free: "Free",
  low: "$",
  medium: "$$",
  high: "$$$",
};

export function PlaceCard({ card }: { card: PlaceCardData }) {
  const router = useRouter();
  const [flagging, setFlagging] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const verdict = VERDICT_STYLES[card.verdict] ?? VERDICT_STYLES.depends;

  async function handleFlag() {
    if (!flagReason.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/places/flag/${card.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: flagReason }),
      });
      if (res.ok) {
        setShowFlagForm(false);
        setFlagReason("");
        router.refresh();
      }
    } finally {
      setLoading(false);
      setFlagging(false);
    }
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden flex flex-col">
      {/* Image or placeholder */}
      {card.imageUrl ? (
        <img
          src={card.imageUrl}
          alt={card.name}
          className="w-full h-36 object-cover"
        />
      ) : (
        <div className="w-full h-36 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
          <span className="text-3xl">{categoryIcon(card.category)}</span>
        </div>
      )}

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-white text-sm leading-snug">
              {card.name}
            </h3>
            <p className="text-xs text-slate-400 capitalize mt-0.5">
              {card.category.replace(/_/g, " ")}
            </p>
          </div>
          <span
            className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${verdict.classes}`}
          >
            {verdict.label}
          </span>
        </div>

        {/* Summary */}
        <p className="text-slate-300 text-xs leading-relaxed">{card.summary}</p>

        {/* Reasons */}
        {card.worthItReasons.length > 0 && (
          <ul className="space-y-1">
            {card.worthItReasons.slice(0, 3).map((r, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-300">
                <span className="mt-0.5 shrink-0">✓</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        )}
        {card.skipItReasons.length > 0 && (
          <ul className="space-y-1">
            {card.skipItReasons.slice(0, 2).map((r, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-red-300">
                <span className="mt-0.5 shrink-0">✗</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Meta chips */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-slate-700/50">
          <span className="text-xs bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded-full">
            {COST_ICONS[card.costLevel] ?? card.costLevel}
          </span>
          <span className="text-xs bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded-full">
            ⏱ {card.timeNeeded}
          </span>
          <span className="text-xs bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded-full truncate max-w-32">
            👤 {card.bestFor}
          </span>
        </div>

        {/* Flag section */}
        {!showFlagForm ? (
          <button
            onClick={() => setShowFlagForm(true)}
            className="text-xs text-slate-500 hover:text-slate-300 transition text-left"
          >
            ⚑ Report inaccuracy
          </button>
        ) : (
          <div className="mt-1 space-y-2">
            <textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="What's inaccurate?"
              rows={2}
              maxLength={500}
              className="w-full text-xs bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 resize-none focus:outline-none focus:border-slate-400"
            />
            <div className="flex gap-2">
              <button
                onClick={handleFlag}
                disabled={loading || !flagReason.trim()}
                className="text-xs bg-red-600/80 hover:bg-red-600 text-white px-3 py-1 rounded-lg disabled:opacity-50 transition"
              >
                {loading ? "Reporting…" : "Report"}
              </button>
              <button
                onClick={() => {
                  setShowFlagForm(false);
                  setFlagReason("");
                }}
                className="text-xs text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function categoryIcon(category: string): string {
  const map: Record<string, string> = {
    museum: "🏛️",
    restaurant: "🍽️",
    park: "🌳",
    religious_site: "⛪",
    historic: "🏰",
    nature: "🌿",
    shopping: "🛍️",
    attraction: "📍",
  };
  return map[category] ?? "📍";
}
