import { useEffect, useState } from "react";

const TEAM_ID = 73600;
// Use the DonorDrive-hosted API host directly: extra-life.org/api issues a
// cross-origin 302 to dd.extra-life.org without CORS headers on the redirect,
// which browsers reject. dd.extra-life.org serves 200 with
// `access-control-allow-origin: *`, so fetch works from the browser.
const BASE_URL = "https://dd.extra-life.org/api";

export interface ExtraLifeParticipant {
  participantID: number;
  displayName: string;
  fundraisingGoal: number;
  sumDonations: number;
  numDonations: number;
  teamName: string;
  teamID: number;
  eventName: string;
  eventID: number;
  avatarImageURL: string;
  isCustomAvatarImage: boolean;
  isTeamCaptain: boolean;
  isTeamCoCaptain: boolean;
  createdDateUTC: string;
  numMilestones: number;
  numIncentives: number;
  sumPledges: number;
  participantTypeCode: string;
  hasActivityTracking: boolean;
  streamIsLive?: boolean;
  streamIsEnabled?: boolean;
  streamingPlatform?: string;
  streamingChannel?: string;
  links: {
    donate: string;
    page: string;
    stream?: string;
    facebookFundraiser?: string;
  };
}

export interface ExtraLifeTeam {
  teamID: number;
  name: string;
  numParticipants: number;
  fundraisingGoal: number;
  sumDonations: number;
  numDonations: number;
  eventName: string;
  eventID: number;
  captainDisplayName: string;
  avatarImageURL: string;
  createdDateUTC: string;
  links: {
    page: string;
    join: string;
  };
}

interface UseExtraLifeTeamResult {
  team: ExtraLifeTeam | null;
  participants: ExtraLifeParticipant[];
  isLoading: boolean;
  error: string | null;
}

/**
 * The team record and its participants. Fetched once by default; pass
 * `refreshMs` to re-fetch on an interval (the Command Center does, so its total
 * keeps up through the marathon). A failed refresh keeps the last good data.
 *
 * Like `/donations`, these endpoints send `cache-control: max-age=14400`, so
 * the fetches use `cache: "no-store"` or a returning visitor would see a total
 * up to four hours old.
 */
export function useExtraLifeTeam(refreshMs?: number): UseExtraLifeTeamResult {
  const [team, setTeam] = useState<ExtraLifeTeam | null>(null);
  const [participants, setParticipants] = useState<ExtraLifeParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const [teamRes, participantsRes] = await Promise.all([
          fetch(`${BASE_URL}/teams/${TEAM_ID}`, { signal: controller.signal, cache: "no-store" }),
          fetch(`${BASE_URL}/teams/${TEAM_ID}/participants`, { signal: controller.signal, cache: "no-store" }),
        ]);

        if (!teamRes.ok || !participantsRes.ok) {
          throw new Error("Failed to fetch team data");
        }

        const teamData: ExtraLifeTeam = await teamRes.json();
        const participantsData: ExtraLifeParticipant[] = await participantsRes.json();

        // Sort: captain first, then by total donations descending
        participantsData.sort((a, b) => {
          if (a.isTeamCaptain !== b.isTeamCaptain) return a.isTeamCaptain ? -1 : 1;
          if (a.isTeamCoCaptain !== b.isTeamCoCaptain) return a.isTeamCoCaptain ? -1 : 1;
          return b.sumDonations - a.sumDonations;
        });

        setTeam(teamData);
        setParticipants(participantsData);
        setError(null);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    const id = refreshMs ? window.setInterval(fetchData, refreshMs) : undefined;

    return () => {
      window.clearInterval(id);
      controller.abort();
    };
  }, [refreshMs]);

  return { team, participants, isLoading, error };
}
