// Modules: self-contained pieces of a page (a card, a strip, a block) saved so
// they can be dropped onto any page later. /modules shows every one of them
// at once, live (src/pages/Modules.tsx). Homepage templates are whole-page
// layouts (homeTemplates.ts); modules are the parts.
//
// A new module: a component in src/components/modules/, a case in
// ModulePreview.tsx, an entry here, and its slug in SiteModuleSlug.

export type SiteModuleSlug = "extra-life-page-donation-totals" | "gameday-totals";

export type SiteModule = {
  slug: SiteModuleSlug;
  name: string;
  /** What it shows and where its data comes from, for /modules. */
  description: string;
  /** When it was saved as a module. */
  savedOn: string;
  /** The component, and how to put it on a page. */
  source: string;
  usage: string;
  /** Where the site shows it (or the same thing) today. */
  usedOn: string;
  /** "card" previews at a card's width (max-w-2xl); "wide" uses the full width. */
  width: "card" | "wide";
};

export const SITE_MODULES: SiteModule[] = [
  {
    slug: "extra-life-page-donation-totals",
    name: "Extra Life Page donation totals",
    description:
      "The team's Team Total, Goal and Participants with the progress bar, read live from our Extra Life team page. Shows a placeholder while it loads and a link to the team page if Extra Life can't be reached, never a $0.",
    savedOn: "2026-11-15",
    source: "src/components/modules/ExtraLifeDonationTotals.tsx",
    usage: "<ExtraLifeDonationTotals /> (optional: label, refreshMs)",
    usedOn: "Only here since 2026-11-15, when Gameday totals took its place under the homepage countdown, in the roster section and on the Command Center.",
    width: "card",
  },
  {
    slug: "gameday-totals",
    name: "Gameday totals",
    description:
      "One grand total for the event: our Extra Life team page (live) plus the money raised that isn't on that page, with each part listed underneath. Each extra line in src/lib/gamedayTotals.ts is either a typed-in amount or a live running total of another Extra Life page's gifts since a date (New leadership additions is Pam's page since Nov 13). The total only shows once every live figure has loaded.",
    savedOn: "2026-11-15",
    source: "src/components/modules/GamedayTotals.tsx, amounts in src/lib/gamedayTotals.ts",
    usage: "<GamedayTotals /> (optional: label, items, refreshMs, children)",
    usedOn: "Under the homepage countdown, at the top of the roster section, and on the Command Center (/gameday) beside the latest donations.",
    width: "card",
  },
];

export function getSiteModule(slug: string): SiteModule | undefined {
  return SITE_MODULES.find((m) => m.slug === slug);
}
