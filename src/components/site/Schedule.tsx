import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";

import { getRsvpEvent, rsvpEndsAtMs } from "@/lib/rsvpEvents";

interface SubEvent {
  time: string;
  title: string;
  blurb: string;
  color: string;
  accent: string;
}

interface EventItem {
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
   *  (e.g. "2026-08-08T18:00:00-05:00" — CDT is -05:00, CST is -06:00). Once
   *  this moment passes the card moves itself from Future to Past Events, so
   *  no code change is needed after an event happens. Events with an rsvpSlug
   *  inherit their RSVP page's `calendar.end` automatically; set this for
   *  events without one. An event with neither never archives. */
  endsAt?: string;
  /** Slug of this event's RSVP page (/rsvp/<slug>). Omit for events with no RSVP. */
  rsvpSlug?: string;
  /** Google Maps link for the Directions chip. Events with an rsvpSlug inherit
   *  their RSVP page's mapUrl automatically; set this for events without one. */
  mapUrl?: string;
  subEvents?: SubEvent[];
}

/** Every event, past and future. The Future/Past split is derived from each
 *  event's end time at render, not hand-maintained — see splitByDate(). */
const EVENTS: EventItem[] = [
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
function endsAtMs(item: EventItem): number {
  if (item.endsAt) {
    const ms = Date.parse(item.endsAt);
    return Number.isNaN(ms) ? Number.POSITIVE_INFINITY : ms;
  }
  const rsvpEvent = item.rsvpSlug ? getRsvpEvent(item.rsvpSlug) : undefined;
  return rsvpEvent ? rsvpEndsAtMs(rsvpEvent) : Number.POSITIVE_INFINITY;
}

/** Partition the events into upcoming and finished, based on the visitor's
 *  clock at render time. Future events run soonest-first; past events run
 *  most-recent-first. */
function splitByDate(events: EventItem[], now: number) {
  const future: EventItem[] = [];
  const past: EventItem[] = [];

  for (const item of events) {
    (endsAtMs(item) < now ? past : future).push(item);
  }

  future.sort((a, b) => endsAtMs(a) - endsAtMs(b));
  past.sort((a, b) => endsAtMs(b) - endsAtMs(a));

  return { future, past };
}

function EventCard({
  item,
  index,
  openIndex,
  toggle,
  past,
}: {
  item: EventItem;
  index: string;
  openIndex: string | null;
  toggle: (i: string) => void;
  past?: boolean;
}) {
  const isOpen = openIndex === index;
  const mapUrl = item.mapUrl ?? (item.rsvpSlug ? getRsvpEvent(item.rsvpSlug)?.mapUrl : undefined);
  // RSVPs to an event that already happened would only pollute the sheet.
  const rsvpSlug = past ? undefined : item.rsvpSlug;
  return (
    <div
      className={`group relative rounded-2xl border-l-4 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 ${item.color} ${past ? "bg-ink/[0.03] opacity-60" : "bg-paper"}`}
    >
      {/* Top-left corner: RSVP + Directions buttons */}
      {(rsvpSlug || mapUrl) && (
        <div className="absolute left-4 top-4 z-10 flex flex-col items-start gap-2 sm:left-5 sm:top-5">
          {rsvpSlug && (
            <a
              href={`${import.meta.env.BASE_URL}rsvp/${rsvpSlug}`}
              className="group/rsvp inline-flex items-center gap-1.5 rounded-full bg-teal px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-[var(--shadow-soft)] transition-all hover:bg-teal-bright"
            >
              RSVP
              <ArrowRight className="size-3.5 transition-transform group-hover/rsvp:translate-x-0.5" />
            </a>
          )}
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-teal bg-paper px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-teal shadow-[var(--shadow-soft)] transition-all hover:bg-teal-soft"
            >
              Directions
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      )}

      {/* Top-right corner: expand indicator */}
      <span
        className={`pointer-events-none absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 sm:right-5 sm:top-5 ${
          isOpen ? "bg-ink/10 text-ink-soft" : "bg-teal-soft text-teal"
        }`}
      >
        {isOpen ? "Close" : "Details"}
      </span>

      <button
        type="button"
        onClick={() => toggle(index)}
        className={`w-full cursor-pointer p-6 text-left ${
          rsvpSlug ? "pt-28 sm:pt-28" : mapUrl ? "pt-16 sm:pt-16" : "pr-24 sm:pr-32"
        }`}
        aria-expanded={isOpen}
      >
        <div className="grid gap-4 md:grid-cols-12 md:items-center md:gap-6">
          <div className="md:col-span-4">
            <p className={`font-display text-base font-extrabold ${item.accent}`}>
              {item.time}
            </p>
            {(item.main || item.partner || past) && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {item.main && (
                  <span className="shrink-0 rounded-full bg-magenta px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                    Main Event
                  </span>
                )}
                {item.partner && (
                  <span className="shrink-0 rounded-full bg-gold px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                    Partner Event
                  </span>
                )}
                {past && (
                  <span className="shrink-0 rounded-full bg-ink-soft/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-ink-soft">
                    Completed
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="md:col-span-8">
            <h3 className="mb-1 font-display text-xl font-extrabold text-ink">{item.title}</h3>
            <p className="text-sm text-ink-soft sm:text-base">{item.blurb}</p>
          </div>
        </div>
      </button>

      {/* Expandable details */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-line px-6 pt-4 pb-6">
          {item.details && (
            <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
              {item.details}
            </p>
          )}

          {item.fee && (
            <p className="mt-3 text-sm font-bold text-ink sm:text-base">
              {item.fee}
            </p>
          )}

          {item.detailsLabel && (
            <p className="mt-3 text-sm font-bold text-ink sm:text-base">
              {item.detailsLabel}
            </p>
          )}

          {/* Line-item list */}
          {item.detailsList && (
            <ul className="mt-3 space-y-1">
              {item.detailsList.map((line) => (
                <li key={line} className="text-sm font-semibold text-ink sm:text-base">
                  {line}
                </li>
              ))}
            </ul>
          )}

          {/* Sub-events (nested cards) */}
          {item.subEvents && (
            <div className="mt-4 grid gap-3">
              {item.subEvents.map((sub) => (
                <div
                  key={sub.title}
                  className="rounded-xl bg-gold-soft p-4"
                >
                  <div className="grid gap-2 sm:grid-cols-12 sm:items-center sm:gap-4">
                    <div className="sm:col-span-4">
                      <p className="font-display text-sm font-extrabold text-ink">
                        {sub.time}
                      </p>
                    </div>
                    <div className="sm:col-span-8">
                      <h4 className="mb-0.5 font-display text-base font-extrabold text-ink">
                        {sub.title}
                      </h4>
                      <p className="text-sm text-ink-soft">{sub.blurb}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** "2026 " / "2026–2027 " prefix for a section heading, derived from the events
 *  actually in it so the year never goes stale. Empty when nothing is dated. */
function yearPrefix(items: EventItem[]): string {
  const years = items
    .map(endsAtMs)
    .filter((ms) => Number.isFinite(ms))
    .map((ms) => new Date(ms).getFullYear());

  if (years.length === 0) return "";

  const first = Math.min(...years);
  const last = Math.max(...years);
  return first === last ? `${first} ` : `${first}–${last} `;
}

export function Schedule() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // Re-check the clock while the page is open so a card crossing its end time
  // during a long session (the 24-hour marathon, say) archives itself without
  // waiting for a reload.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const { future, past } = useMemo(() => splitByDate(EVENTS, now), [now]);

  const toggle = (i: string) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="schedule" className="bg-cream px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">

        {/* Future Events */}
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal">
            {yearPrefix(future)}Future Events
          </p>
        </div>
        {future.length > 0 ? (
          <div className="grid gap-4">
            {future.map((item) => (
              <EventCard
                key={item.title}
                item={item}
                index={item.title}
                openIndex={openIndex}
                toggle={toggle}
              />
            ))}
          </div>
        ) : (
          // Every event has come and gone — say so rather than leaving a gap.
          <div className="rounded-2xl border border-dashed border-line bg-paper/60 p-6">
            <p className="text-sm text-ink-soft sm:text-base">
              Nothing on the calendar right now — we're planning our next event.
              Check back soon, or follow us for the announcement.
            </p>
          </div>
        )}

        {/* Divider */}
        {past.length > 0 && <div className="my-12 border-t border-line" />}

        {/* Past Events */}
        {past.length > 0 && (
          <>
            <div className="mb-12 max-w-2xl">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-ink-soft">
                {yearPrefix(past)}Past Events
              </p>
            </div>
            <div className="grid gap-4">
              {past.map((item) => (
                <EventCard
                  key={item.title}
                  item={item}
                  index={item.title}
                  openIndex={openIndex}
                  toggle={toggle}
                  past
                />
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
}
