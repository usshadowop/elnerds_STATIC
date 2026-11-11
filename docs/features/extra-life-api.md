# Extra Life API integration

- **Status:** Live
- **Last reviewed:** 2026-11-11 (sponsor logos now read from `2026_sponsors/`)
- **Covers:** `src/hooks/useExtraLifeTeam.ts`, `src/hooks/useExtraLifeDonors.ts`, `src/hooks/useExtraLifeDonations.ts`, `src/components/site/ActiveRoster.tsx`, `src/components/site/TeamProgress.tsx`, `src/components/site/Donors.tsx`, `src/components/site/DonationTicker.tsx`, `src/hooks/useExtraLifeIncentives.ts`, `src/lib/sponsorLogos.ts`

## Purpose

Live fundraising data — team total, participant roster, donor list, latest
donations — pulled
from DonorDrive so the site doesn't carry numbers that go stale the moment
someone donates.

## Where it lives

- `src/hooks/useExtraLifeTeam.ts` — team record + participants (team ID
  `73600`).
- `src/hooks/useExtraLifeDonors.ts` — donor list.
- `src/hooks/useExtraLifeDonations.ts` — the 6 most recent donations,
  re-fetched on an interval.
- `src/components/site/DonationTicker.tsx` — the scrolling "Latest" strip
  under the hero countdown (keyframes in `src/styles.css`).
- `src/components/site/TeamProgress.tsx` — the team-summary block: three
  figures (total, goal, participants) and the progress bar, plus a
  skeleton. Rendered inside the roster section's cream card and, since
  2026-11-07, in a white "Team fundraising" card under the hero countdown
  (`TeamProgressCard` in `Hero.tsx`, hidden after the marathon when the
  grand-total card says it, and hidden on a failed fetch).
- `src/components/site/ActiveRoster.tsx` — the roster section, with skeleton
  placeholders while loading. The team-summary figures size with `clamp(1.125rem, 5.5vw, 1.875rem)` and
  `whitespace-nowrap`; a fixed `text-2xl` made "$17,380" and "$60,000" run
  into each other in the ~85px columns of a 360–412px phone (2026-10-23).
  The clamp tops out at `text-3xl`, so desktop is unchanged.
- `src/components/site/Donors.tsx` — the "2026 Donors" section: the live
  donor wall takes two-thirds, and the right column is three hand-maintained
  cards, **Venue Donation** (Improving, the Game Day venue: their logo
  (see Sponsor logos, below) is the link, with the arrow beside it,
  under an "Our home for 24 hours" subheader; the old text link and blurb
  went 2026-11-06 at the owner's request), then **Food
  Donation** (`FOOD_DONORS`: Papa Johns Roseville, Q’s Cue and Placemaker
  Hospitality, each a small logo plus a link with a one-line note, gold
  accent; added 2026-11-06), then **In-Kind Donors** (a plain list). The
  food list is the same vendors as `SPONSOR_LINKS` on `/gameday` (`CommandCenter.tsx`),
  copied by hand (names, links and notes only: both pages read the logos
  from `sponsorLogos`, see below), so change both when a food sponsor
  changes. Nothing in the right column comes from the API.
- `src/components/site/Hero.tsx` — the post-Game-Day grand total (see
  [gameday-hero-states](gameday-hero-states.md)).

## How it works

Plain `fetch` against `https://dd.extra-life.org/api`, each hook owning its own
`AbortController` and loading/error state. Participants are sorted captain
first, then co-captains, then by donations descending. Donors are sorted by
total descending.

A small "See all donations ↓" link under the strip smooth-scrolls to the
`#donors` section (it jumps instead of gliding when reduced motion is on). It is a
plain `#donors` link underneath, so it still works if the script doesn't run.

The donation ticker reads `/teams/73600/donations?limit=20`, which DonorDrive
returns newest first. It drops registration fees (`isRegFee`) and keeps the
first 6. It asks for 20 so that 6 real donations remain even when several
sign-ups land together. The hero
passes a refresh interval of one minute while Game Day is live and five minutes
otherwise. The strip scrolls by rendering the list twice and sliding the track
by half. Each copy opens with a blank gap as wide as the visible strip
(`.donation-ticker-gap`, `width: 100cqw`, with the strip as a size
container). So each loop starts empty, and the newest donation enters from
the right instead of scrolling away first. The donor's name is readable for
about 5s on desktop and about 2s on a 390px phone. The gap counts as one
more item in the loop duration, so it doesn't speed the strip up. It pauses on hover, but only on devices with a real mouse (`hover: hover` and `pointer: fine`). On a phone a tap leaves `:hover` stuck on, which used to freeze the strip until you tapped elsewhere. Under `prefers-reduced-motion` it
stops moving and becomes a plain horizontal scroll.

## Decisions and gotchas

- **Use `dd.extra-life.org`, not `extra-life.org/api`.** The latter issues a
  cross-origin 302 to the former *without* CORS headers on the redirect, which
  browsers reject. `dd.extra-life.org` serves 200 with
  `access-control-allow-origin: *`, so fetch works from the browser. This is
  written at the top of `useExtraLifeTeam.ts` and is easy to "fix" backwards.
- **The `/donors` endpoint caps `limit` at 100 and does not support `offset`** —
  passing one returns an empty string rather than an array. So the hook
  requests the maximum page in a single call and there is no pagination. If the
  team ever exceeds 100 donors, the list silently truncates.
- **`/donations` answers with `cache-control: max-age=14400`.** A plain fetch
  would keep reusing the browser's four-hour-old copy, so the ticker fetches
  with `cache: "no-store"`. Drop that and the "live" ticker stops being live.
- `displayName` is missing for anonymous gifts and `amount` is missing when the
  donor hides it. The ticker shows "Anonymous" and leaves out the amount
  instead of printing `$0`.
- The ticker renders nothing while loading, when the list is empty, or when
  the first fetch fails. A later failed refresh keeps the last good list.
- `useExtraLifeTeam` is called independently by `ActiveRoster` and by the
  hero's `TeamProgressCard` (all year since 2026-11-07; before that only the
  `after`-phase grand-total card), so that's two fetches of the same data
  on one page. Harmless at this size; worth a shared cache if a third
  consumer appears.
