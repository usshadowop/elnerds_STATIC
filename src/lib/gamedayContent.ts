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

/** One run of a Details cell: plain text, or text that links somewhere. */
export interface GamedayTextPart {
  text: string;
  url?: string;
}

/** A row of the "Gameday Event Details" tab: a pink title ("$35") and a
 *  details line that can carry links, shown under the schedule. */
export interface GamedayEventDetail {
  title: string;
  details: GamedayTextPart[];
}

/** A row of the "Gameday Signups" tab, listed on /gameday_events. With a
 *  `link` it gets a "Sign up" button to that address; without one it is
 *  offered in the site's own sign-up form. */
export interface GamedaySignupEvent {
  event: string;
  when: string;
  details: GamedayTextPart[];
  /** A "Prize: …" line typed in the Details cell, taken out of `details` and
   *  shown as a box under the event. `label` is what came before the colon
   *  ("Prize", "Grand prize"). Absent when the cell has no such line. */
  prize?: { label: string; text: GamedayTextPart[] };
  link?: string;
  /** Column E. Rows with the same Group share one card in Event Details
   *  ("D&D with Ben Stoddart"); blank gives the event a card of its own. */
  group: string;
  /** Column F, the pink label on the card ("$35 / seat", "Donation"). */
  price: string;
}

export interface GamedayContent {
  streams: GamedayStream[];
  runOfShow: GamedayShowRow[];
  incentives: GamedayIncentive[];
  /** "Event Details" under the schedule. Empty hides the section; there is
   *  no shipped example, so a failed read shows nothing rather than stale
   *  sign-ups. */
  eventDetails: GamedayEventDetail[];
  /** The /gameday_events list. Empty means "check back"; no shipped copy. */
  signups: GamedaySignupEvent[];
  /** One-line announcement across the top. Empty hides the banner. */
  notice: string;
}

export const FALLBACK_CONTENT: GamedayContent = {
  streams: [
    { name: "Main Stage", who: "Team channel — the big one" },
    { name: "Second Feed", who: "Roaming camera / co-streamer" },
    { name: "Third Feed", who: "Spare slot" },
  ],
  // The 2025 schedule, as an example, so the page has something to show until
  // the sheet is filled in. Times are Central; "Sunday" marks the second
  // morning. Rows that mention a meal render as green banners.
  runOfShow: [
    { time: "8am Saturday - 8am Sunday", title: "24-hour gaming for fundraisers", detail: "" },
    { time: "8a - 5p", title: "Open house gaming", detail: "Consoles and board games provided!" },
    { time: "8:30a - 9:30a", title: "Waffles", detail: "provided by Butchy for donations!" },
    {
      time: "9:30a - 12:30p",
      title: "Dungeons and Dragons",
      detail: "with Badwolf Adventure Studios",
    },
    { time: "10a - 8p", title: "Warhammer 40k Open Play", detail: "" },
    { time: "11a - 4p", title: "Golf Simulator Tournament", detail: "ALL skill levels welcome!" },
    { time: "11 - 1p", title: "Final Fantasy MtG Cube Draft", detail: "" },
    {
      time: "12p - 1p",
      title: "Lunch",
      detail: "Provided by Eric Morris with Edward Jones for EL NERDS FUNDRAISERS ONLY",
    },
    {
      time: "1:30p - 4:30p",
      title: "Dungeons and Dragons",
      detail: "with Badwolf Adventure Studios",
    },
    { time: "2p - 4p", title: "Super Smash Brothers Tournament", detail: "" },
    { time: "5p - 8p", title: "Dungeons and Dragons", detail: "with Badwolf Adventure Studios" },
    {
      time: "6p - 7p",
      title: "Dinner",
      detail: "Provided by Gillette Children\u2019s Hospital for EL NERDS FUNDRAISERS ONLY",
    },
    { time: "6p - 8p", title: "Dark Souls Speedrun Race", detail: "" },
    { time: "8am Sunday", title: "Cleanup", detail: "" },
  ],
  incentives: [
    { amount: "$—", what: "Milestone to be announced" },
    { amount: "$—", what: "Milestone to be announced" },
    { amount: "$—", what: "Milestone to be announced" },
  ],
  eventDetails: [],
  signups: [],
  notice: "",
};

const DAY = 24 * 60;
const KICKOFF = 8 * 60;

/** One clock token ("9:30a", "12pm", "8") into minutes since midnight, given a
 *  meridian to fall back on when the token has none. */
function clock(
  h: number,
  m: number,
  mer: string | undefined,
  fallback: string | undefined,
): number | null {
  const ap = (mer ?? fallback ?? "").toLowerCase();
  if (!ap) return null;
  let hour = h % 12;
  if (ap === "p") hour += 12;
  return hour * 60 + m;
}

