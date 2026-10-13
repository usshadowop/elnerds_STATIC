// The Command Center's schedule: the run-of-show rows from the sheet laid out
// on a 24-hour track, with a line showing where "now" is.
//
// Rows stay the sheet's three columns (Time, Title, Detail). Each row's block
// runs from its time to the next row's time; a time that can't be parsed
// ("Whenever", "TBD") is listed below the track instead of being lost.
//
// The "now" line follows the real clock during Game Day. Before and after, it
// previews using the visitor's clock — today's 2:15 PM sits where Saturday's
// 2:15 PM will — so the page can be checked without waiting for November.

import { Clock } from "lucide-react";

import { useNow } from "@/hooks/use-now";
import { minutesFromKickoff, type GamedayShowRow } from "@/lib/gamedayContent";

const DAY_MINUTES = 24 * 60;
const PX_PER_HOUR = 52;
const START_HOUR = 8; // Game Day runs 8:00 AM Saturday to 8:00 AM Sunday.

function hourLabel(h: number): string {
  const hour = (START_HOUR + h) % 24;
  const suffix = hour >= 12 ? "PM" : "AM";
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve} ${suffix}`;
}

function clockLabel(minutes: number): string {
  const total = (START_HOUR * 60 + minutes) % DAY_MINUTES;
  const h = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${suffix}`;
}

const BLOCK_COLORS = [
  "border-teal bg-teal-soft text-teal",
  "border-magenta bg-magenta-soft text-magenta",
  "border-orange bg-orange-soft text-orange",
  "border-purple bg-magenta-soft text-purple",
  "border-gold bg-gold-soft text-gold",
];

export function GamedaySchedule({
  rows,
  startMs,
  endMs,
}: {
  rows: GamedayShowRow[];
  /** Game Day's bounds as epoch ms; the "now" line is real inside them. */
  startMs: number;
  endMs: number;
}) {
  const now = useNow();

  const live = now >= startMs && now < endMs;
  let nowMinutes: number;
  if (live) {
    nowMinutes = Math.floor((now - startMs) / 60_000);
  } else {
    const d = new Date(now);
    nowMinutes = (d.getHours() * 60 + d.getMinutes() - START_HOUR * 60 + DAY_MINUTES) % DAY_MINUTES;
  }

  const timed = rows
    .map((row) => ({ row, at: minutesFromKickoff(row.time) }))
    .filter((r): r is { row: GamedayShowRow; at: number } => r.at !== null && r.at >= 0 && r.at <= DAY_MINUTES)
    .sort((a, b) => a.at - b.at);
  const untimed = rows.filter((row) => minutesFromKickoff(row.time) === null);

  const blocks = timed.map((entry, i) => {
    const next = timed[i + 1]?.at ?? DAY_MINUTES;
    const end = Math.max(entry.at + 30, Math.min(next, DAY_MINUTES));
    return { ...entry, end, current: nowMinutes >= entry.at && nowMinutes < end };
  });
  // The last row (the finale) is a moment, not a block, when it sits at the end.
  const trackHeight = DAY_MINUTES * (PX_PER_HOUR / 60);
  const y = (minutes: number) => minutes * (PX_PER_HOUR / 60);

  return (
    <div className="rounded-2xl border border-line bg-paper p-4 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="inline-flex items-center gap-2 text-xs font-bold text-ink-soft">
          <Clock className="size-4" />
          Saturday 8 AM to Sunday 8 AM, Central time
        </p>
        <p className="inline-flex items-center gap-2 text-xs font-bold text-magenta">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-magenta opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-magenta" />
          </span>
          {live ? "Now" : "Preview: the line follows your clock until Game Day"}
        </p>
      </div>

      <div className="relative" style={{ height: trackHeight + 24 }}>
        {/* Hour grid */}
        {Array.from({ length: 25 }, (_, h) => (
          <div
            key={h}
            className="absolute left-0 right-0 flex items-start gap-3"
            style={{ top: y(h * 60) }}
          >
            <span className="w-14 shrink-0 -translate-y-1/2 text-right text-[11px] font-bold tabular-nums text-ink-soft">
              {hourLabel(h)}
            </span>
            <span className={`h-px flex-1 ${h % 6 === 0 ? "bg-ink-soft/30" : "bg-line"}`} />
          </div>
        ))}

        {/* Blocks */}
        {blocks.map((b, i) => (
          <div
            key={`${b.row.time}-${b.row.title}`}
            className={`absolute left-[4.25rem] right-0 overflow-hidden rounded-xl border-l-4 px-3 py-1.5 transition-colors sm:left-[4.5rem] ${
              BLOCK_COLORS[i % BLOCK_COLORS.length]
            } ${b.current ? "ring-2 ring-magenta shadow-[var(--shadow-soft)]" : ""}`}
            style={{ top: y(b.at) + 2, height: Math.max(y(b.end - b.at) - 4, 24) }}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">{b.row.time}</span>
              {b.current && (
                <span className="rounded-full bg-magenta px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
                  Now
                </span>
              )}
            </div>
            <p className="truncate font-display text-sm font-extrabold text-ink">{b.row.title}</p>
            {b.end - b.at >= 90 && b.row.detail && (
              <p className="truncate text-xs text-ink-soft">{b.row.detail}</p>
            )}
          </div>
        ))}

        {/* Now line */}
        <div
          className="pointer-events-none absolute left-0 right-0 z-10 flex items-center"
          style={{ top: y(nowMinutes) }}
          aria-label={`Current time: ${clockLabel(nowMinutes)}`}
        >
          <span className="w-14 shrink-0 -translate-y-1/2 rounded-full bg-magenta px-1.5 py-0.5 text-center text-[10px] font-extrabold tabular-nums text-white shadow-[var(--shadow-soft)]">
            {clockLabel(nowMinutes)}
          </span>
          <span className="ml-1 size-2.5 shrink-0 rounded-full bg-magenta" />
          <span className="h-0.5 flex-1 bg-magenta" />
        </div>
      </div>

      {untimed.length > 0 && (
        <ul className="mt-4 space-y-2 border-t border-line pt-4">
          {untimed.map((row) => (
            <li key={`${row.time}-${row.title}`} className="text-sm">
              <span className="font-extrabold text-magenta">{row.time}</span>{" "}
              <span className="font-display font-extrabold text-ink">{row.title}</span>
              {row.detail && <span className="text-ink-soft"> — {row.detail}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
