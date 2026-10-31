# MTG interest form

- **Status:** Built 2026-10-31; **backend not yet live** — `Code.gs` needs a redeploy before `/mtginterest` can save anything
- **Last reviewed:** 2026-10-31
- **Covers:** `src/pages/MtgInterest.tsx`, `src/lib/mtgInterest.ts`

## Purpose

Gauge interest in Magic: The Gathering before planning MTG events: who is
in, which formats they play, and whether they want competitive or casual
play. The Halloween email's hero section points here.

## Where it lives

- `src/pages/MtgInterest.tsx`: `/mtginterest`, laid out like `/newsletter`.
  Three sections: Email, Format interest (checkboxes: Commander, Standard,
  Modern, Pioneer, Pauper, Legacy), Type of interest (checkboxes:
  Competitive, Casual). At least one box in each group is required.
- `src/lib/mtgInterest.ts`: the POST client and the two option lists.
- `handleMtgInterest_` in `apps-script/Code.gs` (owned by
  [rsvp-backend](rsvp-backend.md)) writes the row.
- The route is one line in `src/App.tsx`. Nothing in the nav or footer
  links to the page; the email button and shared links are the way in.

## How it works

The form posts `{ type: "mtg", email, formats[], interest[], website }` to
the same Apps Script endpoint as the RSVP and newsletter forms
(`VITE_RSVP_ENDPOINT`). `type: "mtg"` sends it to `handleMtgInterest_`,
which:

- opens (or on first use creates) a **separate spreadsheet,
  `elnerds_mtginterest`**, in the captain account's Drive; its ID is kept in
  the `MTG_SPREADSHEET_ID` script property. It is *not* a tab in "elnerds
  RSVPs";
- keeps an `Interest` tab with columns Timestamp, Email, Formats, Interest
  level. Formats and Interest level are comma-separated strings in the
  site's order ("Commander, Modern" / "Casual");
- writes one row per email: a repeat submission overwrites that address's
  Formats, Interest level and Timestamp rather than adding a row;
- emails the captain for each *new* address only.

## Decisions and gotchas

- **Only the site's option values are stored.** `pickAllowed_` drops
  anything not in `MTG_FORMATS` / `MTG_INTEREST_LEVELS`, so a crafted POST
  cannot put free text in the sheet. The two lists exist in both
  `mtgInterest.ts` and `Code.gs` and must be kept the same by hand; a
  format added to the site but not to `Code.gs` is silently dropped.
- **Repeat submissions update, not duplicate.** Different from the
  newsletter tab, where a repeat is a no-op, because here the answers are
  the point and people change their mind. The visitor is told "You're on
  the list!" either way; nothing reveals whether the address was known.
- **Bot trap** is the same hidden `website` field as the newsletter form.
- **Checkbox styling is plain `<input type="checkbox">`** with
  `accent-teal` and a `has-[:checked]` border on the label, not the Radix
  checkbox in `components/ui`, so react-hook-form's `register` works
  without a controller.
- **An older `Code.gs` rejects these posts** with "Invalid submission."
  because they have no `name`/`title`, so until the redeploy the form shows
  that error and saves nothing.

## Manual steps and open questions

- **Paste `Code.gs` into the Apps Script editor, run `setupMtg` once**
  (Run → setupMtg; the log prints the new sheet's URL), **then redeploy**
  (Deploy → Manage deployments → ✏️ → New version). `setupMtg` creates
  `elnerds_mtginterest` with its header row in the captain account's Drive,
  owned by that account, so it exists before the first submission; share
  it from there. Skipping `setupMtg` is fine: the first submission creates
  the same sheet. Verify with a bad-email post (refused, no write) and
  then a real one.
- Nothing links to `/mtginterest` from the site itself. Decide whether it
  should appear in the nav or footer once the email has gone out.
