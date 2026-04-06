"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
}

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  traveler: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
};

export function AdminUserRow({
  user,
  currentUserId,
}: {
  user: User;
  currentUserId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isSelf = user.id === currentUserId;

  async function toggleRole() {
    if (isSelf) return;
    setLoading(true);
    const newRole = user.role === "admin" ? "traveler" : "admin";
    await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition">
      <td className="px-4 py-3 text-white font-medium">{user.name}</td>
      <td className="px-4 py-3 text-slate-400">{user.email}</td>
      <td className="px-4 py-3">
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${ROLE_STYLES[user.role] ?? ROLE_STYLES.traveler}`}
        >
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-500 text-xs">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-right">
        {!isSelf && (
          <button
            onClick={toggleRole}
            disabled={loading}
            className="text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1 rounded-lg transition disabled:opacity-50"
          >
            {loading
              ? "…"
              : user.role === "admin"
                ? "Demote"
                : "Make Admin"}
          </button>
        )}
      </td>
    </tr>
  );
}
