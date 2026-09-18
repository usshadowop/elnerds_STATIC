#!/usr/bin/env bash
# Reports feature cards nobody has reviewed in 90+ days. Wired as a
# SessionStart hook in .claude/settings.json.
#
# The commit guard only catches features someone is actively working on.
# Untouched code drifts too — dependencies move, the Extra Life API changes,
# a manual step quietly gets done — so cards resurface on a timer as well.

set -uo pipefail

STALE_DAYS=90

root="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
[ -n "$root" ] && [ -d "$root/docs/features" ] || exit 0
cd "$root" || exit 0

# Portable YYYY-MM-DD -> epoch seconds. Silently gives up on a date command
# that supports neither form, since a missing report must not break startup.
to_epoch() {
  date -d "$1" +%s 2>/dev/null || date -j -f "%Y-%m-%d" "$1" +%s 2>/dev/null
}

now=$(date +%s)
probe=$(to_epoch "2026-01-01") || exit 0
[ -n "$probe" ] || exit 0

stale=""
for card in docs/features/*.md; do
  [ -e "$card" ] || continue
  case "$card" in */README.md) continue ;; esac

  reviewed=$(grep -m1 -E '^\s*-\s+\*\*Last reviewed:\*\*' "$card" 2>/dev/null \
    | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}')

  if [ -z "$reviewed" ]; then
    stale="${stale}  - ${card} (no Last reviewed date)"$'\n'
    continue
  fi

  then_epoch=$(to_epoch "$reviewed") || continue
  [ -n "$then_epoch" ] || continue

  age=$(( (now - then_epoch) / 86400 ))
  if [ "$age" -ge "$STALE_DAYS" ]; then
    stale="${stale}  - ${card} (${age} days since review)"$'\n'
  fi
done

[ -n "$stale" ] || exit 0

note="Feature cards not reviewed in ${STALE_DAYS}+ days:"$'\n'"${stale}"
note="${note}"$'\n'"Re-read each against the code it Covers. If it's still accurate, bump Last reviewed anyway — that's the signal someone looked."

jq -n --arg note "$note" '{
  systemMessage: $note,
  hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: $note }
}'
