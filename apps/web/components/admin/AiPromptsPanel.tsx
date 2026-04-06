'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AiPrompt } from "@/lib/db/ai-config";
import { PROMPT_VARIABLES } from "@/lib/db/ai-config";

const KEY_LABELS: Record<string, string> = {
  generate_itinerary: "Generate Itinerary",
  rewrite_day: "Rewrite Day",
  place_card: "Place Card",
};

interface NewVersionForm {
  name: string;
  description: string;
  template: string;
}

const EMPTY_FORM: NewVersionForm = { name: "", description: "", template: "" };

export function AiPromptsPanel({ prompts }: { prompts: AiPrompt[] }) {
  const router = useRouter();

  const allKeys = Array.from(new Set(prompts.map((p) => p.promptKey)));
  const [selectedKey, setSelectedKey] = useState<string>(
    allKeys[0] ?? "generate_itinerary",
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewVersionForm>(EMPTY_FORM);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activating, setActivating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const keyPrompts = prompts
    .filter((p) => p.promptKey === selectedKey)
    .sort((a, b) => b.version - a.version);
  const activePrompt = keyPrompts.find((p) => p.isActive);

  async function createVersion() {
    if (!form.name.trim() || !form.template.trim()) {
      setError("Name and template are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/ai/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptKey: selectedKey,
          name: form.name,
          description: form.description,
          template: form.template,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `Failed (${res.status})`);
        return;
      }
      setForm(EMPTY_FORM);
      setShowForm(false);
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function activateVersion(prompt: AiPrompt) {
    setActivating(prompt.id);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/ai/prompts/${prompt.id}/activate`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ promptKey: prompt.promptKey }),
        },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `Failed (${res.status})`);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setActivating(null);
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-card">
      <h2 className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider mb-5">
        Prompt Templates
      </h2>

      {/* Key tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {allKeys.map((key) => (
          <button
            key={key}
            onClick={() => {
              setSelectedKey(key);
              setShowForm(false);
              setViewingId(null);
              setError(null);
            }}
            className={`text-sm px-4 py-1.5 rounded-full transition font-label ${
              selectedKey === key
                ? "bg-primary text-white"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {KEY_LABELS[key] ?? key}
          </button>
        ))}
      </div>

      {error && <p className="text-error text-sm mb-4">{error}</p>}

      {/* Available variables hint */}
      {PROMPT_VARIABLES[selectedKey] && (
        <div className="mb-4">
          <p className="text-xs text-on-surface-variant mb-1">Available variables:</p>
          <div className="flex flex-wrap gap-1">
            {PROMPT_VARIABLES[selectedKey].map((v) => (
              <code
                key={v}
                className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded"
              >
                {`{{${v}}}`}
              </code>
            ))}
          </div>
        </div>
      )}

      {/* Version list */}
      <div className="space-y-3 mb-5">
        {keyPrompts.length === 0 && (
          <p className="text-sm text-on-surface-variant italic">No versions yet.</p>
        )}
        {keyPrompts.map((p) => (
          <div
            key={p.id}
            className={`rounded-2xl p-4 ${
              p.isActive
                ? "bg-primary/5 ring-1 ring-primary/30 shadow-card-hover"
                : "bg-surface-container-low shadow-card"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-on-surface font-medium text-sm">{p.name}</span>
                  <span className="text-xs text-on-surface-variant">v{p.version}</span>
                  {p.isActive && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                {p.description && (
                  <p className="text-xs text-on-surface-variant mt-0.5">{p.description}</p>
                )}
                <p className="text-xs text-outline mt-0.5">
                  Created{" "}
                  {new Date(p.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() =>
                    setViewingId(viewingId === p.id ? null : p.id)
                  }
                  className="text-xs text-on-surface-variant hover:text-on-surface"
                >
                  {viewingId === p.id ? "Hide" : "View"}
                </button>
                {!p.isActive && (
                  <button
                    onClick={() => activateVersion(p)}
                    disabled={activating === p.id}
                    className="text-xs text-primary hover:text-primary/80 disabled:opacity-50"
                  >
                    {activating === p.id ? "…" : "Activate"}
                  </button>
                )}
              </div>
            </div>

            {viewingId === p.id && (
              <pre className="mt-3 text-xs text-on-surface bg-surface-container-low rounded-xl p-3 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
                {p.template}
              </pre>
            )}
          </div>
        ))}
      </div>

      {/* Create new version */}
      {!showForm ? (
        <button
          onClick={() => {
            setForm(
              activePrompt
                ? {
                    name: `v${(activePrompt.version ?? 0) + 1}`,
                    description: "",
                    template: activePrompt.template,
                  }
                : EMPTY_FORM,
            );
            setShowForm(true);
          }}
          className="text-sm text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 rounded-full px-4 py-2 transition"
        >
          + Create new version
        </button>
      ) : (
        <div className="bg-surface-container-low rounded-2xl p-5 space-y-4">
          <h3 className="font-headline font-bold text-on-surface text-sm">New Version</h3>

          <div>
            <label className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. v2 — more cultural emphasis"
              className="w-full bg-surface-container-lowest rounded-2xl px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">
              Description (optional)
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="What changed in this version"
              className="w-full bg-surface-container-lowest rounded-2xl px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">
              Prompt Template *
            </label>
            <textarea
              value={form.template}
              onChange={(e) =>
                setForm((f) => ({ ...f, template: e.target.value }))
              }
              rows={16}
              className="w-full bg-surface-container-lowest rounded-2xl px-3 py-2 text-sm text-on-surface font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
              placeholder={`Use {{variableName}} for dynamic values`}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={createVersion}
              disabled={saving}
              className="text-sm horizon-gradient disabled:opacity-50 text-white rounded-full px-5 py-2"
            >
              {saving ? "Saving…" : "Save & Activate"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setError(null);
              }}
              className="text-sm text-on-surface-variant hover:text-on-surface px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
