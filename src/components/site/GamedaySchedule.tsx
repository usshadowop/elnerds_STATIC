// The Command Center's schedule, in the style of the printed 2025 run of show:
// a navy Time / Event header, red hourly pills down the left, parallel lanes of
// sky-blue blocks, and lime-green meal banners layered across the lanes. A
// magenta line marks the current time.
//
// Rows stay the sheet's three columns (Time, Title, Detail):
//   Time   a range ("9:30a - 12:30p", "11 - 1p", "8am Saturday - 8am Sunday")
//          or a single time ("8am Sunday"), which gets an hour.
//   Title  bold heading of the block.
//   Detail second line; omitted when the block is too short to fit it.
// A row whose title or detail mentions a meal (breakfast, lunch, dinner,
// waffles, snacks, food) becomes a green banner across the lanes instead of a
// blue block. Overlapping blocks are packed into lanes automatically, and
// quiet stretches with nothing starting or ending (the overnight hours) fold
// into a single "…" row, as on the printed version.
//
// The "now" line follows the real clock during Game Day. Before and after, it
// previews using the visitor's clock — today's 2:15 PM sits where Saturday's
// 2:15 PM will — so the page can be checked without waiting for November.

import { useNow } from "@/hooks/use-now";
import { parseShowTime, type GamedayShowRow } from "@/lib/gamedayContent";

const DAY_MINUTES = 24 * 60;
const START_HOUR = 8; // Game Day runs 8:00 AM Saturday to 8:00 AM Sunday.
const ROW_PX = 60; // one hour
const FOLD_PX = 34; // a folded run of quiet hours
const FOOD = /breakfast|lunch|dinner|waffle|snack|food|pizza/i;

function pillLabel(h: number): string {
  const hour = (START_HOUR + h) % 24;
  return `${hour % 12 === 0 ? 12 : hour % 12}${hour >= 12 ? "pm" : "am"}`;
}

