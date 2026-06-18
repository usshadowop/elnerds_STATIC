import { useEffect, useState } from "react";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  ready: boolean;
}

const ZERO: Countdown = { days: 0, hours: 0, minutes: 0, seconds: 0, ready: false };

function compute(target: number): Countdown {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    ready: true,
  };
}

export function useCountdown(targetIso: string): Countdown {
  // Always start at zero on both server and client to avoid hydration mismatch.
  const [state, setState] = useState<Countdown>(ZERO);

  useEffect(() => {
    const target = new Date(targetIso).getTime();
    setState(compute(target));
    const id = window.setInterval(() => setState(compute(target)), 1000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  return state;
}
