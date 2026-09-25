# Command Center content pipeline

- **Status:** Live. `Code.gs` was redeployed 2026-09-25, and the four tabs exist
- **Last reviewed:** 2026-09-25
- **Covers:** `src/lib/gamedayContent.ts`, `src/hooks/use-gameday-content.ts`, `src/pages/CommandCenter.tsx`

## Purpose

`/gameday` is the page to sit on during the marathon: where to watch, what's on
next, how to chip in. A command center whose run of show is a hardcoded array
is only useful until the first time plans change — at 2am, when the room moves
to Mario Kart, nobody is opening a pull request. So its contents are edited in
a spreadsheet during the event.

## Where it lives

- `src/pages/CommandCenter.tsx` — the page (route `/gameday`, wired in
  `App.tsx`). Presentation only.
- `src/lib/gamedayContent.ts` — types, the shipped fallback copy, `fetch` and
  the response parser.
- `src/hooks/use-gameday-content.ts` — the polling hook.
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

A stream tile with a blank **Embed URL** stays a labelled placeholder slot;
fill it in and the tile becomes a live player.

## Decisions and gotchas

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
  exactly that. `getGamedayContent_` now uses `getDisplayValues()`. **That fix
  needs one more `Code.gs` redeploy** (open since 2026-09-25). Until then,
  typed times read wrong; typing the time as text (`'8:00 AM`) avoids it.
- **CORS is fine.** Verified against the live deployment that the Apps Script
  `ContentService` JSON path returns `access-control-allow-origin: *` on both
  the 302 and the final 200, so the cross-origin browser read works. (The
  `HtmlService` path — what a plain GET returns — does not, which is a useful
  tell for whether the redeploy has happened.)

## Manual steps and open questions

- **Redeploy `Code.gs` once more** for the display-value fix above (steps in
  [rsvp-backend](rsvp-backend.md)). Check that
  `curl "$ENDPOINT?action=gameday"` shows `"8:00 AM"`, not an 1899 date.
- The four `Gameday *` tabs exist now, with starter rows. They need real
  content before Nov 14.
- **Open:** should `/gameday` go in the top nav for Game Day? It's link-only
  today, reachable from the hero button while the marathon runs.
- The run of show is display text, not parsed — the page does not compute
  "what's on now" from it.
