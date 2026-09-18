#!/usr/bin/env bash
# Blocks a `git commit` that changes a feature's files without updating that
# feature's card. Wired as a PreToolUse hook on Bash in .claude/settings.json.
#
# The path -> card mapping comes from each card's own "**Covers:**" line, so
# adding a card extends this check automatically and the mapping can't drift
# away from the card that owns it.
#
# Escape hatch: put `no-card` anywhere in the commit command (in the message,
# or as a trailing `# no-card` comment) for changes no card describes.
#
# Exit 0 = allow, exit 2 = block and tell Claude why.

set -uo pipefail

payload=$(cat)
command=$(printf '%s' "$payload" | jq -r '.tool_input.command // ""' 2>/dev/null) || exit 0

# Only care about commits.
case "$command" in
  *"git commit"*) ;;
  *) exit 0 ;;
esac

# Deliberate opt-out.
case "$command" in
  *no-card*) exit 0 ;;
esac

root="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
[ -n "$root" ] && [ -d "$root/docs/features" ] || exit 0
cd "$root" || exit 0

changed=$(git diff --cached --name-only 2>/dev/null)
# `git commit -a` stages tracked edits at commit time, so they aren't in the
# index yet — fold them in when that flag is present.
case "$command" in
  *" -a"*|*" -am"*|*" --all"*)
    changed=$(printf '%s\n%s\n' "$changed" "$(git diff --name-only 2>/dev/null)")
    ;;
esac

changed=$(printf '%s\n' "$changed" | sed '/^$/d' | sort -u)
[ -n "$changed" ] || exit 0

staged_card() {
  printf '%s\n' "$changed" | grep -qxF "$1"
}

missing=""
for card in docs/features/*.md; do
  [ -e "$card" ] || continue
  case "$card" in */README.md) continue ;; esac

  covers=$(grep -m1 -E '^\s*-\s+\*\*Covers:\*\*' "$card" 2>/dev/null \
    | grep -oE '`[^`]+`' | tr -d '`')
  [ -n "$covers" ] || continue

  hit=""
  while IFS= read -r glob; do
    [ -n "$glob" ] || continue
    while IFS= read -r file; do
      # shellcheck disable=SC2254
      case "$file" in $glob) hit="$file"; break ;; esac
    done <<< "$changed"
    [ -n "$hit" ] && break
  done <<< "$covers"

  if [ -n "$hit" ] && ! staged_card "$card"; then
    missing="${missing}  - ${card} (you changed ${hit})"$'\n'
  fi
done

[ -n "$missing" ] || exit 0

{
  echo "Feature cards are out of date with this commit."
  echo
  echo "These cards describe files you're committing, but aren't in the commit:"
  echo
  printf '%s' "$missing"
  echo
  echo "Update each card — what changed in How it works, any new Decisions and"
  echo "gotchas, and bump Last reviewed to today — then stage it and commit again."
  echo
  echo "If no card describes this change (a lockfile bump, a typo, the cards"
  echo "themselves), add 'no-card' to the commit message and it will go through."
} >&2

exit 2
