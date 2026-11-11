// Phone-sized run of show: a timeline of cards with duration bars.
//
// The lane grid in GamedaySchedule.tsx needs sideways scrolling on a phone, so
// below `md` both pages show this instead (owner's design, 2026-11-11, from the
// "Game Day Timeline Mockup" canvas). Hours run down the left as red pills.
// Each event is a card at its start time; the card's top-left corner turns
// down into a thin bar that ends at the event's end time. Bars pack side by
// side into lanes right beside the hour pills (moved there from the cards'
// right on 2026-11-11, owner's ask), longest first and outermost, touching,
// so neighbours share one outline. The pink now-line runs across, under the
// cards and over the bars, with a dot on every bar it crosses.
//
// Every card sits at its own start time. Where cards would crowd, the stretch
// of time before the next start grows until the card above clears it, so busy
// hours are taller than quiet ones; two or more quiet hours fold into a short
// band. The bars and the now-line use the same time scale, so they stay true.
// Card heights are measured from the page, so a card's text never runs into
// the next card. Details are folded behind a "Details – click to expand" line
// (owner's ask, 2026-11-11), and each card then stretches down to the end of
// its own bar unless the next card starts first, so a card is as tall as its
// event where there's room. Same rows, same parser and colours as the grid.

import { useLayoutEffect, useRef, useState } from "react";
import { CalendarRange, ChevronDown, ChevronUp } from "lucide-react";

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

const HOUR_PX = 72; // a quiet hour; busy hours stretch past this
const FOLD_PX = 48; // a folded run of quiet hours
const CARD_GAP = 6;
const B = 4; // the black outline on cards, arms and bars
const LANE_W = 13;
const PITCH = LANE_W - B; // neighbouring bars overlap by one outline: no white between them
const ARM_H = 16;
const TOP = 14; // room above the first hour pill
const GUTTER = 38; // hour pills
const BARS_LEFT = 44; // the bars sit right beside the hour pills
const CARD_TO_BARS = 8;
const EST_CARD_H = 52; // first-layout guess; replaced by the measured height before paint
const PILL_CLEAR = 27; // an hour pill this close to the now pill is hidden

const INK = "#1a2b4a";
const MAGENTA = "#c8327c";
const SKY = "#56c6f5";
const LIME = "#c7f36b";
// Finished events use solid faded colours rather than opacity, so a card and
// its arm don't darken where they overlap.
const INK_PAST = "#a7afbb";
const SKY_PAST = "#c3e8f9";
const LIME_PAST = "#e7f8c0";

type Entry = {
  key: string;
  row: GamedayShowRow;
  start: number;
  end: number;
  food: boolean;
  range: boolean;
  lane: number;
};

/** Minutes from kickoff → "8:30a"; with `sun`, "8a Sun" from Sunday 8 AM on. */
function shortTime(minutes: number, sun = false): string {
  const h24 = (START_HOUR + Math.floor(minutes / 60)) % 24;
  const m = minutes % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const tail = sun && minutes >= DAY_MINUTES ? " Sun" : "";
  return `${h12}${m ? `:${String(m).padStart(2, "0")}` : ""}${h24 < 12 ? "a" : "p"}${tail}`;
}

/** Bars: longest first, each into the first lane (0 = outermost, next to the
 *  hour pills) where it overlaps nothing. Long bars sit farthest from the
 *  cards, so the short events' arms stay short. */
function packLanes(entries: Entry[]): number {
  const lanes: Entry[][] = [];
  const byLength = [...entries].sort((a, b) => b.end - b.start - (a.end - a.start) || a.start - b.start);
  for (const e of byLength) {
    let k = lanes.findIndex((l) => l.every((o) => o.end <= e.start || o.start >= e.end));
    if (k === -1) {
      k = lanes.length;
      lanes.push([]);
    }
    lanes[k].push(e);
    e.lane = k;
  }
  return Math.max(lanes.length, 1);
}

type Row = { h: number; span: number; folded: boolean };

/** Time → y, and each card's top. Knots at every hour edge and every start
 *  and end; before each start the stretch grows until that start's first card
 *  clears the card above. Cards sharing a start stack under the first. */
