import { SiteNav } from "@/components/site/SiteNav";
import { Footer } from "@/components/site/Footer";
import { Home } from "@/pages/Home";
import { GilletteChildrensHospital } from "@/pages/GilletteChildrensHospital";
import { PatientProfiles } from "@/pages/PatientProfiles";
import { usePath } from "@/lib/router";

export default function App() {
  const path = usePath();

  let page = <Home />;
  if (path === "gillette-childrens-hospital") page = <GilletteChildrensHospital />;
  if (path === "patient-profiles") page = <PatientProfiles />;

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <SiteNav />
      {page}
      <Footer />
    </div>
  );
}
