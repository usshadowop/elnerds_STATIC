# Module refactor: execution plan

Status: **planned, not started.** Written 2026-11-19 from the owner's locked choices. Nothing below has been built. The owner said "plan it, don't start yet". The work starts when the owner says go, and PR 0.1 comes first.

---

## 1. What this is for

The owner wants elnerds.com rebuilt as a set of **modules**. A module is a named piece of a page, such as the hero, a row of buttons, a photo or the donor wall. The goal is a site that a semi-web-savvy person can keep up **without AI**: someone who edits files on GitHub or in VS Code and knows basic HTML/CSS and a little JavaScript, but not much React or TypeScript.

When the work is done:

- Each page you might rearrange is a short list of modules in a **page file**. Each list of facts (links, leaders, sponsors, incentive amounts, photos) is a plain **content file**.
- A mistake in either file stops the build with a plain-English message that names the file and the entry. The live site stays as it was.
- `/modules` shows every module and its options, as each looks before, during and after Game Day.
- `MAINTAINING.md` has step-by-step recipes for the common changes.

**Out of scope:**
- The emails. `email/`, `public/email/` and `branding/email/` stay hand-coded HTML, sent through Brevo and archived the way they are today.
- The Apps Script backend (`apps-script/Code.gs`). No change is planned to it.
- The team page `/silent-auction`, which stays a code page.

## 2. Checked before planning (2026-11-19)