function layout(entries: Entry[], heights: number[], trackEnd: number) {
  const hours = Math.ceil(trackEnd / 60);
  const edges = [0, DAY_MINUTES, ...entries.flatMap((e) => [e.start, e.end])];
  const quiet = Array.from({ length: hours }, (_, h) => {
    const lo = h * 60;
    const hi = lo + 60;
    return h !== 0 && !edges.some((x) => x > lo && x < hi) && !edges.includes(lo);
  });
  const rows: Row[] = [];
  for (let h = 0; h < hours; ) {
    if (quiet[h] && quiet[h + 1]) {
      let span = 0;
      while (h + span < hours && quiet[h + span]) span += 1;
      rows.push({ h, span, folded: true });
      h += span;
    } else {
      rows.push({ h, span: 1, folded: false });
      h += 1;
    }
  }

  const knotSet = new Set<number>([trackEnd]);
  for (const r of rows) {
    knotSet.add(r.h * 60);
    knotSet.add((r.h + r.span) * 60);
  }
  for (const e of entries) {
    knotSet.add(e.start);
    knotSet.add(e.end);
  }
  const knots = [...knotSet].filter((t) => t <= trackEnd).sort((a, b) => a - b);
  const basePx = (t0: number, t1: number) => {
    const r = rows.find((q) => t0 >= q.h * 60 && t0 < (q.h + q.span) * 60) ?? rows[rows.length - 1];
    return ((t1 - t0) / (r.span * 60)) * (r.folded ? FOLD_PX : HOUR_PX);
  };

  const byStart = new Map<number, number[]>();
  entries
    .map((e, i) => ({ e, i }))
    .sort((a, b) => a.e.start - b.e.start || b.e.end - a.e.end)
    .forEach(({ e, i }) => byStart.set(e.start, [...(byStart.get(e.start) ?? []), i]));

  const pos: number[] = [];
  const cardTop: number[] = [];
  let lastBottom = -Infinity;
  knots.forEach((t, k) => {
    pos[k] = k === 0 ? 0 : pos[k - 1] + basePx(knots[k - 1], t);
    const group = byStart.get(t);
    if (!group) return;
    pos[k] = Math.max(pos[k], lastBottom + CARD_GAP);
    let top = pos[k];
    for (const i of group) {
      cardTop[i] = top;
      top += (heights[i] || EST_CARD_H) + CARD_GAP;
    }
    lastBottom = top - CARD_GAP;
  });

  const y = (t: number): number => {
    if (t <= knots[0]) return pos[0];
    for (let k = 1; k < knots.length; k++) {
      if (t <= knots[k]) return pos[k - 1] + ((t - knots[k - 1]) / (knots[k] - knots[k - 1])) * (pos[k] - pos[k - 1]);
    }
    return pos[pos.length - 1];
  };
  const trackPx = Math.max(y(trackEnd), lastBottom) + 16;
  return { rows, y, cardTop, trackPx };
}

