// Homepage templates: whole-page layouts for elnerds.com's homepage, kept so a
// season's layout can be put back later. One is live at a time
// (ACTIVE_HOME_TEMPLATE); every one can be previewed at /templates/<slug>, and
// /templates lists them all (src/pages/Templates.tsx).
//
// Each template is a component in src/pages/homeTemplates/ and is rendered by
// HomeTemplatePage.tsx. `sections` lists the anchor ids the template has, so
// the nav (SiteNav.tsx) and the /sitemap and /library lists (sitePages.ts) can
// hide links to homepage sections the live template doesn't have.
//
// A template is a layout, not a snapshot: the components it is built from
// (hero, schedule, donors…) keep evolving and are shared between templates.
// To switch the live homepage, change ACTIVE_HOME_TEMPLATE and push.

export type HomeTemplateSlug = "gameday-week-runup" | "standard-display";

export type HomeTemplate = {
  slug: HomeTemplateSlug;
  name: string;
  /** What it's for and what's on it, for /templates. */
  description: string;
  /** When it was saved as a template. */
  savedOn: string;
  /** Anchor ids on the page (without "#"). */
  sections: string[];
};

export const HOME_TEMPLATES: HomeTemplate[] = [
  {
    slug: "gameday-week-runup",
    name: "Gameday Week Runup",
    description:
      "For the days around Game Day: countdown (gone once the marathon ends), fundraising progress and latest donations, then everything from the Game Day email: what to bring, parking and the way in, prize drawings and silent auctions, donation tokens, and where to watch. Then the schedule and event details, Victoria's story, the 2026 donors, the roster and the leadership team.",
    savedOn: "2026-11-14",
    sections: [
      "top",
      "gameday-essentials",
      "getting-here",
      "prizes",
      "donation-tokens",
      "watch",
      "schedule",
      "gameday-schedule",
      "past-events",
      "story",
      "donors",
      "active-roster",
      "team",
    ],
  },
  {
    slug: "standard-display",
    name: "Standard Display",
    description:
      "The year-round homepage, as it stood the week before Game Day 2026: the \"Play Games. Heal Kids.\" hero with the countdown, the team photo and the incentive chips; Our Impact; the events and Game Day schedule; donation incentives; Why We Play with its photo carousel; the 2026 donors; the roster; the 2025 sponsors; and the leadership team.",
    savedOn: "2026-11-14",
    sections: [
      "top",
      "mission",
      "schedule",
      "gameday-schedule",
      "past-events",
      "incentives",
      "story",
      "donors",
      "active-roster",
      "sponsors",
      "team",
    ],
  },
];

/** The template elnerds.com's homepage shows. */
export const ACTIVE_HOME_TEMPLATE: HomeTemplateSlug = "gameday-week-runup";

export function getHomeTemplate(slug: string): HomeTemplate | undefined {
  return HOME_TEMPLATES.find((t) => t.slug === slug);
}

/** Does the live homepage have a section with this anchor id? */
export function homeHasSection(id: string): boolean {
  return getHomeTemplate(ACTIVE_HOME_TEMPLATE)?.sections.includes(id) ?? true;
}

/** For a link like "/#mission": false when the live homepage has no such section. */
export function homeLinkIsLive(href: string): boolean {
  const base = import.meta.env.BASE_URL;
  if (!href.startsWith(`${base}#`)) return true;
  return homeHasSection(href.slice(base.length + 1));
}
