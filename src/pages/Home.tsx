import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Schedule } from "@/components/site/Schedule";
import { WhyWePlay } from "@/components/site/WhyWePlay";
import { Sponsors } from "@/components/site/Sponsors";
import { Donors } from "@/components/site/Donors";
import { Team } from "@/components/site/Team";

export function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Schedule />
      <WhyWePlay />
      <Sponsors />
      <Donors />
      <Team />
    </main>
  );
}
