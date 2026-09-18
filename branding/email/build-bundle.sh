#!/usr/bin/env bash
# Regenerates BRIEF_BUNDLE.md — the whole email design system as one
# self-contained file, for handing to an AI that cannot read this repo.
#
# BRIEF_BUNDLE.md is GENERATED. Never edit it by hand; edit the four source
# files and re-run this:
#
#     ./branding/email/build-bundle.sh
#
# Run from anywhere; paths resolve against the script's own location.

set -euo pipefail

cd "$(dirname "$0")"
OUT="BRIEF_BUNDLE.md"

{
  cat <<'HEADER'
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

HEADER

  echo "# 1. The brief"
  echo
  # Demote the brief's own H1 so the bundle keeps one heading hierarchy.
  sed 's/^# /## /' DESIGN_BRIEF.md
  echo
  echo '---'
  echo
  echo "# 2. Design tokens"
  echo
  sed 's/^# /## /' tokens.md
  echo
  echo '---'
  echo
  echo "# 3. The template"
  echo
  echo 'Copy this, then fill every `[[PLACEHOLDER]]`.'
  echo
  echo '```html'
  cat template.html
  echo '```'
  echo
  echo '---'
  echo
  echo "# 4. The block library"
  echo
  echo 'Assemble the body from these. Not a sendable email on its own.'
  echo
  echo '```html'
  cat blocks.html
  echo '```'
} > "$OUT"

echo "Wrote $OUT ($(wc -c < "$OUT") bytes, $(wc -l < "$OUT") lines)"
