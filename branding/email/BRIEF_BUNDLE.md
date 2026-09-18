# Extra Life Nerds — email design system (complete bundle)

**This file is everything you need to build an Extra Life Nerds email.** It
is a concatenation of four documents from the team's repository, bundled so
it can be handed to an assistant that cannot browse or read files. Work only
from what is below — do not guess at brand details that aren't here, and ask
rather than invent.

You will produce **one HTML file**: a complete, sendable email. It goes
through Brevo, so the merge tags described below must survive intact.

Contents:

1. **The brief** — audience, voice, brand, hard constraints, how to assemble
   one, and a pre-send checklist. Read it first, all the way through.
2. **Design tokens** — the authoritative colour, type and layout values.
3. **The template** — the skeleton to start from. Its chrome is already
   correct; fill the placeholders.
4. **The block library** — tested section markup to build the body from.

> Generated from the repository, which is public if you can browse:
> <https://github.com/usshadowop/elnerds_STATIC/tree/main/branding/email>

---

# 1. The brief

## Extra Life Nerds — email design brief

**If you are an AI model or a developer who has been asked to build an
Extra Life Nerds email, this is your brief. Read it start to finish before
writing markup.** It is self-contained: everything you need is here or in
the three files it points to.

- `tokens.md` — the authoritative colour, type and layout values
- `template.html` — the skeleton to start from (chrome is already correct)
- `blocks.html` — tested section markup to assemble the body from
- `../../email/elnerds-announcement.html` — the reference email that all of
  the above was extracted from. When in doubt, look at what shipped.

---

## 1. Who this is for

The Extra Life Nerds are a volunteer team of gamers in Minneapolis who
raise money for **Gillette Children's Hospital** through Extra Life, a
program of Children's Miracle Network Hospitals. The main event is a
24-hour gaming marathon; there are smaller events through the year.

The audience is **supporters, donors and past attendees** — friendly,
already sympathetic, not a cold list. They are reading on a phone. They
want to know: when is it, where is it, and what do you want me to do.

## 2. Voice

Warm, plain, a little playful. Short sentences. Never corporate.

- Say **"the kids"** or **"Gillette Children's Hospital"**, not "our
  beneficiary."
- Lead with the human reason, not the logistics. *"Come for 24 hours or
  come for one — every hour counts."*
- Be specific: real dates, real prices, real addresses. No "stay tuned for
  more details" as a substitute for content.
- The tagline is **"Play Games. Heal Kids."** Use it in a hero, not
  everywhere.
- Em dashes and proper typography — `&mdash;`, `&rsquo;`, `&ndash;`,
  `&bull;`. The reference email uses HTML entities throughout, not raw
  Unicode; match that.
- Sign off as **"— The Extra Life Nerds Team"** with a one-line send-off
  above it.

## 3. Brand at a glance

Full values in `tokens.md`. The essentials:

| | |
| --- | --- |
| Typeface | **Nunito** (Google Fonts), falling back to `Helvetica, Arial, sans-serif` |
| Weights | 900 display, 800 buttons/eyebrows, 700 emphasis, 600 body |
| Ink | `#1a2b4a` headlines · `#4a5a73` body |
| Accents | `#1d6e7a` teal · `#c8327c` magenta · `#e87722` orange · `#6b3d8a` purple · `#d4a017` gold |
| Grounds | `#fdfaf6` page · `#ffffff` card · `#e6f2f3` teal band · `#f3ecf7` purple band |
| Lines | `#e6eaed` |
| Container | 600px, card with `border-radius:24px` and a `1px #e6eaed` border |
| Logo | `https://elnerds.com/email/assets/logo-dark.png` (190×106) |
| CMN badge | `https://elnerds.com/email/assets/cmn-badge.png` (170×68) — required in the footer |

**The look:** a single rounded white card on a cream page, paced by
full-bleed tinted bands. Heavy rounded type, very round buttons
(`border-radius:100px`), generous 40px padding, everything centred. Colour
is used in blocks — each section takes one accent and commits to it,
including its bullets and buttons. It should feel like a friendly poster,
not a newsletter.

## 4. Hard constraints — get these wrong and the email breaks

