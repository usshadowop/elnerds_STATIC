// Contents of the Gameday Command Center (/gameday).
//
// These are editable mid-marathon: the Apps Script backend serves them from
// the tabs of a separate "Dashboard" spreadsheet ("Schedule", "Streams",
// "Incentives", "Notice"), and the page re-reads every minute
// while it's open. Typing in the sheet at 2am changes the page at 2:01am — no
// deploy, no code change.
//
// The values below are the fallback the site ships with. They're what shows if
// the backend can't be reached, hasn't been redeployed with the gameday
// endpoint yet, or returns something unusable — so the page is never empty.

const ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT as string | undefined;

export interface GamedayStream {
  name: string;
  who: string;
  /** The platform's *embed* URL, not the channel page. Present = real player. */
  embedUrl?: string;
  pageUrl?: string;
}

export interface GamedayShowRow {
  time: string;
  title: string;
  detail: string;
}

export interface GamedayIncentive {
  amount: string;
  what: string;
}

export interface GamedayContent {
  streams: GamedayStream[];
  runOfShow: GamedayShowRow[];
  incentives: GamedayIncentive[];
  /** One-line announcement across the top. Empty hides the banner. */
  notice: string;
}

export const FALLBACK_CONTENT: GamedayContent = {
  streams: [
    { name: "Main Stage", who: "Team channel — the big one" },
    { name: "Second Feed", who: "Roaming camera / co-streamer" },
    { name: "Third Feed", who: "Spare slot" },
  ],
  // The run of show has no shipped copy: the page shows whatever the sheet
  // holds, including its starter rows, and an "arriving soon" notice when the
  // tab is empty or hasn't been read yet.
  runOfShow: [],
  incentives: [
    { amount: "$—", what: "Milestone to be announced" },
    { amount: "$—", what: "Milestone to be announced" },
    { amount: "$—", what: "Milestone to be announced" },
  ],
  notice: "",
};

const DAY = 24 * 60;
const KICKOFF = 8 * 60;

/** One clock token ("9:30a", "12pm", "8") into minutes since midnight, given a
 *  meridian to fall back on when the token has none. */
function clock(h: number, m: number, mer: string | undefined, fallback: string | undefined): number | null {
  const ap = (mer ?? fallback ?? "").toLowerCase();
  if (!ap) return null;
  let hour = h % 12;
  if (ap === "p") hour += 12;
  return hour * 60 + m;
}

/** A sheet Time cell → minutes from kickoff. Ranges ("9:30a - 12:30p",
 *  "11 - 1p", "8am Saturday - 8am Sunday") give start and end; a single time
 *  ("8am Sunday") gets one hour. Times before 8 AM, or marked Sunday, are the
 *  second morning. Null when the text holds no clock time. */
export function parseShowTime(time: string): { start: number; end: number } | null {
  const re = /(\d{1,2})(?::(\d{2}))?\s*([ap])?\.?m?\b/gi;
  const tokens = [...time.matchAll(re)].slice(0, 2).map((m) => ({
    h: parseInt(m[1], 10),
    m: m[2] ? parseInt(m[2], 10) : 0,
    mer: m[3]?.toLowerCase(),
    index: m.index ?? 0,
  }));
  if (tokens.length === 0) return null;
  const [a, b] = tokens;
  // "11 - 1p": a start with no meridian borrows the end's, but flips to AM
  // when that would put it after the end.
  let startMer = a.mer ?? b?.mer;
  if (!a.mer && b?.mer === "p" && a.h % 12 > b.h % 12) startMer = "a";
  const s = clock(a.h, a.m, a.mer, startMer);
  if (s === null) return null;
  const text = time.toLowerCase();
  const sundayAt = (pos: number) => /sun/.test(text.slice(pos, pos + 16));
  let start = s - KICKOFF;
  if (sundayAt(a.index) || start < 0) start += DAY;
  if (!b) return { start, end: start + 60 };
  const e = clock(b.h, b.m, b.mer, startMer);
  if (e === null) return { start, end: start + 60 };
  let end = e - KICKOFF;
  if (sundayAt(b.index) || end <= start) end += DAY;
  return { start, end: Math.min(end, DAY + 60) };
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Keep only rows that have the field the section is keyed on — a half-typed
 *  row in the sheet shouldn't render as an empty card. */
function rows<T>(value: unknown, map: (row: Record<string, unknown>) => T, keyOf: (row: T) => string): T[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((row): row is Record<string, unknown> => typeof row === "object" && row !== null)
    .map(map)
    .filter((row) => keyOf(row).length > 0);
}

/** Shape whatever the sheet returned into something the page can render.
 *  Streams and incentives that come back empty or unparseable keep their
 *  shipped copy, so a cleared tab can't silently blank out part of the page.
 *  The run of show is the exception: it has no shipped copy (see above). */
export function parseGamedayContent(data: unknown): GamedayContent {
  if (typeof data !== "object" || data === null) return FALLBACK_CONTENT;
  const raw = data as Record<string, unknown>;

  const streams = rows<GamedayStream>(
    raw.streams,
    (r) => ({
      name: text(r.name),
      who: text(r.who),
      embedUrl: text(r.embedUrl) || undefined,
      pageUrl: text(r.pageUrl) || undefined,
    }),
    (r) => r.name,
  );

  // The run of show is the sheet's, verbatim — starter rows included. There is
  // no example schedule to fall back on; an empty tab renders as "coming soon".
  const runOfShow = rows<GamedayShowRow>(
    raw.runOfShow,
    (r) => ({ time: text(r.time), title: text(r.title), detail: text(r.detail) }),
    (r) => r.time,
  );

  const incentives = rows<GamedayIncentive>(
    raw.incentives,
    (r) => ({ amount: text(r.amount), what: text(r.what) }),
    (r) => r.amount,
  );

  return {
    streams: streams.length ? streams : FALLBACK_CONTENT.streams,
    runOfShow,
    incentives: incentives.length ? incentives : FALLBACK_CONTENT.incentives,
    notice: text(raw.notice),
  };
}

/** Read the current contents from the sheet. Throws if it can't. */
export async function fetchGamedayContent(signal?: AbortSignal): Promise<GamedayContent> {
  if (!ENDPOINT) throw new Error("No RSVP endpoint configured");

  const url = `${ENDPOINT}${ENDPOINT.includes("?") ? "&" : "?"}action=gameday`;
  const res = await fetch(url, { signal, redirect: "follow" });
  if (!res.ok) throw new Error(`Gameday content failed (${res.status})`);

  const data = await res.json();
  if (data && data.ok === false) throw new Error(String(data.error || "Gameday content unavailable"));

  return parseGamedayContent(data);
}
