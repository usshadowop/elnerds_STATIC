# Homepage templates

- **Status:** Live. Gameday Week Runup is the live homepage since 2026-11-14; Standard Display is saved.
- **Last reviewed:** 2026-11-14 (created: Standard Display saved, Gameday Week Runup built and made live)
- **Covers:** `src/lib/homeTemplates.ts`, `src/pages/Home.tsx`, `src/pages/Templates.tsx`, `src/pages/homeTemplates/*`, `src/components/site/GamedayRunup.tsx`, `src/lib/prizes.ts`

## Purpose

The homepage changes with the season: a year-round layout most of the year, and
a Game Day layout around the marathon. Templates keep each layout so it can be
put back later (the owner: "we will go back to that when we start working on
next year") instead of being rebuilt from git history.

## Where it lives

- `src/lib/homeTemplates.ts`: the list of templates (name, description, date
  saved, and `sections`, the anchor ids each one has), `ACTIVE_HOME_TEMPLATE`
  (the one the homepage shows), and `homeHasSection` / `homeLinkIsLive`.
- `src/pages/homeTemplates/`: one component per template
  (`StandardDisplay.tsx`, `GamedayWeekRunup.tsx`) and `HomeTemplatePage.tsx`,
  which picks one by slug.
- `src/pages/Home.tsx`: renders the active template, nothing else.
- `src/pages/Templates.tsx`: `/templates` lists every template (like `/email/`
  for emails), with a "Live on the homepage" badge, and `/templates/<slug>`
  previews one under a dark banner. Both call `useNoIndex()`; listed under "For
  the team" in `sitePages.ts`.
- `src/components/site/GamedayRunup.tsx`: the Gameday Week Runup's own
  sections (essentials cards with the "what to bring" note, getting here,
  prize drawings and silent auctions, donation tokens, watch, and Why We Play
  cut to the Victoria's Story button).
- `src/lib/prizes.ts`: drawing times, auction items, what's on the prize tables
  and the donor links, shared by `/prizes` and the Gameday Week Runup.

## How it works

- **Standard Display** is `Home.tsx` exactly as it was on 2026-11-14: Hero,
  Stats (Our Impact), Schedule, TeamIncentives (Earn Donations), WhyWePlay,
  Donors, ActiveRoster, Sponsors (2025), Team.
- **Gameday Week Runup** is the owner's cut of it: `<Hero variant="gameday">`
  (see the gameday-hero-states card: no "Play Games. Heal Kids.", no team photo,
  no incentives chip; Prizes and Parking chips; the countdown disappears when
  the marathon ends; fundraising progress and latest donations kept), then the
  `GamedayRunup` sections, Schedule (with Game Day schedule and event details),
  Victoria's story, Donors (2026), ActiveRoster, Team. No Stats, no
  TeamIncentives, no Sponsors (2025).
- **Dead links are hidden, not broken.** `SiteNav.tsx` drops any `/#anchor`
  link whose anchor isn't in the live template's `sections` (and a dropdown
  left empty), and `sitePages.ts` filters its "Home page sections" list the
  same way. Today that hides "Our Impact" and Sponsors → "Past".
- Templates are layouts, not frozen copies: they share components, so a change
  to `Schedule.tsx` or `Donors.tsx` shows in both.

## Decisions and gotchas

- Switching the homepage is one line, `ACTIVE_HOME_TEMPLATE`, plus a push. Keep
  `sections` honest when a template changes, or the nav will hide a link that
  works (or show one that doesn't).
- A new template: add a component in `src/pages/homeTemplates/`, a case in
  `HomeTemplatePage.tsx`, an entry in `HOME_TEMPLATES`, and its slug to
  `HomeTemplateSlug`.
- The Gameday Week Runup copy repeats the Game Day email
  (`email/elnerds-gameday-parking-prizes.html`) and `/parking` by hand; the
  prize facts don't, they come from `src/lib/prizes.ts`.

## Manual steps and open questions

- When to switch back to Standard Display after Game Day week is the owner's
  call (see Open threads in CLAUDE.md).
