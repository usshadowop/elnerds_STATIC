// Gillette's Game Week swag drawing — a Game Day incentive with its own section
// on the home page (after Events) and on /incentives, so the numbers live in
// exactly one place.
//
// The details came from Grant Gray's Oct 2 email, by way of the Oct 2026
// "Sign Up Today" campaign in email/. When the drawing changes, change it here.

import { ArrowRight, Gift, Sparkles } from "lucide-react";

import { useGameday } from "@/hooks/use-countdown";
import { getRsvpEvent } from "@/lib/rsvpEvents";

const HOME = import.meta.env.BASE_URL;

// Game Day's bounds come from the marathon's RSVP entry, so the date is written
// down once. The fallbacks only matter if that event is ever renamed away.
const MARATHON = getRsvpEvent("marathon")?.calendar;
const GAME_DAY_START = MARATHON?.start ?? "2026-11-14T08:00:00-06:00";
const GAME_DAY_END = MARATHON?.end ?? "2026-11-15T08:00:00-06:00";

const TIERS = [
  { raised: "$100", entries: "1 entry" },
  { raised: "$350", entries: "2 entries" },
  { raised: "$600", entries: "3 entries" },
];

const SWAG = [
  "An Extra Life neon sign",
  "A sling bag",
  "An Extra Life keyboard or Switch controller",
  "A Chromatic gaming system with Tetris",
  "…and more",
];

/**
 * `home` (the default) is the home-page section: it links out to /incentives
 * and drops off the page once the marathon is over, like the hero's pills.
 * `page` is the copy on /incentives itself: no self-link, and it stays up after
 * Game Day as the record, under that page's "has wrapped" banner.
 */
export function GameWeekDrawing({ variant = "home" }: { variant?: "home" | "page" }) {
  const { phase } = useGameday(GAME_DAY_START, GAME_DAY_END);
  if (variant === "home" && phase === "after") return null;

  return (
    <section id="game-week" className="bg-paper px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-purple to-magenta text-white shadow-[var(--shadow-lift)]">
          <div className="grid gap-10 p-8 sm:p-12 md:grid-cols-[1.2fr_1fr] md:gap-14">
            <div>
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-white/70">
                Game Week Drawing · Nov 14
              </p>
              <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
                Raise $100, get in Gillette&rsquo;s Game Week drawing
              </h2>
              <p className="mt-4 max-w-xl text-white/85 sm:text-lg">
                Every Extra Lifer who raises $100 for Gillette Children&rsquo;s is entered to win the
                Ultimate Extra Life Swag Package. The drawing happens on November 14, and every extra
                $250 you raise earns another entry.
              </p>

              <ul className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                {TIERS.map((t) => (
                  <li key={t.raised} className="rounded-2xl bg-white/10 px-3 py-3 ring-1 ring-white/20 sm:px-4">
                    <p className="font-display text-xl font-extrabold tabular-nums sm:text-2xl">{t.raised}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 sm:text-xs">
                      {t.entries}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs font-bold text-white/70">…and one more entry for every extra $250.</p>

              {variant === "home" && (
                <a
                  href={`${HOME}incentives`}
                  className="group mt-8 inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition-all hover:bg-white/10"
                >
                  All Game Day incentives
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
              )}
            </div>

            <div className="rounded-2xl bg-white p-6 text-ink shadow-[var(--shadow-soft)] sm:p-8 md:self-center">
              <p className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
                <Gift className="size-4" />
                In the package
              </p>
              <h3 className="mt-2 font-display text-xl font-extrabold text-ink">
                Ultimate Extra Life Swag Package
              </h3>
              <ul className="mt-4 space-y-2.5">
                {SWAG.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-ink-soft sm:text-base">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-magenta" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
