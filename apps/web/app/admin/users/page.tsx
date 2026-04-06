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
    <div className="min-h-screen bg-surface px-4 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <a
            href="/admin"
            className="flex items-center gap-1.5 text-sm font-label text-on-surface-variant hover:text-on-surface transition"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Admin
          </a>
          <h1 className="font-headline font-bold text-on-surface text-2xl">Users</h1>
          <span className="text-xs font-label text-on-surface-variant">({total} total)</span>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-xs font-label uppercase tracking-wider">
                <th className="text-left px-5 py-4">Name</th>
                <th className="text-left px-5 py-4">Email</th>
                <th className="text-left px-5 py-4">Role</th>
                <th className="text-left px-5 py-4">Joined</th>
                <th className="px-5 py-4"></th>
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
            <p className="text-on-surface-variant text-sm text-center py-8">
              No users found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
