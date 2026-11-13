import { useMemo, useState } from "react";
import { ArrowRight, CalendarClock, ChevronDown, ExternalLink, Swords, Trophy } from "lucide-react";

import { ResponsiveGamedaySchedule } from "@/components/site/GamedayAgenda";
import { GamedayEventDetails } from "@/components/site/GamedayEventDetails";
import { LoadingBox } from "@/components/site/LoadingBox";
import { useGamedayContent } from "@/hooks/use-gameday-content";
import { useNow } from "@/hooks/use-now";
import { getRsvpEvent } from "@/lib/rsvpEvents";
import { EVENTS, endsAtMs, eventAnchor, splitByDate, type EventItem } from "@/lib/scheduleEvents";

/** The Game Day run of show, shown under the main-event card. Same rows as
 *  /gameday (the sheet's, re-read once a minute), so the home page never
 *  shows a different schedule from the Command Center. Phones get the
 *  timeline of cards with duration bars; wider screens get the lane grid. The
 *  sheet's "Event Details" list follows the schedule, and a link to the
 *  /gameday_events sign-up page sits above it. Until the
 *  first read lands it shows a placeholder, not the shipped fallback, so the
 *  real rows don't replace an example a second after it appears. */
// "November 14th 2026", from the marathon's calendar start, in Central time.
function ordinalDate(iso: string) {
  const d = new Date(iso);
  const month = d.toLocaleDateString("en-US", { month: "long", timeZone: "America/Chicago" });
  const year = d.toLocaleDateString("en-US", { year: "numeric", timeZone: "America/Chicago" });
  const day = Number(d.toLocaleDateString("en-US", { day: "numeric", timeZone: "America/Chicago" }));
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `${month} ${day}${suffix} ${year}`;
}