These are not stylistic preferences. Each one cost someone real time.

1. **Tables and inline styles only.** No flexbox, no grid, no `<div>`
   layout, no external or embedded CSS for anything except the resets and
   the one media query already in `template.html`. Email clients strip the
   rest.
2. **Every button needs its VML twin.** The `<!--[if mso]><v:roundrect>`
   block is what makes a rounded button render in Outlook. Keep both halves
   and keep their two `href`s identical. Widen the VML `width` for a long
   label or Outlook clips the text.
3. **Images are absolute URLs to `elnerds.com/email/assets/`, with `alt`
   text, and only the logo and the CMN badge.** Everything else is CSS and
   type, so the email survives images-off. Don't introduce images for
   layout or text.
4. **`{{ unsubscribe }}` must be in the footer.** Brevo refuses to save a
   campaign without it.
5. **Light theme only.** `color-scheme: light only` and the meta tags are
   already set. Gmail mobile and Outlook.com will force their own inversion
   anyway and no email HTML can prevent that — so tolerate inversion, don't
   add dark-mode variants, which makes it worse.
6. **Personalization is `{{ contact.FULL_NAME|default:"there" }}`.** The
   templating language is **Pongo2** (Django-style), so a default goes
   through the `|default:` filter — a bare `{{contact.X,"fallback"}}`
   silently resolves to nothing. The attribute is `FULL_NAME`, **not**
   Brevo's stock `FIRSTNAME`, and names are case-sensitive; a miss degrades
   silently and every recipient gets "Hi there." There is no reliable
   first-name filter (`first` returns the first *character*,
   `truncatewords:1` appends an ellipsis), so greet with the full name.
7. **`{{ mirror }}`** is the view-in-browser link. There is no
   `{{ update_profile }}` equivalent — don't add one, it ships as a dead
   link.
8. **Keep the preheader entity padding.** The
   `&#847;&zwnj;&nbsp;` run after the preheader text stops clients pulling
   body copy into the inbox preview.

## 5. How to build one

1. Copy `template.html` to a new file. Don't start from a previous
   campaign — you'll inherit its dates.
2. Fill every `[[PLACEHOLDER]]`. They're double-square so they can't be
   confused with Brevo's `{{ }}` tags.
3. Build the body in the `[[CONTENT_SECTIONS]]` slot from `blocks.html`:
   - **3–5 sections.** More than five and nobody reaches the end.
   - **Alternate** tinted bands with white sections.
   - **Lead with whatever has a date on it.** The reference email opens with
     Game Day, not with the website news, because the date is the reason to
     read.
   - **One primary button per email.** Everything else is a chip. Two
     competing calls to action means neither gets clicked.
   - Give each section one accent colour and use it for the eyebrow, the
     bullets and the chip in that section.
4. Check nothing is unfilled:
   ```bash
   grep -o '\[\[[A-Z_]*\]\]' your-email.html    # should print nothing
   ```
5. Run through the checklist below.
6. For sending, follow `../../email/BREVO_SETUP.md`. Paste via **Import a
   code / Rich HTML**, never the drag-and-drop editor, which rewrites the
   markup. Re-pasting can regenerate the plain-text part and clobber hand
   edits to it. The free plan caps at **300 emails/day** across all
   campaigns.

## 6. Before you hand it over

- [ ] No `[[PLACEHOLDER]]` left
- [ ] Every link opens the right page — RSVP links point at
      `elnerds.com/rsvp/<slug>`, and directions links use the
      `https://www.google.com/maps/dir/?api=1&destination=…` form so the
      route starts from the reader's own location (a shared
      `maps.app.goo.gl` directions link bakes in the creator's origin)
- [ ] Every button has its VML twin, with matching `href`s
- [ ] `{{ unsubscribe }}` and `{{ mirror }}` present
- [ ] `{{ contact.FULL_NAME|default:"there" }}` spelled exactly that way
- [ ] Renders at 320px wide without horizontal scroll
- [ ] Reads correctly with images blocked
- [ ] Dates, times, prices and addresses checked against
      `src/lib/rsvpEvents.ts` and `src/lib/scheduleEvents.ts`, which are the
      site's source of truth for them
