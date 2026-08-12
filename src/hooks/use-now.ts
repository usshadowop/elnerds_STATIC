import { useEffect, useState } from "react";

/**
 * A "now" timestamp that re-renders on an interval, so anything derived from
 * the clock (an event archiving itself, an RSVP form closing) updates on a page
 * that's been left open instead of waiting for a reload.
 *
 * The default minute tick is plenty — everything built on this switches at
 * event boundaries, not second by second.
 */
export function useNow(intervalMs = 60_000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
