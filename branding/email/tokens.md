# Email design tokens

Every value below is taken from the shipped announcement email
(`email/elnerds-announcement.html`), not from the site's CSS. Email clients
can't read CSS custom properties, so these have to be typed as literal hex
and px into inline styles — which is exactly why they need writing down.

## Palette

The five brand colours, same values as the site's `--color-*` tokens:

| Role | Hex | Used for |
| --- | --- | --- |
| Ink | `#1a2b4a` | Headlines, big dates, strong text |
| Ink soft | `#4a5a73` | Body copy — the workhorse |
| Teal | `#1d6e7a` | Primary accent, links, eyebrows, primary buttons |
| Magenta | `#c8327c` | Emphasis inside headlines, "Heal Kids.", alerts |
| Orange | `#e87722` | The main call-to-action button, "we're moving" eyebrow |
| Purple | `#6b3d8a` | Bingo / secondary event theming |
| Gold | `#d4a017` | Partner-event bullets only |

Grounds and lines:

| Role | Hex | Used for |
| --- | --- | --- |
| Cream | `#fdfaf6` | Page background outside the card |
| White | `#ffffff` | Card surface |
| Line | `#e6eaed` | Card borders, dividers, social-link separators |
| Teal soft | `#e6f2f3` | Tinted section band (Game Day, monitored-inbox note) |
| Teal mist | `#eef7f7` | Hero band base |
| Magenta soft | `#fbe7f0` | Hero gradient end stop |
| Purple soft | `#f3ecf7` | Bingo section band |
| Purple line | `#e6d9ee` | Bingo pricing-card border |
| Muted | `#8a97a8` | View-in-browser, footer meta |
| Muted light | `#a6b0be` | Unsubscribe line |
| Muted lighter | `#c2ccd8` | Copyright line |

**Section bands are how the email is paced.** Full-bleed tinted rows
(`#e6f2f3` teal, `#f3ecf7` purple) alternate with white rows, and each band
carries the accent colour of the event it's about. That's the one structural
idea worth preserving in a new email.

## Type

```
font-family:'Nunito',Helvetica,Arial,sans-serif
```

on every text element. The `<body>` uses the longer stack with
`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto` in front of
Helvetica. Nunito is pulled from Google Fonts inside an `[if !mso]`
conditional, so Outlook and any client that blocks web fonts falls back to
the stack — the design must survive that, which is why nothing depends on
Nunito's exact metrics.

Weights run heavy: **900** for headlines and dates, **800** for buttons and
eyebrows, **700** for emphasis, **600** for body, **500** only in the one
long paragraph.

| Size | Weight | Role | Mobile override |
| --- | --- | --- | --- |
| 42px | 900 | `h1` hero headline, `letter-spacing:-1px` | 30px (`.h1`) |
| 44px | 900 | Big dates, `letter-spacing:-1.5px` | 40px (`.date-xl`) |
| 26px | 900 | `h2` section headline, `letter-spacing:-0.5px` | — |
| 24px | 900 | Event time under a big date | — |
| 20px | 900 | Year stamp (`letter-spacing:3px`), address card name | — |
| 18px | 900 | Section eyebrow (`letter-spacing:1.2px`, uppercase) | 16px (`.event-label`) |
| 16px | 600 | Body copy, list items, sign-off | — |
| 15px | 600/800 | Dense body, bullets, large button labels | — |
| 13px | 700/900 | Card sub-labels, monitored-inbox note | — |
| 12px | 800 | Chips, footer meta (uppercase, `letter-spacing:1.5px`) | — |
| 11px | 800 | Badge pill, social links, unsubscribe | — |

Line heights: `1.05–1.08` on display sizes, `1.2–1.3` on headings,
`1.5–1.65` on body.

## Layout

- Container **600px**, `max-width:600px`, centred, wrapped in an `[if mso]`
  600px table because Outlook ignores `max-width`.
- Card: `background:#ffffff`, `border:1px solid #e6eaed`,
  `border-radius:24px`, `overflow:hidden`.
- Section padding **40px** horizontal, dropping to **24px** on mobile via
  the `.px` class. Vertical padding 36–40px.
- Inner cards `border-radius:16px`, padding `20–22px / 28–30px`.
- Buttons and chips are fully round: `border-radius:100px`.
- Measure is held with `max-width` on the paragraph itself — `420px` and
  `440px` for hero/body copy, `400px` for dense text.

## Mobile

One breakpoint, `max-width:620px`, driving five classes: `.email-container`,
`.fluid`, `.stack-col`, `.px`, `.h1`, `.date-xl`, `.event-label`, and
`.btn a` (which goes full-width). Put those classes on new sections rather
than inventing new media queries.

## Light only, deliberately

`color-scheme: light only` plus the `color-scheme` / `supported-color-schemes`
meta tags. Gmail mobile and Outlook.com force their own inversion anyway and
no email HTML can opt out of that — so the design has to tolerate being
inverted, not fight it. Don't add dark-mode variants; they make it worse.