- [ ] Preheader says something the subject line doesn't

## 7. Where the file goes

A new campaign's HTML lives in `email/` at the repo root — **not** in
`branding/`. This directory holds the template and the rules; `email/` holds
the campaigns. And note the trap documented in `CLAUDE.md`: the announcement
email is served from **two** copies under `public/email/`, which drift
silently if you update one and forget the other.

---

# 2. Design tokens

## Email design tokens

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

---

# 3. The template

Copy this, then fill every `[[PLACEHOLDER]]`.

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<!--
  Extra Life Nerds — email template.

  Everything outside the CONTENT SECTIONS marker below is chrome: it is
  already correct and should be copied as-is. Fill in every placeholder,
  then build the middle out of blocks from blocks.html.

  Placeholders use double square brackets on purpose — Brevo's own merge
  tags use curly braces, so the two can never be confused, and an unfilled
  placeholder is greppable before you send:

      grep -o '\[\[[A-Z_]*\]\]' your-email.html

  That check should come back empty. (This comment deliberately contains no
  placeholder-shaped text and no curly-brace tags, so it can't produce a
  false positive or get resolved by Brevo. Delete it if you'd rather.)

  See README.md for the workflow and DESIGN_BRIEF.md for the rules.
-->
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>[[BROWSER_TITLE]]</title>

  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->

  <!--[if !mso]><!-->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
  <!--<![endif]-->

  <style type="text/css">
    /* ---------- Force light theme (no dark-mode variants) ---------- */
    :root { color-scheme: light only; supported-color-schemes: light only; }

    /* ---------- Resets ---------- */
    html, body { margin: 0 !important; padding: 0 !important; height: 100% !important; width: 100% !important; }
    * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; border-collapse: collapse !important; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    a { text-decoration: none; }
    #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; }
    .im { color: inherit !important; }

    /* ---------- Mobile ---------- */
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; margin: 0 auto !important; }
      .fluid { width: 100% !important; max-width: 100% !important; height: auto !important; }
      .stack-col { display: block !important; width: 100% !important; }
      .px { padding-left: 24px !important; padding-right: 24px !important; }
      .h1 { font-size: 30px !important; line-height: 1.12 !important; }
      .date-xl { font-size: 40px !important; line-height: 1.05 !important; }
      .event-label { font-size: 16px !important; letter-spacing: 1px !important; }
      .btn a { display: block !important; width: 100% !important; box-sizing: border-box !important; }
    }

  </style>
</head>

