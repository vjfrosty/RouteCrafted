"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Flag {
  id: string;
  placeCardId: string;
  reason: string;
  createdAt: Date;
}

interface Card {
  id: string;
  name: string;
  category: string;
  verdict: string;
  summary: string;
  tripId: string;
}

export function AdminFlagRow({ flag, card }: { flag: Flag; card: Card }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAction(action: "resolved" | "dismissed") {
    setLoading(action);
    await fetch(`/api/admin/flags/${flag.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading(null);
    router.refresh();
  }

  async function handleDelete() {
    setLoading("delete");
    await fetch(`/api/admin/cards/${card.id}`, { method: "DELETE" });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium">{card.name}</p>
          <p className="text-slate-400 text-xs mt-0.5 capitalize">
            {card.category.replace(/_/g, " ")} · {card.verdict.replace(/_/g, " ")}
          </p>
          <p className="text-slate-300 text-sm mt-2 line-clamp-2">{card.summary}</p>

          <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
            <p className="text-xs text-amber-300 font-medium mb-0.5">Flag reason</p>
            <p className="text-slate-300 text-sm">{flag.reason}</p>
          </div>

          <p className="text-slate-600 text-xs mt-2">
            Flagged {new Date(flag.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => handleAction("dismissed")}
            disabled={loading !== null}
            className="text-xs bg-emerald-600/70 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg transition disabled:opacity-50"
          >
            {loading === "dismissed" ? "…" : "Dismiss Flag"}
          </button>
          <button
            onClick={() => handleAction("resolved")}
            disabled={loading !== null}
            className="text-xs bg-slate-600/70 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg transition disabled:opacity-50"
          >
            {loading === "resolved" ? "…" : "Mark Resolved"}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading !== null}
            className="text-xs bg-red-600/70 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition disabled:opacity-50"
          >
            {loading === "delete" ? "…" : "Delete Card"}
          </button>
        </div>
      </div>
    </div>
  );
}
