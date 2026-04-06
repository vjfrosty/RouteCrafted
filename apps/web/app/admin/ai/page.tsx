import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { seedDefaults, getAllPrompts, getAllSettings } from "@/lib/db/ai-config";
import { AiPromptsPanel } from "@/components/admin/AiPromptsPanel";
import { AiSettingsPanel } from "@/components/admin/AiSettingsPanel";

export const metadata = { title: "AI Configuration — RouteCrafted Admin" };

export default async function AdminAiPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");

  // Seed defaults on first visit (idempotent)
  await seedDefaults();

  const [prompts, settings] = await Promise.all([
    getAllPrompts(),
    getAllSettings(),
  ]);

  return (
    <div className="min-h-screen bg-surface px-4 sm:px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-label text-on-surface-variant hover:text-on-surface transition mb-8"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to admin
        </Link>

        <div className="mb-8">
          <p className="text-xs font-label font-bold text-primary uppercase tracking-wider mb-2">Administration</p>
          <h1 className="font-headline font-extrabold text-3xl text-on-surface">AI Configuration</h1>
          <p className="text-on-surface-variant mt-1">
            Manage prompt templates (with version history) and AI settings. New
            versions are activated immediately.
          </p>
        </div>

        <div className="space-y-6">
          {/* Settings first — quick edits */}
          <AiSettingsPanel settings={settings} />

          {/* Prompt versioning */}
          <AiPromptsPanel prompts={prompts} />
        </div>
      </div>
    </div>
  );
}