function clockLabel(minutes: number): string {
  const total = (START_HOUR * 60 + minutes) % DAY_MINUTES;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

interface Block {
  row: GamedayShowRow;
  start: number;
  end: number;
  food: boolean;
  lane: number;
  lanes: number; // how many blocks share this start (food banners split the width)
}

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

  // ── Parse and pack ──────────────────────────────────────────────────────
  const parsed: Block[] = [];
  const untimed: GamedayShowRow[] = [];
  for (const row of rows) {
    const t = parseShowTime(row.time);
    if (!t) {
      untimed.push(row);
      continue;
    }
    parsed.push({
      row,
      start: t.start,
      end: t.end,
      food: FOOD.test(`${row.title} ${row.detail}`),
      lane: 0,
      lanes: 1,
    });
  }
  const trackEnd = Math.max(DAY_MINUTES, ...parsed.map((b) => b.end));
  const hours = Math.ceil(trackEnd / 60);

  // Blue blocks: earliest start first, longest first on a tie; each takes the
  // first lane that is free by its start.
  const blocks = parsed.filter((b) => !b.food).sort((a, b) => a.start - b.start || b.end - a.end);
  const laneEnds: number[] = [];
  for (const b of blocks) {
    let lane = laneEnds.findIndex((end) => end <= b.start);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = b.end;
    b.lane = lane;
  }
  const laneCount = Math.max(laneEnds.length, 1);

  // Green banners: those that start together share the width.
  const foods = parsed.filter((b) => b.food).sort((a, b) => a.start - b.start);
  for (const f of foods) {
    const peers = foods.filter((o) => o.start === f.start);
    f.lanes = peers.length;
    f.lane = peers.indexOf(f);
  }

  // ── Fold quiet hours ────────────────────────────────────────────────────
  // An hour is quiet when nothing starts or ends inside it. Runs of two or
  // more quiet hours collapse to one short "…" row.
  const edges = parsed.flatMap((b) => [b.start, b.end]);
  const quiet = Array.from({ length: hours }, (_, h) => {
    const lo = h * 60;
    const hi = lo + 60;
    return !edges.some((e) => e > lo && e < hi) && !edges.some((e) => e === lo) && h !== 0;
  });
  type RowSpec = { h: number; folded: boolean; span: number; top: number; px: number };
  const rowSpecs: RowSpec[] = [];
  let top = 0;
  for (let h = 0; h < hours; ) {
    if (quiet[h] && quiet[h + 1]) {
      let span = 0;
      while (h + span < hours && quiet[h + span]) span += 1;
      rowSpecs.push({ h, folded: true, span, top, px: FOLD_PX });
      top += FOLD_PX;
      h += span;
    } else {
      rowSpecs.push({ h, folded: false, span: 1, top, px: ROW_PX });
      top += ROW_PX;
      h += 1;
    }
  }
  const trackPx = top;
  const y = (minutes: number): number => {
    const clamped = Math.max(0, Math.min(minutes, hours * 60));
    const spec = rowSpecs.find((r) => clamped < (r.h + r.span) * 60) ?? rowSpecs[rowSpecs.length - 1];
    const into = (clamped - spec.h * 60) / (spec.span * 60);
    return spec.top + into * spec.px;
  };

  const laneLeft = (lane: number, lanes: number) => `calc(${(lane / lanes) * 100}% + 3px)`;
  const laneWidth = (lanes: number) => `calc(${100 / lanes}% - 6px)`;

  return (
    <div className="rounded-2xl border border-line bg-paper p-3 shadow-[var(--shadow-soft)] sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-xs font-bold text-ink-soft">Saturday 8 AM to Sunday 8 AM, Central time</p>
        <p className="inline-flex items-center gap-2 text-xs font-bold text-magenta">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-magenta opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-magenta" />
          </span>
          {live ? "Now" : "Preview: the line follows your clock until Game Day"}
        </p>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 72 + laneCount * 118 }}>
          {/* Header bars */}
          <div className="mb-2 flex gap-2">
            <div className="w-16 shrink-0 rounded-md bg-[#1f3b5c] py-1.5 text-center text-xs font-extrabold text-white">
              Time
            </div>
            <div className="flex-1 rounded-md bg-[#1f3b5c] py-1.5 text-center text-xs font-extrabold text-white">
              Event
            </div>
          </div>

          <div className="relative flex gap-2" style={{ height: trackPx }}>
            {/* Time pills */}
            <div className="relative w-16 shrink-0">
              {rowSpecs.map((r) => (
                <div
                  key={r.h}
                  className="absolute left-0 right-0 flex items-center justify-center"
                  style={{ top: r.top, height: r.px }}
                >
                  <span
                    className={`flex w-full items-center justify-center rounded-md bg-[#d0455b] font-display font-extrabold text-white ${
                      r.folded ? "h-6 text-sm" : "h-[52px] text-base"
                    }`}
                  >
                    {r.folded ? "…" : pillLabel(r.h)}
                  </span>
                </div>
              ))}
            </div>

            {/* Lanes */}
            <div className="relative flex-1">
              {rowSpecs.map((r) => (
                <div
                  key={r.h}
                  className={`absolute left-0 right-0 border-t border-dashed ${r.folded ? "border-ink-soft/30 bg-cream" : "border-line"}`}
                  style={{ top: r.top, height: r.px }}
                />
              ))}

              {blocks.map((b) => {
                const top = y(b.start) + 3;
                const height = Math.max(y(b.end) - y(b.start) - 6, 26);
                const current = nowMinutes >= b.start && nowMinutes < b.end;
                // Banners lie across the lanes, so the block's text goes in
                // the tallest stretch of the block a banner doesn't cover.
                const covered = foods
                  .filter((f) => f.end > b.start && f.start < b.end)
                  .map((f) => [y(f.start) + 3 - top, y(f.end) - 3 - top] as const)
                  .sort((m, n) => m[0] - n[0]);
                let gap = { top: 0, height };
                let cursor = 0;
                for (const [c0, c1] of [...covered, [height, height] as const]) {
                  if (c0 - cursor > gap.height || gap.top === 0 && gap.height === height) {
                    if (c0 - cursor > 0 && (gap.height === height || c0 - cursor > gap.height)) gap = { top: cursor, height: c0 - cursor };
                  }
                  cursor = Math.max(cursor, c1);
                }
                return (
                  <div
                    key={`${b.row.time}-${b.row.title}`}
                    className={`absolute overflow-hidden rounded-lg border-2 border-ink bg-[#56c6f5] ${
                      current ? "animate-now-pulse motion-reduce:animate-none motion-reduce:ring-2 motion-reduce:ring-magenta" : ""
                    }`}
                    style={{ top, height, left: laneLeft(b.lane, laneCount), width: laneWidth(laneCount) }}
                  >
                    <div
                      className="absolute left-0 right-0 flex flex-col items-center justify-center px-2 py-1 text-center"
                      style={{ top: gap.top, height: gap.height }}
                    >
                      <p className="font-display text-[13px] font-extrabold leading-tight text-ink">{b.row.time}</p>
                      <p className="text-[13px] font-semibold leading-tight text-ink">{b.row.title}</p>
                      {gap.height >= 110 && b.row.detail && (
                        <p className="mt-1 text-xs leading-tight text-ink/80">{b.row.detail}</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {foods.map((f) => {
                const height = Math.max(y(f.end) - y(f.start) - 6, 40);
                return (
                  <div
                    key={`${f.row.time}-${f.row.title}`}
                    className="absolute z-10 flex items-center justify-center rounded-lg border-2 border-ink bg-[#c7f36b] px-3 py-1 text-center shadow-[var(--shadow-soft)]"
                    style={{ top: y(f.start) + 3, height, left: laneLeft(f.lane, f.lanes), width: laneWidth(f.lanes) }}
                  >
                    <p className="text-[13px] leading-tight text-ink">
                      <span className="font-extrabold">{f.row.title}</span>
                      {f.row.detail && <> {f.row.detail}</>}
                    </p>
                  </div>
                );
              })}

              {/* Now line */}
              <div
                className="pointer-events-none absolute -left-2 right-0 z-20 flex items-center"
                style={{ top: y(nowMinutes) }}
                aria-label={`Current time: ${clockLabel(nowMinutes)}`}
              >
                <span className="size-3 shrink-0 rounded-full border-2 border-white bg-magenta shadow" />
                <span className="h-[3px] flex-1 bg-magenta" />
                <span className="shrink-0 -translate-y-1/2 rounded-full bg-magenta px-2 py-0.5 text-[10px] font-extrabold tabular-nums text-white shadow">
                  {clockLabel(nowMinutes)}
                </span>
              </div>
            </div>
          </div>
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
