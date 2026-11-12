// /sitemap: every page on elnerds.com in one place, mostly for the team (it is
// not linked from the nav, and search engines are told not to index it). The
// list itself lives in src/lib/sitePages.ts, shared with /library.

import { ArrowUpRight } from "lucide-react";
import { useNoIndex } from "@/hooks/use-noindex";
import { sitePageGroups } from "@/lib/sitePages";

const BASE = import.meta.env.BASE_URL;

export function SiteMap() {
  useNoIndex();
  return (
    <main>
      <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">Site map</p>
          <h1 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Every page on elnerds.com
          </h1>
          <p className="mt-3 text-ink-soft sm:text-lg">
            All the addresses in one place. Bookmark this one and you never have to remember the others.
          </p>

          <div className="mt-10 space-y-10">
            {sitePageGroups().map((g) => (
              <section key={g.title}>
                <h2 className="font-display text-xl font-extrabold text-ink">{g.title}</h2>
                {g.blurb && <p className="mt-1 text-sm text-ink-soft">{g.blurb}</p>}
                <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper shadow-[var(--shadow-soft)]">
                  {g.pages.map((p) => (
                    <li key={p.path || "home"}>
                      <a
                        href={`${BASE}${p.path}`}
                        className="group flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-cream"
                      >
                        <span className="min-w-0">
                          <span className="block font-bold text-ink transition-colors group-hover:text-teal">{p.title}</span>
                          <span className="block break-all font-mono text-xs text-teal">elnerds.com/{p.path}</span>
                          <span className="mt-1 block text-sm text-ink-soft">{p.note}</span>
                        </span>
                        <ArrowUpRight className="mt-1 size-4 shrink-0 text-ink-soft transition-colors group-hover:text-teal" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
