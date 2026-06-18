import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Schedule } from "@/components/site/Schedule";
import { WhyWePlay } from "@/components/site/WhyWePlay";
import { Sponsors } from "@/components/site/Sponsors";
import { Donors } from "@/components/site/Donors";
import { Footer } from "@/components/site/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <SiteNav />
      <main>
        <Hero />
        <Stats />
        <Schedule />
        <WhyWePlay />
        <Sponsors />
        <Donors />
      </main>
      <Footer />
    </div>
  );
}
