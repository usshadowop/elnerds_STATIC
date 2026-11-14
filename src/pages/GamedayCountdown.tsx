// /gameday before kickoff: a single big countdown. The Command Center that
// used to live here is at /gameday_holding until Game Day, and /gameday hands
// over to it on its own once the marathon starts (see App.tsx).

import { useGameday } from "@/hooks/use-countdown";
import { getRsvpEvent } from "@/lib/rsvpEvents";

const MARATHON = getRsvpEvent("marathon")?.calendar;
const GAME_DAY_START = MARATHON?.start ?? "2026-11-14T08:00:00-06:00";
const GAME_DAY_END = MARATHON?.end ?? "2026-11-15T08:00:00-06:00";

function Unit({ value, label, accent }: { value: number; label: string; accent: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center">
      <span
        className={`inline-block min-w-[2ch] text-center font-display text-6xl font-extrabold tabular-nums sm:text-8xl lg:text-9xl ${accent}`}
      >
        {value.toString().padStart(2, "0")}
      </span>
      <span className="mt-2 text-xs font-bold uppercase tracking-widest text-ink-soft sm:text-sm">{label}</span>
    </div>
  );
}

export function GamedayCountdown() {
  const c = useGameday(GAME_DAY_START, GAME_DAY_END);

  return (
    <main>
      <section className="flex min-h-[70vh] items-center bg-cream px-4 py-16 sm:px-6">
        <div className="mx-auto w-full max-w-5xl text-center">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.3em] text-magenta sm:text-sm">
            Game Day Command Center
          </p>
          <h1 className="mb-10 font-display text-4xl font-extrabold uppercase leading-tight text-ink sm:text-6xl">
            Goes live on <span className="text-magenta">Game Day</span>
          </h1>
          <div
            role="timer"
            aria-label="Countdown to Game Day"
            className="grid grid-cols-4 items-center gap-2 sm:gap-6"
          >
            <Unit value={c.days} label="Days" accent="text-teal" />
            <Unit value={c.hours} label="Hours" accent="text-magenta" />
            <Unit value={c.minutes} label="Mins" accent="text-purple" />
            <Unit value={c.seconds} label="Secs" accent="text-orange" />
          </div>
          <p className="mt-10 text-base font-semibold text-ink-soft sm:text-lg">
            Saturday, November 14 · 8 AM at Improving, Minneapolis
          </p>
          <a
            href={`${import.meta.env.BASE_URL}parking`}
            className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-teal px-5 py-2.5 text-sm font-extrabold uppercase tracking-wider text-teal transition-all hover:bg-teal-soft"
          >
            Where to park &amp; how to get in
          </a>
        </div>
      </section>
    </main>
  );
}
