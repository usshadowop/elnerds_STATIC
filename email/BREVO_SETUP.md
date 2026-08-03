# Sending this campaign with Brevo (free plan)

This walks through sending `elnerds-announcement.html` (general list) and
`elnerds-announcement-vip.html` (VIP list) from **info@elnerds.com** using
Brevo's free plan — 300 emails/day, unlimited contacts, no credit card.

If your combined list is under ~300 people, everything below fits in a
single day. If it's bigger, see **Daily limit** at the bottom.

## 1. Create the account + verify the sender

1. Sign up at [brevo.com](https://www.brevo.com/) (free plan).
2. **Senders, Domains & Dedicated IPs → Senders → Add a sender.** Add
   `info@elnerds.com` as the sender email, "Extra Life Nerds" as the sender
   name.
3. **Authenticate the domain** (strongly recommended — without this, mail
   is far more likely to land in spam): same section → **Domains → Add a
   domain** → enter `elnerds.com`. Brevo gives you SPF, DKIM, and (usually)
   a DMARC TXT record to add at your domain registrar/DNS host.
   - If `elnerds.com`'s DNS is already used for something else (e.g. the
     GitHub Pages site), you're just adding new TXT records alongside it —
     this won't affect the website.
   - Verification can take a few minutes to a few hours to propagate.
     Brevo's dashboard shows a green check once it's confirmed.
4. Once the sender is verified, `info@elnerds.com` is selectable as the
   "From" address on any campaign.

## 2. Create the two lists

**Contacts → Lists → Create a list**, twice:

- **VIP Supporters**
- **General Mailing List**

Import contacts into each (**Import contacts** → CSV/Excel, or paste). At
minimum you need an `EMAIL` column; add `FULL_NAME` if you have it — the
templates use it for the "Hi {{ contact.FULL_NAME }}" greeting (falls back
to "there" if blank, see below). The attribute name must match exactly,
including case: this list uses `FULL_NAME`, not Brevo's stock `FIRSTNAME`,
so map the name column to `FULL_NAME` during import.

A contact can be in both lists (e.g. if you're not sure who counts as
VIP yet) — Brevo dedupes by email per-campaign, so no one gets double
messages as long as you don't add the same list twice to one campaign.

## 3. Create the two campaigns

Repeat for each list:

1. **Campaigns → Email → Create an email campaign.**
2. Name it internally, e.g. `2026 Relaunch — VIP` / `2026 Relaunch — General`.
3. **Subject**: e.g. `Bingo Aug 8, a new venue, and Game Day 2026`
   (VIP version can lead with something like `A quick heads-up for our VIP
   crew`).
4. **From**: `Extra Life Nerds` / `info@elnerds.com` (now selectable since
   step 1).
5. **Design**: choose **"Import a code"** / **"Rich HTML"** (Brevo's editor
   name for pasting raw HTML) and paste the full contents of:
   - `email/elnerds-announcement-vip.html` for the VIP campaign
   - `email/elnerds-announcement.html` for the General campaign
6. **Recipients**: select the matching list (`VIP Supporters` or
   `General Mailing List`). If a contact is on both lists and you don't
   want VIPs to also get the general send, exclude the VIP list under
   "Recipients → Exclude" on the General campaign.
7. Both templates already carry the Brevo tags they need — nothing to
   hand-edit before pasting:
   - `{{ unsubscribe }}` in the footer (Brevo swaps in the real
     one-click unsubscribe URL)
   - `{{ mirror }}` in the "View it in your browser" line at the top
   - `{{ contact.FULL_NAME|default:"there" }}` in the greeting
8. **Send a test** to yourself first (button near the top) and check it in
   Gmail + your phone before sending for real.
9. **Send now** or schedule.

## 4. Personalization notes

Both templates use Brevo Template Language (Pongo2/Django-style filters):

```
{{ contact.FULL_NAME|default:"there" }}
```

This renders the contact's name, or "there" if it's blank — so nobody
gets "Hi ,". No extra setup needed beyond importing a `FULL_NAME` column
in step 2.

Because the attribute holds a full name, the greeting reads "Hi Jane
Smith —". Brevo Template Language is Pongo2 (Django-style) and has no
filter that reliably returns just the first word: `first` returns the
first *character* of a string, and `truncatewords:1` appends an ellipsis
when it truncates ("Jane …"). If a first-name-only greeting matters,
add a separate `FIRSTNAME` attribute in Brevo and populate it, then
switch the tag back.

## Daily limit (free plan)

Brevo's free plan caps at **300 emails/day** total, across all campaigns.
If VIP + General adds up to more than ~300 people:

- Send the smaller VIP list on day one.
- Schedule the General campaign for the next day (Brevo lets you schedule
  a send time when creating the campaign).
- Or upgrade to a paid tier if you need same-day delivery to everyone —
  not required for a one-time announcement.

## After sending

**Campaigns → [your campaign] → Statistics** shows opens, clicks, bounces,
and unsubscribes per list — useful for seeing whether the VIP send
performed differently from the general one.
