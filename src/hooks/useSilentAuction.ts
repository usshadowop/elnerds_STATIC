import { useEffect, useState } from "react";

import { fetchGiftsSince, type ExtraLifeGift } from "@/hooks/useExtraLifeGiftsSince";
import {
  AUCTION_PAYMENT_PAGES,
  AUCTION_PAYMENTS_SINCE,
  AUCTION_WINS,
  matchAuctionPayments,
  type AuctionTally,
} from "@/lib/silentAuction";

/**
 * The silent auction's winning bids, each tied to the Extra Life gift that
 * paid it (src/lib/silentAuction.ts), read live from DonorDrive: our team's
 * pages and Pam's. Re-read every `refreshMs` if given; a failed refresh keeps
 * the last good tally. Pass `enabled: false` to skip the read (hooks can't be
 * called conditionally).
 *
 * `ignoreNames` are display names that belong to another line (the chips and
 * RSVP matches, from claimedDisplayNames()), never auction payments.
 */
export function useSilentAuction({
  enabled = true,
  ignoreNames = [],
  refreshMs,
}: {
  enabled?: boolean;
  ignoreNames?: string[];
  refreshMs?: number;
}) {
  const key = JSON.stringify(ignoreNames);
  const [tally, setTally] = useState<AuctionTally | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const ignore: string[] = JSON.parse(key);
    const controller = new AbortController();

    async function load() {
      try {
        const lists = await Promise.all(
          AUCTION_PAYMENT_PAGES.map((from) => fetchGiftsSince(from, AUCTION_PAYMENTS_SINCE, controller.signal)),
        );
        // A team's list and a member's list could hold the same gift.
        const gifts = new Map<string, ExtraLifeGift>();
        for (const g of lists.flat()) gifts.set(g.donationID, g);
        setTally(matchAuctionPayments(AUCTION_WINS, [...gifts.values()], ignore));
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
  }, [enabled, key, refreshMs]);

  return { tally, isLoading, error };
}
