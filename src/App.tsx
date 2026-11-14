import { SiteNav } from "@/components/site/SiteNav";
import { Footer } from "@/components/site/Footer";
import { CommandCenter } from "@/pages/CommandCenter";
import { GamedayCountdown } from "@/pages/GamedayCountdown";
import { GamedayEvents } from "@/pages/GamedayEvents";
import { Home } from "@/pages/Home";
import { Incentives } from "@/pages/Incentives";
import { LeadershipDnD } from "@/pages/LeadershipDnD";
import { Library } from "@/pages/Library";
import { MtgInterest } from "@/pages/MtgInterest";
import { Newsletter } from "@/pages/Newsletter";
import { Parking } from "@/pages/Parking";
import { GilletteChildrensHospital } from "@/pages/GilletteChildrensHospital";
import { PatientProfiles } from "@/pages/PatientProfiles";
import { Prizes } from "@/pages/Prizes";
import { Registration } from "@/pages/Registration";
import { Rsvp } from "@/pages/Rsvp";
import { SiteMap } from "@/pages/SiteMap";
import { Templates } from "@/pages/Templates";
import { useGameday } from "@/hooks/use-countdown";
import { getRsvpEvent } from "@/lib/rsvpEvents";
import { useHashScroll, usePath } from "@/lib/router";

const MARATHON = getRsvpEvent("marathon")?.calendar;

export default function App() {
  const path = usePath();
  // `#anchor` links from emails and chips land on the right spot on first load.
  useHashScroll([path]);
  // /gameday is a countdown until kickoff, then the Command Center on its own.
  const { phase } = useGameday(
    MARATHON?.start ?? "2026-11-14T08:00:00-06:00",
    MARATHON?.end ?? "2026-11-15T08:00:00-06:00",
  );

  // Every route here is also listed in src/lib/sitePages.ts (shown on /sitemap and /library): add new ones there too.
  let page = <Home />;
  if (path === "sitemap") page = <SiteMap />;
  if (path === "gameday") page = phase === "before" ? <GamedayCountdown /> : <CommandCenter />;
  if (path === "gameday_holding") page = <CommandCenter />;
  if (path === "gameday_events") page = <GamedayEvents />;
  if (path === "gillette-childrens-hospital") page = <GilletteChildrensHospital />;
  if (path === "incentives") page = <Incentives />;
  if (path === "library") page = <Library />;
  if (path === "leadership_DandD") page = <LeadershipDnD />;
  if (path === "mtginterest") page = <MtgInterest />;
  if (path === "newsletter") page = <Newsletter />;
  if (path === "parking") page = <Parking />;
  if (path === "patient-profiles") page = <PatientProfiles />;
  if (path === "prizes") page = <Prizes />;
  if (path === "registration") page = <Registration />;
  if (path === "rsvp") page = <Rsvp />;
  if (path === "templates") page = <Templates />;
  if (path.startsWith("templates/")) page = <Templates slug={path.slice("templates/".length)} />;
  if (path.startsWith("rsvp/")) page = <Rsvp slug={path.slice("rsvp/".length)} />;

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <SiteNav />
      {page}
      <Footer />
    </div>
  );
}
