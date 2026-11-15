// Renders a module by slug, for /modules (src/pages/Modules.tsx). The list of
// modules and what each one is for is src/lib/siteModules.ts.

import { ExtraLifeDonationTotals } from "@/components/modules/ExtraLifeDonationTotals";
import { GamedayTotals } from "@/components/modules/GamedayTotals";
import type { SiteModuleSlug } from "@/lib/siteModules";

export function ModulePreview({ slug }: { slug: SiteModuleSlug }) {
  switch (slug) {
    case "extra-life-page-donation-totals":
      // Kept current while the page is open, like the Command Center's total.
      return <ExtraLifeDonationTotals refreshMs={60_000} />;
    case "gameday-totals":
      return <GamedayTotals refreshMs={60_000} />;
  }
}