function MainEventSchedule({ item }: { item: EventItem }) {
  const { content, settled } = useGamedayContent();
  const calendar = item.rsvpSlug ? getRsvpEvent(item.rsvpSlug)?.calendar : undefined;
  if (!calendar) return null;
  return (
    <>
      {/* Sign-ups for specific Game Day events (/gameday_events). */}
      <a
        href={`${import.meta.env.BASE_URL}gameday_events`}
        className="group flex min-w-0 items-center gap-3 rounded-2xl border-2 border-teal bg-teal-soft px-5 py-4 shadow-[var(--shadow-soft)] transition-colors hover:bg-teal sm:px-6"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal text-white transition-colors group-hover:bg-white group-hover:text-teal">
          <Swords className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-lg font-extrabold text-ink transition-colors group-hover:text-white">
            Sign up for Game Day events
          </span>
          <span className="block text-sm text-ink-soft transition-colors group-hover:text-white/90">
            Grab a seat at a session or tournament during the marathon.
          </span>
        </span>
        <ArrowRight className="size-5 shrink-0 text-teal transition-all group-hover:translate-x-0.5 group-hover:text-white" />
      </a>
      <div id="gameday-schedule" className="min-w-0 scroll-mt-24 rounded-2xl border border-line bg-paper p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="mb-4">
          <p className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
            <CalendarClock className="size-3.5" /> What&rsquo;s on
          </p>
          <h3 className="font-display text-xl font-extrabold text-ink sm:text-2xl">
            Game Day Schedule &ndash;{" "}
            <span className="whitespace-nowrap">{ordinalDate(calendar.start)}</span>
          </h3>
        </div>
        {!settled ? (
          <LoadingBox>Loading the schedule&hellip;</LoadingBox>
        ) : (
          <>
            <ResponsiveGamedaySchedule
              rows={content.runOfShow}
              startMs={Date.parse(calendar.start)}
              endMs={Date.parse(calendar.end)}
              showNowLine={false}
            />
            <GamedayEventDetails items={content.eventDetails} signups={content.signups} />
          </>
        )}
      </div>
    </>
  );
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
  // The main event (the marathon) gets a gradient header band with the RSVP
  // and Directions buttons and a countdown in it, so the body stays tight.
  const band = Boolean(item.main && !past);
  const Body = band ? "div" : "button";
  const start = item.rsvpSlug ? getRsvpEvent(item.rsvpSlug)?.calendar.start : undefined;
  const daysAway = start ? Math.max(0, Math.ceil((Date.parse(start) - Date.now()) / 86_400_000)) : null;
  const mapUrl = item.mapUrl ?? (item.rsvpSlug ? getRsvpEvent(item.rsvpSlug)?.mapUrl : undefined);
  // RSVPs to an event that already happened would only pollute the sheet.
  const rsvpSlug = past ? undefined : item.rsvpSlug;
  return (
    <div
      id={eventAnchor(item)}
      className={`group relative scroll-mt-24 rounded-2xl border-l-4 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 ${item.color} ${
        past ? "bg-ink/[0.03] opacity-60" : "bg-paper"
      } ${band ? "overflow-hidden border-l-0 ring-2 ring-magenta/40" : ""}`}
    >
      {band && (
        <div className="flex flex-col items-start gap-y-2 bg-gradient-to-r from-magenta via-purple to-teal px-5 py-2.5 text-white sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:px-6">
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-extrabold uppercase tracking-[0.18em] sm:tracking-[0.25em]">
            <Trophy className="size-4" /> The Big One · Game Day 2026
            {daysAway !== null && (
              <span className="whitespace-nowrap rounded-full bg-white/20 px-2.5 py-0.5 tracking-wider sm:ml-1">{daysAway} days away</span>
            )}
          </span>
          <span className="flex flex-wrap items-center gap-2">
            {rsvpSlug && (
              <a
                href={`${import.meta.env.BASE_URL}rsvp/${rsvpSlug}`}
                className="group/rsvp inline-flex items-center gap-1.5 rounded-full bg-orange px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-[var(--shadow-soft)] transition-all hover:brightness-110"
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
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/80 bg-white/10 px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white transition-all hover:bg-white/20"
              >
                Directions
                <ExternalLink className="size-3.5" />
              </a>
            )}
          </span>
        </div>
      )}
      {/* Top-left corner: RSVP + Directions buttons (the main event has them in its band) */}
      {!band && (rsvpSlug || mapUrl) && (
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

      {/* Top-right corner: expand indicator. It and the body share a wrapper so
          on band cards it sits just under the band however tall the band wraps. */}
      <div className="relative">
      {!band && (
        <span
          className={`pointer-events-none absolute right-4 z-10 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 sm:right-5 top-4 sm:top-5 ${
            isOpen ? "bg-ink/10 text-ink-soft" : "bg-teal-soft text-teal"
          }`}
        >
          {isOpen ? "Close" : "Details"}
        </span>
      )}

      {/* The main event has nothing folded away (its details section is
          always open and its schedule is the grid below), so its body is
          plain, not a button. */}
      <Body
        {...(band
          ? {}
          : { type: "button" as const, onClick: () => toggle(index), "aria-expanded": isOpen })}
        className={`w-full p-6 text-left ${
          band ? "" : rsvpSlug ? "cursor-pointer pt-28 sm:pt-28" : mapUrl ? "cursor-pointer pt-16 sm:pt-16" : "cursor-pointer pr-24 sm:pr-32"
        }`}
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
                    External Partner Event
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
            <h3
              className={`mb-1 font-display font-extrabold ${
                band
                  ? "bg-gradient-to-r from-magenta via-purple to-teal bg-clip-text text-2xl text-transparent sm:text-3xl"
                  : "text-xl text-ink"
              }`}
            >
              {item.title}
            </h3>
            <p className="text-sm text-ink-soft sm:text-base">{item.blurb}</p>
          </div>
        </div>
      </Body>
      </div>

      {/* Details section: folded on ordinary cards, always open on the main
          event (same ruled-off block, just never hidden). */}
      <div
        className={
          band
            ? ""
            : `overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
              }`
        }
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
  // Ticking clock, so a card crossing its end time during a long session (the
  // 24-hour marathon, say) archives itself without waiting for a reload.
  const now = useNow();

  const { future, past } = useMemo(() => splitByDate(EVENTS, now), [now]);
  // The team's own events lead; partner events sit below them in grey.
  const hosted = future.filter((item) => !item.partner);
  const partners = future.filter((item) => item.partner);

  const toggle = (i: string) => setOpenIndex(openIndex === i ? null : i);
  // Past events start folded away; the list only gets longer as the year goes on.
  const [pastOpen, setPastOpen] = useState(false);

  return (
    <section id="schedule" className="bg-cream px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">

        {/* Extra Life Nerds events */}
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal">
            {yearPrefix(hosted)}Extra Life Nerds Events
          </p>
        </div>
        {hosted.length > 0 ? (
          <div className="grid gap-4">
            {hosted.map((item) => (
              <div key={item.title} className="grid min-w-0 gap-4">
                <EventCard
                  item={item}
                  index={item.title}
                  openIndex={openIndex}
                  toggle={toggle}
                />
                {item.main && <MainEventSchedule item={item} />}
              </div>
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

        {/* Partner events */}
        {partners.length > 0 && (
          <>
            <div className="my-12 border-t border-line" />
            <div className="mb-8 max-w-2xl">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-ink-soft">
                {yearPrefix(partners)}External Partner Events
              </p>
            </div>
            <div className="grid gap-4">
              {partners.map((item) => (
                <EventCard
                  key={item.title}
                  item={item}
                  index={item.title}
                  openIndex={openIndex}
                  toggle={toggle}
                />
              ))}
            </div>
          </>
        )}

        {/* Divider */}
        {past.length > 0 && <div className="my-12 border-t border-line" />}

        {/* Past Events */}
        {past.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setPastOpen((v) => !v)}
              aria-expanded={pastOpen}
              aria-controls="past-events"
              className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-line bg-paper/60 px-5 py-4 text-left transition-colors hover:border-ink-soft/40 hover:bg-paper"
            >
              <span>
                <span className="block text-[10px] font-extrabold uppercase tracking-[0.3em] text-ink-soft">
                  {yearPrefix(past)}Past Events
                </span>
                <span className="mt-1 block text-sm font-bold text-ink">
                  {pastOpen
                    ? "Hide past events"
                    : `Click to see ${past.length} past ${past.length === 1 ? "event" : "events"}`}
                </span>
              </span>
              <ChevronDown
                aria-hidden
                className={`size-5 shrink-0 text-ink-soft transition-transform ${pastOpen ? "rotate-180" : ""}`}
              />
            </button>
            {pastOpen && (
              <div id="past-events" className="mt-6 grid gap-4">
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
            )}
          </>
        )}

      </div>
    </section>
  );
}
