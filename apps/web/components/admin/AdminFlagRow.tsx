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
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-on-surface font-semibold">{card.name}</p>
          <p className="text-on-surface-variant text-xs mt-0.5 capitalize">
            {card.category.replace(/_/g, " ")} · {card.verdict.replace(/_/g, " ")}
          </p>
          <p className="text-on-surface text-sm mt-2 line-clamp-2">{card.summary}</p>

          <div className="mt-3 bg-tertiary-fixed/20 rounded-2xl px-3 py-2">
            <p className="text-xs text-on-surface font-label font-bold uppercase tracking-wide mb-0.5">Flag reason</p>
            <p className="text-on-surface-variant text-sm">{flag.reason}</p>
          </div>

          <p className="text-outline text-xs mt-2">
            Flagged {new Date(flag.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => handleAction("dismissed")}
            disabled={loading !== null}
            className="text-xs bg-secondary/10 text-secondary hover:bg-secondary/20 px-3 py-1.5 rounded-full transition disabled:opacity-50"
          >
            {loading === "dismissed" ? "…" : "Dismiss Flag"}
          </button>
          <button
            onClick={() => handleAction("resolved")}
            disabled={loading !== null}
            className="text-xs bg-surface-container-high text-on-surface hover:bg-surface-container text-on-surface px-3 py-1.5 rounded-full transition disabled:opacity-50"
          >
            {loading === "resolved" ? "…" : "Mark Resolved"}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading !== null}
            className="text-xs bg-error/10 text-error hover:bg-error/20 px-3 py-1.5 rounded-full transition disabled:opacity-50"
          >
            {loading === "delete" ? "…" : "Delete Card"}
          </button>
        </div>
      </div>
    </div>
  );
}
