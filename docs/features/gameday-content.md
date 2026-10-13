# Command Center content pipeline

- **Status:** Live. `Code.gs` was redeployed 2026-09-25, and the four tabs exist
- **Last reviewed:** 2026-10-13 (layered lane packing, new heading)
- **Covers:** `src/lib/gamedayContent.ts`, `src/hooks/use-gameday-content.ts`, `src/pages/CommandCenter.tsx`, `src/components/site/GamedaySchedule.tsx`

## Purpose

`/gameday` is the page to sit on during the marathon: where to watch, what's on
next, how to chip in. A command center whose run of show is a hardcoded array
is only useful until the first time plans change — at 2am, when the room moves
to Mario Kart, nobody is opening a pull request. So its contents are edited in
a spreadsheet during the event.

## Where it lives

- `src/pages/CommandCenter.tsx` — the page (route `/gameday`, wired in
  `App.tsx`). Presentation only. The closing "Links to our sponsors!" grid
  is a hand-maintained list in the file (Improving, Papa Johns Eden Prairie,
  Random Taco Company, Gillette Children's), not sheet content, with each
  sponsor's logo from `src/assets/logos/sponsors/` (Improving's and
  Gillette's from their sites, Papa John's and Taco Bell from Wikimedia).
  Above the streams, a "Come visit" card shows the marathon's venue from
  `rsvpEvents.ts` with a directions button in the `maps/dir/` form.
- `src/lib/gamedayContent.ts` — types, the shipped fallback copy, `fetch` and
  the response parser.
- `src/hooks/use-gameday-content.ts` — the polling hook.
- `src/components/site/GamedaySchedule.tsx` — the "Schedule" section: the
  run-of-show rows on a 24-hour track with a "now" line.
- `apps-script/Code.gs` — `doGet(?action=gameday)` and `getGamedayContent_()`.

## How it works

Four tabs in the RSVP spreadsheet drive the page:

| Tab | Columns |
| --- | --- |
| `Gameday Streams` | Name, Description, Embed URL, Channel URL |
| `Gameday Run of Show` | Time, Title, Detail |
| `Gameday Incentives` | Amount, What |
| `Gameday Notice` | one banner message in cell **A2** |

The tabs are created with headers and starter rows the first time the page
asks for them, so setup is opening the sheet and typing. The page fetches
`?action=gameday` and re-reads once a minute, so an edit reaches every open
browser within about a minute — nobody refreshes.

A stream tile with a blank **Embed URL** shows a sample still (an event
photo from `src/assets/carousel/`) with a "Live" badge, a "Sample" tag and a
play button, so the demo reads as a stream wall; fill it in and the tile
becomes a live player.

## Decisions and gotchas

- **An untouched starter tab counts as empty.** The "Gameday Run of Show"
  tab is seeded with five rows (Kickoff, two TBDs, Open house wraps,
  Finale). When the sheet returns exactly those, `parseGamedayContent`
  treats the section as unfilled and keeps the example schedule, instead of
  the page flashing the example and then swapping to a grid of TBDs a
  second later (which is what happened on 2026-10-13). Change a single row
  in the sheet and it takes over. `RUN_OF_SHOW_SEED` in `gamedayContent.ts`
  must match the seed in `Code.gs`.

- **The schedule is laid out like the printed 2025 run of show**, not a
  list: a navy Time / Event header, red hourly pills, parallel lanes of
  sky-blue black-bordered blocks, and lime-green meal banners layered across
  the lanes. `parseShowTime` in `gamedayContent.ts` reads the Time cell as a
  range ("9:30a - 12:30p", "11 - 1p", "8am Saturday - 8am Sunday") or a
  single time (one hour). A start with no meridian borrows the end's, and
  flips to AM when it would otherwise land after the end. Times before 8 AM
  or marked "Sunday" are the second morning. Overlapping blocks are packed
  into lanes automatically, longest first; a block of three hours or less
  may ride on top of a block at least twice as long in the same lane (not
  the all-day block), provided the one underneath keeps a clear stretch of
  about 100 minutes for its own label, which the label then moves into. A row
  whose title or detail mentions breakfast, lunch, dinner, waffles, snacks
  or food becomes a green banner in the first lane only (the all-day
  block's), so the other lanes stay free for stacking; banners that start
  together share that lane's width. Riders are shifted 12px to the right of
  the block underneath at full width, so they overhang its right edge. Hours with nothing starting or ending fold into one "…" row when
  two or more run together, so the overnight stretch doesn't dominate. A
  Time cell with no clock time ("TBD") is listed under the grid instead of
  dropped. The sheet's columns are unchanged.
- **The "now" line is real only during Game Day.** Outside it the line
  previews with the visitor's own clock (today's 2:15 PM sits where
  Saturday's 2:15 PM will), labelled as a preview, so the page can be
  checked any day. During the event it's minutes since the marathon's
  `calendar.start`, so it reads the same in every timezone.
- The shipped fallback run of show is **the 2025 schedule as an example**
  (from the printed Canva run of show), not the 2026 plan. The sheet
  replaces it row for row.

- **Nothing here can leave the page blank.** Every failure path — endpoint not
  yet redeployed, network down, a tab emptied out, a half-typed row — falls
  back to `FALLBACK_CONTENT` in `gamedayContent.ts`. A stale run of show beats
  an empty page in the middle of the event. A failed poll keeps the last good
  content on screen rather than swapping in an error state.
- **Editing the fallback in the repo does not change what the sheet serves.**
  During the event, edit the sheet.
- Rows whose first cell is blank are skipped, so gaps and half-typed rows in
  the sheet are safe.
- **Embed URLs are the platform's embed address, not the channel page**, and
  Twitch additionally needs `&parent=elnerds.com` or the player refuses to
  load.
- **Times are read as displayed text, not raw cell values.** Sheets turns a
  typed "8:00 AM" into a time value, which `getValues()` returns as "Sat Dec 30
  1899 08:00:00 GMT-0600". The first live read after the redeploy showed
  exactly that. `getGamedayContent_` now uses `getDisplayValues()`. It went live
  in the Version 4 deployment, verified 2026-09-25: the times read
  "8:00 AM".
- **CORS is fine.** Verified against the live deployment that the Apps Script
  `ContentService` JSON path returns `access-control-allow-origin: *` on both
  the 302 and the final 200, so the cross-origin browser read works. (The
  `HtmlService` path — what a plain GET returns — does not, which is a useful
  tell for whether the redeploy has happened.)

## Manual steps and open questions

- The four `Gameday *` tabs exist now, with starter rows. They need real
  content before Nov 14.
- **Open:** should `/gameday` go in the top nav for Game Day? It's link-only
  today, reachable from the hero button while the marathon runs.
