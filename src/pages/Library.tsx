// /library: the team's reference shelf. Every page on the site with the file it
// is built from, every file served as-is from public/, and a short guide to the
// repo's folders. Not linked from the nav and hidden from search engines, like
// /sitemap. The page list is shared with /sitemap (src/lib/sitePages.ts); the
// public/ list comes from the publicFiles() plugin in vite.config.ts, so new
// files there appear on their own.

import { ArrowUpRight } from "lucide-react";
import publicFiles from "virtual:public-files";
import { useNoIndex } from "@/hooks/use-noindex";
import { sitePageGroups } from "@/lib/sitePages";

const BASE = import.meta.env.BASE_URL;

// The repo's top-level folders that matter when you go looking for something.
const FOLDERS: { path: string; note: string }[] = [
  { path: "src/pages/", note: "One file per page. The route table that maps addresses to them is src/App.tsx." },
  { path: "src/components/site/", note: "The pieces pages are built from: hero, schedule, donors, team, nav, footer." },
  { path: "src/lib/", note: "Content and config: events (scheduleEvents.ts), RSVP pages (rsvpEvents.ts), Game Day fallback copy, this page list." },
  { path: "src/hooks/", note: "Live data: Extra Life totals and donors, the Game Day sheet, the countdown clock." },
  { path: "src/assets/", note: "Images bundled into the site: team headshots, patient photos, logos." },
  { path: "2026_sponsors/", note: "Every sponsor logo, in one place. Imported only by src/lib/sponsorLogos.ts." },
  { path: "2026_photos/", note: "Setup-night photos of the venue, the way in and the prize tables (Nov 13, 2026)." },
  { path: "public/", note: "Files served exactly as they are, at the same address (listed below)." },
  { path: "email/", note: "The campaign being written, and email/archive/ for every one sent." },
  { path: "branding/", note: "Email template, block library and design brief." },
  { path: "apps-script/", note: "Code.gs, the Google Apps Script behind RSVPs, sign-ups and the Game Day sheet." },
  { path: "docs/features/", note: "One card per feature: how it works and what was decided." },
];

/** "email/archive/x/index.html" is served at "email/archive/x/". */
const urlFor = (file: string) => file.replace(/(^|\/)index\.html$/, "$1");

function groupByFolder(files: string[]) {
  const map = new Map<string, string[]>();
  for (const f of files) {
    const dir = f.includes("/") ? f.slice(0, f.lastIndexOf("/") + 1) : "";
    map.set(dir, [...(map.get(dir) ?? []), f]);
  }
  return [...map.entries()];
}

const card = "mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper shadow-[var(--shadow-soft)]";

export function Library() {
  useNoIndex();
  const folders = groupByFolder(publicFiles);

  return (
    <main>
      <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">Library</p>
          <h1 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Every page, every file, and where it lives
          </h1>
          <p className="mt-3 text-ink-soft sm:text-lg">
            Each address on elnerds.com, with the file in the repo that builds it. For just the addresses, see{" "}
            <a href={`${BASE}sitemap`} className="font-bold text-teal hover:underline">
              the site map
            </a>
            .
          </p>

          <nav className="mt-6 flex flex-wrap gap-2 text-sm font-bold">
            {[
              ["#pages", "Pages"],
              ["#files", "Files"],
              ["#folders", "Repo folders"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="rounded-full border border-line bg-paper px-4 py-1.5 text-ink hover:text-teal">
                {label}
              </a>
            ))}
          </nav>

          <h2 id="pages" className="mt-12 scroll-mt-24 font-display text-2xl font-extrabold text-ink">
            Pages
          </h2>
          <div className="mt-6 space-y-10">
            {sitePageGroups().map((g) => (
              <section key={g.title}>
                <h3 className="font-display text-xl font-extrabold text-ink">{g.title}</h3>
                {g.blurb && <p className="mt-1 text-sm text-ink-soft">{g.blurb}</p>}
                <ul className={card}>
                  {g.pages.map((p) => (
                    <li key={p.path || "home"} className="px-5 py-4">
                      <a href={`${BASE}${p.path}`} className="group inline-flex items-center gap-1.5">
                        <span className="font-bold text-ink transition-colors group-hover:text-teal">{p.title}</span>
                        <ArrowUpRight className="size-4 shrink-0 text-ink-soft transition-colors group-hover:text-teal" />
                      </a>
                      <span className="block break-all font-mono text-xs text-teal">elnerds.com/{p.path}</span>
                      <span className="mt-1 block text-sm text-ink-soft">{p.note}</span>
                      <span className="mt-1.5 block break-words text-xs text-ink-soft">
                        <span className="font-bold uppercase tracking-wider">Lives in </span>
                        <code className="font-mono text-ink">{p.source}</code>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <h2 id="files" className="mt-16 scroll-mt-24 font-display text-2xl font-extrabold text-ink">
            Files served as-is
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Everything in the repo's <code className="font-mono">public/</code> folder, at the same address on the site.
          </p>
          <div className="mt-6 space-y-8">
            {folders.map(([dir, files]) => (
              <section key={dir || "root"}>
                <h3 className="break-all font-mono text-sm font-bold text-ink">public/{dir}</h3>
                <ul className={card}>
                  {files.map((f) => (
                    <li key={f}>
                      <a
                        href={`${BASE}${urlFor(f)}`}
                        className="group flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-cream"
                      >
                        <span className="min-w-0 break-all font-mono text-xs text-teal group-hover:underline">
                          elnerds.com/{urlFor(f)}
                        </span>
                        <ArrowUpRight className="size-4 shrink-0 text-ink-soft transition-colors group-hover:text-teal" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <h2 id="folders" className="mt-16 scroll-mt-24 font-display text-2xl font-extrabold text-ink">
            Repo folders
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Where to look when you need to change something.</p>
          <ul className={card}>
            {FOLDERS.map((f) => (
              <li key={f.path} className="px-5 py-4">
                <code className="font-mono text-sm font-bold text-ink">{f.path}</code>
                <span className="mt-1 block text-sm text-ink-soft">{f.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
