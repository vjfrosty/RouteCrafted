import Link from "next/link";

interface DayCardProps {
  tripId: string;
  dayNumber: number;
  date: string;
  theme: string;
  summary: string;
  itemCount: number;
  weatherLabel?: string | null;
  rewrittenAt?: Date | null;
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function DayCard({
  tripId,
  dayNumber,
  date,
  theme,
  summary,
  itemCount,
  weatherLabel,
  rewrittenAt,
}: DayCardProps) {
  return (
    <Link href={`/trips/${tripId}/day/${dayNumber}`} className="block group">
      <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 rounded-2xl p-5 transition">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="shrink-0 bg-blue-600/30 text-blue-300 text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
              {dayNumber}
            </span>
            <div>
              <p className="text-xs text-slate-400">{formatDate(date)}</p>
              <h3 className="text-white font-semibold group-hover:text-blue-300 transition">
                {theme}
              </h3>
            </div>
          </div>
          <span className="shrink-0 text-xs bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded-full">
            {itemCount} {itemCount === 1 ? "stop" : "stops"}
          </span>
        </div>

        <p className="text-sm text-slate-400 line-clamp-2">{summary}</p>

        {weatherLabel && (
          <p className="mt-2 text-xs text-amber-400">⚠ {weatherLabel}</p>
        )}
        {rewrittenAt && (
          <p className="mt-1 text-xs text-slate-500">Rewritten by AI</p>
        )}
      </div>
    </Link>
  );
}
