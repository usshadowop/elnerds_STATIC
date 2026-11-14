// "Gameday Week Runup": the homepage for the days around Game Day (2026-11-14).
// The owner's cuts from Standard Display: no "Play Games. Heal Kids." headline,
// no team photo, no donation-incentive chip or Earn Donations section, no Our
// Impact, Why We Play shrunk to Victoria's story, no 2025 sponsors. Added: the
// Game Day email's details, with /prizes and /parking up front.

import { ActiveRoster } from "@/components/site/ActiveRoster";
import { Donors } from "@/components/site/Donors";
import {
  GamedayEssentials,
  GamedayGettingHere,
  GamedayPrizesSummary,
  GamedayStory,
  GamedayTokens,
  GamedayWatch,
} from "@/components/site/GamedayRunup";
import { Hero } from "@/components/site/Hero";
import { Schedule } from "@/components/site/Schedule";
import { Team } from "@/components/site/Team";

export function GamedayWeekRunup() {
  return (
    <main>
      <Hero variant="gameday" />
      <GamedayEssentials />
      <GamedayGettingHere />
      <GamedayPrizesSummary />
      <GamedayTokens />
      <GamedayWatch />
      <Schedule />
      <GamedayStory />
      <Donors />
      <ActiveRoster />
      <Team />
    </main>
  );
}