/** A card's time line and title. */
function CardHeading({ e, current }: { e: Entry; current: boolean }) {
  return (
    <>
      <span className={`block text-[11px] font-extrabold leading-[14px] text-ink/70 ${current ? "pr-12" : ""}`}>
        {e.range ? `${shortTime(e.start, true)} – ${shortTime(e.end, true)}` : shortTime(e.start, true)}
      </span>
      <span className="block text-[13px] font-extrabold leading-[17px] text-ink">{e.row.title}</span>
    </>
  );
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
  /** Draw the now-line. The home page turns this off, matching its grid, so
   *  nothing reads as live before the event. During Game Day it also tags
   *  current events NOW, fades finished ones and adds the "On now" card;
   *  before and after, the line previews with the visitor's clock (as the
   *  grid's does) and nothing else changes. */
  showNow?: boolean;
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
  const lineOn = showNow;
  const liveOn = showNow && live;

  const entries: Entry[] = [];
  const allDay: GamedayShowRow[] = [];
  const untimed: GamedayShowRow[] = [];
  rows.forEach((row, i) => {
    const t = parseShowTime(row.time);
    if (!t) untimed.push(row);
    // The all-day block (the 24-hour gaming row) is a banner, not a card.
    else if (t.end - t.start >= DAY_MINUTES) allDay.push(row);
    else
      entries.push({
        key: `${i}-${row.time}-${row.title}`,
        row,
        start: t.start,
        end: t.end,
        food: FOOD.test(`${row.title} ${row.detail}`),
        range: /[-–—]|\bto\b/i.test(row.time),
        lane: 0,
      });
  });
  const laneCount = packLanes(entries);
  const railsPx = LANE_W + (laneCount - 1) * PITCH;
  const cardLeft = BARS_LEFT + railsPx + CARD_TO_BARS;
  const trackEnd = Math.max(DAY_MINUTES, ...entries.map((e) => e.end));

  // Card heights come from the page: the first layout uses a guess, then this
  // measures every card's content before paint and again whenever it changes
  // size (a narrower phone, the web font arriving, details opened or closed).
  // It measures the content, not the card, because the card is then stretched
  // to its bar; measuring that would feed the stretch back into the layout.
  const contentEls = useRef<(HTMLDivElement | null)[]>([]);
  const [heights, setHeights] = useState<number[]>([]);
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const signature = entries.map((e) => e.key + e.row.detail).join("\n");
  useLayoutEffect(() => {
    const measure = () => {
      const next = entries.map((_, i) => {
        const el = contentEls.current[i];
        return el ? el.offsetHeight + 2 * B : 0;
      });
      setHeights((prev) => (prev.length === next.length && prev.every((h, i) => h === next[i]) ? prev : next));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    contentEls.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run when the rows change, not on every poll
  }, [signature]);

  const { rows: hourRows, y, cardTop, trackPx } = layout(entries, heights, trackEnd);
  // Where there's room, a card runs down to the end of its bar: as tall as the
  // event, stopping short of the next card. Never shorter than its content.
  const cardHeight = entries.map((e, i) => {
    const top = cardTop[i] ?? 0;
    const natural = heights[i] || EST_CARD_H;
    const nextTop = Math.min(...cardTop.filter((t) => t > top));
    const room = nextTop - CARD_GAP - top;
    const toBarEnd = Math.max(y(e.end), y(e.start) + ARM_H + 4) - top;
    return Math.max(natural, Math.min(toBarEnd, room));
  });
  const nowY = y(nowMinutes) + TOP;
  const clearOfNow = (centre: number) => !lineOn || Math.abs(centre - nowY) >= PILL_CLEAR;

  const isActive = (e: Entry) => nowMinutes >= e.start && nowMinutes < e.end;
  const active = lineOn ? entries.filter(isActive) : [];
  const onNow = liveOn ? [...active].sort((a, b) => a.start - b.start) : [];
  const next = liveOn ? entries.filter((e) => e.start > nowMinutes).sort((a, b) => a.start - b.start)[0] : undefined;
  const nowLineEl = useRef<HTMLDivElement | null>(null);

  // By start; for a shared start the lower card first, so the first card's
  // arm passes over the other's bar.
  const order = entries
    .map((e, i) => ({ e, i }))
    .sort((a, b) => a.e.start - b.e.start || (cardTop[b.i] ?? 0) - (cardTop[a.i] ?? 0));

  const look = (e: Entry) => {
    const current = liveOn && isActive(e);
    const faded = liveOn && e.end <= nowMinutes;
    return {
      current,
      faded,
      stroke: current ? MAGENTA : faded ? INK_PAST : INK,
      fill: faded ? (e.food ? LIME_PAST : SKY_PAST) : e.food ? LIME : SKY,
    };
  };

  return (
    <div>
      <p className="px-1 text-xs font-bold text-ink-soft">Saturday 8 AM to Sunday 8 AM, Central time</p>
      <p className="mb-3 px-1 text-xs text-ink-soft">The bar to the left of each card runs until that event ends.</p>
      {lineOn && !live && (
        <p className="mb-3 inline-flex items-center gap-2 px-1 text-xs font-bold text-magenta">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-magenta opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-magenta" />
          </span>
          Preview: the line follows your clock until Game Day
        </p>
      )}

      {allDay.map((row) => (
        <div
          key={`${row.time}-${row.title}`}
          className="mb-3 flex items-center gap-3 rounded-xl border-4 border-ink bg-[#56c6f5] px-2.5 py-2"
        >
          <CalendarRange className="size-5 shrink-0 text-ink" aria-hidden />
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-ink">{row.title}</p>
            <p className="text-xs text-ink/80">
              {row.time}
              {row.detail ? ` · ${row.detail}` : ""}
            </p>
          </div>
        </div>
      ))}

      {liveOn && onNow.length > 0 && (
        <div className="mb-3 grid gap-2 rounded-2xl border border-line bg-paper px-3.5 py-3 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between gap-2">
            <p className="inline-flex items-center gap-2 text-[11px] font-extrabold tracking-[0.14em] text-magenta">
              <span className="size-2 rounded-full bg-magenta" aria-hidden />
              ON NOW · {shortTime(nowMinutes)}
            </p>
            <button
              type="button"
              onClick={() => nowLineEl.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
              className="py-1 text-xs font-extrabold text-teal"
            >
              Jump to now ↓
            </button>
          </div>
          {onNow.map((e) => (
            <div key={e.key} className="flex items-baseline justify-between gap-2.5">
              <p className="text-[13px] font-extrabold leading-snug text-ink">{e.row.title}</p>
              <p className="whitespace-nowrap text-[11px] font-bold text-ink-soft">until {shortTime(e.end, true)}</p>
            </div>
          ))}
          {next && (
            <p className="border-t border-dashed border-line pt-2 text-xs text-ink-soft">
              <span className="font-extrabold text-ink">Next:</span> {next.row.title} · {shortTime(next.start, true)}
            </p>
          )}
        </div>
      )}

      <div className="relative" style={{ height: trackPx + TOP }}>
        {/* Folded quiet hours, hour lines and hour pills */}
        {hourRows.map((r) => {
          const top = y(r.h * 60) + TOP;
          if (r.folded) {
            const bottom = y((r.h + r.span) * 60) + TOP;
            return (
              <div key={r.h}>
                <div
                  className="absolute right-0 rounded-md bg-[#f1ece4]"
                  style={{ left: BARS_LEFT, top: top + 2, height: bottom - top - 4 }}
                />
                {clearOfNow((top + bottom) / 2) && (
                  <span
                    className="absolute left-0 flex h-5 items-center justify-center rounded-md bg-[#b9a9ad] text-[11px] font-extrabold text-white"
                    style={{ top: (top + bottom) / 2 - 10, width: GUTTER }}
                    aria-hidden
                  >
                    ···
                  </span>
                )}
              </div>
            );
          }
          return (
            <div key={r.h}>
              <div className="absolute right-0 border-t border-dashed border-line" style={{ left: BARS_LEFT, top }} />
              {clearOfNow(top) && (
                <span
                  className="absolute left-0 flex h-5 items-center justify-center rounded-md bg-[#d0455b] text-[11px] font-extrabold text-white"
                  style={{ top: top - 10, width: GUTTER }}
                >
                  {shortTime(r.h * 60)}
                </span>
              )}
            </div>
          );
        })}

        {/* Layer 1: each event's arm and bar. Outline first, then fill, so the
            arm and bar read as one shape with the card. */}
        {order.map(({ e, i }) => {
          const { stroke, fill } = look(e);
          const top = (cardTop[i] ?? 0) + TOP;
          const barTop = y(e.start) + TOP;
          const barH = Math.max(y(e.end) + TOP - barTop, ARM_H + 4);
          const laneLeft = BARS_LEFT + e.lane * PITCH;
          return (
            <div key={`bar-${e.key}`} aria-hidden>
              <div
                className="absolute"
                style={{ left: laneLeft, top, width: cardLeft + B - laneLeft, height: ARM_H, background: stroke, borderTopLeftRadius: 7 }}
              />
              <div
                className="absolute rounded-[7px]"
                style={{ left: laneLeft, top: barTop, width: LANE_W, height: barH, background: stroke }}
              />
              <div
                className="absolute"
                style={{ left: laneLeft + B, top: top + B, width: cardLeft - laneLeft, height: ARM_H - 2 * B, background: fill, borderTopLeftRadius: 3 }}
              />
              <div
                className="absolute rounded-[3px]"
                style={{ left: laneLeft + B, top: barTop + B, width: LANE_W - 2 * B, height: barH - 2 * B, background: fill }}
              />
            </div>
          );
        })}

        {/* Layer 2: the now-line, over the bars and under the cards */}
        {lineOn && (
          <div
            ref={nowLineEl}
            className="pointer-events-none absolute right-0 h-[3px] bg-magenta shadow-[0_0_0_1px_rgba(255,255,255,0.85)]"
            style={{ left: GUTTER, top: nowY - 1.5 }}
          />
        )}

        {/* Layer 3: the cards. A patch over each card's left edge opens it
            into its arm. */}
        {order.map(({ e, i }) => {
          const { current, faded, stroke, fill } = look(e);
          const top = (cardTop[i] ?? 0) + TOP;
          return (
            <div key={`card-${e.key}`}>
              <div
                className="absolute rounded-xl rounded-tl-none"
                style={{ left: cardLeft, right: 0, top, minHeight: cardHeight[i], border: `${B}px solid ${stroke}`, background: fill }}
              >
                <div
                  ref={(el) => {
                    contentEls.current[i] = el;
                  }}
                  className={`px-2.5 pb-[7px] pt-1.5 ${faded ? "opacity-50" : ""}`}
                >
                  {e.row.detail ? (
                    <button
                      type="button"
                      onClick={() => setOpened((o) => ({ ...o, [e.key]: !o[e.key] }))}
                      aria-expanded={!!opened[e.key]}
                      className="block w-full text-left"
                    >
                      <CardHeading e={e} current={current} />
                      {opened[e.key] && <span className="mt-0.5 block text-[11.5px] leading-[15px] text-ink/80">{e.row.detail}</span>}
                      <span className="mt-0.5 inline-flex items-center gap-0.5 text-[10.5px] font-bold leading-[14px] text-ink/60">
                        {opened[e.key] ? (
                          <>
                            Hide details <ChevronUp className="size-3" aria-hidden />
                          </>
                        ) : (
                          <>
                            Details – click to expand <ChevronDown className="size-3" aria-hidden />
                          </>
                        )}
                      </span>
                    </button>
                  ) : (
                    <CardHeading e={e} current={current} />
                  )}
                </div>
                {current && (
                  <span className="absolute right-2 top-[3px] rounded-full bg-magenta px-[7px] py-0.5 text-[9px] font-extrabold tracking-[0.1em] text-white">
                    NOW
                  </span>
                )}
              </div>
              <div
                className="absolute"
                style={{ left: cardLeft, top: top + B, width: B, height: ARM_H - 2 * B, background: fill }}
                aria-hidden
              />
            </div>
          );
        })}

        {/* The now pill and a dot on every bar the line crosses */}
        {lineOn && (
          <>
            <span
              className="absolute left-0 flex h-5 items-center justify-center rounded-md bg-magenta text-[10.5px] font-extrabold tabular-nums text-white shadow"
              style={{ top: nowY - 10, width: 40 }}
              aria-label={`${live ? "Now" : "Preview"}: ${clockLabel(nowMinutes)}`}
            >
              {shortTime(nowMinutes)}
            </span>
            {active.map((e) => (
              <span
                key={`dot-${e.key}`}
                className="absolute rounded-full border-[3px] border-magenta bg-white"
                style={{ left: BARS_LEFT + e.lane * PITCH, top: nowY - LANE_W / 2, width: LANE_W, height: LANE_W }}
                aria-hidden
              />
            ))}
          </>
        )}
      </div>

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
    </div>
  );
}

/** Below `md`: the phone timeline. From `md` up: the lane grid. Both pages
 *  use this. (Until 2026-11-11 phones got a plain list plus a button that
 *  opened the grid full-screen; the timeline replaced both.) */
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
  return (
    <>
      <div className="md:hidden">
        <GamedayAgenda rows={rows} startMs={startMs} endMs={endMs} showNow={showNowLine} />
      </div>
      <div className="hidden md:block">
        <GamedaySchedule rows={rows} startMs={startMs} endMs={endMs} showNowLine={showNowLine} />
      </div>
    </>
  );
}
