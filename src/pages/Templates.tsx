// /templates — the homepage templates, the way /email/ lists the email pages:
// each with what it's for, a preview, and which one the homepage shows.
// /templates/<slug> previews a template under a banner. The list itself is
// src/lib/homeTemplates.ts. Kept out of search engines like /library.

import { ArrowLeft, ArrowRight, Eye, LayoutTemplate } from "lucide-react";

import { useNoIndex } from "@/hooks/use-noindex";
import { ACTIVE_HOME_TEMPLATE, HOME_TEMPLATES, getHomeTemplate } from "@/lib/homeTemplates";
import { HomeTemplatePage } from "@/pages/homeTemplates/HomeTemplatePage";

const BASE = import.meta.env.BASE_URL;

export function Templates({ slug }: { slug?: string }) {
  useNoIndex();
  const preview = slug ? getHomeTemplate(slug) : undefined;

  if (preview) {
    const live = preview.slug === ACTIVE_HOME_TEMPLATE;
    return (
      <>
        <div className="border-b border-line bg-ink px-4 py-3 text-center text-sm text-white">
          <span className="font-extrabold">Template preview: {preview.name}</span>
          <span className="text-white/70">{live ? " · this is the live homepage" : " · not the live homepage"}</span>
          <a href={`${BASE}templates`} className="ml-3 font-bold underline underline-offset-2">
            All templates
          </a>
        </div>
        <HomeTemplatePage slug={preview.slug} />
      </>
    );
  }

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
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">Homepage templates</h1>
        <p className="mt-3 max-w-2xl text-base text-ink-soft">
          Whole-page layouts for the homepage, saved so a season&rsquo;s layout can come back later. One is live at a
          time; preview any of them here. Switching is a one-line change in the repo
          (<code className="rounded bg-paper px-1 text-sm">src/lib/homeTemplates.ts</code>).
        </p>

        <ul className="mt-8 space-y-4">
          {HOME_TEMPLATES.map((t) => {
            const live = t.slug === ACTIVE_HOME_TEMPLATE;
            return (
              <li key={t.slug} className="rounded-2xl border border-line bg-paper p-6 shadow-[var(--shadow-soft)]">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-teal-soft text-teal">
                    <LayoutTemplate className="size-5" />
                  </span>
                  <h2 className="font-display text-xl font-extrabold text-ink">{t.name}</h2>
                  {live ? (
                    <span className="rounded-full bg-magenta px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-white">
                      Live on the homepage
                    </span>
                  ) : (
                    <span className="rounded-full bg-ink/5 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-ink-soft">
                      Saved
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-ink-soft sm:text-base">{t.description}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-ink-soft/70">Saved {t.savedOn}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={`${BASE}templates/${t.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition-all hover:bg-teal-bright"
                  >
                    <Eye className="size-4" />
                    Preview
                  </a>
                  {live && (
                    <a
                      href={BASE}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-teal px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-teal transition-all hover:bg-teal-soft"
                    >
                      Open the homepage
                      <ArrowRight className="size-4" />
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
