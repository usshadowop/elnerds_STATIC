# Email branding

The template, block library and design rules behind Extra Life Nerds
emails. Extracted from the shipped announcement email
(`../../email/elnerds-announcement.html`) so everything here is already
tested in real inboxes.

## Start here

**[`DESIGN_BRIEF.md`](DESIGN_BRIEF.md)** — the one file to point a developer
or an AI model at. Self-contained: audience, voice, brand values, the hard
client constraints, how to assemble an email, and a pre-send checklist.

> Build me a new Extra Life Nerds email announcing X. Follow
> `branding/email/DESIGN_BRIEF.md` in this repo.

### Handing this to an outside AI

That pointer only works for something that can read the repo. For an
assistant that has never seen it, use one of these instead — the repo is
public, so both work:

**If it can browse the web**, give it the raw URLs:

```
https://raw.githubusercontent.com/usshadowop/elnerds_STATIC/main/branding/email/DESIGN_BRIEF.md
https://raw.githubusercontent.com/usshadowop/elnerds_STATIC/main/branding/email/tokens.md
https://raw.githubusercontent.com/usshadowop/elnerds_STATIC/main/branding/email/template.html
https://raw.githubusercontent.com/usshadowop/elnerds_STATIC/main/branding/email/blocks.html
```

**If it can't browse**, paste [`BRIEF_BUNDLE.md`](BRIEF_BUNDLE.md) — all
four documents concatenated into one self-contained file (~41KB), with a
header that explains to the assistant what it's looking at.

`BRIEF_BUNDLE.md` is **generated**. Don't edit it; edit the four sources and
re-run:

```bash
./branding/email/build-bundle.sh
```

## The rest

| File | What |
| --- | --- |
| [`DESIGN_BRIEF.md`](DESIGN_BRIEF.md) | The brief. Read first. |
| [`tokens.md`](tokens.md) | Authoritative colour, type, layout and mobile values |
| [`template.html`](template.html) | The skeleton — correct chrome, `[[PLACEHOLDERS]]` for content |
| [`blocks.html`](blocks.html) | Ten tested section blocks to build the body from |
| [`BRIEF_BUNDLE.md`](BRIEF_BUNDLE.md) | Generated — all of the above in one paste-able file |
| [`build-bundle.sh`](build-bundle.sh) | Regenerates the bundle |

## What lives where

- **This directory** holds the template and the rules.
- **`email/`** at the repo root holds actual campaigns, plus
  `BREVO_SETUP.md` for the send procedure and `README.md` for the
  announcement email's own notes.
- **`public/email/`** holds the two published copies that serve
  <https://elnerds.com/email/>. They drift silently — see the warning in
  `CLAUDE.md`.

The site's own styling is not duplicated here; it lives in `src/styles.css`
as Tailwind theme tokens. `tokens.md` exists because email clients can't
read those, so the values have to be written down as literal hex and px.

## Keeping it true

These documents describe markup that ships. If you change the template or
the blocks, update `tokens.md` in the same commit, and if a change came out
of a real client bug, write the reason into the brief's hard-constraints
section — that list is only useful because every line on it cost someone
time.
