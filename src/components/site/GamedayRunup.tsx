// The Gameday Week Runup homepage's own sections (src/pages/homeTemplates/
// GamedayWeekRunup.tsx), carrying the Game Day email's details up front: what
// to bring, parking and the way in, prize drawings and silent auctions,
// donation tokens and where to watch, plus Why We Play cut down to Victoria's
// story.
//
// The prize facts come from src/lib/prizes.ts (shared with /prizes). The
// parking steps and the "what to bring" line repeat /parking and the email
// (email/elnerds-gameday-parking-prizes.html) by hand: change them together.

import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  CircleCheck,
  Clock,
  Coins,
  Dices,
  Gavel,
  Gift,
  MapPin,
  Navigation,
  Repeat,
  Ticket,
  Video,
} from "lucide-react";

import { DonationChipsSection } from "@/components/site/DonationChips";
import { VictoriaStoryReveal } from "@/components/site/WhyWePlay";
import { AUCTION_ITEMS, DRAWING_TIMES, LEVEL_UP_URL, SPOTTED } from "@/lib/prizes";
import { getRsvpEvent } from "@/lib/rsvpEvents";
import { sponsorLogos } from "@/lib/sponsorLogos";

const BASE = import.meta.env.BASE_URL;

// The venue line is the marathon's RSVP location, so it's written down once.
const VENUE = getRsvpEvent("marathon")?.location ?? "Improving, 3033 Excelsior Blvd #180, Minneapolis, MN 55416";
const [VENUE_NAME, ...VENUE_REST] = VENUE.split(", ");
const VENUE_ADDRESS = VENUE_REST.join(", ");
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(VENUE)}`;

// Class strings spelled out in full: Tailwind can't see names built at runtime.
const TONES = {
  teal: "bg-teal-soft text-teal",
  magenta: "bg-magenta-soft text-magenta",
  gold: "bg-gold-soft text-gold",
  purple: "bg-[#f3ecf7] text-purple",
  orange: "bg-orange-soft text-orange",
  blue: "bg-blue/10 text-blue",
} as const;

function SectionHead({ eyebrow, title, className, children }: { eyebrow: string; title: string; className: string; children?: ReactNode }) {
  return (
    <div className="mb-8 text-center">
      <p className={`mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] ${className}`}>{eyebrow}</p>
      <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h2>
      {children && <p className="mx-auto mt-3 max-w-2xl text-base text-ink-soft sm:text-lg">{children}</p>}
    </div>
  );
}

function Pill({ href, children, className, external }: { href: string; children: ReactNode; className: string; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold uppercase tracking-wider transition-all ${className}`}
    >
      {children}
    </a>
  );
}

// ── Essentials: one card per thing people ask about on Game Day ───────────────

const ESSENTIALS: { href: string; icon: typeof MapPin; title: string; text: string; cta: string; tone: keyof typeof TONES }[] = [
  {
    href: `${BASE}parking`,
    icon: MapPin,
    title: "Parking & the way in",
    text: "Park in the lot off Excelsior Blvd, then follow our arrows up to suite 180.",
    cta: "Map and photos",
    tone: "teal",
  },
  {
    href: `${BASE}prizes`,
    icon: Ticket,
    title: "Prize drawings",
    text: "9 drawings from 10 AM to 10 PM. $1 tickets, and you must be present to win.",
    cta: "Times and prizes",
    tone: "magenta",
  },
  {
    href: `${BASE}prizes`,
    icon: Gavel,
    title: "Silent auctions",
    text: "All event long, and you don't need to be there to win. Headlined by a signed Avengers poster.",
    cta: "What's up for bid",
    tone: "teal",
  },
  {
    href: `${BASE}prizes#donation-tokens`,
    icon: Coins,
    title: "Donation tokens",
    text: "Poker chips worth $10, $25 or $50, to give to any Extra Life page or use to enter an event.",
    cta: "How they work",
    tone: "gold",
  },
  {
    href: `${BASE}gameday`,
    icon: Video,
    title: "Watch the streams",
    text: "Streams and the live schedule, all day on the Game Day page.",
    cta: "Game Day page",
    tone: "magenta",
  },
  {
    href: `${BASE}leadership_DandD`,
    icon: Dices,
    title: "Leadership D&D one-shot",
    text: "Streaming Saturday night: the stream goes live at 9:30 PM and the game starts at 10 PM.",
    cta: "Watch it",
    tone: "purple",
  },
  {
    href: `${BASE}gameday_events`,
    icon: CalendarCheck,
    title: "Event sign-ups",
    text: "Tournaments, D&D tables and more. Every entrant gets a free drawing ticket.",
    cta: "Sign up",
    tone: "orange",
  },
  {
    href: `${BASE}#gameday-schedule`,
    icon: CalendarClock,
    title: "Game Day schedule",
    text: "The run of show for all 24 hours, with event details.",
    cta: "See the schedule",
    tone: "blue",
  },
];

