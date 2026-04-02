import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getTripById } from "@/lib/db/trips";
import { getDayWithItems } from "@/lib/db/itinerary";
import { RewriteDayButton } from "@/components/itinerary/RewriteDayButton";

type Props = { params: Promise<{ id: string; dayNumber: string }> };

const TYPE_STYLES: Record<string, string> = {
  activity: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  meal: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  transport: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

const BLOCK_ORDER = ["morning", "afternoon", "evening"] as const;

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Props) {
  const { id, dayNumber } = await params;
  return { title: `Day ${dayNumber} — RouteCrafted` };
}

export default async function DayPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id, dayNumber } = await params;
  const dayNum = Number(dayNumber);
  if (!Number.isInteger(dayNum) || dayNum < 1) notFound();

  const trip = await getTripById(id, session.user.id);
  if (!trip) notFound();

  const dayWithItems = await getDayWithItems(id, dayNum);
  if (!dayWithItems) notFound();

  const { items, ...day } = dayWithItems;

  const itemsByBlock = BLOCK_ORDER.reduce(
    (acc, block) => {
      acc[block] = items.filter((i) => i.timeBlock === block);
      return acc;
    },
    {} as Record<string, typeof items>,
  );

  const totalCost = items.reduce(
    (sum, i) => sum + Number(i.estimatedCost ?? 0),
    0,
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          href={`/trips/${id}`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-8"
        >
          ← Back to trip
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="bg-blue-600/30 text-blue-300 text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                {dayNum}
              </span>
              <p className="text-blue-300 text-sm">{formatDate(day.date)}</p>
            </div>
            <h1 className="text-2xl font-bold text-white">{day.theme}</h1>
            {day.weatherLabel && (
              <p className="text-amber-400 text-sm mt-1">⚠ {day.weatherLabel}</p>
            )}
          </div>
          <RewriteDayButton tripId={id} dayId={day.id} />
        </div>

        {/* Summary */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
          <p className="text-slate-300">{day.summary}</p>
          <div className="flex gap-4 mt-3 text-xs text-slate-500">
            <span>{items.length} stops</span>
            {totalCost > 0 && (
              <span>Est. ${totalCost.toFixed(0)} total</span>
            )}
            {day.rewrittenAt && <span>Rewritten by AI</span>}
          </div>
        </div>

        {/* Time blocks */}
        {BLOCK_ORDER.map((block) => {
          const blockItems = itemsByBlock[block];
          if (blockItems.length === 0) return null;
          return (
            <div key={block} className="mb-8">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 capitalize">
                {block}
              </h2>
              <div className="space-y-3">
                {blockItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${TYPE_STYLES[item.type] ?? TYPE_STYLES.activity}`}
                        >
                          {item.type}
                        </span>
                        {item.isOptional && (
                          <span className="text-xs text-slate-500 italic">
                            optional
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-slate-400">
                          {item.durationMins} min
                        </p>
                        {Number(item.estimatedCost) > 0 && (
                          <p className="text-xs text-emerald-400">
                            ${Number(item.estimatedCost).toFixed(0)}
                          </p>
                        )}
                      </div>
                    </div>

                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 mb-2">📍 {item.location}</p>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
