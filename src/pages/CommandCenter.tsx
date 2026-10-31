// Gameday Command Center — the one page to sit on during the 24-hour marathon:
// where to watch, what's happening right now, and how to chip in.
//
// The contents — streams, run of show, milestones, banner — are edited in the
// RSVP spreadsheet's "Gameday *" tabs and re-read every minute, so they can be
// changed mid-marathon without a deploy. See src/lib/gamedayContent.ts; the
// copy that ships with the site is the fallback when that read fails.

import { Radio, Video, CalendarClock, Gift, ArrowRight, ExternalLink, Handshake, MapPin, Navigation, Play } from "lucide-react";

import improvingLogo from "@/assets/logos/sponsors/improving.svg";
import papaJohnsLogo from "@/assets/logos/sponsors/papa-johns.svg";
import tacoBellLogo from "@/assets/logos/sponsors/taco-bell.svg";
import gilletteLogo from "@/assets/logos/sponsors/gillette-childrens.svg";
import stillPc from "@/assets/carousel/event-5.jpg";
import stillCrowd from "@/assets/carousel/event-3.jpg";
import stillVr from "@/assets/carousel/event-4.jpg";

// Stand-in stills for stream slots that have no embed yet, so the page reads
// as a demo rather than a row of empty boxes. A real Embed URL replaces one.
const SAMPLE_STILLS = [stillPc, stillCrowd, stillVr];

import { ResponsiveGamedaySchedule } from "@/components/site/GamedayAgenda";
import { useGameday } from "@/hooks/use-countdown";
import { useGamedayContent } from "@/hooks/use-gameday-content";
import { getRsvpEvent } from "@/lib/rsvpEvents";

const MARATHON_EVENT = getRsvpEvent("marathon");
const MARATHON = MARATHON_EVENT?.calendar;
const GAME_DAY_START = MARATHON?.start ?? "2026-11-14T08:00:00-06:00";
const GAME_DAY_END = MARATHON?.end ?? "2026-11-15T08:00:00-06:00";

// The venue line is the marathon's RSVP location, so it's written down once.
// Directions use the dir/ form so the route starts from the visitor.
const VENUE = MARATHON_EVENT?.location ?? "Improving, 3033 Excelsior Blvd #180, Minneapolis, MN 55416";
const [VENUE_NAME, ...VENUE_REST] = VENUE.split(", ");
const VENUE_ADDRESS = VENUE_REST.join(", ");
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(VENUE)}`;

const HOME = import.meta.env.BASE_URL;

const DONATE_URL = "https://www.extra-life.org/team/73600";

// The sponsors who make Game Day happen. Each goes to the sponsor's own site.
const SPONSOR_LINKS: { label: string; note: string; href: string; logo: string; logoClass: string }[] = [
  { label: "Improving", note: "Our Game Day venue", href: "https://www.improving.com/", logo: improvingLogo, logoClass: "h-10" },
  { label: "Papa Johns Eden Prairie", note: "Pizza", href: "https://www.papajohns.com/", logo: papaJohnsLogo, logoClass: "h-12" },
  { label: "Random Taco Company", note: "Tacos", href: "https://www.tacobell.com/", logo: tacoBellLogo, logoClass: "h-14" },
  { label: "Gillette Children’s", note: "Where every dollar goes", href: "https://www.gillettechildrens.org/", logo: gilletteLogo, logoClass: "h-12" },
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
    <span className="inline-block rounded-full border border-dashed border-white/70 bg-ink/50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur">
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
  const { content, settled } = useGamedayContent();
  const { streams, runOfShow, incentives, notice } = content;

  return (
    <main>
      <section className="bg-cream px-4 pt-10 pb-20 sm:px-6 sm:pt-12 sm:pb-24">
        <div className="mx-auto max-w-6xl">

          <div className="mb-6 text-center">
            <h1 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-5xl">
              Game Day is Live
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base font-bold text-ink-soft sm:text-lg">
              Come visit, play games, win prizes, have fun, help the kids!
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

          {/* Come visit ----------------------------------------------------- */}
          <div className="mb-10 flex flex-col items-start gap-4 rounded-2xl border border-line bg-paper p-5 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-teal-soft text-teal">
                <MapPin className="size-6" />
              </span>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal">Come visit</p>
                <p className="font-display text-lg font-extrabold text-ink">{VENUE_NAME}</p>
                <p className="text-sm text-ink-soft">{VENUE_ADDRESS}</p>
              </div>
            </div>
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-teal px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-white shadow-[var(--shadow-soft)] transition-all hover:bg-teal-bright"
            >
              <Navigation className="size-4" />
              Click for directions
            </a>
          </div>

          {/* Watch ---------------------------------------------------------- */}
          <div className="mb-16">
            <SectionHeading icon={Video} label="Watch" title="Live streams" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {streams.map((stream, i) => (
                <div
                  key={stream.name}
                  className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[var(--shadow-soft)]"
                >
                  <div className="relative flex aspect-video items-center justify-center border-b border-line bg-ink/[0.03]">
                    {stream.embedUrl ? (
                      <iframe
                        src={stream.embedUrl}
                        title={stream.name}
                        allowFullScreen
                        className="size-full"
                      />
                    ) : (
                      <>
                        <img
                          src={SAMPLE_STILLS[i % SAMPLE_STILLS.length]}
                          alt=""
                          aria-hidden
                          className="size-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                          <span className="inline-block size-1.5 animate-pulse rounded-full bg-white" />
                          Live
                        </span>
                        <span className="absolute right-3 top-3">
                          <Slot>Sample</Slot>
                        </span>
                        <span className="absolute grid size-14 place-items-center rounded-full bg-white/90 text-ink shadow-[var(--shadow-lift)]">
                          <Play className="ml-1 size-6" />
                        </span>
                      </>
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
            <SectionHeading icon={CalendarClock} label="What's on" title="Schedule" />
            {!settled ? (
              <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-line text-sm font-semibold text-ink-soft">
                Loading the schedule&hellip;
              </div>
            ) : (
              <ResponsiveGamedaySchedule
                rows={runOfShow}
                startMs={Date.parse(GAME_DAY_START)}
                endMs={Date.parse(GAME_DAY_END)}
              />
            )}
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

          {/* Sponsor links -------------------------------------------------- */}
          <div>
            <SectionHeading icon={Handshake} label="Thank you" title="Links to our sponsors!" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SPONSOR_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="flex h-28 items-center justify-center border-b border-line bg-white px-6">
                    <img
                      src={link.logo}
                      alt={`${link.label} logo`}
                      className={`w-auto max-w-full object-contain transition-transform group-hover:scale-105 ${link.logoClass}`}
                    />
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-3 px-5 py-4">
                    <span>
                      <span className="block font-display text-base font-extrabold text-ink">{link.label}</span>
                      <span className="block text-xs font-bold uppercase tracking-widest text-ink-soft">{link.note}</span>
                    </span>
                    <ExternalLink className="size-4 shrink-0 text-teal transition-transform group-hover:translate-x-0.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