export function GamedayEssentials() {
  return (
    <section id="gameday-essentials" className="scroll-mt-20 bg-paper px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="Game Day essentials" title="Everything you need for Game Day" className="text-magenta" />

        <div className="mx-auto mb-8 max-w-3xl rounded-2xl border-2 border-dashed border-orange bg-orange-soft px-5 py-4 text-center">
          <p className="text-sm font-bold text-ink sm:text-base">
            <span className="font-extrabold text-orange">Monitors are provided,</span> but remember to bring your rig,
            keyboard, mouse and all your cables, including an HDMI or DisplayPort cable.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {ESSENTIALS.map((e) => (
            <a
              key={e.title}
              href={e.href}
              className="group flex flex-col rounded-2xl border border-line bg-cream p-4 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] sm:p-5"
            >
              <span className={`grid size-11 place-items-center rounded-full ${TONES[e.tone]}`}>
                <e.icon className="size-5" />
              </span>
              <span className="mt-3 font-display text-base font-extrabold leading-snug text-ink sm:mt-4 sm:text-lg">{e.title}</span>
              {/* On a phone the cards go two across, so the description waits for more room. */}
              <span className="mt-1 hidden text-sm text-ink-soft sm:block">{e.text}</span>
              <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[10px] font-extrabold uppercase tracking-widest text-teal sm:pt-4 sm:text-xs">
                {e.cta}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Getting here ─────────────────────────────────────────────────────────────

const WAY_IN = [
  "Head for the covered Lakeside Center entrance.",
  "Just inside, find our Game Day arrows on the directory.",
  "Walk down the hallway and take the stairs up one level, or the elevators around the corner to the left.",
  "Improving is suite 180 on the first floor.",
];

export function GamedayGettingHere() {
  return (
    <section id="getting-here" className="scroll-mt-20 bg-teal-soft px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="Getting here" title="Park in the lot off Excelsior Blvd" className="text-teal">
          {VENUE_NAME} is inside Lakeside Center, {VENUE_ADDRESS}.
        </SectionHead>

        <div className="grid items-start gap-8 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <a
              href={`${BASE}photos/parking/parking-map.jpg`}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded-2xl border border-line bg-paper shadow-[var(--shadow-soft)]"
            >
              <img
                src={`${BASE}photos/parking/parking-map.jpg`}
                alt="Parking map: a red route from the east along W Lake St and blue routes from the west on W Lake St and from the south on Excelsior Blvd, all ending in the lot beside Improving, off Excelsior Blvd"
                width={1185}
                height={702}
                loading="lazy"
                className="block h-auto w-full"
              />
            </a>
            <ul className="mt-4 space-y-2 text-sm text-ink sm:text-base">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-8 shrink-0 rounded-full bg-[#e8261f]" aria-hidden />
                <span>
                  <strong>Red:</strong> coming from the east on W Lake St
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-8 shrink-0 rounded-full bg-[#2563eb]" aria-hidden />
                <span>
                  <strong>Blue:</strong> coming from the west on W Lake St, or the south on Excelsior Blvd
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-6 shadow-[var(--shadow-soft)]">
            <p className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal">The way in</p>
            <ol className="space-y-3">
              {WAY_IN.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-teal font-display text-sm font-extrabold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-sm text-ink sm:text-base">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <Pill href={`${BASE}parking`} className="bg-teal text-white shadow-[var(--shadow-soft)] hover:bg-teal-bright">
                Photos of the way in
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Pill>
              <Pill href={DIRECTIONS_URL} external className="border-2 border-teal bg-paper text-teal hover:bg-teal-soft">
                <Navigation className="size-4" />
                Directions
              </Pill>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Prize drawings and silent auctions ───────────────────────────────────────

function Rule({ icon: Icon, tone, children }: { icon: typeof Ticket; tone: string; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ${tone}`}>
        <Icon className="size-3.5" />
      </span>
      <span className="text-sm text-ink sm:text-base">{children}</span>
    </li>
  );
}

export function GamedayPrizesSummary() {
  return (
    <section id="prizes" className="scroll-mt-20 bg-paper px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="Win while you play" title="Prize drawings & silent auctions" className="text-magenta">
          The prize tables are set up and waiting, and every ticket and bid helps the kids.
        </SectionHead>

        <div className="grid items-start gap-6 md:grid-cols-2">
          {/* Drawings */}
          <div className="rounded-3xl border border-line bg-cream p-6 shadow-[var(--shadow-soft)] sm:p-7">
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">Prize drawings</p>
            <h3 className="font-display text-2xl font-extrabold text-ink">9 drawings, 10 AM to 10 PM</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {DRAWING_TIMES.map((t) => (
                <span key={t} className="rounded-full bg-magenta-soft px-2.5 py-0.5 text-xs font-extrabold whitespace-nowrap text-magenta">
                  {t}
                </span>
              ))}
            </div>
            <ul className="mt-5 space-y-3">
              <Rule icon={Ticket} tone={TONES.magenta}>
                <strong>$1 per ticket.</strong>
              </Rule>
              <Rule icon={Repeat} tone={TONES.magenta}>
                Multiple prizes in every drawing, and every ticket you enter can win in any of them.
              </Rule>
              <Rule icon={Coins} tone={TONES.magenta}>
                <strong>Every raffle prize comes with a $10 donation token.</strong>
              </Rule>
              <Rule icon={Gift} tone={TONES.magenta}>
                <strong>Free tickets:</strong> enter any Game Day event and get 1. Event winners get 5 more.
              </Rule>
              <Rule icon={MapPin} tone={TONES.magenta}>
                <strong>You must be present to win.</strong>
              </Rule>
            </ul>
            <div className="mt-5 rounded-2xl bg-paper p-4">
              <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">Up for grabs</p>
              <p className="text-sm text-ink-soft">
                {SPOTTED.join(", ")}, Extra Life 1000-piece puzzles, a dice tray, Squishmallows and more plush, and $25 gift
                certificates to Source Comics &amp; Games.
              </p>
            </div>
          </div>

          {/* Silent auctions */}
          <div className="rounded-3xl border border-line bg-cream p-6 shadow-[var(--shadow-soft)] sm:p-7">
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal">Silent auctions</p>
            <h3 className="font-display text-2xl font-extrabold text-ink">All event long</h3>
            <ul className="mt-5 space-y-3">
              <Rule icon={Clock} tone={TONES.teal}>
                Running through the entire event, 8 AM Saturday to 8 AM Sunday.
              </Rule>
              <Rule icon={CircleCheck} tone={TONES.teal}>
                <strong>You don&rsquo;t need to be present to win.</strong>
              </Rule>
            </ul>
            <div className="mt-5 rounded-2xl bg-paper p-4">
              <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal">Up for bid</p>
              <ul className="space-y-1 text-sm text-ink-soft">
                {AUCTION_ITEMS.map((g) => (
                  <li key={g.group}>
                    <span className="font-bold text-ink">{g.group}:</span> {g.items.join("; ")}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={`${BASE}prizes`}
              className="mt-5 flex items-center gap-4 overflow-hidden rounded-2xl border border-line bg-paper transition-shadow hover:shadow-[var(--shadow-soft)]"
            >
              <img
                src={`${BASE}photos/prizes/avengers-signed-poster.jpg`}
                alt="A framed The Avengers movie poster signed by the cast"
                loading="lazy"
                className="aspect-square w-28 shrink-0 object-cover sm:w-32"
              />
              <span className="py-3 pr-4">
                <span className="block text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal">The big one</span>
                <span className="block font-display text-base font-extrabold leading-snug text-ink">
                  A signed <em>The Avengers</em> poster
                </span>
                <span className="block text-xs text-ink-soft">With a certificate of authenticity. Donated by Level Up Games.</span>
              </span>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Pill href={`${BASE}prizes`} className="bg-magenta text-white shadow-[var(--shadow-soft)] hover:opacity-90">
            See all prize details
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Pill>
          <a
            href={LEVEL_UP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-ink-soft hover:text-teal"
          >
            <img src={sponsorLogos.levelUp} alt="" className="h-6 w-auto" />
            Thanks, Level Up Games
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Donation tokens ──────────────────────────────────────────────────────────

export function GamedayTokens() {
  return (
    <div className="bg-cream px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <DonationChipsSection className="" />
      </div>
    </div>
  );
}

// ── Watch ────────────────────────────────────────────────────────────────────

export function GamedayWatch() {
  return (
    <section id="watch" className="scroll-mt-20 bg-paper px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHead eyebrow="Watch from anywhere" title="Watch all day long" className="text-magenta">
          Every stream and the live schedule are on the Game Day page all day. And don&rsquo;t miss the leadership
          team&rsquo;s D&amp;D one-shot Saturday night: the stream goes live at 9:30 PM and the game starts at 10 PM.
        </SectionHead>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Pill href={`${BASE}gameday`} className="bg-magenta text-white shadow-[var(--shadow-soft)] hover:opacity-90">
            <Video className="size-4" />
            Watch the streams
          </Pill>
          <Pill href={`${BASE}leadership_DandD`} className="border-2 border-purple bg-paper text-purple hover:bg-[#f3ecf7]">
            <Dices className="size-4" />
            Leadership D&amp;D game
          </Pill>
        </div>
        <p className="mt-8 text-sm text-ink-soft sm:text-base">
          Can&rsquo;t make it in person? Every donation to the team still helps the kids at Gillette Children&rsquo;s
          Hospital.{" "}
          <a
            href="https://www.extra-life.org/team/73600"
            className="font-bold text-orange underline underline-offset-2 hover:brightness-110"
          >
            Donate to the team
          </a>
        </p>
      </div>
    </section>
  );
}

// ── Why we play, cut down to Victoria's story ────────────────────────────────

export function GamedayStory() {
  return (
    <section id="story" className="scroll-mt-20 bg-paper px-4 py-12 sm:px-6 sm:py-14">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">Why we play</p>
        <VictoriaStoryReveal className="" />
      </div>
    </section>
  );
}