<body style="margin:0; padding:0; width:100%; background-color:#fdfaf6; font-family:'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Preheader (hidden). First ~90 chars show in the inbox preview next to
       the subject line. The entity padding after it stops clients pulling
       body copy into the preview — keep it. -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#fdfaf6; opacity:0;">
    [[PREHEADER]]
    &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
  </div>

  <!-- Outer background -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="bg-outer" style="background-color:#fdfaf6;">
    <tr>
      <td align="center" style="padding:24px 12px;">

        <!--[if mso]>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" align="center"><tr><td>
        <![endif]-->

        <!-- ============ EMAIL CONTAINER ============ -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="email-container" style="width:600px; max-width:600px;">

          <!-- ===== VIEW IN BROWSER ===== -->
          <tr>
            <td class="px" style="padding:14px 32px 0 32px;" align="center">
              <p style="margin:0; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:11px; font-weight:600; color:#8a97a8;">
                Trouble viewing this email? <a href="{{ mirror }}" style="color:#1d6e7a; font-weight:700; text-decoration:underline;">View it in your browser</a>
              </p>
            </td>
          </tr>

          <!-- ===== HEADER / LOGO ===== -->
          <tr>
            <td class="px" style="padding:8px 32px 20px 32px;" align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://elnerds.com" style="text-decoration:none;">
                      <img src="https://elnerds.com/email/assets/logo-dark.png" width="190" height="106" alt="Extra Life Nerds" style="display:inline-block; width:190px; height:106px; max-width:100%;" />
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ===== HERO CARD ===== -->
          <tr>
            <td style="padding:0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="card" style="background-color:#ffffff; border:1px solid #e6eaed; border-radius:24px; overflow:hidden;">

                <!-- Hero band -->
                <tr>
                  <td class="px" style="padding:40px 40px 36px 40px; background-color:#eef7f7; border-radius:24px 24px 0 0; background-image:linear-gradient(135deg,#e6f2f3 0%,#ffffff 52%,#fbe7f0 100%);" align="center">

                    <!-- Personalized greeting. FULL_NAME is the real attribute
                         name in Brevo — not FIRSTNAME. Keep the default filter. -->
                    <p style="margin:0 0 14px 0; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:14px; font-weight:700; color:#4a5a73;">
                      Hi {{ contact.FULL_NAME|default:"there" }} &mdash;
                    </p>

                    <!-- Badge pill: 2–4 words per segment, separated by bullets -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 22px auto; border:none;">
                      <tr>
                        <td style="background-color:#ffffff; border:none; border-radius:100px; padding:8px 16px;" align="center">
                          <span style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:11px; font-weight:800; letter-spacing:2px; text-transform:uppercase; color:#1d6e7a;"><span style="color:#c8327c;">&#9679;</span>&nbsp; [[BADGE_PILL]]</span>
                        </td>
                      </tr>
                    </table>

                    <h1 class="h1" style="margin:0 0 14px 0; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:42px; line-height:1.08; font-weight:900; letter-spacing:-1px; color:#1a2b4a;">
                      [[HEADLINE_A]]<br />
                      <span style="color:#c8327c;">[[HEADLINE_B]]</span>
                    </h1>

                    <p style="margin:0; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6; font-weight:600; color:#4a5a73; max-width:420px;">
                      [[HERO_BLURB]]
                    </p>
                  </td>
                </tr>

                <!-- ============================================================
                     CONTENT SECTIONS

                     Build the body here from blocks.html. Rules of thumb:
                       - 3 to 5 sections. More than five and nobody reaches the end.
                       - Alternate tinted bands with white sections.
                       - One primary call to action; everything else is a chip.
                       - Lead with the thing that has a date on it.
                       - Put a divider between unrelated topics, not between
                         a tinted band and the section after it.
                     ============================================================ -->

                [[CONTENT_SECTIONS]]

                <!-- ============ /CONTENT SECTIONS ============ -->

              </table>
            </td>
          </tr>

          <!-- ===== SIGN-OFF ===== -->
          <tr>
            <td class="px" style="padding:32px 40px 8px 40px;" align="center">
              <p style="margin:0; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6; font-weight:700; color:#4a5a73;">
                [[SIGNOFF]]
              </p>
              <p style="margin:4px 0 0 0; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6; font-weight:900; color:#1a2b4a;">
                &mdash; The Extra Life Nerds Team
              </p>
            </td>
          </tr>

          <!-- ===== FOOTER — fixed. Do not restyle; the unsubscribe tag is
                     required and Brevo will not save a campaign without it. -->
          <tr>
            <td class="px" style="padding:28px 40px 12px 40px;" align="center">
              <!-- Social links -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 16px auto;">
                <tr>
                  <td style="padding:0 8px;"><a href="https://www.instagram.com/elnerdsmn/" style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:11px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; color:#c8327c;">Instagram</a></td>
                  <td style="color:#e6eaed;">|</td>
                  <td style="padding:0 8px;"><a href="https://www.facebook.com/extralifenerds/" style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:11px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; color:#1d6e7a;">Facebook</a></td>
                  <td style="color:#e6eaed;">|</td>
                  <td style="padding:0 8px;"><a href="https://discord.gg/fg2FMBXwub" style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:11px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; color:#6b3d8a;">Discord</a></td>
                  <td style="color:#e6eaed;">|</td>
                  <td style="padding:0 8px;"><a href="https://www.extra-life.org/team/73600" style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:11px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; color:#e87722;">Donate</a></td>
                </tr>
              </table>

              <!-- CMN Hospitals badge -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 16px auto; border:none;">
                <tr>
                  <td style="background-color:#ffffff; border-radius:12px; padding:10px 16px;" align="center">
                    <img src="https://elnerds.com/email/assets/cmn-badge.png" width="170" height="68" alt="Extra Life, a program of Children's Miracle Network Hospitals" style="display:block; width:170px; height:68px; max-width:100%;" />
                  </td>
                </tr>
              </table>

              <!-- Monitored inbox note -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 16px auto;">
                <tr>
                  <td style="background-color:#e6f2f3; border-radius:12px; padding:12px 20px;" align="center">
                    <p style="margin:0; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:13px; line-height:1.5; font-weight:700; color:#1d6e7a;">
                      This is a monitored email address &mdash; feel free to reply with questions!
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 14px 0; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:12px; line-height:1.6; font-weight:600; color:#8a97a8;">
                <a href="https://elnerds.com" style="color:#1d6e7a; font-weight:800;">ELNerds.com</a>
                &nbsp;&bull;&nbsp; All proceeds support Gillette Children&rsquo;s Hospital
              </p>

              <!-- Unsubscribe (Brevo merge tag) -->
              <p style="margin:0; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:11px; line-height:1.6; font-weight:600; color:#a6b0be;">
                You&rsquo;re receiving this because you&rsquo;ve supported the Extra Life Nerds.<br />
                <a href="{{ unsubscribe }}" style="color:#a6b0be; text-decoration:underline;">Unsubscribe</a>
              </p>
              <p style="margin:12px 0 0 0; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:11px; line-height:1.6; font-weight:600; color:#c2ccd8;">
                &copy; [[YEAR]] Extra Life Nerds
              </p>
            </td>
          </tr>

        </table>
        <!-- ============ /EMAIL CONTAINER ============ -->

        <!--[if mso]>
        </td></tr></table>
        <![endif]-->

      </td>
    </tr>
  </table>

