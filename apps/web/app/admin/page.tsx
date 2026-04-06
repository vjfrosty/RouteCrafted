import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users, trips, placeCards, adminFlags } from "@/lib/db/schema";
import { count as drizzleCount, eq } from "drizzle-orm";

export const metadata = { title: "Admin — RouteCrafted" };

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");

  const [[totalUsers], [totalTrips], [totalCards], [openFlags]] =
    await Promise.all([
      db.select({ value: drizzleCount() }).from(users),
      db.select({ value: drizzleCount() }).from(trips),
      db.select({ value: drizzleCount() }).from(placeCards),
      db
        .select({ value: drizzleCount() })
        .from(adminFlags)
        .where(eq(adminFlags.status, "open")),
    ]);

  const stats = [
    { label: "Users", value: Number(totalUsers.value) },
    { label: "Trips", value: Number(totalTrips.value) },
    { label: "Place Cards", value: Number(totalCards.value) },
    { label: "Open Flags", value: Number(openFlags.value) },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-slate-400 mb-8">RouteCrafted platform management</p>

        {/* Live stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
            >
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Nav cards */}
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

          <Link href="/admin/users" className="group block">
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/40 rounded-2xl p-6 transition">
              <div className="text-2xl mb-3">👥</div>
              <h2 className="text-white font-semibold text-lg group-hover:text-violet-300 transition">
                Users
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                View all {Number(totalUsers.value)} users, promote to admin or demote to traveler.
              </p>
            </div>
          </Link>

          <Link href="/admin/flags" className="group block">
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/40 rounded-2xl p-6 transition">
              <div className="text-2xl mb-3">🚩</div>
              <h2 className="text-white font-semibold text-lg group-hover:text-amber-300 transition">
                Moderation Flags
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Review and resolve flagged place cards.{" "}
                {Number(openFlags.value) > 0 && (
                  <span className="text-amber-400 font-medium">
                    {Number(openFlags.value)} open
                  </span>
                )}
              </p>
            </div>
          </Link>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-2xl mb-3">📊</div>
            <h2 className="text-white font-semibold text-lg">Platform Stats</h2>
            <p className="text-slate-400 text-sm mt-1">
              {Number(totalTrips.value)} trips · {Number(totalCards.value)} place cards across {Number(totalUsers.value)} users.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
