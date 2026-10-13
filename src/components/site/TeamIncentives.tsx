// The donations the leadership team adds to a participant's page — the
// incentives that matter most, so they get a section on the home page (after
// Events) as well as the top of /incentives. One component, one set of numbers.
//
// The copy mirrors the Sep and Oct 2026 emails (email/archive/, email/). When
// an email changes the amounts, change them here in the same breath.

import { ArrowRight, Check, Megaphone, Trophy, UserPlus } from "lucide-react";

import { DiscordIcon } from "@/components/site/DiscordIcon";
import { useGameday } from "@/hooks/use-countdown";
import { getRsvpEvent } from "@/lib/rsvpEvents";

const HOME = import.meta.env.BASE_URL;

// Game Day's bounds come from the marathon's RSVP entry, so the date is written
// down once. The fallbacks only matter if that event is ever renamed away.
const MARATHON = getRsvpEvent("marathon")?.calendar;
const GAME_DAY_START = MARATHON?.start ?? "2026-11-14T08:00:00-06:00";
const GAME_DAY_END = MARATHON?.end ?? "2026-11-15T08:00:00-06:00";

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

/** Heading plus the three cards. No section wrapper, so /incentives can place
 *  it under its own header. */
export function TeamIncentivesBlock() {
  return (
    <>
      <div className="mb-8">
        <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal">Earn Donations</p>
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
    </>
  );
}

/** The home-page section: the block above, a link to the full /incentives
 *  page, and gone once the marathon is over, like the hero's pills. */
export function TeamIncentives() {
  const { phase } = useGameday(GAME_DAY_START, GAME_DAY_END);
  if (phase === "after") return null;

  return (
    <section id="incentives" className="bg-paper px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <TeamIncentivesBlock />
        <div className="mt-10 text-center">
          <a
            href={`${HOME}incentives`}
            className="group inline-flex items-center gap-2 rounded-full border-2 border-teal px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-teal transition-all hover:bg-teal hover:text-white"
          >
            All Game Day incentives
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