export const DAY_MINUTES = 24 * 60;
export const START_HOUR = 8; // Game Day runs 8:00 AM Saturday to 8:00 AM Sunday.

/** Rows whose title or detail mention a meal turn green, in both the grid
 *  and the phone timeline. */
export const FOOD = /breakfast|lunch|dinner|waffle|snack|food|pizza/i;

/** Minutes from kickoff → "2:15 PM". Shared by the grid's now-line and the
 *  phone timeline's now pill so they can never disagree. */
export function clockLabel(minutes: number): string {
  const total = (START_HOUR * 60 + minutes) % DAY_MINUTES;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
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
function rows<T>(
  value: unknown,
  map: (row: Record<string, unknown>) => T,
  keyOf: (row: T) => string,
): T[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((row): row is Record<string, unknown> => typeof row === "object" && row !== null)
    .map(map)
    .filter((row) => keyOf(row).length > 0);
}

// Only these schemes become links: a cell can't smuggle in javascript: URLs.
const SAFE_URL = /^(https?:\/\/|mailto:)/i;
// Bare addresses typed into a cell ("https://…", "www.…"). Trailing
// punctuation is left out so "sign up at https://x.com." links x.com.
const BARE_URL = /(https?:\/\/[^\s<>"]+[^\s<>".,;:!?)\]]|www\.[^\s<>"]+[^\s<>".,;:!?)\]])/gi;

export type SignupGroup = { key: string; title: string; price: string; rows: GamedaySignupEvent[] };

/** Sign-up rows grouped by column E (shared by Event Details and
 *  /gameday_events), in the order each group first appears
 *  (the sheet is kept in time order, so that's the day's order too). */
export function groupSignups(rows: GamedaySignupEvent[]): SignupGroup[] {
  const groups: SignupGroup[] = [];
  const byKey = new Map<string, SignupGroup>();
  rows.forEach((row, i) => {
    const key = row.group ? `g:${row.group.toLowerCase()}` : `e:${i}`;
    let g = byKey.get(key);
    if (!g) {
      g = { key, title: row.group || row.event, price: "", rows: [] };
      byKey.set(key, g);
      groups.push(g);
    }
    if (!g.price && row.price) g.price = row.price;
    g.rows.push(row);
  });
  return groups;
}

export type SignupSection = { key: string; title: string; groups: SignupGroup[] };

// The Game Day events page and Event Details are split into these sections,
// in this order. A row lands in the first one whose pattern matches its Group
// and Event text; anything else is "Other". The sheet needs no extra column.
const SECTIONS: { key: string; title: string; test: RegExp | null }[] = [
  { key: "dnd", title: "Dungeons & Dragons", test: /d&d|dungeons/i },
  { key: "magic", title: "Magic: The Gathering", test: /\bmtg\b|magic/i },
  { key: "video", title: "Video Games", test: /smash|video game/i },
  { key: "other", title: "Other", test: null },
];

/** Which section a sign-up row belongs to. The leadership team's D&D one-shot
 *  is a watch-only event, so it goes under Other with the side events rather
 *  than with the D&D games you can sign up for. */
export function sectionOf(row: GamedaySignupEvent): string {
  const text = `${row.group} ${row.event}`;
  if (/leadership/i.test(text)) return "other";
  return SECTIONS.find((sec) => sec.test?.test(text))?.key ?? "other";
}

/** Sign-up rows split into sections, each holding its group cards. Empty
 *  sections are left out. Shared by Event Details and /gameday_events. */
export function sectionSignups(rows: GamedaySignupEvent[]): SignupSection[] {
  return SECTIONS.map((sec) => ({
    key: sec.key,
    title: sec.title,
    groups: groupSignups(rows.filter((r) => sectionOf(r) === sec.key)),
  })).filter((sec) => sec.groups.length > 0);
}

/** The path on this site a sign-up link points at ("leadership_DandD"), or
 *  null for an outside link. A row that links one of our own pages is a
 *  watch-only event: its button says "Watch Here" and its chip says "Full". */
export function ownPagePath(link: string | undefined): string | null {
  if (!link) return null;
  try {
    const u = new URL(link);
    const host = u.hostname.toLowerCase();
    if (host !== "elnerds.com" && host !== "www.elnerds.com") return null;
    return u.pathname.replace(/^\/+|\/+$/g, "") || null;
  } catch {
    return null;
  }
}

