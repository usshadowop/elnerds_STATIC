import { useEffect, useState } from "react";

const TEAM_ID = 73600;
const BASE_URL = "https://extra-life.org/api";

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

export function useExtraLifeTeam(): UseExtraLifeTeamResult {
  const [team, setTeam] = useState<ExtraLifeTeam | null>(null);
  const [participants, setParticipants] = useState<ExtraLifeParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const [teamRes, participantsRes] = await Promise.all([
          fetch(`${BASE_URL}/teams/${TEAM_ID}`, { signal: controller.signal }),
          fetch(`${BASE_URL}/teams/${TEAM_ID}/participants`, { signal: controller.signal }),
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
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    return () => controller.abort();
  }, []);

  return { team, participants, isLoading, error };
}
