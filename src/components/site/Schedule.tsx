import { useMemo, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";

import { useNow } from "@/hooks/use-now";
import { getRsvpEvent } from "@/lib/rsvpEvents";
import { EVENTS, endsAtMs, splitByDate, type EventItem } from "@/lib/scheduleEvents";

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
  // Ticking clock, so a card crossing its end time during a long session (the
  // 24-hour marathon, say) archives itself without waiting for a reload.
  const now = useNow();

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
