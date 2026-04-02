'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AiSetting } from "@/lib/db/ai-config";
import { SETTING_VARIABLES } from "@/lib/db/ai-config";

const SETTING_LABELS: Record<string, string> = {
  model: "LLM Model",
  rewrite_day_weather_context: "Weather Context Template",
  rewrite_day_reason_context: "Reason Context Template",
};

export function AiSettingsPanel({ settings }: { settings: AiSetting[] }) {
  const router = useRouter();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(s: AiSetting) {
    setEditingKey(s.key);
    setEditValue(s.value);
    setError(null);
  }

  function cancelEdit() {
    setEditingKey(null);
    setEditValue("");
    setError(null);
  }

  async function save(key: string) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/ai/settings/${encodeURIComponent(key)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: editValue }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `Save failed (${res.status})`);
        return;
      }
      setEditingKey(null);
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  const isLong = (key: string) =>
    key === "rewrite_day_weather_context" || key === "rewrite_day_reason_context";

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
        AI Settings
      </h2>

      {error && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}

      <div className="space-y-5">
        {settings.map((s) => (
          <div key={s.key}>
            <div className="flex items-start justify-between gap-3 mb-1">
              <div>
                <p className="text-white font-medium text-sm">
                  {SETTING_LABELS[s.key] ?? s.key}
                </p>
                {s.description && (
                  <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>
                )}
                {SETTING_VARIABLES[s.key] && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {SETTING_VARIABLES[s.key].map((v) => (
                      <code
                        key={v}
                        className="text-xs bg-blue-900/40 text-blue-300 px-1.5 py-0.5 rounded"
                      >
                        {`{{${v}}}`}
                      </code>
                    ))}
                  </div>
                )}
              </div>
              {editingKey !== s.key && (
                <button
                  onClick={() => startEdit(s)}
                  className="shrink-0 text-xs text-blue-400 hover:text-blue-300 mt-1"
                >
                  Edit
                </button>
              )}
            </div>

            {editingKey === s.key ? (
              <div className="mt-2 space-y-2">
                {isLong(s.key) ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => save(s.key)}
                    disabled={saving}
                    className="text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded px-3 py-1.5"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-xs text-slate-400 hover:text-white px-3 py-1.5"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <pre className="mt-1 text-xs text-slate-300 bg-slate-800/60 rounded-lg px-3 py-2 whitespace-pre-wrap break-all font-mono">
                {s.value}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
