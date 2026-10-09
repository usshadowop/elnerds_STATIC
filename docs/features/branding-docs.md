# Branding design docs

- **Status:** Live — `email/` section complete; no other surfaces documented yet
- **Last reviewed:** 2026-10-09 (template preview moved to /email/template/)
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
- `branding/email/README.md` — the handoff switchboard: which of the three
  ways to give this to someone applies (repo access / can browse / can
  neither), and the file index.
- `branding/email/DESIGN_BRIEF.md` — the entry point. Self-contained:
  audience, voice, brand values, the eight hard client constraints, how to
  assemble a body, pre-send checklist.
- `branding/email/template.html` — the skeleton, with `[[PLACEHOLDERS]]`.
- `branding/email/blocks.html` — twelve section blocks (11 and 12, the
  tinted section and reward card, came from the Sep 2026 email).
- `branding/email/tokens.md` — authoritative palette, type scale, layout.
- `branding/email/BRIEF_BUNDLE.md` — all four of the above concatenated into
  one self-contained file, for an assistant that can't read the repo.
  **Generated** by `branding/email/build-bundle.sh`; never hand-edited.
- `branding/email/build-preview.py` — builds `public/email/template/index.html`,
  the page at <https://elnerds.com/email/template/>: the template with all twelve
  blocks in its content slot, each under a small "Block N" label, and a
  notice at the top. `build-bundle.sh` runs it, so one command refreshes
  both generated files.

Campaigns themselves live in `email/` at the repo root (sent ones in
`email/archive/`, each published under `public/email/archive/`). This directory holds the template and the rules,
not the sends.

## How it works

Everything in `branding/email/` was extracted from the shipped announcement
email (`email/archive/2026-08-announcement/elnerds-announcement.html`), so the markup is already proven in
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

- **The guard forces the card to be *touched*, not to be *right*.** PR #36
  added `BRIEF_BUNDLE.md` and `build-bundle.sh`, the guard duly blocked the
  commit, the card was updated — and it still shipped without
  `branding/email/README.md` listed, even though that file had just become
  the handoff switchboard. Caught by auditing the card's file list against
  `git ls-tree` afterwards. Worth repeating that check when reviewing:

  ```bash
  git ls-tree -r --name-only HEAD | grep '^branding/'
  ```

- **Three ways to hand this off, because the pointer doesn't always work.**
  An AI with repo access gets `DESIGN_BRIEF.md` by path. One that can browse
  gets raw.githubusercontent URLs — the repo is public, verified HTTP 200
  unauthenticated. One that can do neither gets `BRIEF_BUNDLE.md` pasted.
  The bundle exists because the first two paths silently fail for an outside
  assistant: it won't say "I can't see that file", it will invent brand
  details instead.
- **`BRIEF_BUNDLE.md` is generated and will go stale if the sources change
  and nobody re-runs the script.** It's the one derived artifact here. The
  commit guard helps — editing any `branding/` file forces this card into
  the commit, which is the prompt to remember — but it can't check the
  bundle is current. If you touch the brief, tokens, template or blocks,
  run `./branding/email/build-bundle.sh` in the same commit.
- **The brief states the *reason* for each constraint, not just the rule.**
  That's the whole value: an AI working from the palette alone will happily
  reinvent a `<div>` layout, drop the VML button twin, or use
  `FIRSTNAME`. The eight constraints each cost someone real time once.
- **The reference email is upstream of these docs.** If the design of
  the reference email changes, `tokens.md` and `blocks.html`
  can silently go stale — and the commit guard will *not* catch it, because
  the campaign files are content and aren't in `Covers` (blocking every copy
  edit would just train people to type `no-card`). The 90-day review report
  is the backstop. When reviewing this card, diff the tokens against what
  the shipped email actually uses.
- **brevo.com's firewall blocked the owner for pasting HTML that quoted a
  shell command.** The template's instruction comment used to include the
  `grep` placeholder check verbatim; the sign-up/recruit email (Sep 2026)
  kept that comment, and pasting it into Brevo got the sender blocked
  (the August email, which predates the template, pasted fine). The
  comment now points at `README.md` for the check instead, and says to
  delete it before pasting. Keep commands out of anything that gets
  pasted into Brevo.
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
- When a new campaign is written, it goes in `email/`; the previous one moves
  to `email/archive/` (see `email/archive/README.md`).
- **The social icon row was tried and not adopted.** The Sep 2026 email
  closed with a row of icon images; the owner then chose to keep socials as
  text links in the footer (Instagram | Facebook | Discord | Newsletter)
  and to add an outlined Donate button above the CMN badge instead. The
  icon PNGs stay in `public/email/assets/` because the archived email
  still uses them.
