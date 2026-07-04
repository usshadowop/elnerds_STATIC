import { useEffect, useState } from "react";

const TEAM_ID = 73600;
const BASE_URL = "https://dd.extra-life.org/api";
// DonorDrive caps the `limit` parameter at 100 (requests above that return an
// empty array), so we page through with limit+offset until a short page.
const PAGE_SIZE = 100;

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

        const all: ExtraLifeDonor[] = [];
        for (let offset = 0; ; offset += PAGE_SIZE) {
          const res = await fetch(
            `${BASE_URL}/teams/${TEAM_ID}/donors?limit=${PAGE_SIZE}&offset=${offset}`,
            { signal: controller.signal },
          );
          if (!res.ok) throw new Error("Failed to fetch donors");

          const page: ExtraLifeDonor[] = await res.json();
          all.push(...page);
          if (page.length < PAGE_SIZE) break;
        }

        // Rank by total given, highest first.
        all.sort((a, b) => b.sumDonations - a.sumDonations);
        setDonors(all);
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
