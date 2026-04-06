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
      <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-card hover:shadow-card-hover transition-shadow">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="shrink-0 w-9 h-9 bg-primary/10 text-primary font-headline font-extrabold text-sm rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              {dayNumber}
            </span>
            <div>
              <p className="text-xs font-label text-on-surface-variant">{formatDate(date)}</p>
              <h3 className="font-headline font-semibold text-on-surface group-hover:text-primary transition-colors">
                {theme}
              </h3>
            </div>
          </div>
          <span className="shrink-0 text-xs font-label bg-surface-container-low text-on-surface-variant px-2.5 py-0.5 rounded-full">
            {itemCount} {itemCount === 1 ? "stop" : "stops"}
          </span>
        </div>

        <p className="text-sm text-on-surface-variant line-clamp-2">{summary}</p>

        {weatherLabel && (
          <div className="mt-2 flex items-center gap-1.5 text-xs font-label text-tertiary-fixed">
            <span className="material-symbols-outlined text-[14px]">partly_cloudy_day</span>
            {weatherLabel}
          </div>
        )}
        {rewrittenAt && (
          <div className="mt-1 flex items-center gap-1.5 text-xs font-label text-primary">
            <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
            Rewritten by AI
          </div>
        )}
      </div>
    </Link>
  );
}
