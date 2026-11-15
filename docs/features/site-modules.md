# Modules

- **Status:** Live. Two modules saved. Gameday totals is on the homepage (hero and roster) and the Command Center; Extra Life Page donation totals is only on `/modules`.
- **Last reviewed:** 2026-11-15 (created; Gameday totals put everywhere the old block was; then a live "New leadership additions" line from Pam's page)
- **Covers:** `src/lib/siteModules.ts`, `src/pages/Modules.tsx`, `src/components/modules/*`, `src/lib/gamedayTotals.ts`

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
| Gameday totals | `GamedayTotals` | 2026-11-15 | New: the owner's grand total for Game Day 2026 |

**Extra Life Page donation totals.** The Team Total / Goal / Participants block
and its progress bar in a white card, read live from DonorDrive
(`useExtraLifeTeam`). Props: `label` (default "Team fundraising") and
`refreshMs` (omit to read once; `/modules` re-reads every minute). It shows the
`TeamProgress` skeleton while loading and, if the first read fails, a "See it on
Extra Life" link. It never shows $0. The figures inside are the shared
`TeamProgress` block (extra-life-api card), so the module changes when the hero,
roster and Command Center versions do. When it was saved the team stood at
$45,393.05 of $60,000 with 49 participants.

**Gameday totals.** One big grand total: the Extra Life team total (live, as
above) plus the money raised that isn't on the Extra Life page, with every part
listed underneath (the Extra Life row carries a "Live" tag). The extra amounts
are `GAMEDAY_TOTAL_ITEMS` in `src/lib/gamedayTotals.ts`, typed in by hand. For
Game Day 2026 they are the owner's figures of 2026-11-15: Chips $580, Cash
bucket $175 (then $575, once a $400 check that hadn't been counted turned up),
Donation matching $1,125, Silent auction remaining payouts $910
($2,790 in all; with the Extra Life page at $45,418.05 the card read
$48,208.05). Props: `label` (default "Gameday totals"), `items` (another list
in place of the file's) and `refreshMs`. The sum is done in cents, so it never
shows floating-point dust. The grand total waits for the Extra Life figure: a
placeholder while it loads, and "the grand total can't be added up" plus a
link if it fails. It never shows a total that is missing the biggest part. The
breakdown rows show either way. `children` go at the bottom of the card (the
Command Center puts its Donate Now and Team page links there).

**Live line items (2026-11-15).** A line item can also be live:
`extraLifeGiftsSince: { participantId, since }` is a running total of
everything given to one Extra Life participant's page since `since`, read from
DonorDrive by `useExtraLifeGiftsSince` (`src/hooks/useExtraLifeGiftsSince.ts`)
and re-read on the module's `refreshMs`. It is shown with a "Live" tag like the
team row.

The first is **"New leadership additions"**: gifts to Pam van Muijen's page
(participant 567979) from 2026-11-13 00:00 Central on. Pam is on the
leadership team, but her page is on **another Extra Life team** (NCC-AL5, team
74636), so none of it is in our team total and adding it double-counts
nothing. When added it was $645 from 13 gifts, all on Nov 14–15, and the
grand total read $49,169.57.

- **Only use a live line for a page on another team.** Anyone on team 73600
  is already in the team row.
- DonorDrive lists donations newest first, and **its `offset` counts from 1**:
  `offset=1` is the first gift, `offset=101` the 101st (checked 2026-11-15).
  The hook pages by 100, drops repeats by `donationID` and stops at the first
  gift older than `since`.
- Gifts whose donor hid the amount have no `amount`, so they can't be added.
  None of Pam's do: her 24 visible amounts add up to her page's `sumDonations`.
- `parseDonorDriveDate` (`src/lib/donationFormat.ts`) pads fractional seconds
  to three digits. DonorDrive sends some with two (`…:33.30+0000`), and
  Safari's date parser only takes three. A date that still won't parse is left
  out rather than guessed at.
- The grand total waits for every live figure, not just the team's. If Pam's
  page can't be read, her row shows "—" and the card says the grand total
  can't be added up.
- Checked with Pam's real gifts ($645), with a made-up 250-gift list (two pages
  read, then stopped at the cutoff: $149, the hidden-amount gift left out), and
  with her page failing.

**Where Gameday totals is used (2026-11-15).** The owner asked for it
"everywhere the old module was, for last minute announcements". So it replaced
the Team Total / Goal / Participants block in all three places:

- under the hero countdown, in `TeamProgressCard` in `Hero.tsx`, read once;
- at the top of the roster section, in `ActiveRoster.tsx`, read once;
- on the Command Center, in `GamedayDonations.tsx`, re-read every minute.

The live homepage (Gameday Week Runup) therefore shows it twice, as it did the
old block. To go back, put `TeamProgress` (or `<ExtraLifeDonationTotals />`)
back in those three files.

**The big figure sizes to its card, not the window.** The card is an
`@container`, and the figure is `clamp(1.75rem, 16cqw, 4.5rem)`. On the
Command Center the card is two-fifths of the row at `lg`, about 333px inside at
1024px wide. A window-based size (`11vw`, capped at 72px) would make
"$48,208.05" about 383px wide there, which overflows. Measured with Nunito: it
fits its card on the homepage and the Command Center from 320px to 1440px.

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

- **When do the homepage and Command Center go back** to the plain Extra
  Life total (or something else)? The owner's call; see Open threads in
  CLAUDE.md.
- **The four fixed Gameday totals amounts are typed in.** The live lines
  ("New leadership additions") keep themselves current. To change a fixed one
  (the silent auction payouts will come in, for instance), edit
  `src/lib/gamedayTotals.ts` and push. List only money that is **not** on the
  Extra Life page; anything also entered there (an offline donation) would be
  counted twice. Whether any of the four 2026 amounts is also on the Extra Life
  page is the owner's knowledge, not checked.

- A new module: a component in `src/components/modules/`, a case in
  `ModulePreview.tsx`, an entry in `SITE_MODULES` and its slug in
  `SiteModuleSlug`. Update the table above in the same commit.
