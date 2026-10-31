// Phone-sized run of show: a top-to-bottom list instead of the lane grid.
//
// The grid in GamedaySchedule.tsx needs sideways scrolling on a phone and its
// blocks turn into slivers. Below `md` the pages show this agenda instead: the
// all-day block as one banner, then every other row as "time pill | event
// card", meals green, in start order. A "See the full timeline" button opens
// the real grid in a full-screen overlay for anyone who wants the picture.
// Same rows, same parser, same colours — nothing new for the sheet to feed.

import { useEffect, useState } from "react";
import { CalendarRange, X } from "lucide-react";

import { GamedaySchedule } from "@/components/site/GamedaySchedule";
import { useNow } from "@/hooks/use-now";
import {
  DAY_MINUTES,
  FOOD,
  START_HOUR,
  clockLabel,
  parseShowTime,
  type GamedayShowRow,
} from "@/lib/gamedayContent";

type Entry = { row: GamedayShowRow; start: number; end: number; food: boolean };

/** Minutes-from-kickoff → short pill label ("8:30a", "8a Sun"). */
function pillLabel(minutes: number): string {
  const sunday = minutes >= DAY_MINUTES;
  const h24 = (START_HOUR + Math.floor(minutes / 60)) % 24;
  const m = minutes % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const mer = h24 < 12 ? "a" : "p";
  return `${h12}${m ? `:${String(m).padStart(2, "0")}` : ""}${mer}${sunday ? " Sun" : ""}`;
}

export function GamedayAgenda({
  rows,
  startMs,
  endMs,
  showNow = true,
}: {
  rows: GamedayShowRow[];
  startMs: number;
  endMs: number;
  /** Tag the current event "NOW" during Game Day. The home page turns this
   *  off, matching its grid, so nothing reads as live before the event. */
  showNow?: boolean;
}) {
  const now = useNow();
  const live = showNow && now >= startMs && now < endMs;
  const nowMinutes = live ? Math.floor((now - startMs) / 60_000) : -1;

  const entries: Entry[] = [];
  const untimed: GamedayShowRow[] = [];
  for (const row of rows) {
    const t = parseShowTime(row.time);
    if (!t) untimed.push(row);
    else entries.push({ row, start: t.start, end: t.end, food: FOOD.test(`${row.title} ${row.detail}`) });
  }
  entries.sort((a, b) => a.start - b.start || b.end - a.end);
  // The all-day block (the 24-hour gaming row) becomes a banner, not a row,
  // so the list is not led by something with no start-time story to tell.
  const allDay = entries.filter((e) => e.end - e.start >= DAY_MINUTES);
  const timed = entries.filter((e) => e.end - e.start < DAY_MINUTES);

  return (
    <div>
      <p className="mb-3 px-1 text-xs font-bold text-ink-soft">Saturday 8 AM to Sunday 8 AM, Central time</p>

      {allDay.map((e) => (
        <div
          key={e.row.title}
          className="mb-3 flex items-center gap-3 rounded-xl border-2 border-ink bg-[#56c6f5] px-3 py-2.5"
        >
          <CalendarRange className="size-5 shrink-0 text-ink" aria-hidden />
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-ink">{e.row.title}</p>
            <p className="text-xs text-ink/80">
              {e.row.time}
              {e.row.detail ? ` · ${e.row.detail}` : ""}
            </p>
          </div>
        </div>
      ))}

      <ol className="grid gap-2">
        {timed.map((e, i) => {
          const current = live && nowMinutes >= e.start && nowMinutes < e.end;
          return (
            <li key={`${e.row.time}-${e.row.title}-${i}`} className="relative grid grid-cols-[72px_1fr] gap-2.5">
              {current && (
                <span className="absolute -left-1 -top-2 z-10 rounded-full bg-magenta px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider text-white shadow">
                  NOW
                </span>
              )}
              <div className="flex flex-col items-center justify-center rounded-lg bg-[#d0455b] px-1 py-1.5 text-center leading-tight text-white">
                <span className="font-display text-sm font-extrabold">{pillLabel(e.start)}</span>
                <span className="text-[10px] font-bold opacity-90">– {pillLabel(e.end)}</span>
              </div>
              <div
                className={`rounded-xl border-2 border-ink px-3 py-2 ${e.food ? "bg-[#c9f26b]" : "bg-[#56c6f5]"} ${
                  current ? "ring-[3px] ring-magenta/40" : ""
                }`}
              >
                <p className="text-sm font-extrabold text-ink">{e.row.title}</p>
                {e.row.detail && <p className="text-xs text-ink/80">{e.row.detail}</p>}
              </div>
            </li>
          );
        })}
      </ol>

      {untimed.length > 0 && (
        <ul className="mt-3 grid gap-1 px-1 text-xs text-ink-soft">
          {untimed.map((r, i) => (
            <li key={`${r.title}-${i}`}>
              <span className="font-bold text-ink">{r.title}</span>
              {r.time ? ` — ${r.time}` : ""}
              {r.detail ? ` · ${r.detail}` : ""}
            </li>
          ))}
        </ul>
      )}
      {live && (
        <p className="mt-3 px-1 text-xs font-bold text-magenta">Now: {clockLabel(nowMinutes)}</p>
      )}
    </div>
  );
}

/** Below `md`: the agenda plus a button that opens the grid full-screen.
 *  From `md` up: the grid, as before. Both pages use this. */
export function ResponsiveGamedaySchedule({
  rows,
  startMs,
  endMs,
  showNowLine = true,
}: {
  rows: GamedayShowRow[];
  startMs: number;
  endMs: number;
  showNowLine?: boolean;
}) {
  const [open, setOpen] = useState(false);

  // Escape closes; the page behind stops scrolling while the overlay is up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <div className="md:hidden">
        <GamedayAgenda rows={rows} startMs={startMs} endMs={endMs} showNow={showNowLine} />
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border-2 border-teal bg-paper px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-teal shadow-[var(--shadow-soft)] transition-all hover:bg-teal-soft"
          >
            <CalendarRange className="size-4" aria-hidden /> See the full timeline
          </button>
        </div>
      </div>
      <div className="hidden md:block">
        <GamedaySchedule rows={rows} startMs={startMs} endMs={endMs} showNowLine={showNowLine} />
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Game Day timeline"
          className="fixed inset-0 z-[100] flex flex-col bg-cream"
        >
          <div className="flex items-center justify-between border-b border-line bg-paper px-4 py-3">
            <p className="font-display text-base font-extrabold text-ink">Game Day timeline</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="flex size-9 items-center justify-center rounded-full bg-teal-soft text-teal"
            >
              <X className="size-5" />
            </button>
          </div>
          <p className="px-4 pt-2 text-[11px] font-bold text-ink-soft">
            Swipe sideways to see every lane · rotate your phone for the full view
          </p>
          <div className="min-h-0 flex-1 overflow-auto px-3 pb-6 pt-2">
            <GamedaySchedule rows={rows} startMs={startMs} endMs={endMs} showNowLine={showNowLine} />
          </div>
        </div>
      )}
    </>
  );
}
