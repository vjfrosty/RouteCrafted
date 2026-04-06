import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAllUsers } from "@/lib/db/users";
import { AdminUserRow } from "@/components/admin/AdminUserRow";

export const metadata = { title: "Users — Admin — RouteCrafted" };

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");

  const { rows, total } = await getAllUsers(1, 50);

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
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <span className="text-slate-500 text-sm">({total} total)</span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Joined</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((user) => (
                <AdminUserRow
                  key={user.id}
                  user={user}
                  currentUserId={session.user.id}
                />
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-8">
              No users found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