</body>
</html>
```

---

# 4. The block library

Assemble the body from these. Not a sendable email on its own.

```html
<!--
  Extra Life Nerds — email block library.

  Copy-paste sections for template.html's [[CONTENT_SECTIONS]] slot. Every
  block below is lifted from the shipped announcement email, so it is already
  tested in Gmail, Apple Mail and Outlook — change the copy and the colours,
  not the table structure.

  This file is not a sendable email. It's a parts bin.

  Colour swaps: each block notes which hex values are the "theme" of that
  block. Swap all of them together, or the section looks half-repainted.
  Values live in tokens.md.
-->


<!-- ==========================================================================
     1. EVENT BAND — a tinted, full-bleed section built around a date.
     The centrepiece block. Theme colours: #e6f2f3 band, #1d6e7a accent.
     For a purple event: #f3ecf7 band, #6b3d8a accent.
     ========================================================================== -->
<tr>
  <td class="px" style="padding:36px 40px; background-color:#e6f2f3; border-radius:0;" align="center">
    <p class="event-label" style="margin:0 0 12px 0; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:18px; line-height:1.25; font-weight:900; letter-spacing:1.2px; text-transform:uppercase; color:#1d6e7a;">[[EYEBROW]]</p>
    <div class="date-xl" style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:44px; line-height:1.05; font-weight:900; letter-spacing:-1.5px; color:#1a2b4a;">
      [[DATE_LINE_1]]
    </div>
    <!-- Optional second date line, magenta for a range's end -->
    <div class="date-xl" style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:44px; line-height:1.05; font-weight:900; letter-spacing:-1.5px; color:#c8327c;">
      [[DATE_LINE_2]]
    </div>
    <div style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:20px; line-height:1.2; font-weight:900; letter-spacing:3px; color:#1d6e7a; margin-top:8px;">
      [[YEAR]]
    </div>
    <p style="margin:14px auto 0; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:15px; line-height:1.55; font-weight:600; color:#4a5a73; max-width:400px;">
      [[BLURB]]
    </p>
  </td>
</tr>


<!-- ==========================================================================
     2. TEXT SECTION — white, eyebrow + heading + paragraph. The default.
     Eyebrow colour carries the topic: #e87722 orange, #c8327c magenta,
     #1d6e7a teal, #6b3d8a purple.
     ========================================================================== -->
