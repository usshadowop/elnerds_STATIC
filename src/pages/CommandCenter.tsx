// Gameday Command Center — the one page to sit on during the 24-hour marathon:
// where to watch, what's happening right now, and how to chip in.
//
// SKELETON. The structure and the live/before/after behavior are real; the
// contents are placeholders. Filling this in is meant to be data-entry, not
// layout work — every section below is driven by an array at the top of this
// file, so adding a stream or a schedule row is one entry.

import { Radio, Video, CalendarClock, Gift, ArrowRight, ExternalLink } from "lucide-react";

import { useGameday } from "@/hooks/use-countdown";
import { getRsvpEvent } from "@/lib/rsvpEvents";

const MARATHON = getRsvpEvent("marathon")?.calendar;
const GAME_DAY_START = MARATHON?.start ?? "2026-11-14T08:00:00-06:00";
const GAME_DAY_END = MARATHON?.end ?? "2026-11-15T08:00:00-06:00";

const HOME = import.meta.env.BASE_URL;

const DONATE_URL = "https://www.extra-life.org/team/73600";

/** Stream tiles. Add an `embedUrl` (the platform's *embed* URL, not the page
 *  URL) to turn a slot into a real player; leave it off and the tile stays a
 *  labelled placeholder. Twitch embeds also need `&parent=elnerds.com`. */
const STREAMS: { name: string; who: string; embedUrl?: string; pageUrl?: string }[] = [
  { name: "Main Stage", who: "Team channel — the big one" },
  { name: "Second Feed", who: "Roaming camera / co-streamer" },
  { name: "Third Feed", who: "Spare slot" },
];

/** Run of show. Times are display strings — this table is a schedule people
 *  read, not something the site computes against. */
const RUN_OF_SHOW: { time: string; title: string; detail: string }[] = [
  { time: "8:00 AM", title: "Kickoff", detail: "Doors open, streams go live" },
  { time: "10:00 AM", title: "TBD", detail: "Block to be filled in" },
  { time: "12:00 PM", title: "TBD", detail: "Block to be filled in" },
  { time: "5:00 PM", title: "Open house wraps", detail: "Family gaming session ends" },
  { time: "8:00 AM (Sun)", title: "Finale & grand total", detail: "Cross the line together" },
];

/** Incentives, milestones, challenges — anything with a dollar hook. */
const INCENTIVES: { amount: string; what: string }[] = [
  { amount: "$—", what: "Milestone to be announced" },
  { amount: "$—", what: "Milestone to be announced" },
  { amount: "$—", what: "Milestone to be announced" },
];

const QUICK_LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: "Donate to the team", href: DONATE_URL, external: true },
  { label: "RSVP for the marathon", href: `${HOME}rsvp/marathon` },
  { label: "Full event schedule", href: `${HOME}#schedule` },
  { label: "Join the team", href: `${HOME}registration` },
];

function SectionHeading({
  icon: Icon,
  label,
  title,
}: {
  icon: typeof Radio;
  label: string;
  title: string;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal">
        <Icon className="size-4" />
        {label}
      </p>
      <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">{title}</h2>
    </div>
  );
}

/** Marks a slot that's still waiting on real content, so a half-built page
 *  never looks like a broken one. */
function Slot({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-dashed border-ink-soft/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-ink-soft">
      {children}
    </span>
  );
}

function StatusBanner({ phase }: { phase: "before" | "live" | "after" }) {
  if (phase === "live") {
    return (
      <div className="mb-10 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-magenta bg-magenta-soft px-5 py-4 text-center">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-magenta opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-magenta" />
        </span>
        <p className="text-sm font-extrabold uppercase tracking-widest text-magenta">
          We&rsquo;re live right now — thanks for playing with us
        </p>
      </div>
    );
  }

  return (
    <div className="mb-10 rounded-2xl border border-line bg-paper px-5 py-4 text-center">
      <p className="text-sm font-bold text-ink-soft">
        {phase === "before"
          ? "Game Day hasn’t started yet — this page comes alive on November 14th at 8:00 AM."
          : "Game Day has wrapped. Thanks to everyone who played, donated, and cheered."}
      </p>
    </div>
  );
}

export function CommandCenter() {
  const { phase } = useGameday(GAME_DAY_START, GAME_DAY_END);

  return (
    <main>
      <section className="bg-cream px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-6xl">

          <div className="mb-10 text-center">
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
              Extra Life Nerds
            </p>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-5xl">
              Gameday Command Center
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-soft sm:text-base">
              Everything happening across the 24 hours, in one place — where to
              watch, what&rsquo;s on next, and how to help us hit the goal.
            </p>
          </div>

          <StatusBanner phase={phase} />

          {/* Watch ---------------------------------------------------------- */}
          <div className="mb-16">
            <SectionHeading icon={Video} label="Watch" title="Live streams" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {STREAMS.map((stream) => (
                <div
                  key={stream.name}
                  className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[var(--shadow-soft)]"
                >
                  <div className="flex aspect-video items-center justify-center border-b border-line bg-ink/[0.03]">
                    {stream.embedUrl ? (
                      <iframe
                        src={stream.embedUrl}
                        title={stream.name}
                        allowFullScreen
                        className="size-full"
                      />
                    ) : (
                      <Slot>Stream slot</Slot>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-extrabold text-ink">{stream.name}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{stream.who}</p>
                    {stream.pageUrl && (
                      <a
                        href={stream.pageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-extrabold text-teal transition-colors hover:text-teal-bright"
                      >
                        Open channel <ExternalLink className="size-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Run of show ---------------------------------------------------- */}
          <div className="mb-16">
            <SectionHeading icon={CalendarClock} label="What's on" title="Run of show" />
            <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[var(--shadow-soft)]">
              {RUN_OF_SHOW.map((row, i) => (
                <div
                  key={`${row.time}-${row.title}`}
                  className={`grid gap-1 px-6 py-4 sm:grid-cols-12 sm:items-baseline sm:gap-4 ${
                    i > 0 ? "border-t border-line" : ""
                  }`}
                >
                  <p className="font-display text-sm font-extrabold text-magenta sm:col-span-3">
                    {row.time}
                  </p>
                  <div className="sm:col-span-9">
                    <h3 className="font-display text-base font-extrabold text-ink">{row.title}</h3>
                    <p className="text-sm text-ink-soft">{row.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incentives ----------------------------------------------------- */}
          <div className="mb-16">
            <SectionHeading icon={Gift} label="Chip in" title="Goals & incentives" />
            <div className="grid gap-4 sm:grid-cols-3">
              {INCENTIVES.map((row, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-line bg-paper p-6 text-center shadow-[var(--shadow-soft)]"
                >
                  <p className="font-display text-3xl font-extrabold text-teal">{row.amount}</p>
                  <p className="mt-2 text-sm text-ink-soft">{row.what}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <a
                href={DONATE_URL}
                className="inline-block rounded-full bg-orange px-7 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-[var(--shadow-soft)] transition-all hover:brightness-110"
              >
                Donate Now
              </a>
            </div>
          </div>

          {/* Quick links ---------------------------------------------------- */}
          <div>
            <SectionHeading icon={Radio} label="Elsewhere" title="Quick links" />
            <div className="grid gap-3 sm:grid-cols-2">
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-6 py-4 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5"
                >
                  <span className="font-display text-base font-extrabold text-ink">
                    {link.label}
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-teal transition-transform group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
