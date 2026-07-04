import { useEffect, useState } from "react";

const TEAM_ID = 73600;
const BASE_URL = "https://dd.extra-life.org/api";
// The /donors endpoint caps `limit` at 100 and does NOT support `offset`
// (passing it returns an empty string rather than an array), so we request the
// max page in a single call.
const MAX_LIMIT = 100;

export interface ExtraLifeDonor {
  donorID: string | null;
  displayName: string;
  avatarImageURL: string;
  sumDonations: number;
  numDonations: number;
}

interface UseExtraLifeDonorsResult {
  donors: ExtraLifeDonor[];
  isLoading: boolean;
  error: string | null;
}

export function useExtraLifeDonors(): UseExtraLifeDonorsResult {
  const [donors, setDonors] = useState<ExtraLifeDonor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDonors() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(
          `${BASE_URL}/teams/${TEAM_ID}/donors?limit=${MAX_LIMIT}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("Failed to fetch donors");

        const data: ExtraLifeDonor[] = await res.json();
        // Rank by total given, highest first.
        data.sort((a, b) => b.sumDonations - a.sumDonations);
        setDonors(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDonors();

    return () => controller.abort();
  }, []);

  return { donors, isLoading, error };
}
