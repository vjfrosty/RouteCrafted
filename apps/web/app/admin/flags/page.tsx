import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getOpenFlags } from "@/lib/db/places";
import { AdminFlagRow } from "@/components/admin/AdminFlagRow";

export const metadata = { title: "Flags — Admin — RouteCrafted" };

export default async function AdminFlagsPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");

  const flags = await getOpenFlags();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <a
            href="/admin"
            className="text-sm text-slate-400 hover:text-white transition"
          >
            ← Admin
          </a>
          <h1 className="text-2xl font-bold text-white">Moderation Flags</h1>
          <span className="text-slate-500 text-sm">
            ({flags.length} open)
          </span>
        </div>

        {flags.length === 0 ? (
          <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white font-medium">All clear — no open flags</p>
          </div>
        ) : (
          <div className="space-y-4">
            {flags.map(({ flag, card }) => (
              <AdminFlagRow key={flag.id} flag={flag} card={card} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
