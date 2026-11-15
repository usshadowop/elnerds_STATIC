// /modules (also /module): every saved module on one page, each rendered live
// with what it is, where its code lives and how to put it on a page. The list
// is src/lib/siteModules.ts; ModulePreview.tsx renders one by slug. Kept out
// of search engines like /templates and /library.

import { ArrowLeft, Blocks } from "lucide-react";

import { ModulePreview } from "@/components/modules/ModulePreview";
import { useNoIndex } from "@/hooks/use-noindex";
import { SITE_MODULES, type SiteModule } from "@/lib/siteModules";

const BASE = import.meta.env.BASE_URL;

const anchor = (m: SiteModule) => `module-${m.slug}`;

function ModuleEntry({ m }: { m: SiteModule }) {
  return (
    <section
      id={anchor(m)}
      className="scroll-mt-24 sm:rounded-2xl sm:border sm:border-line sm:bg-paper sm:p-6 sm:shadow-[var(--shadow-soft)]"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-teal-soft text-teal">
          <Blocks className="size-5" />
        </span>
        <h2 className="font-display text-xl font-extrabold text-ink">{m.name}</h2>
        <span className="rounded-full bg-ink/5 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-ink-soft">
          Saved {m.savedOn}
        </span>
      </div>
      <p className="mt-3 text-sm text-ink-soft sm:text-base">{m.description}</p>

      {/* The module itself, live, on the page background. Unframed on phones so
          it gets the full width it would have on a real page: the team-total
          figures run into each other in anything much narrower. */}
      <div className="mt-5 sm:rounded-xl sm:border sm:border-dashed sm:border-line sm:bg-cream sm:p-6">
        <div className={m.width === "card" ? "mx-auto max-w-2xl" : undefined}>
          <ModulePreview slug={m.slug} />
        </div>
      </div>

      <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[auto_1fr]">
        <dt className="text-[11px] font-extrabold uppercase tracking-widest text-ink-soft/70 sm:pt-0.5">Lives in</dt>
        <dd className="min-w-0 break-words">
          <code className="rounded bg-cream px-1.5 py-0.5 text-xs text-ink">{m.source}</code>
        </dd>
        <dt className="text-[11px] font-extrabold uppercase tracking-widest text-ink-soft/70 sm:pt-0.5">Use it as</dt>
        <dd className="min-w-0 break-words">
          <code className="rounded bg-cream px-1.5 py-0.5 text-xs text-ink">{m.usage}</code>
        </dd>
        <dt className="text-[11px] font-extrabold uppercase tracking-widest text-ink-soft/70 sm:pt-0.5">On the site</dt>
        <dd className="text-ink-soft">{m.usedOn}</dd>
      </dl>
    </section>
  );
}

export function Modules() {
  useNoIndex();

  return (
    <main className="bg-cream px-4 pt-16 pb-24 sm:px-6 sm:pt-20">
      <div className="mx-auto max-w-4xl">
        <a
          href={BASE}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft transition-colors hover:text-teal"
        >
          <ArrowLeft className="size-4" />
          Back to elnerds.com
        </a>
        <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">For the team</p>
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">Modules</h1>
        <p className="mt-3 max-w-2xl text-base text-ink-soft">
          Pieces of a page saved so they can go on any page later, all shown here at once and live. Whole-page
          layouts are on <a href={`${BASE}templates`} className="font-bold text-teal underline underline-offset-2">Templates</a>;
          the list of modules is{" "}
          <code className="rounded bg-paper px-1 text-sm">src/lib/siteModules.ts</code>.
        </p>

        {SITE_MODULES.length > 1 && (
          <nav aria-label="Modules on this page" className="mt-6 flex flex-wrap gap-2">
            {SITE_MODULES.map((m) => (
              <a
                key={m.slug}
                href={`#${anchor(m)}`}
                className="rounded-full border border-line bg-paper px-4 py-1.5 text-xs font-extrabold text-ink-soft transition-colors hover:border-teal hover:text-teal"
              >
                {m.name}
              </a>
            ))}
          </nav>
        )}

        <div className="mt-8 space-y-12 sm:space-y-6">
          {SITE_MODULES.map((m) => (
            <ModuleEntry key={m.slug} m={m} />
          ))}
        </div>
      </div>
    </main>
  );
}
