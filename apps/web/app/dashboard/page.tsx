import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getTripsByUser } from "@/lib/db/trips";
import { TripCard } from "@/components/trips/TripCard";

export const metadata = { title: "Dashboard — RouteCrafted" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const trips = await getTripsByUser(session.user.id);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-3xl font-bold text-white">
              Welcome, {session.user.name.split(" ")[0]} 👋
            </div>
            <p className="text-blue-300 mt-1">
              {trips.length > 0
                ? `You have ${trips.length} trip${trips.length !== 1 ? "s" : ""}`
                : "Your trips will appear here"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/trips/new"
              className="text-sm bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg px-4 py-2 transition"
            >
              + Plan a trip
            </Link>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="text-sm text-slate-400 hover:text-white transition px-4 py-2 rounded-lg border border-white/10 hover:border-white/20"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        {trips.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">🗺️</div>
            <h2 className="text-xl font-semibold text-white mb-2">No trips yet</h2>
            <p className="text-blue-300 mb-6">
              Create your first AI-powered itinerary to get started
            </p>
            <Link
              href="/trips/new"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg px-6 py-2.5 transition"
            >
              Plan a trip
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
