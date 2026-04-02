import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";

export const metadata = { title: "Admin — RouteCrafted" };

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-slate-400 mb-10">RouteCrafted platform management</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/admin/ai" className="group block">
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 rounded-2xl p-6 transition">
              <div className="text-2xl mb-3">🤖</div>
              <h2 className="text-white font-semibold text-lg group-hover:text-blue-300 transition">
                AI Configuration
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Edit prompt templates, version history, model selection, and
                weather context variables.
              </p>
            </div>
          </Link>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 opacity-50">
            <div className="text-2xl mb-3">👥</div>
            <h2 className="text-white font-semibold text-lg">Users</h2>
            <p className="text-slate-400 text-sm mt-1">
              Manage users, roles, and suspensions. Coming in Phase 7.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 opacity-50">
            <div className="text-2xl mb-3">🚩</div>
            <h2 className="text-white font-semibold text-lg">Moderation Flags</h2>
            <p className="text-slate-400 text-sm mt-1">
              Review and resolve flagged place cards. Coming in Phase 7.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 opacity-50">
            <div className="text-2xl mb-3">📊</div>
            <h2 className="text-white font-semibold text-lg">Platform Stats</h2>
            <p className="text-slate-400 text-sm mt-1">
              Usage statistics and analytics. Coming in Phase 7.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
