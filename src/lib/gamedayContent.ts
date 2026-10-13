// Contents of the Gameday Command Center (/gameday).
//
// These are editable mid-marathon: the Apps Script backend serves them from
// tabs in the RSVP spreadsheet ("Gameday Run of Show", "Gameday Streams",
// "Gameday Incentives", "Gameday Notice"), and the page re-reads every minute
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
  // An example day, shaped like past Game Days, so the schedule has something
  // to show until the sheet is filled in. Times are Central; "(Sun)" marks the
  // second morning.
  runOfShow: [
    { time: "8:00 AM", title: "Kickoff", detail: "Doors open, streams go live" },
    { time: "9:00 AM", title: "Waffle Bar", detail: "Breakfast for everyone in the room" },
    { time: "10:00 AM", title: "Open House Family Gaming", detail: "All ages, bring the whole family" },
    { time: "12:00 PM", title: "Lunch", detail: "Gameday lunch, courtesy of our sponsor" },
    { time: "1:00 PM", title: "Smash Bros tournament", detail: "Bracket sign-ups at the front table" },
    { time: "3:00 PM", title: "D&D session one", detail: "A one-shot for drop-in players" },
    { time: "5:00 PM", title: "Open house wraps", detail: "Family gaming session ends" },
    { time: "6:00 PM", title: "Dinner", detail: "Refuel before the night shift" },
    { time: "7:00 PM", title: "Retro stations open", detail: "Free play on the classics" },
    { time: "9:00 PM", title: "Mario Kart", detail: "Grand prix, winner takes bragging rights" },
    { time: "11:00 PM", title: "Gorilla Butler", detail: "You read that right" },
    { time: "12:00 AM", title: "Midnight D&D", detail: "Session two, for the night owls" },
    { time: "2:00 AM", title: "Late-night co-op", detail: "Whatever the room votes for" },
    { time: "5:00 AM", title: "Coffee and a stretch", detail: "The home stretch starts here" },
    { time: "7:00 AM", title: "Final hour push", detail: "Last call for donations" },
    { time: "8:00 AM (Sun)", title: "Finale & grand total", detail: "Cross the line together" },
  ],
  incentives: [
    { amount: "$—", what: "Milestone to be announced" },
    { amount: "$—", what: "Milestone to be announced" },
    { amount: "$—", what: "Milestone to be announced" },
  ],
  notice: "",
};

/** "8:00 AM" → 0, "12:00 PM" → 240, "7:30 PM" → 690, "2:00 AM" → 1080,
 *  "8:00 AM (Sun)" → 1440. Null when the text isn't a clock time. */
export function minutesFromKickoff(time: string): number | null {
  const m = time.match(/(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m?/i);
  if (!m) return null;
  let h = parseInt(m[1], 10) % 12;
  if (m[3].toLowerCase() === "p") h += 12;
  const mins = h * 60 + (m[2] ? parseInt(m[2], 10) : 0) - 8 * 60;
  const sunday = /sun|day 2|\+1/i.test(time);
  if (sunday) return mins + 24 * 60;
  // Times earlier than kickoff are the small hours of Sunday morning.
  return mins < 0 ? mins + 24 * 60 : mins;
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
 *  A section that comes back empty or unparseable keeps its shipped copy, so a
 *  cleared tab can't silently blank out part of the page. */
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
    runOfShow: runOfShow.length ? runOfShow : FALLBACK_CONTENT.runOfShow,
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
