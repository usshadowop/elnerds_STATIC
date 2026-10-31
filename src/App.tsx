import { SiteNav } from "@/components/site/SiteNav";
import { Footer } from "@/components/site/Footer";
import { CommandCenter } from "@/pages/CommandCenter";
import { Home } from "@/pages/Home";
import { Incentives } from "@/pages/Incentives";
import { MtgInterest } from "@/pages/MtgInterest";
import { Newsletter } from "@/pages/Newsletter";
import { GilletteChildrensHospital } from "@/pages/GilletteChildrensHospital";
import { PatientProfiles } from "@/pages/PatientProfiles";
import { Registration } from "@/pages/Registration";
import { Rsvp } from "@/pages/Rsvp";
import { useHashScroll, usePath } from "@/lib/router";

export default function App() {
  const path = usePath();
  // `#anchor` links from emails and chips land on the right spot on first load.
  useHashScroll([path]);

  let page = <Home />;
  if (path === "gameday") page = <CommandCenter />;
  if (path === "gillette-childrens-hospital") page = <GilletteChildrensHospital />;
  if (path === "incentives") page = <Incentives />;
  if (path === "mtginterest") page = <MtgInterest />;
  if (path === "newsletter") page = <Newsletter />;
  if (path === "patient-profiles") page = <PatientProfiles />;
  if (path === "registration") page = <Registration />;
  if (path === "rsvp") page = <Rsvp />;
  if (path.startsWith("rsvp/")) page = <Rsvp slug={path.slice("rsvp/".length)} />;

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <SiteNav />
      {page}
      <Footer />
    </div>
  );
}
