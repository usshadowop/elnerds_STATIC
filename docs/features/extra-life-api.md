# Extra Life API integration

- **Status:** Live
- **Last reviewed:** 2026-09-24
- **Covers:** `src/hooks/useExtraLifeTeam.ts`, `src/hooks/useExtraLifeDonors.ts`, `src/hooks/useExtraLifeDonations.ts`, `src/components/site/ActiveRoster.tsx`, `src/components/site/Donors.tsx`, `src/components/site/DonationTicker.tsx`

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
- `src/components/site/ActiveRoster.tsx` — the roster section, with skeleton
  placeholders while loading.
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
by half. It pauses on hover, but only on devices with a real mouse (`hover: hover` and `pointer: fine`). On a phone a tap leaves `:hover` stuck on, which used to freeze the strip until you tapped elsewhere. Under `prefers-reduced-motion` it
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
- `useExtraLifeTeam` is called independently by `ActiveRoster` and (in the
  `after` phase only) by the hero, so that's two fetches of the same data on
  one page. Harmless at this size; worth a shared cache if a third consumer
  appears.
- The API is unreachable from the Claude sandbox's browser, so verification
  needs a stubbed route (`page.route`) rather than a live call.

## Manual steps and open questions

- The team ID `73600` and the event year are baked into the hooks. A new Extra
  Life season may need the ID checked.
- `src/components/site/Stats.tsx` still carries **hardcoded** yearly totals
  ("$51K raised in 2025"). Those are historical and not available from the
  current-season API, so they're hand-maintained — a candidate for its own card
  if it ever grows a source.
