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
    <div className="min-h-screen bg-surface px-4 sm:px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <a
            href="/admin"
            className="flex items-center gap-1.5 text-sm font-label text-on-surface-variant hover:text-on-surface transition"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Admin
          </a>
          <h1 className="font-headline font-bold text-on-surface text-2xl">Moderation Flags</h1>
          <span className="text-xs font-label text-on-surface-variant">({flags.length} open)</span>
        </div>

        {flags.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-lowest rounded-3xl shadow-card">
            <span className="material-symbols-outlined text-[48px] text-secondary block mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <p className="font-headline font-bold text-on-surface">All clear — no open flags</p>
          </div>
        ) : (
          <div className="space-y-4">
            {flags.map(({ flag, card }) => (
              <AdminFlagRow key={flag.id} flag={flag} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
