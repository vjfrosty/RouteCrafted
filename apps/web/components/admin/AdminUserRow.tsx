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
  admin: "bg-primary/10 text-primary",
  traveler: "bg-surface-container-high text-on-surface-variant",
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
    <tr className="hover:bg-surface-container-low transition">
      <td className="px-5 py-3 text-on-surface font-medium">{user.name}</td>
      <td className="px-5 py-3 text-on-surface-variant">{user.email}</td>
      <td className="px-5 py-3">
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-label ${ROLE_STYLES[user.role] ?? ROLE_STYLES.traveler}`}
        >
          {user.role}
        </span>
      </td>
      <td className="px-5 py-3 text-on-surface-variant text-xs">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="px-5 py-3 text-right">
        {!isSelf && (
          <button
            onClick={toggleRole}
            disabled={loading}
            className="text-xs text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface-container-high rounded-full px-3 py-1 transition disabled:opacity-50"
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
