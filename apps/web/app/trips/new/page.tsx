import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { TripForm } from "@/components/trips/TripForm";

export const metadata = { title: "Plan a trip — RouteCrafted" };

export default async function NewTripPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-12">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Plan a new trip</h1>
          <p className="text-blue-300 mt-1">
            Tell us about your trip and we&apos;ll build a day-by-day itinerary.
          </p>
        </div>
        <TripForm />
      </div>
    </main>
  );
}
