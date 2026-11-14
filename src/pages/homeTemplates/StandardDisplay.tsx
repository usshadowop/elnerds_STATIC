// "Standard Display": the year-round homepage, saved as a template on
// 2026-11-14 exactly as src/pages/Home.tsx composed it then. Put it back for
// next year by setting ACTIVE_HOME_TEMPLATE in src/lib/homeTemplates.ts.

import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Schedule } from "@/components/site/Schedule";
import { TeamIncentives } from "@/components/site/TeamIncentives";
import { WhyWePlay } from "@/components/site/WhyWePlay";
import { Sponsors } from "@/components/site/Sponsors";
import { Donors } from "@/components/site/Donors";
import { Team } from "@/components/site/Team";
import { ActiveRoster } from "@/components/site/ActiveRoster";

export function StandardDisplay() {
  return (
    <main>
      <Hero />
      <Stats />
      <Schedule />
      <TeamIncentives />
      <WhyWePlay />
      <Donors />
      <ActiveRoster />
      <Sponsors />
      <Team />
    </main>
  );
}
