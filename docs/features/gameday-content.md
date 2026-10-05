# Command Center content pipeline

- **Status:** Live, read from the RSVP sheet until `Code.gs` is redeployed. The repo's `Code.gs` moves the tabs into their own `Gameday_Command_Center` spreadsheet (2026-10-05), and that version is not deployed yet
- **Last reviewed:** 2026-10-05
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
- `apps-script/Code.gs` — `doGet(?action=gameday)`, `getGamedayContent_()`, and
  `getGamedaySpreadsheet_()`, which finds (or creates) the spreadsheet.

## How it works

Four tabs in the **`Gameday_Command_Center`** spreadsheet drive the page.
It lives in the Drive of the account that owns the script, next to "elnerds
RSVPs":

| Tab | Columns |
| --- | --- |
| `Gameday Streams` | Name, Description, Embed URL, Channel URL |
| `Gameday Run of Show` | Time, Title, Detail |
| `Gameday Incentives` | Amount, What |
| `Gameday Notice` | one banner message in cell **A2** |

The spreadsheet and its tabs are created with headers and starter rows the
first time the page asks for them, so setup is opening the sheet and typing.
The script finds it again through the `GAMEDAY_SPREADSHEET_ID` script
property, so renaming or moving the file is harmless. Running `setup` in the
Apps Script editor prints its URL. The page fetches
`?action=gameday` and re-reads once a minute, so an edit reaches every open
browser within about a minute — nobody refreshes.

A stream tile with a blank **Embed URL** stays a labelled placeholder slot;
fill it in and the tile becomes a live player.

## Decisions and gotchas

- **Its own spreadsheet, not tabs in the RSVP sheet.** Until 2026-10-05 the
  four tabs lived in "elnerds RSVPs". They moved to `Gameday_Command_Center`
  so the people running Game Day can be given edit access without also seeing
  every RSVP's name and email.
- **The move happens on the backend, once.** The first time
  `getGamedaySpreadsheet_()` runs with no `GAMEDAY_SPREADSHEET_ID` set, it
  creates the file, `copyTo`s whichever `Gameday *` tabs exist in the RSVP
  sheet (content intact), fills in any that don't from the starter rows, saves
  the ID, and only then deletes the originals. A tab left behind in the RSVP
  sheet would look editable while the page ignored it. The creation runs under
  the script lock because every open `/gameday` page polls at once. The Google
  Drive connector in Claude sessions can't see "elnerds RSVPs" (checked
  2026-10-05), so the move can't be done from outside the script.
- **Redeploy before running anything from the editor.** If `setup` moves the
  tabs while the old version is still deployed, the old version's next poll
  recreates starter-row tabs in the RSVP sheet. `apps-script/README.md` gives
  the order.
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

- **Waiting on a `Code.gs` redeploy** (opened 2026-10-05). Until then the page
  still reads the RSVP sheet's tabs, and the content is the same either way.
  `curl "$ENDPOINT?action=gameday"` returns identical JSON before and after,
  so the only check is the owner's Drive: `Gameday_Command_Center` exists and
  "elnerds RSVPs" no longer has `Gameday *` tabs.
- The four `Gameday *` tabs exist now, with starter rows. They need real
  content before Nov 14.
- **Open:** should `/gameday` go in the top nav for Game Day? It's link-only
  today, reachable from the hero button while the marathon runs.
- The run of show is display text, not parsed — the page does not compute
  "what's on now" from it.
