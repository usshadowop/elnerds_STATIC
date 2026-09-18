# Extra Life Nerds — email design brief

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
