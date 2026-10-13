// Game Day donation incentives — the one page to send people when they ask
// "what do I get for signing up?". Shared by text and email, so it has to
// stand on its own: every incentive, its threshold, and where to go next.
//
// The copy mirrors the incentives in the Sep 2026 "Sign Up" email and the Oct
// 2026 "Sign Up Today" email (email/archive/, email/). When the incentives
// change in a future email, change them here in the same breath. The leadership-team
// cards live in TeamIncentives.tsx (shared with the home page); the Game Week
// drawing in GameWeekDrawing.tsx.

import { ArrowLeft, ArrowRight, Radio, Utensils } from "lucide-react";

import { GameWeekDrawing } from "@/components/site/GameWeekDrawing";
import { TeamIncentivesBlock } from "@/components/site/TeamIncentives";
import { useGameday } from "@/hooks/use-countdown";
import { getRsvpEvent } from "@/lib/rsvpEvents";

const HOME = import.meta.env.BASE_URL;

// Game Day's bounds come from the marathon's RSVP entry, so the date is written
// down once. The fallbacks only matter if that event is ever renamed away.
const MARATHON = getRsvpEvent("marathon")?.calendar;
const GAME_DAY_START = MARATHON?.start ?? "2026-11-14T08:00:00-06:00";
const GAME_DAY_END = MARATHON?.end ?? "2026-11-15T08:00:00-06:00";

const DONATE_URL = "https://www.extra-life.org/team/73600";

function Eyebrow({ children, className = "text-magenta" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] ${className}`}>{children}</p>
  );
}

function PhaseBanner({ phase }: { phase: "before" | "live" | "after" }) {
  if (phase === "before") return null;

  if (phase === "live") {
    return (
      <a
        href={`${HOME}gameday`}
        className="mb-10 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-magenta bg-magenta-soft px-5 py-4 text-center transition-all hover:shadow-[var(--shadow-soft)]"
      >
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-magenta opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-magenta" />
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-magenta">
          <Radio className="size-4" />
          Game Day is live right now — open the Command Center
          <ArrowRight className="size-4" />
        </span>
      </a>
    );
  }

  return (
    <div className="mb-10 rounded-2xl border border-line bg-paper px-5 py-4 text-center">
      <p className="text-sm font-bold text-ink-soft">
        Game Day 2026 has wrapped — these incentives were for the 2026 marathon. Thanks to everyone who
        played, donated, and cheered.
      </p>
    </div>
  );
}

export function Incentives() {
  const { phase } = useGameday(GAME_DAY_START, GAME_DAY_END);

  return (
    <main>
      {/* ── Header + donations from the leadership team ─────────────────── */}
      <section className="bg-cream px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <a
            href={HOME}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft transition-colors hover:text-teal"
          >
            <ArrowLeft className="size-4" />
            Back to elnerds.com
          </a>

          <div className="mb-12 text-center">
            <Eyebrow>Game Day 2026 · Nov 14–15</Eyebrow>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-5xl">
              Donation Incentives
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-ink-soft sm:text-lg">
              Sign up, show up and spread the word, and your Extra Life Nerds leadership team will put
              real donations on your fundraising page. Raise a little more and there&rsquo;s food,
              prizes and swag on top. Registration is free, takes a couple of minutes, and you
              don&rsquo;t need to be a hardcore gamer.
            </p>
          </div>

          <PhaseBanner phase={phase} />

          <TeamIncentivesBlock />
        </div>
      </section>

      {/* ── Gillette's Game Week drawing — its own section, shared with Home ── */}
      <GameWeekDrawing />

      {/* ── Food, the Platinum tip, and the closing call ────────────────── */}
      <section className="bg-cream px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <Eyebrow className="text-orange">More to Earn</Eyebrow>
            <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
              Raise a little more and unlock the extras
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-line bg-paper p-8 shadow-[var(--shadow-soft)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">Fuel for the Marathon</p>
                  <p className="mt-1 font-display text-4xl font-extrabold tabular-nums text-orange">$50 raised</p>
                </div>
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-orange-soft text-orange">
                  <Utensils className="size-6" />
                </span>
              </div>
              <h3 className="mt-3 font-display text-xl font-extrabold text-ink">
                Gaming for 24 hours is hungry work
              </h3>
              <p className="mt-4 text-sm text-ink-soft sm:text-base">
                Every participant who raises $50 or more gets access to the food we&rsquo;re providing at
                the event. The donations above give you a head start, and a couple of shares to friends
                and family will get you the rest of the way.
              </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-teal to-purple p-8 text-white shadow-[var(--shadow-soft)]">
              <Eyebrow className="text-white/70">Tip</Eyebrow>
              <h3 className="font-display text-xl font-extrabold sm:text-2xl">Pick Platinum when you register</h3>
              <p className="mt-4 text-sm text-white/85 sm:text-base">
                Platinum participants also unlock Extra Life&rsquo;s own milestone rewards — a decal at
                $75, a T-shirt at $200, and medals and an LED sign higher up.
              </p>
            </div>
          </div>

          <div className="mt-20 text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Ready to play for the kids?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-soft sm:text-lg">
              It just takes a couple of minutes. We can&rsquo;t wait to game with you on November 14.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`${HOME}registration`}
                className="rounded-full bg-teal px-7 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-[var(--shadow-soft)] transition-all hover:bg-teal-bright"
              >
                Register Today
              </a>
              <a
                href={DONATE_URL}
                className="rounded-full bg-orange px-7 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-[var(--shadow-soft)] transition-all hover:brightness-110"
              >
                Donate Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
