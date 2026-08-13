import { useEffect, useState } from "react";

/** Which side of Game Day we're on. Drives the whole hero countdown card. */
export type GamedayPhase = "before" | "live" | "after";

export interface Gameday {
  phase: GamedayPhase;
  /** Time until the phase's target — the start while "before", the finish
   *  while "live". Zeroed once we're "after". */
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Hours *not* wrapped at 24, for the live countdown — the marathon runs a
   *  full 24 hours, and `hours % 24` would read 0 at the moment it starts. */
  totalHours: number;
  /** False until the first client tick, so the card can hold its shape instead
   *  of flashing a wrong value. */
  ready: boolean;
}

const ZERO: Gameday = {
  phase: "before",
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  totalHours: 0,
  ready: false,
};

function compute(startMs: number, endMs: number, now: number): Gameday {
  const phase: GamedayPhase = now < startMs ? "before" : now < endMs ? "live" : "after";
  const target = phase === "before" ? startMs : endMs;
  const diff = phase === "after" ? 0 : Math.max(0, target - now);

  return {
    phase,
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    totalHours: Math.floor(diff / 3_600_000),
    ready: true,
  };
}

/**
 * Ticks once a second and reports both the phase of Game Day and the time left
 * in it: counting down to the start beforehand, counting down the 24 hours of
 * the marathon itself while it runs, and finishing at "after" once it's over.
 *
 * Both bounds are ISO 8601 strings *with a timezone offset*, sourced from the
 * marathon's `calendar` entry in rsvpEvents.ts so the date lives in one place.
 */
export function useGameday(startIso: string, endIso: string): Gameday {
  // Always start neutral so the first paint can't show a stale value.
  const [state, setState] = useState<Gameday>(ZERO);

  useEffect(() => {
    const startMs = new Date(startIso).getTime();
    const endMs = new Date(endIso).getTime();

    const tick = () => setState(compute(startMs, endMs, Date.now()));
    tick();

    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [startIso, endIso]);

  return state;
}