- The API is unreachable from the Claude sandbox's browser, so verification
  needs a stubbed route (`page.route`) rather than a live call.

## Manual steps and open questions

- The team ID `73600` and the event year are baked into the hooks. A new Extra
  Life season may need the ID checked.
- `src/components/site/Stats.tsx` still carries **hardcoded** yearly totals
  ("$51K raised in 2025"). Those are historical and not available from the
  current-season API, so they're hand-maintained — a candidate for its own card
  if it ever grows a source.

## Incentive spots left (added 2026-11-04)

`useIncentiveStock` in `src/hooks/useExtraLifeIncentives.ts` shows live
"3 of 5 left" / "Full" chips for Extra Life donation incentives that the
Game Day sheet links to:

- **Where the chips appear:** next to the title in "Event Details" under
  the schedule, and next to When on `/gameday_events`. A full row there
  swaps its Sign up button for a grey "Full".
- **How a row is recognised:** a link of the form
  `…/participants/<id>/donate?incentiveID=<id>` (`parseIncentiveLink`), in
  the row's Sign-up link or anywhere in its Details text. That's the
  `links.donate` value the API returns for each incentive, and also what
  "Copy link address" on a participant page gives.
- **Data:** `GET dd.extra-life.org/api/participants/<id>/incentives`, one
  request per participant, re-fetched every minute with
  `cache: "no-store"` (the API sends a 4-hour max-age).
  `left = quantity - quantityClaimed`.
- **When nothing shows:** incentives with no quantity (unlimited) or
  `isActive: false` get no chip, and neither does a failed fetch. A failed
  refresh keeps the previous counts.
- **No sheet change is needed:** whoever fills the sheet should drop
  hand-typed "5 left" text, since the chip now says it.

## Sponsor logos (added 2026-11-11)

`2026_sponsors/` at the repo root is the one home for sponsor logos, and
`src/lib/sponsorLogos.ts` is the one file that imports from it. `Donors.tsx`
and `CommandCenter.tsx` use its names (`sponsorLogos.improving`, …) and never
an image file, so there is no second copy to drift and no page that needs to
know where the folder is. The folder's README says where each logo came from.

- **Add a logo:** put the file in `2026_sponsors/` (a brand under a parent
  company goes in a subfolder, as `placemaker-hospitality/` does), then add it
  to `sponsorLogos.ts`. Replacing a file in place, under the same name, needs
  no code change.
- **Not everything in the folder is imported.** Placemaker's five brand logos
  are saved but no page shows them yet; import them when one does.
- **The email renditions are separate on purpose.**
  `public/email/assets/sponsor-*` are small hand-made copies served at stable
  public URLs, which an email needs (and sent emails keep pointing at them).
  Nothing generates them from the folder, so change both by hand if a logo
  changes.
- **History:** until 2026-11-11 the site kept its own copies in
  `src/assets/logos/sponsors/`. That folder is gone. Vite reads
  `2026_sponsors/` directly, in the dev server and in the production build
  (both checked in a browser), and the emitted image files are byte-identical
  to before.

