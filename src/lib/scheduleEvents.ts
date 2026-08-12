// Single source of truth for the events on the site.
//
// One array holds every event, past and future. Nothing here is split by hand:
// each event's end time decides where it shows up, so a finished event moves
// itself from Future to Past Events, drops its RSVP chip, and disappears from
// the hero chips the moment it's over — no code change or redeploy needed.
//
// Events with an `rsvpSlug` take their date from that event's `calendar.end` in
// rsvpEvents.ts, so the date lives in exactly one place.

import { getRsvpEvent, rsvpEndsAtMs } from "@/lib/rsvpEvents";

export interface SubEvent {
  time: string;
  title: string;
  blurb: string;
  color: string;
  accent: string;
}

/** The small pill links above the hero headline. Full Tailwind class strings,
 *  since Tailwind can't see class names assembled at runtime. */
export interface EventChip {
  /** Short label, e.g. "Bingo Night · Aug 8". */
  label: string;
  /** Border/text/hover classes for the pill. */
  className: string;
  /** Background class for the little dot. */
  dotClassName: string;
}

export interface EventItem {
  time: string;
  title: string;
  blurb: string;
  details?: string;
  fee?: string;
  detailsLabel?: string;
  detailsList?: string[];
  color: string;
  accent: string;
  main?: boolean;
  partner?: boolean;
  /** When the event finishes, as an ISO 8601 string *with a timezone offset*
   *  (e.g. "2026-08-08T18:00:00-05:00" — CDT is -05:00, CST is -06:00). Events
   *  with an rsvpSlug inherit this from their RSVP page's `calendar.end`; set
   *  it here for events without one. An event with neither never archives. */
  endsAt?: string;
  /** Slug of this event's RSVP page (/rsvp/<slug>). Omit for events with no RSVP. */
  rsvpSlug?: string;
  /** Google Maps link for the Directions chip. Events with an rsvpSlug inherit
   *  their RSVP page's mapUrl automatically; set this for events without one. */
  mapUrl?: string;
  /** Hero pill for this event. Omit to keep the event out of the hero. */
  chip?: EventChip;
  subEvents?: SubEvent[];
}

export const EVENTS: EventItem[] = [
  {
    time: "Apr 11 · 10:00 AM – 4:30 PM",
    title: "Tabletop Day",
    blurb: "Game to make a difference! Join us to learn games and raise money for Gillette Children's Hospital.",
    details:
      "Held at Minneapolis Cider Company, 701 SE 9th St, Minneapolis, MN 55414.",
    detailsLabel: "Teaching sessions available for:",
    detailsList: [
      "Magic: The Gathering",
      "Dungeons & Dragons",
      "Settlers of Catan",
      "Hexeh",
    ],
    color: "border-teal",
    accent: "text-teal",
    endsAt: "2026-04-11T16:30:00-05:00",
  },
  {
    time: "Aug 8 · 3:00 PM – 6:00 PM",
    title: "Extra Life Bingo",
    blurb: "Join the Extra Life Leadership for a thrilling night of Bingo located at Truplayerz Sports Training & Upper Deck Lounge!",
    detailsList: [
      "10 game Bingo bundle — $20",
      "16 oz pounders — $6/each, 2 for $8",
      "12 oz cans — $4",
      "Nutrl vodka seltzers — $5",
    ],
    color: "border-purple",
    accent: "text-purple",
    rsvpSlug: "bingo",
    chip: {
      label: "Bingo Night · Aug 8",
      className: "border-purple/20 text-purple hover:bg-purple/5",
      dotClassName: "bg-purple",
    },
  },
  {
    time: "Nov 7 · 9:00 AM – 11:59 PM",
    title: "15-Hours of Board Gaming",
    blurb:
      "Join our partner team and show your support for their marathon board gaming main event!",
    details:
      "Held at St Paul Masonic Center, 200 E Plato Blvd, St Paul, MN 55107. How to sign up: just show up!",
    fee: "Entry Fee: $5 — Includes (entry, food, and drink)",
    detailsLabel: "What's happening:",
    detailsList: [
      "Raffles every hour for games",
      "Silent auction",
      "Hours of boardgaming — play what's there, or bring your own",
      "Nerf battles",
      "Nintendo Switch games (Mario Kart, Mario vs. Rabbids, Super Smash Bros, and more)",
    ],
    color: "border-gold",
    accent: "text-gold",
    partner: true,
    endsAt: "2026-11-07T23:59:00-06:00",
    mapUrl:
      "https://www.google.com/maps/dir/?api=1&destination=St.+Paul+Masonic+Center,+200+E+Plato+Blvd,+St+Paul,+MN+55107",
    chip: {
      label: "Board Game Day · Nov 7",
      className: "border-teal/20 text-teal hover:bg-teal-soft",
      dotClassName: "bg-teal",
    },
  },
  {
    time: "Nov 14 · 8 AM → Nov 15 · 8 AM",
    title: "24-Hour Marathon",
    blurb:
      "Join us for the big event! Whether you participate for 1 hour, or marathon the full 24, your presence and effort will go to helping local children in need.",
    details:
      "The main event! We kick off 24 consecutive hours of gaming at 8:00 AM on November 14th and don't stop until 8:00 AM on November 15th. Join us in person or watch the livestream. Every donation and every hour of play makes a difference.",
    color: "border-magenta",
    accent: "text-magenta",
    main: true,
    rsvpSlug: "marathon",
    chip: {
      label: "Game Day · Nov 14–15",
      className: "border-teal/20 text-teal hover:bg-teal-soft",
      dotClassName: "bg-magenta",
    },
    subEvents: [
      {
        time: "Nov 14 · 8:00 AM – 5:00 PM",
        title: "Open House Family Gaming",
        blurb: "Drop in, meet the team, and play with us. Open to all ages — bring the whole family.",
        color: "border-teal",
        accent: "text-teal",
      },
      {
        time: "Nov 15 · 8:00 AM",
        title: "Finale & Grand Total",
        blurb: "Cross the finish line together and reveal what we raised — for the kids.",
        color: "border-orange",
        accent: "text-orange",
      },
    ],
  },
];

/** The moment an event ends, in ms since epoch. Falls back to the event's RSVP
 *  page `calendar.end` so RSVP-backed events only carry the date in one place.
 *  Returns Infinity when neither is set (and when a value fails to parse), so
 *  an under-configured event stays visible under Future rather than vanishing
 *  into Past. */
export function endsAtMs(item: EventItem): number {
  if (item.endsAt) {
    const ms = Date.parse(item.endsAt);
    return Number.isNaN(ms) ? Number.POSITIVE_INFINITY : ms;
  }
  const rsvpEvent = item.rsvpSlug ? getRsvpEvent(item.rsvpSlug) : undefined;
  return rsvpEvent ? rsvpEndsAtMs(rsvpEvent) : Number.POSITIVE_INFINITY;
}

/** True once the event is over, on the clock passed in. */
export function hasEnded(item: EventItem, now: number): boolean {
  return endsAtMs(item) < now;
}

/** Partition the events into upcoming and finished, based on the visitor's
 *  clock at render time. Future events run soonest-first; past events run
 *  most-recent-first. */
export function splitByDate(events: EventItem[], now: number) {
  const future: EventItem[] = [];
  const past: EventItem[] = [];

  for (const item of events) {
    (hasEnded(item, now) ? past : future).push(item);
  }

  future.sort((a, b) => endsAtMs(a) - endsAtMs(b));
  past.sort((a, b) => endsAtMs(b) - endsAtMs(a));

  return { future, past };
}
