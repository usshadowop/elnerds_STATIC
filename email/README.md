# Extra Life Nerds — Announcement Email

`elnerds-announcement.html` is a production-ready, brand-matched HTML email announcing:

- The refreshed **ELNerds.com** website
- **Game Day 2026: November 14–15**
- The new venue — **Improving, 3033 Excelsior Blvd #180, Minneapolis, MN 55416**

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
- **Dark mode**: `prefers-color-scheme` + `[data-ogsc]` (Outlook.com) overrides.
- Responsive `@media` breakpoint at 620px (full-width buttons, scaled headings).
- No JavaScript, no external CSS. Only external dependency is the Nunito web
  font (with a safe system fallback); it degrades gracefully where blocked.

## Sending

Paste the raw HTML into your ESP (Mailchimp, Brevo, MailerLite, Constant
Contact, Amazon SES, SendGrid). The footer contains merge-tag placeholders:

- `{{unsubscribe}}` — unsubscribe link
- `{{update_profile}}` — preference-center link

Replace these with your provider's merge tags (e.g. Mailchimp
`*|UNSUB|*`, Brevo `{{ unsubscribe }}`) before sending.

**Best practices:** send from an `@elnerds.com` address, configure SPF/DKIM/DMARC,
and test rendering in Gmail, Outlook, Apple Mail, and mobile before a full send.
Do not send directly from personal Gmail/Outlook.
