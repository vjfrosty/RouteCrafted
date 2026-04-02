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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-8"
        >
          ← Back to admin
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">AI Configuration</h1>
          <p className="text-slate-400 mt-1">
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
    </main>
  );
}