<tr>
  <td class="px" style="padding:40px 40px 8px 40px;" align="center">
    <p style="margin:0 0 10px 0; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:12px; font-weight:800; letter-spacing:2px; text-transform:uppercase; color:#c8327c;">[[EYEBROW]]</p>
    <h2 style="margin:0 0 14px 0; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:26px; line-height:1.2; font-weight:900; letter-spacing:-0.5px; color:#1a2b4a;">
      [[HEADING]]
    </h2>
    <p style="margin:0 auto; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:16px; line-height:1.65; font-weight:500; color:#4a5a73; max-width:440px;">
      [[BODY]]
    </p>
  </td>
</tr>


<!-- ==========================================================================
     3. PRIMARY BUTTON — solid fill, the one main call to action per email.
     Orange (#e87722) by default. The VML block is what makes it render in
     Outlook; keep both halves and keep the two hrefs identical.
     ========================================================================== -->
<tr>
  <td class="px" style="padding:24px 40px 8px 40px;" align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" class="btn">
      <tr>
        <td align="center" style="border-radius:100px; background-color:#e87722;">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="[[HREF]]" style="height:52px;v-text-anchor:middle;width:260px;" arcsize="100%" strokecolor="#e87722" fillcolor="#e87722">
          <w:anchorlock/>
          <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:bold;">[[LABEL_UPPERCASE]]</center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-->
          <a href="[[HREF]]" style="display:inline-block; padding:16px 34px; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:15px; font-weight:800; letter-spacing:1px; text-transform:uppercase; color:#ffffff; background-color:#e87722; border-radius:100px;">[[LABEL]]</a>
          <!--<![endif]-->
        </td>
      </tr>
    </table>
  </td>
</tr>


<!-- ==========================================================================
     4. SECONDARY BUTTON — outlined, white fill. For directions, secondary
     links. Theme: #1d6e7a border and text.
     ========================================================================== -->
<tr>
  <td class="px" style="padding:22px 40px 8px 40px;" align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" class="btn">
      <tr>
        <td align="center" style="border-radius:100px; background-color:#ffffff;">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="[[HREF]]" style="height:52px;v-text-anchor:middle;width:260px;" arcsize="100%" strokecolor="#1d6e7a" fillcolor="#ffffff">
          <w:anchorlock/>
          <center style="color:#1d6e7a;font-family:sans-serif;font-size:15px;font-weight:bold;">[[LABEL_UPPERCASE]]</center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-->
          <a href="[[HREF]]" style="display:inline-block; padding:15px 34px; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:15px; font-weight:800; letter-spacing:1px; text-transform:uppercase; color:#1d6e7a; background-color:#ffffff; border:2px solid #1d6e7a; border-radius:100px;">[[LABEL]]</a>
          <!--<![endif]-->
        </td>
      </tr>
    </table>
  </td>
</tr>


<!-- ==========================================================================
     5. CHIP — a small pill, for use *inside* a band under a date. Solid or
     outlined. Goes in the band's <td>, not in its own <tr>.
     ========================================================================== -->

<!-- 5a. Solid chip -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:18px auto 0 auto;">
  <tr>
    <td align="center" style="border-radius:100px; background-color:#1d6e7a;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="[[HREF]]" style="height:40px;v-text-anchor:middle;width:150px;" arcsize="100%" strokecolor="#1d6e7a" fillcolor="#1d6e7a">
      <w:anchorlock/>
      <center style="color:#ffffff;font-family:sans-serif;font-size:12px;font-weight:bold;">[[LABEL_UPPERCASE]]</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a href="[[HREF]]" style="display:inline-block; padding:11px 24px; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:12px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; color:#ffffff; background-color:#1d6e7a; border-radius:100px;">[[LABEL]] &rarr;</a>
      <!--<![endif]-->
    </td>
  </tr>
</table>

<!-- 5b. Outlined chip. Widen the VML `width` for a longer label or Outlook clips it. -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:10px auto 0 auto;">
  <tr>
    <td align="center" style="border-radius:100px; background-color:#ffffff;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="[[HREF]]" style="height:40px;v-text-anchor:middle;width:230px;" arcsize="100%" strokecolor="#6b3d8a" fillcolor="#ffffff">
      <w:anchorlock/>
      <center style="color:#6b3d8a;font-family:sans-serif;font-size:12px;font-weight:bold;">[[LABEL_UPPERCASE]]</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a href="[[HREF]]" style="display:inline-block; padding:10px 22px; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:12px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; color:#6b3d8a; background-color:#ffffff; border:2px solid #6b3d8a; border-radius:100px;">[[LABEL]]</a>
      <!--<![endif]-->
    </td>
  </tr>
</table>


<!-- ==========================================================================
     6. ADDRESS CARD — venue name + address in a bordered inner card.
     ========================================================================== -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
  <tr>
    <td style="border:1px solid #e6eaed; border-radius:16px; padding:22px 30px; background-color:#ffffff;" align="center">
      <div style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:20px; font-weight:900; color:#1a2b4a;">[[VENUE_NAME]]</div>
      <div style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:15px; line-height:1.5; font-weight:600; color:#4a5a73; margin-top:6px;">
        [[STREET]]<br />
        [[CITY_STATE_ZIP]]
      </div>
    </td>
  </tr>
</table>


<!-- ==========================================================================
     7. DETAIL CARD — a titled list in a bordered inner card. Pricing,
     what's included, what to bring. Border tints with the section
     (#e6d9ee in a purple band, #e6eaed on white).
     ========================================================================== -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:20px auto 0;">
  <tr>
    <td style="border:1px solid #e6d9ee; border-radius:16px; padding:20px 28px; background-color:#ffffff;" align="left">
      <div style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:17px; line-height:1.3; font-weight:900; color:#c8327c; margin:0 0 14px 0;">[[CARD_CALLOUT]]</div>
      <div style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:13px; font-weight:900; letter-spacing:1.5px; text-transform:uppercase; color:#6b3d8a; margin-bottom:10px;">[[CARD_LABEL]]</div>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <!-- Repeat, cycling the bullet colour: purple, teal, orange, magenta -->
        <tr>
          <td style="padding:4px 0;">
            <span style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:15px; font-weight:700; color:#6b3d8a;">&#8226;</span>&nbsp;&nbsp;<span style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:15px; font-weight:600; color:#4a5a73;">[[ITEM]]</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>


<!-- ==========================================================================
     8. BULLETED LIST — free-standing, centred. Bullet colours cycle through
     the palette (teal, magenta, gold, orange) so the list reads as brand
     rather than as a default <ul>. 16px for a standalone list, 15px inside a
     card or band.
     ========================================================================== -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
  <tr>
    <td style="padding:6px 0;">
      <span style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:16px; font-weight:700; color:#1d6e7a;">&#8226;</span>&nbsp;&nbsp;<span style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:16px; font-weight:600; color:#4a5a73;">[[ITEM]]</span>
    </td>
  </tr>
  <tr>
    <td style="padding:6px 0;">
      <span style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:16px; font-weight:700; color:#c8327c;">&#8226;</span>&nbsp;&nbsp;<span style="font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:16px; font-weight:600; color:#4a5a73;">[[ITEM]]</span>
    </td>
  </tr>
</table>


<!-- ==========================================================================
     9. DIVIDER — between unrelated topics. Not needed after a tinted band,
     which already reads as a break.
     ========================================================================== -->
<tr><td class="px" style="padding:32px 40px 0 40px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="border-top:1px solid #e6eaed; font-size:0; line-height:0;">&nbsp;</td></tr></table></td></tr>


<!-- ==========================================================================
     10. CLOSING SECTION — heading in a colour other than ink, short lead-in,
     then a bulleted list. Used as the last section before the sign-off.
     ========================================================================== -->
<tr>
  <td class="px" style="padding:36px 40px 40px 40px;" align="center">
    <h2 style="margin:0 0 12px 0; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:26px; line-height:1.2; font-weight:900; letter-spacing:-0.5px; color:#6b3d8a;">
      [[HEADING]]
    </h2>
    <p style="margin:0 auto 20px; font-family:'Nunito',Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6; font-weight:600; color:#4a5a73; max-width:420px;">
      [[LEAD_IN]]
    </p>
    <!-- Then block 8. -->
  </td>
</tr>
```
