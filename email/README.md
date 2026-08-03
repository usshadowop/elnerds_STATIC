# Extra Life Nerds — Announcement Email

`elnerds-announcement.html` (general list) and `elnerds-announcement-vip.html`
(VIP list — adds a personalized thank-you and a "VIP Supporter" badge) are
production-ready, brand-matched HTML emails announcing:

- **Game Day 2026: November 14–15** (with an RSVP chip → `/rsvp/marathon`)
- The new venue — **Improving, 3033 Excelsior Blvd #180, Minneapolis, MN 55416**
- **Extra Life Bingo, Aug 8** at Truplayerz — pricing, an RSVP chip
  (`/rsvp/bingo`), and a "Directions to Truplayerz" chip
- The refreshed **ELNerds.com** website

Event details mirror [`src/lib/rsvpEvents.ts`](../src/lib/rsvpEvents.ts) and
[`src/components/site/Schedule.tsx`](../src/components/site/Schedule.tsx) —
update those and this email together.

## Branding

Colors, typography, buttons, and spacing are derived directly from the website
source (`src/styles.css` and site components):

| Token | Value |
| --- | --- |
| Cream (background) | `#fdfaf6` |
| Ink (text) | `#1a2b4a` |
| Ink soft | `#4a5a73` |
| Teal | `#1d6e7a` |
| Teal bright | `#2a8a96` |
| Magenta | `#c8327c` |
| Orange | `#e87722` |
| Purple | `#6b3d8a` |
| Font | Nunito (900 for display), Arial/Helvetica fallback |

Buttons use the site's full-radius pill style: orange-filled primary CTA and
teal-outline secondary CTA, matching the site nav/hero.

## Technical notes

- Table-based layout, 600px max width, all critical CSS inlined.
- **Outlook**: VML `roundrect` bulletproof buttons + MSO conditional wrapper.
- **Light theme only**: `color-scheme: light only` plus `light` color-scheme
  meta tags; no `prefers-color-scheme` or `[data-ogsc]` dark variants. Every
  colour is set inline, so clients that respect `color-scheme` (Apple Mail,
  iOS Mail) keep the light design on dark-mode devices. Gmail's mobile apps
  and Outlook.com apply their own forced inversion that no email HTML can
  fully opt out of — the design degrades gracefully there.
- Responsive `@media` breakpoint at 620px (full-width buttons, scaled headings).
- No JavaScript, no external CSS. Only external dependency is the Nunito web
  font (with a safe system fallback); it degrades gracefully where blocked.

## Live preview

`public/email/index.html` and `public/email/elnerds-announcement.html` are
copies of the general template, published at
[elnerds.com/email/](https://elnerds.com/email/). Re-copy them whenever the
source template changes:

```bash
cp email/elnerds-announcement.html public/email/elnerds-announcement.html
cp email/elnerds-announcement.html public/email/index.html
```

The preview shows the raw Brevo tags as literal text — that's expected;
they only resolve when Brevo sends the campaign.

## Sending

Paste the raw HTML into your ESP. Both templates are written for **Brevo**
and carry its merge tags:

- `{{ unsubscribe }}` — footer unsubscribe link
- `{{ mirror }}` — "View it in your browser" link at the top
- `{{ contact.FULL_NAME|default:"there" }}` — greeting, falls back to "there" when blank

On another provider (Mailchimp, MailerLite, SES, SendGrid), swap these for
that provider's equivalents — e.g. Mailchimp `*|UNSUB|*`, `*|ARCHIVE|*`,
`*|FNAME|*` — before sending.

**Using Brevo with two lists (VIP + General) sending as `info@elnerds.com`:**
see [`BREVO_SETUP.md`](./BREVO_SETUP.md) for the full step-by-step —
sender/domain verification, creating the two lists, and setting up both
campaigns on Brevo's free plan.

**Best practices:** send from an `@elnerds.com` address, configure SPF/DKIM/DMARC,
and test rendering in Gmail, Outlook, Apple Mail, and mobile before a full send.
Do not send directly from personal Gmail/Outlook.
