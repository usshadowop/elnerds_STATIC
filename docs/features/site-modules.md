# Modules

- **Status:** Live in the repo; one module saved (Extra Life Page donation totals).
- **Last reviewed:** 2026-11-15 (created: `/modules`, and the first module saved from the hero's team-fundraising card)
- **Covers:** `src/lib/siteModules.ts`, `src/pages/Modules.tsx`, `src/components/modules/*`

## Purpose

The owner wanted pieces of a page saved so they can be reused later, and one
page that shows every saved piece at once ("We'll have several modules and I
want to be able to see them all simultaneously on a page"). Homepage templates
(the home-templates card) save whole-page layouts. Modules save the parts.

## Where it lives

- `src/lib/siteModules.ts`: the list. Each module has a slug, name,
  description, date saved, the file it lives in, how to put it on a page, where
  the site shows it today, and a preview width (`card`, max-w-2xl, or `wide`).
- `src/components/modules/`: one component per module, plus
  `ModulePreview.tsx`, which renders a module by slug for `/modules` (the same
  pattern as `HomeTemplatePage.tsx`).
- `src/pages/Modules.tsx`: `/modules`, also reachable as `/module` (the owner
  asked for "/module"). Every module rendered live, one after another, with its
  name, saved date, description, file, usage and where it's on the site. A row
  of jump links appears once there are two or more modules. `useNoIndex()`,
  listed under "For the team" in `sitePages.ts`, linked from nowhere else.

## The modules

| Module | Component | Saved | From |
| --- | --- | --- | --- |
| Extra Life Page donation totals | `ExtraLifeDonationTotals` | 2026-11-15 | The "Team fundraising" card under the hero countdown |

**Extra Life Page donation totals.** The Team Total / Goal / Participants block
and its progress bar in a white card, read live from DonorDrive
(`useExtraLifeTeam`). Props: `label` (default "Team fundraising") and
`refreshMs` (omit to read once; `/modules` re-reads every minute). It shows the
`TeamProgress` skeleton while loading and, if the first read fails, a "See it on
Extra Life" link. It never shows $0. The figures inside are the shared
`TeamProgress` block (extra-life-api card), so the module changes when the hero,
roster and Command Center versions do. When it was saved the team stood at
$45,393.05 of $60,000 with 49 participants.

## Decisions and gotchas

- **Modules are live, not snapshots.** A module is a component that fetches its
  own data, so it can be put on any page with nothing passed in. To freeze a
  figure (say, a final total), save a separate module that takes the number as
  a prop.
- **On phones, `/modules` shows each module unframed.** The first build put the
  module inside the entry's panel and a dashed "stage". At 320px that left the
  donation totals about 170px, and "$45,393" ran into "$60,000". Below `sm` the
  panel and stage drop away, so the module gets the full content width, the same
  288px it has under the homepage countdown. Measured with Nunito loaded: from
  320px to 1280px each figure stays inside its column, with no sideways scroll.
  The donation totals need roughly that width. Don't put them in a column much
  narrower than a phone screen.
- The hero's own `TeamProgressCard` was left as it is, not switched to the module.
  It hides on a failed fetch, which the module doesn't, and the live homepage
  didn't need to change to save the module.

## Manual steps and open questions

- A new module: a component in `src/components/modules/`, a case in
  `ModulePreview.tsx`, an entry in `SITE_MODULES` and its slug in
  `SiteModuleSlug`. Update the table above in the same commit.
