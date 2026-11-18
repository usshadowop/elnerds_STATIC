import { useEffect, useState } from "react";

import { parseDonorDriveDate } from "@/lib/donationFormat";

// Running totals of what Extra Life pages have been given since a date, for
// live line items in the Gameday totals module (src/lib/gamedayTotals.ts).
// Either one participant's page (any team: the first was Pam van Muijen's,
// which is on NCC-AL5) or a whole team's, optionally only the gifts entered
// under one display name (the chips and RSVP matches typed onto our team's
// pages, so they come off their typed-in Gameday totals lines).
const BASE_URL = "https://dd.extra-life.org/api";
/** DonorDrive's page size cap. */
const PAGE = 100;
/** Stop after this many pages (10,000 gifts) whatever happens. */
const MAX_PAGES = 100;

export type GiftsSince = (
  | {
      /** The number in the participant's API record, also in their page's HTML. */
      participantId: number;
    }
  | {
      /** Every page on the team (ours is 73600). */
      teamId: number;
    }
) & {
  /** ISO time with an offset, e.g. "2026-11-13T00:00:00-06:00" (Central). */
  since: string;
  /**
   * Count only gifts made under this public display name, e.g. "Poker Chip
   * Donations". Case and spacing are ignored. Anonymous gifts have no name and
   * never match.
   */
  displayName?: string;
};

type Donation = { donationID: string; amount?: number; displayName?: string; createdDateUTC: string };

/** "  Poker  chip donations " and "Poker Chip Donations" are the same name. */
function sameName(a: string | undefined, b: string): boolean {
  const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();
  return typeof a === "string" && norm(a) === norm(b);
}

/**
 * The sum of a participant's (or a team's) gifts at or after `since`, in
 * dollars, only those under `displayName` if one is given.
 *
 * DonorDrive lists donations newest first, and its `offset` counts from 1
 * (offset=1 is the first gift, offset=101 the 101st), for teams as for
 * participants. Paging stops at the first gift older than `since`. Gifts whose
 * donor hid the amount have no `amount` and can't be added.
 */
async function sumGiftsSince(spec: GiftsSince, signal: AbortSignal): Promise<number> {
  const { since, displayName } = spec;
  const path = "teamId" in spec ? `teams/${spec.teamId}` : `participants/${spec.participantId}`;
  const cutoff = Date.parse(since);
  const seen = new Set<string>();
  let cents = 0;
  for (let page = 0; page < MAX_PAGES; page++) {
    // `no-store`: like every DonorDrive list, this one says max-age=14400.
    const res = await fetch(`${BASE_URL}/${path}/donations?limit=${PAGE}&offset=${page * PAGE + 1}`, {
      signal,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch donations for ${path}`);
    const list: Donation[] = await res.json();
    let reachedOlder = false;
    for (const d of list) {
      if (seen.has(d.donationID)) continue;
      seen.add(d.donationID);
      const at = parseDonorDriveDate(d.createdDateUTC);
      // A date that still won't parse is left out rather than guessed at.
      if (Number.isNaN(at)) continue;
      if (at < cutoff) {
        reachedOlder = true;
        continue;
      }
      if (displayName !== undefined && !sameName(d.displayName, displayName)) continue;
      if (typeof d.amount === "number") cents += Math.round(d.amount * 100);
    }
    if (reachedOlder || list.length < PAGE) break;
  }
  return cents / 100;
}

/**
 * One running total per entry of `specs`, in the same order. Re-fetched every
 * `refreshMs` if given. A failed refresh keeps the last good totals; `amounts`
 * is empty until the first read lands.
 */
export function useExtraLifeGiftsSince(specs: GiftsSince[], refreshMs?: number) {
  // Keyed by content, so a list written inline doesn't refetch every render.
  const key = JSON.stringify(specs);
  const [amounts, setAmounts] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(specs.length > 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const list: GiftsSince[] = JSON.parse(key);
    if (list.length === 0) return;
    const controller = new AbortController();

    async function load() {
      try {
        setAmounts(await Promise.all(list.map((s) => sumGiftsSince(s, controller.signal))));
        setError(null);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    load();
    const id = refreshMs ? window.setInterval(load, refreshMs) : undefined;
    return () => {
      window.clearInterval(id);
      controller.abort();
    };
  }, [key, refreshMs]);

  return { amounts, isLoading, error };
}
