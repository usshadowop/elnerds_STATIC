# Branding design docs

- **Status:** Live — `email/` section complete; no other surfaces documented yet
- **Last reviewed:** 2026-09-18
- **Covers:** `branding/*`

## Purpose

Design source of truth for surfaces that can't read the site's Tailwind
tokens — email being the first and, so far, only one. The goal is that a
teammate can point a developer or an AI model at one file in this repo and
get back a correct, on-brand email without knowing anything else about the
project.

## Where it lives

- `branding/README.md` — what the directory is for, and what it deliberately
  does *not* duplicate (the site's own styling stays in `src/styles.css`).
- `branding/email/DESIGN_BRIEF.md` — the entry point. Self-contained:
  audience, voice, brand values, the eight hard client constraints, how to
  assemble a body, pre-send checklist.
- `branding/email/template.html` — the skeleton, with `[[PLACEHOLDERS]]`.
- `branding/email/blocks.html` — ten section blocks.
- `branding/email/tokens.md` — authoritative palette, type scale, layout.

Campaigns themselves live in `email/` at the repo root, published from
`public/email/`. This directory holds the template and the rules, not the
sends.

## How it works

Everything in `branding/email/` was extracted from the shipped announcement
email (`email/elnerds-announcement.html`), so the markup is already proven in
real inboxes rather than freshly authored. `template.html` carries the chrome
that is easy to get wrong and never needs to change — doctype, resets, the
`[if mso]` conditionals, the 600px container with its Outlook fallback table,
the preheader entity padding, and the whole footer including the mandatory
`{{ unsubscribe }}` tag. `blocks.html` carries the parts that vary.

Placeholders are `[[DOUBLE_SQUARE]]` so they can never collide with Brevo's
`{{ curly }}` merge tags, which also makes an unfilled one mechanically
detectable before a send:

```bash
grep -o '\[\[[A-Z_]*\]\]' your-email.html    # must print nothing
```

## Decisions and gotchas

- **The brief states the *reason* for each constraint, not just the rule.**
  That's the whole value: an AI working from the palette alone will happily
  reinvent a `<div>` layout, drop the VML button twin, or use
  `FIRSTNAME`. The eight constraints each cost someone real time once.
- **The reference email is upstream of these docs.** If the design of
  `email/elnerds-announcement.html` changes, `tokens.md` and `blocks.html`
  can silently go stale — and the commit guard will *not* catch it, because
  the campaign files are content and aren't in `Covers` (blocking every copy
  edit would just train people to type `no-card`). The 90-day review report
  is the backstop. When reviewing this card, diff the tokens against what
  the shipped email actually uses.
- **Two flaws found by smoke-testing the template**, both fixed, both worth
  not reintroducing: the instruction comment contained placeholder-shaped
  text, which made the pre-send grep never come back empty; and it contained
  a literal curly-brace example that Brevo would have tried to resolve. Keep
  that comment free of both.
- The blocks' banner comments are multi-line, so a naive script that splits
  on the first line leaves the banner's closing `-->` as stray text inside
  the table. Humans copy-pasting are unaffected; anything automated must
  consume the whole comment.
- **Verification method:** assemble an email from the template plus a few
  blocks with no hand edits, render it, and confirm it matches the shipped
  email's layout width at 700px and 320px (currently `700` and `418`). That
  catches structural breakage the eye misses.

## Manual steps and open questions

- Nothing blocking. The docs are inert — they describe markup, they don't
  run.
- **Open:** `branding/` has room for siblings (site, logos, social) if those
  surfaces ever need documenting. Only `email/` exists today.
- When a new campaign is written, it goes in `email/` — and the announcement
  email is served from **two** copies under `public/email/` that drift
  silently if only one is updated (see `CLAUDE.md`).
