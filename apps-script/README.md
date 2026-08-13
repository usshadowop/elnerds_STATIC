# RSVP backend — Google Apps Script

The RSVP form at **`elnerds.com/rsvp`** is a native page on the site. When a
visitor submits it, the form POSTs the data to a **Google Apps Script Web App**
that:

1. Appends the RSVP to a Google Sheet (**"elnerds RSVPs"**) in this account's Drive
2. Emails the **registrant** a confirmation with **Add to Calendar** + **Cancel** buttons
3. Emails the **captain account** a "new RSVP" notification
4. Handles **cancel** links (marks the row `Cancelled`, notifies the captain)

Nothing about this is visible to the visitor — they stay on the styled site the
whole time. The Google Sheet is your private back-office view.

- Backend code: [`apps-script/Code.gs`](./Code.gs)
- Frontend page: [`../src/pages/Rsvp.tsx`](../src/pages/Rsvp.tsx)
- Submit client: [`../src/lib/rsvp.ts`](../src/lib/rsvp.ts)

---

## One-time setup (~15 min, all clicking)

Do this while signed in to the Google account that should **own the RSVP data
and send the emails** (the captain account is the natural choice — the Sheet
lands in its Drive and emails come "from" it).

### 1. Create the script

1. Go to **[script.google.com](https://script.google.com)** → **New project**.
2. Delete the placeholder `myFunction` code.
3. Open [`Code.gs`](./Code.gs) from this repo, copy **all** of it, and paste it in.
4. (Optional) Near the top, set `CAPTAIN_EMAIL` to a specific address. If you
   leave it as-is, notifications go to whichever account owns the script.
5. Click the **💾 Save** icon.

### 2. Authorize + create the sheet

1. In the function dropdown (top toolbar) pick **`setup`**, then click **Run**.
2. Google shows a permissions prompt → **Review permissions** → pick your
   account → "Google hasn't verified this app" → **Advanced** →
   **Go to (project name)** → **Allow**. (This is normal for your own scripts.)
3. Open **Execution log** (View → Logs) — it prints the URL of the new
   "elnerds RSVPs" spreadsheet. Bookmark it; that's where submissions land.

### 3. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the ⚙️ gear next to "Select type" → **Web app**.
3. Set:
   - **Description**: `RSVP endpoint`
   - **Execute as**: **Me**
   - **Who has access**: **Anyone**  ← required so site visitors can submit
4. Click **Deploy** → authorize again if asked → **copy the Web app URL**
   (looks like `https://script.google.com/macros/s/AKfy…/exec`).

### 4. Give the URL to the site

Add it as a repository secret so the deployed build can reach it:

- GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**
- Name: `VITE_RSVP_ENDPOINT`
- Value: the Web app URL you copied

Then trigger a redeploy (push to `main`, or Actions → Deploy → Run workflow).
The "Setup needed" banner on `/rsvp` disappears and submissions start flowing.

For **local dev**, put the same value in `.env.local`:

```bash
cp .env.example .env.local
# edit .env.local → VITE_RSVP_ENDPOINT=https://script.google.com/macros/s/.../exec
bun run dev   # http://localhost:5173/rsvp
```

---

## Testing it

Submit a test RSVP from `/rsvp` (or your local dev server). Within a few seconds:

- A new row appears in the "elnerds RSVPs" sheet
- You (the registrant email) get the confirmation email — try the **Add to
  Calendar** and **Cancel my RSVP** buttons
- The captain account gets a notification email

Clicking **Cancel** flips that row's `Status` to `Cancelled` and emails the captain.

---

## Editing later

- Each event has its own RSVP page and fields, defined in
  [`../src/lib/rsvpEvents.ts`](../src/lib/rsvpEvents.ts). Submissions land in a
  per-event tab of the "elnerds RSVPs" sheet, with columns matching that event's
  fields.
- **Event dates / locations** for the calendar buttons live in the `EVENTS`
  object at the top of `Code.gs`, keyed by **slug** (e.g. `bingo`, `marathon`) —
  these must match the slugs in `rsvpEvents.ts`.
- Those `end` times also **close RSVPs automatically**: once an event's end
  passes, the site stops showing its form and `doPost` rejects submissions for
  that slug with "This event has already taken place — RSVPs are closed." No
  edit is needed when an event finishes — but the dates only take effect once
  this file is redeployed (below), so a `Code.gs` still running an older version
  will keep accepting late RSVPs even though the site has hidden the form. A
  slug that isn't in `EVENTS` is treated as still open.
- After changing `Code.gs`: **Deploy → Manage deployments → ✏️ edit → Version:
  New version → Deploy.** This keeps the **same URL**, so you don't need to touch
  the GitHub secret again. (Creating a brand-new deployment instead gives a new
  URL — avoid that unless you mean to.)

## Gameday Command Center content

The `/gameday` page reads its contents from four tabs in the same
"elnerds RSVPs" spreadsheet, so the run of show, streams, milestones and
banner can all be changed **during** the marathon without a deploy. The page
re-reads once a minute, so an edit shows up within about a minute on every
open browser — no one has to refresh.

The tabs are created with headers and starter rows the first time the page
asks for them. Just open the sheet and type.

| Tab | Columns | Notes |
| --- | --- | --- |
| `Gameday Streams` | Name, Description, Embed URL, Channel URL | Leave **Embed URL** blank and the tile stays an empty "stream slot". Fill it in and the tile becomes a live player — use the platform's *embed* URL, not the channel page, and append `&parent=elnerds.com` for Twitch or the player refuses to load. |
| `Gameday Run of Show` | Time, Title, Detail | Times are display text ("2:00 AM"), not parsed. |
| `Gameday Incentives` | Amount, What | |
| `Gameday Notice` | one message in cell **A2** | Shows as a banner across the top. Clear the cell to hide it. |

Rows whose first cell is empty are skipped, so gaps and half-typed rows are
safe. If a whole tab is emptied, the page falls back to the copy that ships
with the site rather than rendering an empty section.

**This needs `Code.gs` redeployed** (see below) before it does anything — until
then the endpoint doesn't answer `?action=gameday` and the page quietly shows
its built-in copy.

## Limits & notes

- Free Gmail sends to ~100 recipients/day. Each RSVP = 2 emails, so ~50
  RSVPs/day. For a bigger push, use a Google Workspace account (~1,500/day) or
  move to a Cloudflare Worker + Resend later (the frontend wouldn't change).
- Emails send "from" the owning Google account's address, not `rsvp@elnerds.com`.
- The endpoint is public but only does what `Code.gs` allows: validate an RSVP,
  append a row, send those emails, or cancel by token. It can't read the sheet back.
