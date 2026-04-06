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
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-card">
      <h2 className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider mb-5">
        AI Settings
      </h2>

      {error && (
        <p className="text-error text-sm mb-4">{error}</p>
      )}

      <div className="space-y-5">
        {settings.map((s) => (
          <div key={s.key}>
            <div className="flex items-start justify-between gap-3 mb-1">
              <div>
                <p className="text-on-surface font-medium text-sm">
                  {SETTING_LABELS[s.key] ?? s.key}
                </p>
                {s.description && (
                  <p className="text-xs text-on-surface-variant mt-0.5">{s.description}</p>
                )}
                {SETTING_VARIABLES[s.key] && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {SETTING_VARIABLES[s.key].map((v) => (
                      <code
                        key={v}
                        className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded"
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
                  className="shrink-0 text-xs text-primary hover:text-primary/80 mt-1"
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
                    className="w-full bg-surface-container-low rounded-2xl px-3 py-2 text-sm text-on-surface font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                  />
                ) : (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full bg-surface-container-low rounded-2xl px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => save(s.key)}
                    disabled={saving}
                    className="text-xs horizon-gradient disabled:opacity-50 text-white rounded-full px-4 py-1.5"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-xs text-on-surface-variant hover:text-on-surface px-3 py-1.5"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <pre className="mt-1 text-xs text-on-surface-variant bg-surface-container-low rounded-xl px-3 py-2 whitespace-pre-wrap break-all font-mono">
                {s.value}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
