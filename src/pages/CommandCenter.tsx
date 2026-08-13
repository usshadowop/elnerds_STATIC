// Gameday Command Center — the one page to sit on during the 24-hour marathon:
// where to watch, what's happening right now, and how to chip in.
//
// The contents — streams, run of show, milestones, banner — are edited in the
// RSVP spreadsheet's "Gameday *" tabs and re-read every minute, so they can be
// changed mid-marathon without a deploy. See src/lib/gamedayContent.ts; the
// copy that ships with the site is the fallback when that read fails.

import { Radio, Video, CalendarClock, Gift, ArrowRight, ExternalLink } from "lucide-react";

import { useGameday } from "@/hooks/use-countdown";
import { useGamedayContent } from "@/hooks/use-gameday-content";
import { getRsvpEvent } from "@/lib/rsvpEvents";

const MARATHON = getRsvpEvent("marathon")?.calendar;
const GAME_DAY_START = MARATHON?.start ?? "2026-11-14T08:00:00-06:00";
const GAME_DAY_END = MARATHON?.end ?? "2026-11-15T08:00:00-06:00";

const HOME = import.meta.env.BASE_URL;

const DONATE_URL = "https://www.extra-life.org/team/73600";

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
  // Streams, run of show, milestones and the banner all come from the sheet,
  // re-read every minute so mid-marathon edits land without a reload.
  const { content } = useGamedayContent();
  const { streams, runOfShow, incentives, notice } = content;

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

          {/* Whatever's typed into the Notice tab, if anything — the fastest
              way to say "we've moved to Mario Kart" at 2am. */}
          {notice && (
            <div className="mb-6 rounded-2xl border-l-4 border-orange bg-orange-soft px-5 py-4">
              <p className="text-sm font-bold text-ink sm:text-base">{notice}</p>
            </div>
          )}

          <StatusBanner phase={phase} />

          {/* Watch ---------------------------------------------------------- */}
          <div className="mb-16">
            <SectionHeading icon={Video} label="Watch" title="Live streams" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {streams.map((stream) => (
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
              {runOfShow.map((row, i) => (
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
              {incentives.map((row, i) => (
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
