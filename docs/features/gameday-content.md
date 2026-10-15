# Command Center content pipeline

- **Status:** Live. `Code.gs` was redeployed 2026-09-25, and the four tabs exist
- **Last reviewed:** 2026-10-15 (example schedule removed; the run of show is sheet-only)
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
  run-of-show rows laid out as a lane grid with a "now" line (rules below).
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

- **The run of show has no shipped copy; the sheet is the only source.**
  Whatever the `Gameday Run of Show` tab holds is what renders, starter
  rows ("TBD") included. An empty tab, or a read that hasn't landed, shows
  a dashed "The run of show is coming soon" card in the grid's place
  ("Loading the schedule…" until the first fetch settles, via the hook's
  `settled` flag). Until 2026-10-15 the page carried the printed 2025
  schedule as an example and treated the untouched seed rows as unfilled
  so the example stayed up; the owner asked to drop the sample and show
  live data, so both the example rows and the seed check are gone.
  Streams and incentives still keep their shipped copy when their tab is
  empty.

- **The schedule is laid out like the printed 2025 run of show**, not a
  list: a navy Time / Event header, red hourly pills, lanes of sky-blue
  black-bordered blocks, lime-green meal banners. Everything below is
  computed from the rows on every render, so editing the sheet re-packs the
  grid; nobody touches code.
  - **Time cells** are read by `parseShowTime` in `gamedayContent.ts` as a
    range ("9:30a - 12:30p", "11 - 1p", "8am Saturday - 8am Sunday") or a
    single time, which gets an hour. A start with no meridian borrows the
    end's and flips to AM when it would land after the end. Times before
    8 AM or marked "Sunday" are the second morning. A cell with no clock
    time ("TBD") is listed under the grid, not dropped.
  - **Lanes and stacking.** Blocks are placed longest first, each into the
    first lane where it overlaps nothing. Failing that, a block of three
    hours or less may ride on top of a block at least twice as long in the
    same lane (never the all-day block), provided the one underneath keeps
    about 100 minutes clear for its own label; the label moves into that
    gap. Riders are shifted 12px right at full width so they overhang the
    block beneath. The thresholds (`MAX_OVERLAY_MIN`, `MIN_LABEL_MIN`,
    `RIDE_PX`) are constants at the top of `GamedaySchedule.tsx`.
  - **Meals.** A row whose title or detail mentions breakfast, lunch,
    dinner, waffles, snacks, food or pizza becomes a green banner in the
    first lane only (the all-day block's), so the other lanes stay free;
    banners that start together share that lane's width.
  - **Quiet hours fold.** Two or more consecutive hours with nothing
    starting or ending collapse to one "…" row, so the overnight stretch
    doesn't dominate.
  - **Current blocks** (the ones the now-line crosses) glow with a magenta
    pulse that fades fully in and out (`now-pulse` in `styles.css`); with
    reduced motion they get a static ring instead.
  - **The now-line row is centred on its time** (`-translate-y-1/2`). With
    its top edge there it drew about ten minutes late, below a block that
    hadn't ended yet (reported from the live site 2026-10-15, PR #83).
    Check line position with the clock forced, not by eye.
- **The "now" line is real only during Game Day.** Outside it the line
  previews with the visitor's own clock (today's 2:15 PM sits where
  Saturday's 2:15 PM will), labelled as a preview, so the page can be
  checked any day. During the event it's minutes since the marathon's
  `calendar.start`, so it reads the same in every timezone.
- **Nothing here can leave the page blank.** Every failure path — endpoint not
  yet redeployed, network down, a tab emptied out, a half-typed row — falls
  back to `FALLBACK_CONTENT` in `gamedayContent.ts` (the schedule to its
  "coming soon" card). A failed poll keeps the last good content on screen
  rather than swapping in an error state, so a stale run of show beats an
  empty one in the middle of the event.
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
  content before Nov 14. For the run of show, Time cells may be ranges
  ("9:30a - 12:30p"); meal rows just need the meal word in the title.
- The sponsor list is hand-maintained in `CommandCenter.tsx`. Papa Johns
  links to papajohns.com; the Eden Prairie store page URL was never
  supplied.
- **Open:** should `/gameday` go in the top nav for Game Day? It's link-only
  today, reachable from the hero button while the marathon runs.
