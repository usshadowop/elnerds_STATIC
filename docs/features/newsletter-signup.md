# Newsletter signup

- **Status:** Live (backend verified 2026-09-25)
- **Last reviewed:** 2026-09-25
- **Covers:** `src/pages/Newsletter.tsx`, `src/lib/newsletter.ts`

## Purpose

A place to collect email addresses for the team newsletter, and to record
who referred each person.

## Where it lives

- `src/pages/Newsletter.tsx`: `/newsletter`, with an Email field and an
  optional "Referred by" field.
- `src/lib/newsletter.ts`: the POST client.
- `handleNewsletter_` in `apps-script/Code.gs` (owned by
  [rsvp-backend](rsvp-backend.md)) writes each signup to the sheet.
- Links to the page:
  - an envelope icon after Discord in `SiteNav.tsx`, on desktop (1120px and
    wider, with the other social icons) and in the phone menu;
  - a centred "Sign up for our newsletter" button at the top of
    `Footer.tsx`, directly under the Leadership section on the home page.
  The nav and footer are left off `Covers` on purpose. They hold much more
  than these links, and listing them would force every nav edit to touch
  this card.

## How it works

The form posts `{ type: "newsletter", email, referral, website }` to the
same Apps Script endpoint as the RSVP forms (`VITE_RSVP_ENDPOINT`). The
`type` field sends it to `handleNewsletter_` instead of the RSVP path. That
handler:

- adds a row (Timestamp, Email, Referred by) to a "Newsletter" tab in the
  "elnerds RSVPs" sheet, creating the tab on the first signup;
- emails the captain for each new address.

The page never contacts Brevo. To send a newsletter, export the tab and
import it into Brevo.

`/newsletter?ref=Josh` pre-fills "Referred by", so a member can share their
own link.

## Decisions and gotchas

- **Signing up twice is a quiet success.** The address is compared without
  case or surrounding spaces. A duplicate adds no row and sends no email, but
  the visitor still sees "You're subscribed!". Returning an error would tell
  a stranger whether an address is already on the list.
- **Bot trap:** the form has a hidden `website` field that people never see.
  If it arrives filled in, the backend reports success but saves nothing.
- **The subscriber gets no confirmation email.** Only the captain is
  notified. There is no double opt-in, and no unsubscribe step on the site;
  Brevo's `{{ unsubscribe }}` covers that when mail goes out.
- **An older `Code.gs` rejects these posts** with "Invalid submission.",
  because they have no `name` or `title`. So a stale deployment can never
  mistake a signup for an RSVP; the form just shows an error.

## Manual steps and open questions

- **Verified live on 2026-09-25**, by posts straight to the endpoint:
  - a test signup, `newsletter-test@example.com`, returned ok. That row can be
    deleted from the sheet;
  - the same address with different capitals returned ok without adding a
    row;
  - a bad address was refused.
- Each signup sends one captain email, and free Gmail allows about 100 a
  day, shared with RSVPs. A big signup push could hit that cap. Rows are
  still saved if it does; only the notification emails stop.
