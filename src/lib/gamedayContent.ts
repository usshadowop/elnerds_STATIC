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
  runOfShow: [
    { time: "8:00 AM", title: "Kickoff", detail: "Doors open, streams go live" },
    { time: "10:00 AM", title: "TBD", detail: "Block to be filled in" },
    { time: "12:00 PM", title: "TBD", detail: "Block to be filled in" },
    { time: "5:00 PM", title: "Open house wraps", detail: "Family gaming session ends" },
    { time: "8:00 AM (Sun)", title: "Finale & grand total", detail: "Cross the line together" },
  ],
  incentives: [
    { amount: "$—", what: "Milestone to be announced" },
    { amount: "$—", what: "Milestone to be announced" },
    { amount: "$—", what: "Milestone to be announced" },
  ],
  notice: "",
};

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
