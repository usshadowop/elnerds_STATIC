import { useEffect, useMemo, useState } from "react";

import type { GamedayTextPart } from "@/lib/gamedayContent";

// dd.extra-life.org, not extra-life.org/api — see useExtraLifeTeam.ts.
const BASE_URL = "https://dd.extra-life.org/api";

// An Extra Life incentive's donate link, as the API's links.donate and the
// "Copy link address" on a participant page give it:
//   https://dd.extra-life.org/participants/566961/donate?incentiveID=5B1A…
const INCENTIVE_LINK = /\/participants\/(\d+)\/donate\?(?:[^#]*&)?incentiveID=([0-9A-F-]{20,})/i;

export function parseIncentiveLink(
  url: string | undefined,
): { participantID: string; incentiveID: string } | null {
  const m = url ? INCENTIVE_LINK.exec(url) : null;
  return m ? { participantID: m[1], incentiveID: m[2].toUpperCase() } : null;
}

/** The first Extra Life incentive linked from a row: its own link, else any
 *  link inside its text. */
export function incentiveOf(link: string | undefined, parts: GamedayTextPart[] = []) {
  return (
    parseIncentiveLink(link) ?? parts.map((p) => parseIncentiveLink(p.url)).find(Boolean) ?? null
  );
}

export interface IncentiveStock {
  quantity: number;
  claimed: number;
  left: number;
}

interface ApiIncentive {
  incentiveID: string;
  quantity: number | null;
  quantityClaimed: number | null;
  isActive: boolean;
}

/**
 * Live spots left for the Extra Life incentives these URLs point at, keyed
 * by upper-case incentive ID, re-fetched every `refreshMs`. One request per
 * participant. Incentives with no quantity (unlimited) or that are inactive
 * are left out, so callers show nothing for them.
 *
 * The API answers with `cache-control: max-age=14400`; `cache: "no-store"`
 * skips the browser's four-hour-old copy, as in useExtraLifeDonations.
 */
export function useIncentiveStock(
  urls: (string | undefined)[],
  refreshMs = 60_000,
): Map<string, IncentiveStock> {
  const participants = useMemo(
    () =>
      [
        ...new Set(
          urls
            .map((u) => parseIncentiveLink(u)?.participantID)
            .filter((p): p is string => Boolean(p)),
        ),
      ].sort(),
    [urls],
  );
  const key = participants.join(",");
  const [stock, setStock] = useState<Map<string, IncentiveStock>>(new Map());

  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();

    async function load() {
      const next = new Map<string, IncentiveStock>();
      await Promise.all(
        key.split(",").map(async (pid) => {
          try {
            const res = await fetch(`${BASE_URL}/participants/${pid}/incentives`, {
              signal: controller.signal,
              cache: "no-store",
            });
            if (!res.ok) return;
            const list: ApiIncentive[] = await res.json();
            for (const i of list) {
              if (!i.isActive || i.quantity == null) continue;
              const claimed = i.quantityClaimed ?? 0;
              next.set(i.incentiveID.toUpperCase(), {
                quantity: i.quantity,
                claimed,
                left: Math.max(i.quantity - claimed, 0),
              });
            }
          } catch {
            // A missed refresh keeps the last counts; see below.
          }
        }),
      );
      if (controller.signal.aborted) return;
      // Keep counts we couldn't refresh this round rather than dropping them.
      setStock((prev) => new Map([...prev, ...next]));
    }

    load();
    const id = window.setInterval(load, refreshMs);
    return () => {
      controller.abort();
      window.clearInterval(id);
    };
  }, [key, refreshMs]);

  return stock;
}

/** "3 of 5 left" / "Full" chip for an incentive; nothing when unknown. */
export function spotsLabel(s: IncentiveStock | undefined): { text: string; full: boolean } | null {
  if (!s) return null;
  return s.left > 0
    ? { text: `${s.left} of ${s.quantity} left`, full: false }
    : { text: "Full", full: true };
}
