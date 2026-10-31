# MTG interest form

- **Status:** Live. `Code.gs` redeployed 2026-10-31; probes refused a bad email and empty lists with the new messages. No real submission yet
- **Last reviewed:** 2026-10-31
- **Covers:** `src/pages/MtgInterest.tsx`, `src/lib/mtgInterest.ts`

## Purpose

Gauge interest in Magic: The Gathering before planning MTG events: who is
in, which formats they play, and whether they want competitive or casual
play. The Halloween email (sent 2026-10-31, archived as
`email/archive/2026-10-halloween/`) points here from its hero and a chip.

## Where it lives

- `src/pages/MtgInterest.tsx`: `/mtginterest`, laid out like `/newsletter`.
  Three sections: Email (with an opt-in checkbox for MTG news and emails under it), Format interest (checkboxes: Commander, Draft,
  Other; ticking Other reveals a text field that is then required), Type of interest (checkboxes:
  Competitive, Casual). At least one box in each group is required.
- `src/lib/mtgInterest.ts`: the POST client and the two option lists.
- The Magic: The Gathering wordmark, shown in place of the page's `<h1>`
  text and above the email hero's headline. Two copies: the site uses
  `src/assets/logos/mtg-logo.png` (the white-background version with the
  outside white flood-filled to transparent so it sits on the cream page;
  261×84, shown at that width so it never upscales), the email uses
  `public/email/assets/mtg-logo.jpg` (the dark-background version,
  764×401). Both are Wizards of the Coast's mark from Google image
  thumbnails; replace with higher-resolution copies if any turn up.
- `handleMtgInterest_` in `apps-script/Code.gs` (owned by
  [rsvp-backend](rsvp-backend.md)) writes the row.
- The route is one line in `src/App.tsx`. Nothing in the nav or footer
  links to the page; the email button and shared links are the way in.

## How it works

The form posts `{ type: "mtg", email, formats[], formatOther, interest[], emailOptIn, website }` to
the same Apps Script endpoint as the RSVP and newsletter forms
(`VITE_RSVP_ENDPOINT`). `type: "mtg"` sends it to `handleMtgInterest_`,
which:

- opens (or on first use creates) a **separate spreadsheet,
  `elnerds_mtginterest`**, in the captain account's Drive; its ID is kept in
  the `MTG_SPREADSHEET_ID` script property. It is *not* a tab in "elnerds
  RSVPs";
- keeps an `Interest` tab with columns Timestamp, Email, Formats, Interest
  level, MTG emails (Yes/No from the opt-in box). Formats and Interest level are comma-separated strings in the
  site's order ("Commander, Other: Pauper" / "Casual"); the Other text is
  folded into the Formats cell, trimmed to 200 characters;
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

- **Done 2026-10-31:** `Code.gs` pasted, `setupMtg` run (sheet created in
  the captain's Drive), deployment republished. Verified with posts straight
  at the endpoint: bad email → "Please enter a valid email address.", empty
  lists → "Pick at least one format and one type of interest.", bot-trap
  field → `ok` with nothing saved.
- **Not yet done:** a real submission, so the `Interest` tab has only its
  header row. Share the sheet from the captain's Drive.
- Nothing links to `/mtginterest` from the site itself; the sent email is
  the only way in. Decide whether it should appear in the nav or footer.
- The sheet is not shared with the Drive connector's account, so a session
  cannot check whether rows have landed; ask the owner or the captain inbox.