// A line of a Details cell that starts "Prize:" or "Grand prize:" (any
// "<words> prize:"); everything after the colon is the prize.
const PRIZE_LINE = /(^|\n)[ \t]*([^\n:]*\bprizes?):[ \t]*/i;

/** Pull a "Prize: …" line out of a Details cell. The text before it stays as
 *  the details; the rest of the cell, links included, becomes the prize. */
function splitPrize(parts: GamedayTextPart[]): {
  details: GamedayTextPart[];
  prize?: { label: string; text: GamedayTextPart[] };
} {
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.url) continue;
    const m = PRIZE_LINE.exec(part.text);
    if (!m) continue;
    const label = m[2].trim().replace(/^./, (c) => c.toUpperCase());
    const before = part.text.slice(0, m.index).replace(/\s+$/, "");
    const after = part.text.slice(m.index + m[0].length);
    const details = [...parts.slice(0, i), ...(before ? [{ text: before }] : [])];
    const text = [...(after ? [{ text: after }] : []), ...parts.slice(i + 1)].filter(
      (p) => p.text.length > 0,
    );
    if (text.length === 0) return { details: parts };
    return { details, prize: { label, text } };
  }
  return { details: parts };
}

/** A sign-up link cell as a URL the page may link to, or undefined.
 *  "www.…" gains https://; anything that isn't http(s)/mailto is dropped. */
function safeLink(value: string): string | undefined {
  const v = value.trim();
  if (!v) return undefined;
  if (/^www\./i.test(v)) return `https://${v}`;
  return SAFE_URL.test(v) ? v : undefined;
}

/** Split plain text into text and link parts wherever a bare URL appears. */
function linkify(text: string): GamedayTextPart[] {
  const parts: GamedayTextPart[] = [];
  let last = 0;
  for (const m of text.matchAll(BARE_URL)) {
    const at = m.index ?? 0;
    if (at > last) parts.push({ text: text.slice(last, at) });
    const shown = m[0];
    parts.push({
      text: shown,
      url: shown.toLowerCase().startsWith("www.") ? `https://${shown}` : shown,
    });
    last = at + shown.length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}

/** The Details cell as parts. The script sends the cell's runs, so a link
 *  added in Sheets (Insert → Link) keeps its URL; anything left as plain
 *  text still gets its bare URLs linked. Unsafe URLs drop to plain text. */
function detailParts(raw: Record<string, unknown>): GamedayTextPart[] {
  const runs = Array.isArray(raw.parts) ? raw.parts : [{ text: raw.details }];
  const out: GamedayTextPart[] = [];
  for (const run of runs) {
    if (typeof run !== "object" || run === null) continue;
    const r = run as Record<string, unknown>;
    const t = typeof r.text === "string" ? r.text : "";
    if (!t) continue;
    const url = typeof r.url === "string" ? r.url.trim() : "";
    if (url && SAFE_URL.test(url)) out.push({ text: t, url });
    else out.push(...linkify(t));
  }
  // Trim the cell's outer whitespace without touching links inside it.
  if (out.length && !out[0].url) out[0] = { text: out[0].text.replace(/^\s+/, "") };
  const end = out.length - 1;
  if (end >= 0 && !out[end].url) out[end] = { text: out[end].text.replace(/\s+$/, "") };
  return out.filter((p) => p.text.length > 0);
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

  // No fallback here: an empty or missing tab (including a backend that
  // predates the tab) simply hides the section.
  const eventDetails = Array.isArray(raw.eventDetails)
    ? raw.eventDetails
        .filter((r): r is Record<string, unknown> => typeof r === "object" && r !== null)
        .map((r) => ({ title: text(r.title), details: detailParts(r) }))
        .filter((r) => r.title || r.details.length)
    : [];

  const signups = Array.isArray(raw.signups)
    ? raw.signups
        .filter((r): r is Record<string, unknown> => typeof r === "object" && r !== null)
        .map((r) => {
          const link = safeLink(text(r.link));
          const { details, prize } = splitPrize(detailParts(r));
          return {
            event: text(r.event),
            when: text(r.when),
            details,
            ...(prize ? { prize } : {}),
            group: text(r.group),
            price: text(r.price),
            ...(link ? { link } : {}),
          };
        })
        .filter((r) => r.event)
    : [];

  return {
    streams: streams.length ? streams : FALLBACK_CONTENT.streams,
    runOfShow: runOfShow.length ? runOfShow : FALLBACK_CONTENT.runOfShow,
    incentives: incentives.length ? incentives : FALLBACK_CONTENT.incentives,
    eventDetails,
    signups,
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
  if (data && data.ok === false)
    throw new Error(String(data.error || "Gameday content unavailable"));

  return parseGamedayContent(data);
}
