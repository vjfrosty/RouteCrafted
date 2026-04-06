"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProfileForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMessage({ type: "ok", text: "Name updated successfully." });
      router.refresh();
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Failed to update." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider mb-2" htmlFor="name">
          Display Name
        </label>
        <input
          id="name"
          type="text"
          required
          minLength={2}
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-surface-container-low rounded-2xl px-4 py-3 text-on-surface placeholder-on-surface-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Your name"
        />
      </div>

      {message && (
        <div className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-label ${
          message.type === "ok"
            ? "bg-secondary/10 text-secondary"
            : "bg-error/10 text-error"
        }`}>
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {message.type === "ok" ? "check_circle" : "error"}
          </span>
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="horizon-gradient hover:opacity-90 disabled:opacity-50 text-white font-headline font-bold rounded-full px-8 py-3 transition flex items-center gap-2"
      >
        {saving ? (
          <>
            <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            Saving…
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save Changes
          </>
        )}
      </button>
    </form>
  );
}
