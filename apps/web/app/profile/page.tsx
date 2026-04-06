import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserByEmail } from "@/lib/db/users";
import { ProfileForm } from "@/components/auth/ProfileForm";
import { AvatarUpload } from "@/components/auth/AvatarUpload";

export const metadata = { title: "Profile — RouteCrafted" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await getUserByEmail(session.user.email);
  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-12">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
        <p className="text-slate-400 mb-8">Manage your account details</p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          {/* Avatar with upload */}
          <div className="flex items-center gap-4">
            <AvatarUpload
              currentUrl={user.avatarUrl ?? null}
              initials={user.name?.charAt(0).toUpperCase() ?? "?"}
            />
            <div>
              <p className="text-white font-semibold text-lg">{user.name}</p>
              <p className="text-slate-400 text-sm">{user.email}</p>
            </div>
          </div>

          {/* Role badge */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Role:</span>
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                user.role === "admin"
                  ? "bg-violet-500/20 text-violet-300"
                  : "bg-blue-500/20 text-blue-300"
              }`}
            >
              {user.role}
            </span>
          </div>

          <hr className="border-white/10" />

          {/* Edit name form */}
          <ProfileForm initialName={user.name ?? ""} />
        </div>
      </div>
    </main>
  );
}
