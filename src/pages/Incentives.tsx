// Game Day donation incentives — the one page to send people when they ask
// "what do I get for signing up?". Shared by text and email, so it has to
// stand on its own: every incentive, its threshold, and where to go next.
//
// The copy mirrors the incentives in the Sep 2026 "Sign Up" email and the Oct
// 2026 "Sign Up Today" email (email/archive/, email/). When the incentives
// change in a future email, change them here in the same breath. The Game Week
// drawing has its own section component, shared with the home page.

import { ArrowLeft, ArrowRight, Check, Megaphone, Radio, Trophy, UserPlus, Utensils } from "lucide-react";

import { DiscordIcon } from "@/components/site/DiscordIcon";
import { GameWeekDrawing } from "@/components/site/GameWeekDrawing";
import { useGameday } from "@/hooks/use-countdown";
import { getRsvpEvent } from "@/lib/rsvpEvents";

const HOME = import.meta.env.BASE_URL;

// Game Day's bounds come from the marathon's RSVP entry, so the date is written
// down once. The fallbacks only matter if that event is ever renamed away.
const MARATHON = getRsvpEvent("marathon")?.calendar;
const GAME_DAY_START = MARATHON?.start ?? "2026-11-14T08:00:00-06:00";
const GAME_DAY_END = MARATHON?.end ?? "2026-11-15T08:00:00-06:00";

const DONATE_URL = "https://www.extra-life.org/team/73600";

/** Donations the leadership team adds to a participant's page. */
const TEAM_DONATIONS = [
  {
    amount: "$75",
    title: "Show up for Game Day",
    icon: Trophy,
    accent: "text-teal",
    soft: "bg-teal-soft",
    steps: ["RSVP for Game Day", "Raise $25 by kickoff (Nov 14, 8 AM)", "Show up to the event!"],
    cta: { label: "RSVP for Game Day", href: `${HOME}rsvp/marathon`, className: "bg-teal hover:bg-teal-bright" },
  },
  {
    amount: "$25",
    title: "Recruit a teammate",
    icon: UserPlus,
    accent: "text-orange",
    soft: "bg-orange-soft",
    steps: ["Get someone to join the Extra Life Nerds team"],
    cta: { label: "Join the team", href: `${HOME}registration`, className: "bg-orange hover:brightness-110" },
  },
] as const;

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/elnerdsmn/", external: true },
  { label: "Facebook", href: "https://www.facebook.com/extralifenerds/", external: true },
  { label: "Discord", href: "https://discord.gg/fg2FMBXwub", external: true },
  { label: "Newsletter", href: `${HOME}newsletter`, external: false },
];

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

          <div className="mb-8">
            <Eyebrow className="text-teal">Earn Donations</Eyebrow>
            <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
              Donations from us, just for joining in
            </h2>
            <p className="mt-2 max-w-2xl text-ink-soft">
              Whether you&rsquo;re just getting started or your campaign is already flying, here&rsquo;s
              what we&rsquo;ll add to your page:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TEAM_DONATIONS.map((d) => (
              <div
                key={d.title}
                className="flex flex-col rounded-3xl border border-line bg-paper p-8 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className={`font-display text-5xl font-extrabold tabular-nums ${d.accent}`}>{d.amount}</p>
                  <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${d.soft} ${d.accent}`}>
                    <d.icon className="size-6" />
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-extrabold text-ink">{d.title}</h3>
                <ul className="mt-5 space-y-3">
                  {d.steps.map((step) => (
                    <li key={step} className="flex gap-3 text-sm text-ink-soft sm:text-base">
                      <Check className={`mt-0.5 size-5 shrink-0 ${d.accent}`} />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <a
                    href={d.cta.href}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-center text-sm font-extrabold uppercase tracking-wider text-white transition-all ${d.cta.className}`}
                  >
                    {d.cta.label}
                    <ArrowRight className="size-4" />
                  </a>
                </div>
              </div>
            ))}

            <div className="flex flex-col rounded-3xl border border-line bg-paper p-8 shadow-[var(--shadow-soft)]">
              <div className="flex items-start justify-between gap-4">
                <p className="font-display text-5xl font-extrabold tabular-nums text-purple">$5</p>
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-magenta-soft text-purple">
                  <Megaphone className="size-6" />
                </span>
              </div>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-ink-soft">each · up to $20</p>
              <h3 className="mt-3 font-display text-xl font-extrabold text-ink">Grow our socials</h3>
              <p className="mt-5 text-sm text-ink-soft sm:text-base">
                Get someone to follow us on Instagram or Facebook, join our Discord, or sign up for our
                newsletter. If they do all 4, $20 is coming your way!
              </p>
              <div className="mt-8 grid grid-cols-2 gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.external ? "_blank" : undefined}
                    rel={s.external ? "noreferrer" : undefined}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-purple/30 px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-purple transition-all hover:border-purple hover:bg-purple hover:text-white"
                  >
                    {s.label === "Discord" && <DiscordIcon className="size-3.5" />}
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gillette's Game Week drawing — its own section, shared with Home ── */}
      <GameWeekDrawing variant="page" />

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