- `origin/main` is at `27e9fb6` (#236, "Silent auction: stretch bracelet sold for $25 (paid); agate necklace didn't sell"). The working branch matches it.
- There are no open pull requests, and no remote branch is newer than main. The `claude/*` branches date from July to 2026-11-12. `fervent-bell` and `stoic-babbage` are the two known branches that hold only handoff notes (an existing open thread).
- **There is nothing to pick up.** The latest work on main (#226–#236, 2026-11-15 to 11-19) is the Gameday totals and silent-auction tracking, and this plan protects it (section 6).
- `tsc --noEmit` reports 9 errors today, and the build does not run it. The Extra Life team id `73600` is typed into 18 files.

## 3. The locked choices

There are 58 items, locked on 2026-11-19. The source is the decisions page, claude.ai artifact `RSVBvxpZqUHbLbePSWyWmB`. The permanent copy is `docs/plans/module-refactor/decisions.json`, saved with this plan, and the review page is now locked read-only.

- **47 become modules.**
- **2 merge into a bigger module and stay pages:**
  - `gameday-countdown`: the big `/gameday` countdown shows the Countdown / final total module.
  - `leadership-dnd`: `/leadership_DandD` shows the Live streams module.
- **9 are not modules:**
  - `site-nav` and `footer` stay the frame around every page, but read the shared link list.
  - `form-pieces`, `gameday-signups`, `mtg-interest`, `registration-steps`, `rsvp-chooser`, `rsvp-form` and `meet-the-kids`.

How this plan carries out the owner's notes:

- **Buttons** (`cta-buttons`): one generic module called **Buttons**, used as many times as you like. Each copy picks its links by name from one big link list, and the site menu is built from the same list. A link can go to a section of a page (`#donors`), another page (`/prizes`), an outside site, an email address, or play a video.
- **`kids-links` and `victoria-story`** are saved copies of Buttons, not separate modules. Victoria's story is a "video" link that opens the pop-up. So yes, you can make many Buttons copies with different buttons.
- **`hero-photos`** becomes a generic **Photos** module: one photo or a set, laid out single, as a slideshow or as a stack, at a choice of sizes. We recommend, and the owner confirms, that the Why We Play photo carousel (`photo-carousel`) is the same module using the "stack" layout.
- **`hero`**: an example of the Hero by itself is in section 9. It will be on `/modules` from PR 2.3.
- **Renames:** `leadership-incentives` becomes **Incentives**, and `watch-summary` becomes **Stream blurb**.
- **Overrides:**
  - `page-header`, `status-banner` and `section-band` are modules; they had been suggested as building blocks.
  - `prize-tables`, `event-prizes`, `game-week-drawing` and `incentive-extras` are modules; they had been "part of the page". So `/prizes` and `/incentives` become pages built from modules.
  - `meet-the-kids` is not a module; it had been suggested as one.

Section 11 lists all 58, one row per key, with the PR that delivers each.

## 4. How the work is shaped

- **Small PRs, one risky change each.** There are 57 PRs, most of them 1–5 hours. Each one branches from a fresh `origin/main` and is merged in the same session. There is no long-lived refactor branch, because other sessions keep pushing to main.
- **Build beside, then switch.** Each new module is written next to the old code and shown on `/modules` first. A live page switches to it only when the before/after check shows no difference, or the owner has approved the difference.
- **Year-round work first, Game Day work later.** The year-round homepage (Standard Display), `/incentives` and `/newsletter` come first. The Game Day–only pages come after and must be done by **1 September 2027**: the Command Center, `/prizes`, `/parking` and the Gameday Week Runup homepage.
- **No new npm packages, no Puck install, no Code.gs change.** Page files only copy Puck's data shape.
- **Where things live** (settled in PR 1.2):
  - `src/modules/<Type>.tsx` holds one module per file. `<Type>` is the module's name everywhere: `Buttons`, `Photos`, `Hero`.
  - `src/modules/<Type>.meta.json` is the module's label, description, options and examples, as plain data.
  - `content/*.json` holds the lists people edit: links, menu, photos, leaders, supporters, incentives and the season.
  - `content/pages/*.json` holds the page files, after the approach gate.
  - Pieces that are not modules stay in `src/components/site/`: GamedaySchedule, GamedayAgenda, StreamPlayer, DonationChips, PlacemakerCarousel and LoadingBox.
- **Options are limited** to Puck's field types: text, long text, number, yes/no, a choice from a fixed list, a list of link names or photo-set names, and a slot. Page and content files never hold dates, conditions, class names, styles or refresh rates. The one timing option is **show when**: always, before, live, until the end, or after Game Day.
- **There are only two containers.** Columns has a left side and a right side, and the Hero has a "parts" list. Both hold cards only, never sections, and never each other.
- **Which card owns a module file.** Every file in `src/modules/` is listed by name on exactly one feature card:
  - Generic and year-round modules go on the new `module-system` card.
  - Modules with an existing mechanism card join that card: Hero and Countdown go on gameday-hero-states, the Command Center pieces on gameday-content, prize pieces on prizes, Events on schedule-archival, and the newsletter card on newsletter-signup.
  - Modules close to the totals stay on `module-system` until PR 7.2, so module PRs never have to stage the auction work's cards.

## 5. Every PR, the same way

1. **Branch** from a fresh `origin/main`. If the PR replaces or moves a file, first run `git log origin/main --since=14.days -- <file>`. If another session touched that file, wait or coordinate.
2. **Build and check:**
   - Run `npm run build`. From PR 1.2 it runs the site check, then `tsc`, then Vite.
   - Run the check kit on the routes the PR touches and on the must-render list.
   - Run `scripts/check/protected.sh`.
3. **Rebase** onto `origin/main` right before merging, then rebuild. Re-run the kit if main has changed anything the PR touches.
4. **Update the docs in the same commit:**
   - the feature cards whose Covers lines the PR touches (the guard blocks the commit otherwise);
   - CLAUDE.md, wherever it names a path that moved, plus the session handoff;
   - the `source` fields in `sitePages.ts`;
   - the "Done in" column of the coverage table in this file.
5. **Squash-merge and confirm the deploy.** Grep the live bundle for a string unique to the change. If the change doesn't alter the JavaScript (type fixes, workflows, docs), read the Actions log and fetch the page body instead.
6. **Rollback** if needed:
   - Revert the squash commit, push, and confirm the live bundle changed back.
   - If another session has since edited the same files, fix forward instead.
   - A Pages deploy that timed out can't be re-run, so push a new commit.
7. **Tier-2 PRs** (section 6) ship alone and must pass the live-figure check.

**Moves stay separate from logic changes.** A file is either:
- replaced: a new module file is written and the old file deleted in one PR, which reverts cleanly; or
- moved with `git mv`, in a PR that changes nothing else.

## 6. What to protect

The silent-auction and Gameday totals work (#226–#236) is still active. Four winners were emailed on 2026-11-19, and their payments show up on `/silent-auction` by themselves. The totals on the live homepage depend on this work.

**Tier 1: don't edit until the auction gate.** `scripts/check/protected.sh` fails if a PR's diff touches any of these:
- `src/lib/gamedayTotals.ts`
- `src/components/modules/GamedayTotals.tsx`
- `src/components/modules/ExtraLifeDonationTotals.tsx`
- `src/components/modules/ModulePreview.tsx`
- `src/lib/siteModules.ts`
- `src/hooks/useExtraLifeGiftsSince.ts`
- `src/lib/silentAuction.ts`
- `src/hooks/useSilentAuction.ts`
- `src/pages/SilentAuction.tsx`
- the `/silent-auction` lines in `src/App.tsx` and `src/lib/sitePages.ts`
- `docs/features/site-modules.md`, apart from the one Covers-line edit in PR 1.2

**Tier 2: the totals' hosts and feeds.** These change only in a PR that ships alone and passes the live-figure check:
- `src/components/site/Hero.tsx`, `src/components/site/ActiveRoster.tsx` and `src/components/site/GamedayDonations.tsx`, the three places Gameday totals appears;
- `src/hooks/useExtraLifeTeam.ts` and `src/lib/donationFormat.ts`, which feed the totals.

A Tier-2 PR places GamedayTotals unedited, with the same props it gets today.

**The live-figure check**, done within 2 minutes of the deploy:
- The check kit's live mode loads the live site and the branch build in the same minute. DonorDrive is answered live through Node, because the sandbox browser can't reach it directly.
- Both must show the same grand total.
- `/silent-auction` must show the same "N of M items paid" line.
- The production list of DonorDrive URLs fetched on `/` must match the baseline exactly.

**Hot cards.** The auction work edits `site-modules.md` and `extra-life-api.md`. Our edits to them are short, append-only or Covers-line only, and made right after a rebase.

**The protected-files script runs locally, not in CI.** The auction sessions' own PRs have to be able to touch those files.

**The auction gate** opens when every item on `/silent-auction` shows paid, or when the owner says the auction and the Gameday totals lines are final. Each session's handoff asks again. Phase 7 waits for the gate; nothing else does.

**Also protected:**
- **Every URL in a sent email keeps working.** This is the check kit's must-render list:
  - pages: `/rsvp/marathon`, `/gameday`, `/newsletter`, `/registration`, `/gameday_events`, `/leadership_DandD`, `/#gameday-schedule`, `/prizes`, `/mtginterest`, `/rsvp/bingo`, `/parking`, and `/incentives` (sent by text);
  - files: `/photos/prizes/*`, `/photos/parking/parking-map.jpg` and `/email/*`.

  Deep links are checked by page body and anchors, never by status code, because Pages answers them with a 404 by design.
- **Menu anchors land where they do today:** `#mission`, `#story`, `#donors`, `#team`, `#sponsors`, `#active-roster`, `#schedule`, `#past-events`, `#incentives` and `#gameday-schedule`. Each section keeps its current scroll margin; none are evened out.
- **Never name a `public/` folder after a route.** Pages would redirect the route to the folder.
- **The owner's pending changes can land at any time.** Switching the homepage back to Standard Display is PR 5.3, whenever asked. The promised second round of Gameday Week Runup changes is made in today's code whenever it arrives, and the check-kit baseline is then re-captured.

## 7. Phases

Rough targets: Phases 0–6 by the end of March 2027. Phases 8–11 between June and August 2027, done by **1 Sep 2027**, with a rehearsal on `/gameday_holding` in October 2027. Phase 7 runs whenever the auction gate opens.

### Phase 0: Lock in the choices and add safety nets (nothing visible changes)

**Goal:** record the 58 choices in the repo where every session sees them, make a bad change fail the build or fail small, and make "looks identical" something we can measure.

**0.1 Lock in the choices (docs only)** · keys: none · 1–1.5 h  
**Done 2026-11-19** in the same session that wrote this plan, at the owner's "lock in my choices". Nothing else in the plan has started.
- **What:**
  - Add `docs/plans/module-refactor/PLAN.md` (this file) and `decisions.json`. decisions.json holds the 58 choices copied unchanged, plus each module's type name and the PR that delivers it.
  - Add Open threads to CLAUDE.md, dated 2026-11-19:
    - the approach decision;
    - the auction gate and its default trigger;
    - confirming the names Buttons and Photos, and the carousel fold;
    - the Game Day 2027 date.
  - Add one durable line pointing at this plan and the protected list.
  - Commit with `no-card`.
- **Check:** the deploy is green. The bundle is unchanged, as expected.
- **Risk / rollback:** CLAUDE.md is edited by every session, so rebase right before merging and keep both sides of any conflict. Revert if needed.

**0.2 Pin the Bun version in the deploy** · keys: none · 0.25–0.5 h
- **What:** in `deploy.yml`, change `bun-version: latest` to the exact version the last green run used. Card: deploy-pipeline.
- **Check:** the deploy is green and its log shows the pinned version. The bundle name is unchanged, which is expected and not a failure.
- **Risk / rollback:** low. A failed build never deploys. Revert if needed.

**0.3 Type-check every build** · keys: none · 0.75–1.5 h
- **What:**
  - Fix the 9 `tsc` errors: add a `*.PNG` declaration for Team.tsx's photo imports, and type the reduce at `GamedaySchedule.tsx:210`.
  - Change the build to `tsc --noEmit && vite build && cp dist/index.html dist/404.html`.
  - On a scratch branch, prove that deleting the GamedayTokens import from `GamedayWeekRunup.tsx` now fails the build. Today it exits 0 and would ship a blank homepage.
  - Cards: deploy-pipeline, gameday-content.
- **Check:** the Actions log shows tsc ran and passed, and https://elnerds.com/ returns the app's body. Don't rely on the bundle hash: type-only fixes may leave the JavaScript unchanged.
- **Risk / rollback:** low-medium. There is no bypass, so an urgent Game Day fix must type-check too. That is accepted. Revert if needed.

**0.4 A build check on every pull request** · keys: none · 0.5–1 h · *needs the owner's OK*
- **What:** add `.github/workflows/check.yml`. It runs `bun install --frozen-lockfile` and `bun run build` on every pull request, with lint as advisory only. It changes nothing on the site; it shows a green or red mark on a PR before anything merges. Card: deploy-pipeline.
- **Check:** a throwaway PR with a deliberate type error goes red, and a clean one goes green. Close the throwaway without merging.
- **Risk / rollback:** a setup-bun CDN outage can turn the check red for reasons that have nothing to do with the change. Nothing blocks merging, because there is no branch protection. Revert if needed.

**0.5 Before/after check kit and protected-files script** · keys: none · 5–8 h
- **What:** `scripts/check/`, with a README, a recorder, a runner and `protected.sh`. Committed as `no-card` and pointed to from the verify skill.
  - **No lockfile change:** playwright-core is installed in the session scratchpad, never in package.json.
  - **Recorder:** curls the public DonorDrive endpoints and Apps Script `?action=gameday` into the scratchpad at run time. The recordings are **never committed**: the repo is public, and donation lists hold donor names and messages.
  - **Runner:**
    - builds a git ref and serves `dist/`, answering outside reads from the recordings and serving the Nunito font locally;
    - pins three America/Chicago clocks: before, during and after Game Day 2026;
    - captures the first frame and the settled frame of every route in `sitePages.ts` and the must-render list, at 320, 390, 768, 1024 and 1280 px, with animations paused;
    - reports picture diffs, text and anchor-id diffs, the **full list of fetched URLs** per route from the production build, console errors, and any sideways scroll;
    - has a live-smoke mode that confirms the recordings still match the real endpoints, and a live-figure mode (section 6).
  - **`protected.sh`:** fails on Tier-1 paths and names any Tier-2 paths in the diff.
  - **Baseline:** always a fresh build of `origin/main` at merge time.
- **Check:** two runs on unchanged main give zero diffs and identical URL lists. A one-word change shows up on exactly the routes that show it. A test edit to a Tier-1 file is caught.
- **Risk / rollback:** there is no site change. The risk is false confidence from stale recordings, so re-record each session and use live-smoke mode. To roll back, delete the folder.

**0.6 One broken section can't blank a page** · keys: none · 1.5–2.5 h
- **What:**
  - Add `src/components/site/SectionBoundary.tsx`. If a section crashes, a public page shows nothing in its place and logs an error naming the section. In dev and on /modules it shows a small note instead.
  - Wrap with it: each page in `App.tsx` (the silent-auction line untouched), each section in both homepage templates, each Command Center section, and SiteNav and Footer separately. If the nav crashes, a plain home link stands in.
  - Hero.tsx and the totals files are wrapped from outside, not edited.
  - Start the new card `docs/features/module-system.md` and add it to the index. Cards: home-templates, gameday-content, module-system.
- **Check:** zero diffs and identical URL lists everywhere. In a scratch build, a crashing Donors section disappears alone and the console names it; a crashing SiteNav leaves the page up.
- **Risk / rollback:** low. Revert if needed.

**0.7 Remove the unused UI kit (files only)** · keys: none · 0.5–1 h
- **What:**
  - Delete the 46 unused files in `src/components/ui/` and `src/hooks/use-mobile.tsx`, plus the leftover TanStack lint rule. `no-card`.
  - The ~30 packages those files used stay until PR 12.4. Removing them means regenerating `bun.lock`, which hangs in the sandbox, and CI installs with `--frozen-lockfile`.
- **Check:** tsc, build and lint pass, and the react-refresh warnings are gone. Zero diffs, and the deploy is green.
- **Risk / rollback:** low. Revert if needed.

**Gate:** tsc-in-build has gone green on a real deploy. The owner has answered on the PR check (if no, 0.4 is dropped). The check-kit baseline gives zero diffs main against main. Each PR shipped as its own deploy with no visible change.

**You'll notice:** nothing on the site. PRs show a green or red Build mark. A broken import can no longer ship a blank homepage, and one broken section can no longer blank a whole page.

### Phase 1: The module list, the /modules catalog and shared foundations (same under either approach)

**Goal:** one registry that everything hangs off, a `/modules` page showing all 58 choices, a Game Day clock that is right on the first frame, one sheet read per minute, and one season file.

**1.1 Game Day phase right on the first frame** · keys: none · 1.5–2.5 h
- **What:**
  - `use-countdown.ts` works out the phase during render. Today it starts at "before" and corrects itself a moment later.
  - It gains a preview setting, empty by default, that only `/modules` sets.
  - It ships alone, because this hook decides whether `/gameday` (linked from 16 sent emails) shows the countdown or the Command Center, and it drives the hero. Card: gameday-hero-states.
- **Check:**
  - On `/`, `/gameday`, `/gameday_holding` and `/incentives` at three clocks, the first frame now matches the settled frame, and the settled frames match the baseline.
  - `/gameday` shows the countdown before kickoff and the Command Center from kickoff.
  - The one visible difference (the wrong-phase flash is gone) is shown to the owner.
- **Risk / rollback:** medium-low. Revert if needed.

**1.2 Module registry, site check, and /modules as a catalog of all 58 choices** · keys: gameday-totals, meet-the-kids, registration-steps, rsvp-chooser, mtg-interest, rsvp-form · 7–11 h
- **Registry:**
  - `src/modules/registry.ts` collects `src/modules/*.tsx` and `*.meta.json` with `import.meta.glob(..., { eager: true })`. Modules are never loaded with `React.lazy` or `import()`: lazy files break open tabs after a deploy and delay anchor links.
  - The two saved modules, Gameday totals and Extra Life Page donation totals, are registered through `src/modules/saved.ts`. It imports their components and reads their names and descriptions from `SITE_MODULES`. `siteModules.ts`, `ModulePreview.tsx` and both component files stay untouched until the auction gate, and auction sessions can keep editing `siteModules.ts`.
  - GamedayTotals is offered with a label option only. It never exposes `refreshMs`, and never `items`, which would change the auction tally.
- **ShowWhen:** one wrapper, `src/modules/ShowWhen.tsx`, with the choices always, before, live, until the end and after. JSX uses it now; the page renderer uses it later.
- **`scripts/check-site.mjs`:**
  - Plain Node. It reads meta files, and later content and page files, as data, and never runs component code.
  - It fails the build with one plain-English line naming the file and the entry.
  - It bans the option names `refreshMs`, `items`, `className` and `style`, and any date.
  - The build becomes `node scripts/check-site.mjs && tsc --noEmit && vite build && cp ...`.
- **`/modules`:**
  - Lists all 58 choices from `decisions.json`, grouped as Homepage, Game Day, Pages and Building blocks.
  - Built modules render live. The rest say "planned" and link to where that piece is today.
  - "Decided not to be modules" lists the 11 merge/no choices and why.
  - A Before / Live / After switch, and a Full / One-third width toggle that resizes the single copy of each module.
  - Each entry is mounted when scrolled into view (its code is still loaded up front) and sits in its own boundary. Forms on the page never post.
- **Cards and docs:**
  - module-system takes over Modules.tsx, the registry and the check.
  - The only edit to site-modules.md is dropping `src/pages/Modules.tsx` from its Covers line, made right after a rebase.
  - CLAUDE.md's Modules bullet is rewritten in the same commit, and deploy-pipeline is updated for package.json.
- **Check:**
  - Zero diffs on every route except `/modules`.
  - `/modules` at 320, 390, 1024 and 1280 px: no sideways scroll in any phase, and requests start only for entries in view.
  - A bad meta file fails the build with the expected message, and `protected.sh` is clean.
  - The bundle grep finds "Decided not to be modules".
- **Risk / rollback:** medium-low, because site-modules.md is the auction work's card. Rebase right before merging and keep that diff to one line. Revert if needed.

**1.3 One shared Game Day sheet read** · keys: none · 2.5–4 h
- **What:** `use-gameday-content.ts` becomes a shared store:
  - one Apps Script read per minute, however many modules use it;
  - the last good data is kept if a read fails;
  - the shipped fallback and the "Loading…" behaviour are unchanged.

  This lands before any Command Center split. Card: gameday-content.
- **Check:** one `?action=gameday` request per minute on `/`, `/gameday_holding` and `/modules`. The Command Center and the homepage grid are identical at three clocks. A forced failure keeps the last rows on screen.
- **Risk / rollback:** medium-low. Revert if needed.

**1.4 Season facts in one file** · keys: none · 1.5–2.5 h
- **What:**
  - Add `content/season.json`: year, team id 73600, team page and donate URLs, and the participant-page base. It is read through `src/lib/season.ts`, with an `@content` path alias, and the site check validates it.
  - Replace the team-id copies in the 9 unprotected files of the 18 that carry it: Donors, GamedayRunup, SiteNav, Sponsors, useExtraLifeDonations, useExtraLifeDonors, CommandCenter, Incentives and Registration.
  - Point the hard-coded Game Day date fallbacks at the marathon entry in `rsvpEvents.ts`.
  - Tier 1 and Tier 2 files keep their copies until PR 7.2.
  - Cards: extra-life-api (append-only), home-templates, gameday-content, deploy-pipeline (vite.config.ts), module-system.
- **Check:** grep finds 73600 only in `season.json` and the 9 protected files. The full fetched-URL list is identical on every route, and every Donate and Team href is identical.
- **Risk / rollback:** many files change, so rebase just before merging. Revert if needed.

**Gate:** the owner has seen the `/modules` catalog and confirmed the names Buttons and Photos and the carousel fold. That answer is needed before Phase 2. Nothing else changed visibly, and there is one sheet read per minute.

**You'll notice:** `/modules` lists all 58 choices. The two saved modules are live, the rest are tagged "planned", and a list explains the 11 that aren't modules. A switch shows each one before, during and after Game Day. The one-frame flash of the wrong Game Day state is gone.

### Phase 2: The link list, the menu, Buttons and the Hero by itself

**2.1 One link list; the menu and footer built from it** · keys: site-nav, footer · 2.5–4 h
- **What:**
  - `content/links.json` holds every link once: a short name, the label (optionally with highlighted words), its kind (section, page, outside, email or video), where it goes, its default colour and fill (solid or outline), and an optional icon and chip look from fixed lists.
  - `content/menu.json` holds the menu order, the Events / Sponsors / Team dropdowns, the Donate and Join buttons, and the social icons.
  - SiteNav and Footer read both files. Links to homepage sections still hide while the live homepage lacks them.
  - The site check validates both files in the same PR: an unknown kind, a missing target, a duplicate name, or a menu name that doesn't exist fails the build. It warns above today's number of top-level items, because the desktop menu doesn't wrap at 1024 px.
  - `MAINTAINING.md` is started, with recipes for changing the menu, adding a link, reading a build error, and opening a PR and waiting for the green mark.
  - Card: module-system, which adds SiteNav.tsx and Footer.tsx to its Covers.
- **Check:** a script lists every nav and footer label and href on every route; branch and main must match exactly. Run the check kit with the phone menu open and each dropdown open, at 320, 390, 1024 and 1280 px. A misspelled kind fails the build with the plain message.
- **Risk / rollback:** medium: the menu is on every page, but its boundary contains a crash. Revert if needed.
- **Raised here:** should `/gameday` be in the top menu (open since 2026-09-18)? It is now one line.

**2.2 Buttons: one module, many copies** · keys: cta-buttons, kids-links, victoria-story · 3–4.5 h
- **What:** `src/modules/Buttons.tsx`.
  - **Options:**
    - links, by name and in order; each entry can override its colour and its fill, so today's solid Donate, outline Join and solid RSVP come out the same;
    - look: pills, icon buttons (the two-tone "Get to know" look), chips, or banner;
    - alignment, an optional small label above, and an optional anchor.
  - **Link kinds:**
    - section: hidden while the live homepage lacks it;
    - page, outside link and email;
    - video: opens one shared VideoPopup, which replaces the two pop-up copies as each host moves over.
  - Donate keeps its floating hearts.
  - **Three saved copies on /modules**, none placed live yet:
    - Main buttons (Donate / Join / RSVP);
    - Get to know (the kids page and the Gillette video);
    - Victoria's story (video).
  - MAINTAINING.md gains "add a set of buttons". Card: module-system.
- **Check:** on `/modules`, every link kind works. The video opens, and closes on Esc, on the backdrop and on X, with focus returning to the button. A section link to a missing anchor hides. At 320 px the buttons wrap without sideways scroll. Zero diffs elsewhere.
- **Risk / rollback:** none live. Revert if needed.

**2.3 The Hero by itself, on /modules** · keys: hero · 2–3 h
- **What:** a new `src/modules/Hero.tsx`. The live `Hero.tsx` is untouched.
  - **Options:**
    - headline, highlighted words and intro;
    - chips: link names, each chip's look coming from its link, hidden once Game Day ends as now;
    - optional Game Day headlines by phase;
    - one slot, **parts**, a list of cards, buttons and photos, each with its own "show when".
  - Event pills come automatically from `scheduleEvents.ts`.
  - `/modules` shows "Hero by itself", with parts empty, under the Before / Live / After switch.
  - Card: gameday-hero-states.
- **Check:** at three phases and four widths, the band, pills, chips and headline match the live hero's top. The 320 px chip row fits, measured with Nunito loaded.
- **Risk / rollback:** none live. Revert if needed.

**Gate:** the owner has looked at the three Buttons copies and the Hero by itself. The menu and footer are identical to before.

**You'll notice:** `/modules` gains Buttons (three copies) and the Hero by itself. The menu, footer and social links look the same but now come from `content/links.json` and `content/menu.json`.

### Phase 3: Building blocks

**3.1 Page header and Status banner** · keys: page-header, status-banner, gameday-signups · 2–3 h
- **What:**
  - PageHeader: back link, label, title and intro.
  - StatusBanner: the before, live and after wording as options, with the phase taken from the shared clock.
  - They replace the local copies on `/incentives`, `/prizes`, `/parking`, `/gameday_holding` and `/gameday_events`. Each page's words are carried over verbatim, and heading levels are unchanged.
  - `/gameday_events` stays a code page.
  - Cards: prizes, gameday-content, gameday-signups, module-system.
- **Check:** the five routes are identical at three clocks.
- **Risk / rollback:** low; the banner copies are worded differently, so carry each one over word for word. Revert if needed.

**3.2 Section band and Columns** · keys: section-band, columns · 3–4.5 h
- **What:**
  - **SectionBand:** label, heading, intro, background (a fixed list of the site's band colours) and anchor. Each section's current scroll margin is an option that is carried over, never evened out.
  - **Columns:**
    - left and right slots;
    - splits of 1/2–1/2, 2/3–1/3, 1/3–2/3 and 2/5–3/5, each written out as a full class name;
    - stacks on phones below `lg` (or `md`), with a "right side first on phones" yes/no;
    - holds cards only and never another Columns. The meta says so, the dev view shows an error box now, and the page check enforces it later.
  - Shown on `/modules` only. Card: module-system.
- **Check:** each split at 320, 390, 768, 1024 and 1280 px: no sideways scroll, and the right stacking order.
- **Risk / rollback:** none live. Refuse requests to grow Columns into a grid system. Revert if needed.

**3.3 Photos: single, slideshow or stack** · keys: hero-photos, photo-carousel · 2–3.5 h
- **What:**
  - `content/photos.json` holds named sets. Each photo is its **existing** file path plus alt text. Files don't move: event-3 to event-5 are also the Command Center's stream stills.
  - `Photos.tsx` finds the files with an eager `import.meta.glob(..., { import: 'default' })`, so images stay optimised.
  - Options: set; layout (single, slideshow or stack); size (card, wide or full); shape (16:9, 4:5 or square).
  - The site check fails on a missing file or missing alt text.
  - Why We Play's stack on Standard Display, which isn't live, switches to Photos (stack). The hero photo moves in PR 5.2.
  - If the stack can't share code cleanly, it becomes its own PhotoStack module reading the same sets, and the owner is told.
- **Check:** `/templates/standard-display` identical at five widths. Each layout shows on `/modules`. Images keep their width and height, so nothing jumps as they load.
- **Risk / rollback:** low. Revert if needed.

**Gate:** the owner confirms Photos absorbs the carousel. Zero diffs on the five pages and on Standard Display.

**You'll notice:** `/modules` gains Page header, Status banner, Section band, Columns and Photos. Live pages look the same.

### Phase 4: Year-round sections

Each PR's check is zero diffs on the routes it touches, at three clocks and five widths, unless a difference is noted. Each rollback is a revert.

**4.1 Our Impact and Past sponsors** · keys: our-impact, sponsors-2025 · 1.5–2.5 h
- The numbers and names move to `content/impact.json` and `content/past-sponsors.json`, and both sections use SectionBand.
- Standard Display uses them. Stats.tsx and Sponsors.tsx are replaced.
- Check: `#mission` and `#sponsors` still land.

**4.2 Leadership team** · keys: leadership-team · 1–1.5 h
- People, roles, contact links and photo paths move to `content/leadership.json`.
- It is on both homepages, so this changes the live one.
- Check: every mailto and link href is identical.

**4.3 Incentives, Gillette's Game Week drawing, More to earn** · keys: leadership-incentives, game-week-drawing, incentive-extras · 2.5–4 h
- **Incentives** (renamed): the amounts move to `content/incentives.json`. A yes/no controls the "All Game Day incentives" link, and the module still hides itself after Game Day. Its Instagram, Facebook and Discord links come from `links.json`, which retires the third copy of them.
- **GameWeekDrawing.**
- **MoreToEarn:** the $50 food threshold, the Platinum tip, and a closing call whose Join Today and Donate Now are a Buttons copy (solid teal).
- `/incentives`, still a code page for now, and Standard Display use them.
- Check: if the buttons differ at all, a screenshot pair goes to the owner before merging.

**4.4 Our story and Why We Play** · keys: our-story, why-we-play, photo-carousel · 1.5–2.5 h
- **OurStory:** the heading, the Victoria's story video button (a Buttons copy), three paragraphs from `content/our-story.json`, and the Extra Life link.
- **WhyWePlay:** SectionBand plus Columns 1/2–1/2, story first on phones, holding Photos (stack) and OurStory. Anchor `#story`.
- Standard Display only.

**4.5 One supporter list: Supporter cards and Sponsor links** · keys: in-kind-donors, sponsor-links · 2.5–4.5 h
- `content/supporters.json` lists the venue; food, meaning Placemaker's five restaurants; and in-kind supporters (Level Up Games, Source Comics & Games, Mirage Makes), with logo names from `sponsorLogos.ts`.
- **SupporterCards:** the right half of 2026 Donors, with the Placemaker carousel.
- **SponsorLinks:** the Command Center's tiles. This ends its hand-kept second list; the donations row is untouched.
- Check: every sponsor href is identical on `/`, Standard Display and `/gameday_holding`.

**4.6 Donor wall and 2026 Donors** · keys: donor-wall, donors, columns · 1.5–2.5 h
- **DonorWall:** the live Extra Life donor list.
- **Donors:** SectionBand plus Columns 2/3–1/3 of DonorWall and SupporterCards. Anchor `#donors`.
- Both homepages use it; this is the first live use of Columns.
- Check: the DonorDrive URL list is unchanged.

**4.7 Countdown / final total** · keys: final-total, gameday-countdown · 2.5–4 h
- **FinalTotal:** a countdown, then the 24-hour timer, then either the final total or nothing (the "afterwards" option). Sizes normal and big. The label is a text option, pending the owner's open question.
- **The merge:** `/gameday` before kickoff stays a code page, GamedayCountdown.tsx, with its cream band, title, date line and Parking / Prizes buttons, and shows FinalTotal at size big.
- Hero.tsx is untouched. Cards: gameday-hero-states, gameday-content.
- Check: `/gameday` is identical at the "before" clock, and the total never shows $0 while loading.

**4.8 Latest donations strip** · keys: donation-ticker · 1–1.5 h
- DonationTicker becomes a module with a count and a "See all donations" yes/no.
- Its refresh rate stays inside, set by phase: every minute while live, every five otherwise.
- The default is unchanged, so the live hero is unaffected. Card: extra-life-api, append-only.

**4.9 Events** · keys: events · 2.5–4 h
- The Events module wraps Schedule.tsx, which stays where it is. Archiving by date is unchanged.
- The Game Day panel (a yes/no) keeps calling today's schedule and event-details components until Phase 10.
- Anchors: `#schedule`, `#gameday-schedule` (in 10 sent emails) and `#past-events`. Card: schedule-archival.
- Check: also at a clock just after an event ends, and every anchor lands on first load.

**4.10 Newsletter sign-up card** · keys: newsletter-signup · 2–3.5 h
- NewsletterSignup: the email field, "referred by" (from `?ref=`) and the thank-you panel. It never posts on `/modules`.
- `/newsletter`, still a code page for now, uses it. Card: newsletter-signup.
- Check against a stub endpoint: the payload is identical (`type: 'newsletter'`), a bad email shows the same error, and the `?ref=` prefill works.

**Gate:** all diffs are zero, or approved by the owner. The owner answers what the year-round homepage shows after Game Day: which totals card the Hero and the roster show, and the final-total label and cents.

**You'll notice:** about 13 new modules on `/modules`. The live homepage looks the same. Leaders, impact numbers, incentive amounts and supporters are now plain lists in `content/`.

### Phase 5: The totals hosts — Team roster and the live Hero (each PR ships alone)

**5.1 Team roster** · keys: active-roster, gameday-totals · 1.5–2.5 h · Tier 2
- **What:** TeamRoster gets a "totals card" option: Gameday totals, Extra Life total, or none. It renders the saved modules unedited, with today's props.
  - The roster's duplicate team read is left alone until PR 7.2.
  - Cards: extra-life-api (append-only), module-system.
- **Check:** both homepages identical in the check kit, plus the live-figure check.
- **Risk / rollback:** medium. Revert if needed.

**5.2 The Hero goes live with its parts** · keys: hero, cta-buttons, kids-links, hero-photos, donation-ticker, final-total · 3–4.5 h · Tier 2
- **What:** both homepage templates render `src/modules/Hero.tsx`, with parts in today's order:
  1. FinalTotal: the final total on Standard Display after Game Day; nothing on the Runup.
  2. GamedayTotals, unedited: until the end of Game Day on Standard Display, always on the Runup.
  3. DonationTicker.
  4. A Buttons banner, "Check out the Gameday Command Center!", live only.
  5. Main buttons (Donate / Join / RSVP).
  6. Photos, the hero slideshow, on Standard Display only.
  7. Get to know.

  The old Hero.tsx, TeamProgressCard, GrandTotalCard and the Gillette pop-up copy are retired. The Runup's other sections stay JSX.

  Before starting, ask whether round 2 of the Runup changes is coming. If it arrived first, it's already in. If it is still pending, it is applied afterwards as settings.

  Card: gameday-hero-states. Its Covers moves to the new file, and CLAUDE.md and the `sitePages.ts` sources are updated in the same commit.
- **Check:** a merge gate of all 18 hero states (2 templates, 3 clocks, 3 widths), plus 1024 px. The 320 px chip row and the 360 px button row fit with Nunito, and the Donate hearts still float. Then the live-figure check and the bundle grep.
- **Risk / rollback:** this is the biggest single piece and the first screen of the site. Revert if needed.

**5.3 Switch the homepage to Standard Display, when the owner asks** · keys: none · 0.25–0.5 h
- **What:** today this is one line, `ACTIVE_HOME_TEMPLATE` in `homeTemplates.ts`. After PR 6.3 it is one value in `content/site.json`. It can happen any time, before or after other PRs. Card: home-templates.
- **Check:** the bundle grep confirms the deploy. Live `/` shows Standard Display, and the menu hides the Runup-only links.
- **Rollback:** set it back.

**Gate — THE APPROACH GATE.** The owner chooses:
- **page lists as JSON data files** in Puck's shape, with strict rules the build checks (recommended by 2 of 3 reviewers; the rest of this plan assumes it); or
- **page lists written in code.**

Everything through Phase 5 is the same either way.

If the answer is code:
- PR 6.1 becomes typed JSX page lists with their anchors listed beside them (2–3 h).
- PRs 6.2–6.5 and the later page-file steps (8.2, 9.3, 10.5, 11.2) become edits to JSX lists.
- That is about 15–25 hours less, and every module PR is unchanged.

If the gate is still unanswered when Phase 5 ends, the module PRs in Phases 8–10 go ahead with code hosts, and only the page-file PRs wait.

### Phase 6: Page files (assumes the data-file answer)

**6.1 Page-file format, renderer and checker** · keys: none · 6–9 h
- **Format:** `content/pages/<name>.json` in Puck's shape: `{ "root": { "props": { "title": "…", "notes": "…" } }, "content": [ { "type": "…", "props": { … } } ] }`.
  - Slots are named lists inside `props`: Columns has `left` and `right`, and Hero has `parts`.
  - Any entry may carry `showWhen`.
- **Renderer** (about 40–60 lines): looks each type up in the registry, wraps each entry in SectionBoundary and ShowWhen, and renders the slot lists.
- **Routing:**
  - `App.tsx` keeps one explicit table from route to page file. Page files have no address of their own.
  - Coded routes always win.
  - The `/gameday` phase switch, `/rsvp/*`, `/templates/*` and `/silent-auction` stay code.
- **Checker additions** to `check-site.mjs`. Each of these fails the build:
  - bad JSON (with the line number);
  - an unknown type (with a "did you mean");
  - an unknown option, or a value outside its choices;
  - an unknown link name or photo set;
  - a section in a slot, or Columns inside Columns;
  - duplicate anchors;
  - a page file missing from the route table, or a route pointing at no file;
  - a homepage file without Events, which provides `#gameday-schedule`.

  A warning (not a failure) when neighbouring sections share a background.
- **VS Code help:** a generated JSON Schema, mapped in `.vscode/settings.json`, gives autocomplete and red underlines.
- No page uses the renderer yet. Card: module-system, which also covers App.tsx's page-file table.
- **Check:** each of about 10 seeded mistakes fails the build with one clear line. A test page renders, and the check kit shows zero diffs.

**6.2 Standard Display as a page file** · keys: hero, our-impact, events, leadership-incentives, why-we-play, donors, active-roster, sponsors-2025, leadership-team · 2.5–4 h
- `home-standard-display.json` replaces StandardDisplay.tsx.
- The template's "why" comments move to `root.props.notes`, shown on `/templates`, which now lists page files.
- Card: home-templates.
- Check: identical to the JSX version at 3 clocks and 5 widths.

**6.3 The menu, /sitemap and /library follow the live page file; the homepage switch moves to content/site.json** · keys: site-nav · 2–3 h
- Homepage anchors come from the page file. The Runup keeps a short hand-kept anchor list until PR 11.2.
- `ACTIVE_HOME_TEMPLATE` moves to `content/site.json`. The open thread, CLAUDE.md and the `sitePages` sources are updated in the same commit.
- Card: home-templates.
- Check: nav labels and links are identical for each live template, and so are the `/sitemap` and `/library` lists.
- **Raised here:** build `/gillette-childrens-hospital` from modules, or delete the route.

**6.4 /incentives as a page file** · keys: leadership-incentives, game-week-drawing, incentive-extras, page-header, status-banner · 1.5–2.5 h
- The file lists PageHeader, StatusBanner, Incentives, GameWeekDrawing and MoreToEarn.
- Check: identical at three clocks. `/incentives` and `/#incentives` still land.

**6.5 /newsletter as a page file** · keys: newsletter-signup, page-header · 0.5–1 h
- The file lists PageHeader and NewsletterSignup.
- Check: the stub submit works, the `?ref=` prefill works, and the page is identical.

**6.6 The owner's practice edit** · keys: none · 0.5–1 h
- The owner moves one section in `home-standard-display.json` on GitHub, in a PR, and sees the check go green or red.
- Any gap this reveals in MAINTAINING.md is fixed.

**Gate:** the practice edit is done, and Standard Display as a page file is identical to the JSX version. Phase 7 needs the auction gate; if it hasn't opened, go straight on to Phase 8.

**You'll notice:** Standard Display, `/incentives` and `/newsletter` are page files you can read and edit on GitHub. A mistake gets a red mark with a message naming the file and the entry, and the live site stays as it was.

### Phase 7: After the auction is settled (runs whenever the auction gate opens)

**7.1 Gameday totals buttons option, Latest donations, and the totals row** · keys: gameday-totals, latest-donations, donations-panel · 3–4.5 h · Tier 1, ships alone
- GamedayTotals gets a "Donate and Team page buttons" yes/no. This is the first edit to that file. It replaces the buttons the Command Center passes in today.
- LatestDonations is split out of GamedayDonations, with a "how many" option (10 on the Command Center).
- DonationsPanel: SectionBand plus Columns 2/5–3/5 of GamedayTotals and LatestDonations.
- Cards: site-modules, extra-life-api, gameday-content.
- Check: identical at 1024 and 1280 px; the figure sized to its column still fits. Then the live-figure check.

**7.2 The saved modules join the registry; the last team-id copies; the totals card splits** · keys: gameday-totals · 2.5–4 h · ships alone
- `siteModules.ts` and `ModulePreview.tsx` are retired, and the registry owns both saved modules.
- The protected files take the team id from `season.json`. The roster's duplicate team read goes (one team read per page).
- The totals and auction notes move from `site-modules.md` into a new `gameday-totals.md`, and the modules near the totals move to extra-life-api.
- Check: the live-figure check. grep finds 73600 only in `season.json`.

**7.3 Move the two saved modules into src/modules/ (move only)** · keys: none · 0.5–1 h
- A pure `git mv`, with Covers and CLAUDE.md paths updated in the same commit.

**You'll notice:** nothing on screen. The totals are now part of the same module system as everything else.

### Phase 8: Getting here (Game Day)

**8.1 Venue card, Where to park, The way in** · keys: venue-card, parking-map, way-in · 3–5.5 h
- **VenueCard:** the address from the marathon's RSVP entry, a Directions button (using the `google.com/maps/dir/` form), and yes/no Parking and Prizes buttons.
- **ParkingMap:** a heading yes/no. The routes move to `content/parking.json`.
- **WayIn:** the steps also come from `content/parking.json`, with a photos yes/no.
- `/parking` and the Command Center's "Come visit" card use them.
- Photos stay in `public/photos/parking/`, because the emails use them.

**8.2 /parking as a page file; Getting here** · keys: getting-here, page-header · 1.5–2.5 h
- `/parking` becomes `parking.json`.
- **GettingHere:** SectionBand plus Columns 1/2–1/2 of ParkingMap (short) and WayIn (no photos). The Runup homepage uses it.
- The homepage's four sentences become the step titles. **The owner approves a screenshot pair first.**

**Gate:** the owner has accepted the step-title wording.

### Phase 9: Prizes (Game Day)

**9.1 Prize drawings and Silent auctions cards (short and full)** · keys: prize-drawings, silent-auctions · 2–3.5 h
- The drawing rules join the times in `prizes.ts`, whose exports stay stable.
- Level Up Games comes from the supporter list. `silentAuction.ts` is untouched.

**9.2 Prize tables, Event prizes, Donation tokens** · keys: prize-tables, event-prizes, donation-tokens · 3–5.5 h
- **PrizeTables:** the Source Comics & Games thank-you comes from the supporter list.
- **EventPrizes:** read from the shared sheet store.
- **DonationTokens:** the chip rules move into `prizes.ts`, and Mirage Makes comes from the supporter list. DonationChips.tsx stays an internal part, and the chip PNGs for email are untouched.
- The prizes card keeps its list of every copy of the chip rules, including the emails and the printed sign.

**9.3 /prizes as a page file; Prizes summary** · keys: prizes-summary, status-banner, page-header · 1.5–2.5 h
- `prizes.json` lists PageHeader, StatusBanner, PrizeDrawings (full), SilentAuctions (full), EventPrizes, DonationTokens and PrizeTables.
- **PrizesSummary:** SectionBand plus Columns 1/2–1/2 of the two short cards, and a Buttons "See all prize details". The Runup homepage uses it.

### Phase 10: The Command Center (Game Day)

**10.1 Game Day notice; Goals & incentives** · keys: gameday-notice, goals-incentives · 1.75–3 h
- **GamedayNotice:** an orange banner, showing nothing when the tab is empty.
- **GoalsIncentives:** the milestone cards with a Donate button.

**10.2 Live streams; /leadership_DandD uses it** · keys: live-streams, leadership-dnd · 3–4.5 h
- LiveStreams has a "one stream, by name" option.
- The loading spinner, the sample stills and the Twitch `parent=` links are kept as they are. So is the D&D fallback text.

**10.3 Game Day schedule (run of show)** · keys: run-of-show, events · 3–5 h
- RunOfShow wraps GamedaySchedule (computers) and GamedayAgenda (phones), moved rather than rewritten.
- It has a "now line" yes/no, off on the homepage. Events' Game Day panel uses it.
- Check: the verify skill's checks at Game Day 15:15, at 320 and 390 px.

**10.4 Event details & sign-ups** · keys: event-details, events, gameday-signups · 2–3.5 h
- EventDetails wraps GamedayEventDetails: four sections, prices, prizes, and live spots-left chips.
- `/gameday_events` stays a code page and reuses its parts.

**10.5 The Command Center as a page file** · keys: gameday-notice, goals-incentives, live-streams, run-of-show, event-details, donations-panel, sponsor-links, venue-card, page-header, status-banner · 2–3 h
- `command-center.json` lists, in order:
  1. PageHeader, with the "Game Day is Live" headline now a setting in the owner's wording;
  2. StatusBanner;
  3. VenueCard;
  4. GamedayNotice;
  5. LiveStreams;
  6. DonationsPanel, or, if the auction gate is still closed, today's GamedayDonations registered unchanged;
  7. RunOfShow;
  8. EventDetails;
  9. GoalsIncentives;
  10. SponsorLinks.
- It serves `/gameday_holding` before kickoff and `/gameday` from kickoff. CommandCenter.tsx is retired.
- Check: identical at three clocks on both routes, with one sheet read per minute.

**Gate:** the Command Center is identical at three clocks, and an October 2027 rehearsal on `/gameday_holding` is on the calendar.

### Phase 11: The Game Day homepage (Gameday Week Runup)

**11.1 Game Day essentials and Stream blurb** · keys: gameday-essentials, watch-summary · 2.25–4 h
- **GamedayEssentials:** the "what to bring" note and the eight link cards. The words go in `content/gameday.json`, and the links come from `links.json`.
- **StreamBlurb:** renamed from "Watch all day". Its times and wording move to content.

**11.2 Gameday Week Runup as a page file; retire the old code** · keys: victoria-story, getting-here, prizes-summary, donation-tokens, hero · 2–3.5 h
- The page file lists today's sections in today's order:
  1. Hero: the Game Day headlines; the prizes, parking and schedule chips; and parts FinalTotal (nothing after Game Day), GamedayTotals, DonationTicker, Main buttons and Get to know.
  2. GamedayEssentials.
  3. GettingHere.
  4. PrizesSummary.
  5. DonationTokens.
  6. StreamBlurb.
  7. Events.
  8. A SectionBand "Why we play" (`#story`) holding the Victoria's story Buttons copy.
  9. Donors.
  10. TeamRoster.
  11. LeadershipTeam.
- Then delete GamedayRunup.tsx, GamedayWeekRunup.tsx, the `sections` arrays in homeTemplates and the Runup's anchor list.
- Round 2 must have landed or been dropped first. If this is the live homepage, it ships alone.

**Gate:** every homepage and Game Day page renders from page files, by **1 Sep 2027**.

### Phase 12: Hand-over (maintainable without AI)

**12.1 MAINTAINING.md finished; README rewritten** · keys: site-nav, footer, gameday-signups, mtg-interest, registration-steps, rsvp-chooser, rsvp-form, meet-the-kids · 4–6 h
- **Recipes:**
  - switch the homepage; move or remove a section;
  - add a link, menu item or button set;
  - add a photo, leader or sponsor; change the incentive amounts; add an event;
  - change a Gameday totals line; edit the Gameday tabs;
  - redeploy Code.gs and check `SPREADSHEET_ID`;
  - roll over to next year;
  - read a red build mark.
- **Pages that stay code**, and why: `/gameday_events`, `/mtginterest`, `/registration`, `/rsvp`, `/rsvp/<slug>`, `/patient-profiles`, `/silent-auction`, plus the menu and footer frame.
- **Scope:** the emails stay outside the module system.

**12.2 A pre-commit check for human commits** · keys: none · 1–1.5 h
- `.githooks/pre-commit` runs the site check and the feature-card guard's logic. A `prepare` script turns it on.
- Hooks don't run in GitHub's web editor; the PR check covers that case.

**12.3 Shared form pieces (optional: only if the owner says yes, and never a module)** · keys: form-pieces, rsvp-form, mtg-interest · 1.5–2.5 h
- One set of field styles, error box, submit button and thank-you panel for the four forms.
- Ships alone. Each form is checked against the stub endpoint.

**12.4 Unused packages and the toolchain** · keys: none · 1–2 h
- Run this in a Local session where `bun install` works.
- Remove the ~30 unused packages, and regenerate `bun.lock` and `package-lock.json` together, with every URL on `registry.npmjs.org` and no version bumps.
- Keep Bun pinned, or switch the deploy to npm, as the owner chooses.

**12.5 Final sweep and next-year rehearsal** · keys: none · 3–5 h
- **Covers audit:** a script checks that every module and content file is on exactly one card. Whether it runs automatically is the owner's call on an open thread.
- `/modules` shows "used on" for each module.
- CLAUDE.md's "Single sources of truth" is rewritten around `content/`, `content/pages/` and `src/modules/`.
- **Rehearsal:** on a branch, set a made-up 2027 Game Day date and run the kit at its clocks.

**12.6 The owner's dry run** · keys: none · 1–2 h
- Three changes without AI: move a homepage section, add a button to a Buttons copy, and change a menu link.
- One deliberate typo, which the check catches.

**Gate:** the owner has done the dry run. Game Day 2027 preparation can start from content files and page files.

## 8. Gates and owner decisions

**Gates, in order:**

1. **Lock-in (now).** The choices are final; PR 0.1 records them.
2. **PR check (0.4)**: the owner's OK.
3. **Names (end of Phase 1)**: Buttons, Photos, and the carousel folded into Photos.
4. **The approach (after Phase 5)**: data files or code lists.
5. **The auction gate**: opens Phase 7.
6. **Runup round 2 (before 5.2 and 11.2).**
7. **The done-by date** for the Game Day pieces: 1 Sep 2027.

**Open threads this plan turns into one-line edits**, raised at the PR named:
- `/gameday` in the top menu (2.1);
- `/gillette-childrens-hospital` (6.3);
- the "Game Day is Live" headline (10.5);
- the final-total label (4.7 / 5.2);
- the routing card: the module-system card covers App.tsx's page-file table (6.1);
- the Covers audit (12.5).

## 9. Design answers

**Buttons.** Yes: one module, called **Buttons** ("Button row" is the only alternative worth considering), used as many times as you like. A copy in a page file looks like this:

```json
{ "type": "Buttons", "props": { "links": ["donate", "join", "rsvp"], "look": "pills", "align": "center" } }
```

Each copy sets:
- **links:** names from the link list, in order. Each can override its colour and its fill (solid or outline).
- **look:** pills, icon buttons, chips, or banner.
- **alignment**, an optional **small label**, and an optional **anchor**.

A link can jump to a section, open a page, go to an outside site, open an email, or play a video in the pop-up. The kids/Gillette pair and Victoria's story are two more saved copies, not separate modules.

**Links and the menu.** Every link is written once, in `content/links.json`: its name, words, target, kind, colour, fill and icon. Buttons copies, the Hero's chips and the menu all refer to links by name.

The menu is `content/menu.json`: the order of the top-level items, the dropdowns, the Donate and Join buttons and the social icons. The footer and the Incentives cards read the same social links.

The build fails on a misspelled name, and warns if the menu won't fit on one line at 1024 px. Menu links to homepage sections still hide while the live homepage lacks them.

**Photos.** One generic **Photos** module:
- **set:** a named list in `content/photos.json`, each photo a file and its alt text;
- **layout:** single, slideshow, or stack;
- **size:** card, wide, or full;
- **shape:** 16:9, 4:5, or square.

```json
{ "type": "Photos", "props": { "set": "team", "layout": "slideshow", "size": "wide" } }
```

We recommend the Why We Play carousel becomes the "stack" layout. If it can't share code cleanly, it becomes its own module reading the same sets. Photos stay where they are, so emails and other pages keep working.

**The Hero by itself:**

```json
{ "type": "Hero", "props": {
  "headline": "Play Games.", "highlight": "Heal Kids.",
  "intro": "We're the Extra Life Nerds — a community of gamers raising funds for Gillette Children's Hospital through 24 hours of nonstop play.",
  "chips": ["incentives", "gameday-schedule"],
  "parts": [] } }
```

This draws:
- the top band with its soft teal-and-pink glow;
- a row of pills for upcoming events, filled in automatically, each dropping off when its event ends;
- the chips: "Donation incentives live" pulsing in the orange-to-purple gradient and "Gameday schedule" in solid blue, both hidden after Game Day;
- the big headline with "Heal Kids." in the teal-to-orange gradient;
- the one-line intro.

Before Game Day 2027 that is about a third of a laptop screen. **Today**, with every event past and Game Day over, it shows only the headline and intro. The countdown, totals, donations strip, buttons and photo are modules you add to `parts`, in any order, each with its own "show when". `/modules` shows the Hero like this from PR 2.3.

## 10. Risks

- **The live totals and auction work.** Handled by the Tier 1 and Tier 2 lists, the protected-files script, the live-figure check, ship-alone Tier-2 PRs, and the auction gate (section 6).
- **Other sessions pushing to main.** Mitigations:
  - small PRs merged the same session, with a rebase and rebuild right before each merge;
  - a `git log` check before any move or replace;
  - append-only edits to hot cards;
  - re-capturing the baseline whenever someone else's content change lands;
  - merging CLAUDE.md conflicts by hand, keeping both sides.
- **The owner's pending changes.** The homepage switch and Runup round 2 land in the homepage files. The Runup stays JSX until 11.2, the homepage switch works at any point, and the Hero swap (5.2) asks about round 2 first.
- **A green merge is not a green deploy.** A setup-bun 503 or a Pages timeout can stop a deploy with nothing wrong in the diff. Every merge is confirmed live. A cancelled deploy needs a new commit, not a re-run.
- **tsc in the build is a new way to fail.** That is accepted on purpose, with no bypass.
- **The check kit uses recordings and pinned clocks,** so it can't see a changed API. The live-smoke mode, the live-figure check and per-section boundaries cover the gap. Moving parts (hearts, pulsing dots, carousels, tickers) are paused or masked.
- **Clock-driven states** (18 hero states, archiving, the Command Center): every check pins three America/Chicago clocks, and Phase-1.1 checks also capture the first frame.
- **Page files growing into a mini-language.** Options are limited to Puck's field types, and the build bans dates, class names, styles and refresh rates. Only two containers exist, they hold cards only, and they never nest.
- **Puck is still 0.x.** We copy only its stable shape and never install it.
- **Lockfiles.** bun hangs in the sandbox and CI installs frozen, so no PR changes dependencies until 12.4, which runs on a machine where bun works.
- **The Game Day deadline.** Phases 8–11 (about 27–46 h) are seen live only in November 2027. Hence the 1 Sep 2027 finish and the October rehearsal. Each PR leaves its pages complete, so if time runs short, stop converting; the 2026 code still works.
- **/modules load.** Many live modules on one page could mean many requests. Entries mount when scrolled into view, the sheet read is shared, and there is one copy of each module. Several h1s on this team-only, no-index page are accepted.
- **Narrow columns.** A card in a one-third column can overflow. Every card is checked at one-third width from 1024 to 1440 px; GamedayTotals already sizes itself to its container.
- **Human edits bypass Claude's card guard.** The PR check, the pre-commit hook (12.2) and MAINTAINING.md cover it, and a broken deploy leaves the old site up.

## 11. Coverage: every decision key and the PR that delivers it

| Key | Choice | Delivered in | Done in |
| --- | --- | --- | --- |
| active-roster | module | 5.1 Team roster (totals-card choice) | |
| columns | module | 3.2; first live use 4.6 | |
| cta-buttons | module, named **Buttons** | 2.2 (with the link list from 2.1); live in 4.3 and 5.2 | |
| donation-ticker | module | 4.8; in the Hero's parts 5.2 | |
| donation-tokens | module | 9.2; Runup page file 11.2 | |
| donations-panel | module | 7.1 (after the auction gate); Command Center 10.5 | |
| donor-wall | module | 4.6 | |
| donors | module | 4.6 | |
| event-details | module | 10.4 | |
| event-prizes | module (override) | 9.2 | |
| events | module | 4.9; Game Day panel uses 10.3 and 10.4 | |
| final-total | module | 4.7; in the Hero's parts 5.2 | |
| footer | no (frame) | 2.1 builds it from the link list; recipe 12.1 | |
| form-pieces | no | Optional 12.3, only if the owner says yes; recorded 1.2 | |
| game-week-drawing | module (override) | 4.3; /incentives page file 6.4 | |
| gameday-countdown | merge into final-total | 4.7 (GamedayCountdown.tsx stays a page showing the big Countdown) | |
| gameday-essentials | module | 11.1 | |
| gameday-notice | module | 10.1 | |
| gameday-signups | no | Stays a page; shared Status banner 3.1, Event details parts 10.4 | |
| gameday-totals | module | Registered unedited 1.2, placed unedited 5.1/5.2; buttons option 7.1; registry-owned 7.2 | |
| getting-here | module | 8.2 | |
| goals-incentives | module | 10.1 | |
| hero | module | 2.3 (by itself on /modules); 5.2 live with its parts | |
| hero-photos | module, folded into **Photos** | 3.3; hero photo moves in 5.2 | |
| in-kind-donors | module | 4.5 | |
| incentive-extras | module (override), More to earn | 4.3; page file 6.4 | |
| kids-links | module, folded into Buttons | 2.2 saved copy; live in the Hero 5.2 | |
| latest-donations | module | 7.1 | |
| leadership-dnd | merge into live-streams | 10.2 | |
| leadership-incentives | module, renamed **Incentives** | 4.3; page file 6.4 | |
| leadership-team | module | 4.2 | |
| live-streams | module | 10.2 | |
| meet-the-kids | no (override) | /patient-profiles untouched; recorded 1.2 | |
| mtg-interest | no | Stays a page; recorded 1.2; optional 12.3 | |
| newsletter-signup | module | 4.10; page file 6.5 | |
| our-impact | module | 4.1 | |
| our-story | module | 4.4 | |
| page-header | module (override) | 3.1 | |
| parking-map | module | 8.1 | |
| photo-carousel | module, folded into Photos as "stack" (recommended) | 3.3; Why We Play 4.4 | |
| prize-drawings | module | 9.1 | |
| prize-tables | module (override) | 9.2 | |
| prizes-summary | module | 9.3 | |
| registration-steps | no | Stays a page; recorded 1.2 | |
| rsvp-chooser | no | Stays a page; recorded 1.2 | |
| rsvp-form | no | Stays a page; recorded 1.2; optional 12.3 | |
| run-of-show | module | 10.3 | |
| section-band | module (override) | 3.2 | |
| silent-auctions | module | 9.1 | |
| site-nav | no (frame) | 2.1 built from the link list; 6.3 follows the page file | |
| sponsor-links | module | 4.5 | |
| sponsors-2025 | module, Past sponsors | 4.1 | |
| status-banner | module (override) | 3.1 | |
| venue-card | module | 8.1 | |
| victoria-story | module, folded into Buttons | 2.2 saved copy; in Our story 4.4; Runup 11.2 | |
| watch-summary | module, renamed **Stream blurb** | 11.1 | |
| way-in | module | 8.1 | |
| why-we-play | module | 4.4 | |

## 12. Hours

| Phase | Low | High |
| --- | --- | --- |
| 0 Lock-in and safety nets | 9.5 | 16 |
| 1 Registry, catalog, foundations | 12.5 | 20 |
| 2 Links, menu, Buttons, Hero alone | 7.5 | 11.5 |
| 3 Building blocks | 7 | 11 |
| 4 Year-round sections | 18.5 | 30.5 |
| 5 Totals hosts | 4.75 | 7.5 |
| 6 Page files | 13 | 20.5 |
| 7 After the auction gate | 6 | 9.5 |
| 8 Getting here | 4.5 | 8 |
| 9 Prizes | 6.5 | 11.5 |
| 10 Command Center | 11.75 | 19 |
| 11 Runup homepage | 4.25 | 7.5 |
| 12 Hand-over | 11.5 | 19 |
| **Total (57 PRs)** | **117.25** | **191.5** |

If the approach answer is code, subtract about 15–25 h. Skipping the optional form pieces saves 1.5–2.5 h.

This is above the research's 85–145 h because it adds the lock-in, the PR check, the first-frame fix, the Hero-alone preview, the split PRs the reviewers asked for, the owner's practice edit and dry run, and a full hand-over.

## 13. How the review findings were applied

**Majors:**

- **Retiring siteModules.ts and ModulePreview.tsx, and editing the protected files.** *Accepted.* Both stay untouched until the auction gate. The registry reads `SITE_MODULES` through `saved.ts`, there is no `meta` export on GamedayTotals.tsx, and both join the Tier 1 list along with the silent-auction lines.
- **Re-hosting the totals before the auction gate.** *Accepted in a narrower form.* The hosts are Tier 2, not frozen: a host PR ships alone, places GamedayTotals unedited and passes the live-figure check. Reason: the auction commits never touched Hero.tsx or ActiveRoster.tsx, and a full freeze would hold back the Hero the owner asked to see. The first reviewer's own fix allows exactly this kind of early host PR. The auction gate also gets a default trigger.
- **Hero slots can't match today's states.** *Accepted:* a generic "show when" option on every entry. Refresh rates stay inside the modules, and 18-state parity is a merge gate.
- **Refresh rate and `items` exposed as options.** *Accepted:* both are banned by the check.
- **A page file's address could replace a coded page.** *Accepted:* one explicit route table in App.tsx; page files have no address; coded routes win.
- **JSON lists with no validation.** *Accepted:* check-site.mjs ships in the same PR as the first JSON file, and the nav and footer get their own boundaries (0.6).
- **Fixtures committed to a public repo.** *Accepted:* recordings live in the scratchpad only.
- **A lazy glob.** *Accepted:* every glob is eager, and modules never use React.lazy or import().
- **Bundled risky PRs.** *Accepted:* the phase clock (1.1) is separate from the sheet store (1.3), and links/menu (2.1) from Buttons (2.2). The second reviewer's split of 3a.1 is accepted too: 6.1, 6.2, 6.3 and 11.2.
- **No rollback per PR.** *Accepted:* section 5, step 6, plus the rule keeping moves apart from logic.
- **CLAUDE.md paths going stale.** *Accepted:* section 5, step 4. PR 6.3 updates the homepage-switch open thread.
- **The lock-in isn't durable.** *Accepted:* PR 0.1, plus the `/modules` catalog in 1.2.
- **form-pieces built without asking.** *Accepted:* optional PR 12.3, which ships alone and is never a module.
- **No PR build check.** *Accepted:* PR 0.4, with the owner's OK.

**Minors, all accepted:**
- the first-frame fix is its own PR, checked at the first frame;
- the tsc PR is confirmed through the Actions log, not the bundle hash;
- an explicit frozen list, and the season PR skips it;
- full URL lists are compared, not just counts;
- the page check reads metas as data;
- one copy of each module on /modules, with a width toggle;
- photos stay at their paths;
- scroll margins are kept, never evened out;
- a must-render list of the URLs in sent emails;
- the Bun pin, tsc and the PR check are separate PRs;
- GamedayCountdown stays a page;
- each button can set its fill;
- chips are link names;
- the Hero-alone answer describes both views;
- content is JSON, not TypeScript;
- module PRs go ahead if the approach gate goes unanswered;
- a boundary around every section;
- re-estimated hours (check kit 5–8, registry 7–11, totals row and Command Center 5–7.5);
- /gameday_events uses the shared banner;
- names are asked once (Incentives and Stream blurb are already decided);
- open threads are raised at the PRs that turn them into one-line edits;
- 1024 px is in the check widths, with a menu-width warning;
- emails are declared out of scope;
- the team id is in 18 files, not 16, and TeamIncentives' social links move in 4.3;
- `/incentives` isn't in the archived emails, but stays on the must-render list because it was sent by text.

**Rejected from the drafts, with reasons:**
- **Content as TypeScript** (Draft 3): the maintainer knows little TypeScript, and the site check gives plainer errors.
- **Running modules under Node** to check them (Draft 3): browser-only code would break the deploy.
- **Moving photos into new folders** (Draft 2): the files are shared with the stream stills and emails.
- **Evening out scroll margins** (Draft 1): it would be a visible change.
- **Making /gameday's countdown a page file** (Draft 1): the parity check can't pass.

## 14. Glossary

- **Module:** a named, reusable piece of a page (Buttons, Photos, Hero, Donor wall). One file in `src/modules/`, plus a `.meta.json` describing its options.
- **Card / section:**
  - A section is a full-width band of a page.
  - A card is a smaller piece that can go inside a container.
- **Container:** a module that holds other modules. There are only two: Columns (left and right) and the Hero (parts).
- **Slot:** the named list inside a container (`left`, `right`, `parts`).
- **Page file:** `content/pages/<name>.json`, the ordered list of modules on one page, with each module's settings.
- **Content file:** `content/<name>.json`, a list of facts people edit (links, menu, leaders, supporters, photos, season).
- **Registry:** `src/modules/registry.ts`, which finds every module and its options.
- **Site check:** `scripts/check-site.mjs`. It runs first in every build, reads the content files, page files and module options, and stops the build with a plain message if anything is wrong.
- **Check kit:** `scripts/check/`. It takes before/after screenshots and network lists at pinned times and widths, to prove a change looks identical.
- **Boundary:** a wrapper that hides one crashed section instead of letting it blank the page.
- **Show when:** a setting on any module: always, before, live, until the end, or after Game Day.
- **Phase:** before, live or after Game Day, worked out from the marathon's dates in `rsvpEvents.ts`.
- **Tier 1 / Tier 2:** the protected-file lists in section 6.
- **Auction gate:** the moment the silent auction and Gameday totals are settled; the totals' own code waits for it.
- **Approach gate:** the owner's choice between page files as JSON (recommended) and page lists in code.
- **Squash-merge:** merging a PR as a single commit on main, which GitHub Pages deploys in about 40 seconds.
- **Bundle grep:** confirming a deploy by finding a string from the change in the live `assets/index-*.js`.
- **Feature card / Covers:** `docs/features/*.md`, one per feature. The Covers line lists the files it owns, and a commit that changes those files without the card is blocked.
- **Puck:** an open-source page-builder whose data shape (`root`, `content`, `type`, `props`, named slots) the page files copy. Puck itself is never installed.
