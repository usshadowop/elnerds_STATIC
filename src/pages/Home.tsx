import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Schedule } from "@/components/site/Schedule";
import { GameWeekDrawing } from "@/components/site/GameWeekDrawing";
import { WhyWePlay } from "@/components/site/WhyWePlay";
import { Sponsors } from "@/components/site/Sponsors";
import { Donors } from "@/components/site/Donors";
import { Team } from "@/components/site/Team";
import { ActiveRoster } from "@/components/site/ActiveRoster";

export function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Schedule />
      <GameWeekDrawing />
      <WhyWePlay />
      <Donors />
      <ActiveRoster />
      <Sponsors />
      <Team />
    </main>
  );
}
