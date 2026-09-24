import { useEffect, useState } from "react";

const TEAM_ID = 73600;
// dd.extra-life.org, not extra-life.org/api — see useExtraLifeTeam.ts.
const BASE_URL = "https://dd.extra-life.org/api";

export interface ExtraLifeDonation {
  donationID: string;
  /** Missing when the donor gave anonymously. */
  displayName?: string;
  /** Missing when the donor chose to hide the amount. */
  amount?: number | null;
  message?: string | null;
  recipientName?: string;
  createdDateUTC: string;
  /** A participant's own sign-up fee — not something to cheer on a ticker. */
  isRegFee: boolean;
}

interface UseExtraLifeDonationsResult {
  donations: ExtraLifeDonation[];
  isLoading: boolean;
  error: string | null;
}

// Registration fees are filtered out after the fetch, so ask for extra to
// still have `limit` real donations left when a few sign-ups land together.
const FETCH_LIMIT = 20;

/**
 * The team's `limit` most recent donations, newest first, re-fetched every
 * `refreshMs` so a page left open keeps up.
 *
 * The API answers with `cache-control: max-age=14400`, so a plain fetch would
 * keep serving the browser's four-hour-old copy; `cache: "no-store"` skips it.
 */
export function useExtraLifeDonations(limit = 6, refreshMs = 60_000): UseExtraLifeDonationsResult {
  const [donations, setDonations] = useState<ExtraLifeDonation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDonations() {
      try {
        const res = await fetch(`${BASE_URL}/teams/${TEAM_ID}/donations?limit=${FETCH_LIMIT}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch donations");

        const data: ExtraLifeDonation[] = await res.json();
        setDonations(data.filter((d) => !d.isRegFee).slice(0, limit));
        setError(null);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Keep showing the last good list; a missed refresh isn't worth blanking it.
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDonations();
    const id = setInterval(fetchDonations, refreshMs);

    return () => {
      clearInterval(id);
      controller.abort();
    };
  }, [limit, refreshMs]);

  return { donations, isLoading, error };
}
