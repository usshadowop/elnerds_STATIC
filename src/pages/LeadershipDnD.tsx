// /leadership_DandD — watch page for the leadership team's D&D one-shot.
//
// The table is full (the leadership team plays), so the event shows as "Full"
// in Event Details with a "Watch Here" button that lands here. The stream is
// the Gameday Streams tab row whose name mentions "Leadership" or "D&D"; with
// no embed URL typed in yet the page points at the Game Day page instead.

import { ExternalLink, Video } from "lucide-react";

import { useGamedayContent } from "@/hooks/use-gameday-content";

const HOME = import.meta.env.BASE_URL;

export function LeadershipDnD() {
  const { content } = useGamedayContent();
  const stream = content.streams.find((s) => /leadership|d&d/i.test(s.name));

  return (
    <main>
      <section className="bg-cream px-4 pt-10 pb-20 sm:px-6 sm:pt-12 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal">
              <Video className="size-4" />
              Watch live
            </p>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-5xl">
              Leadership Team D&amp;D One-Shot
            </h1>
            <p className="mt-3 text-base font-extrabold text-blue sm:text-lg">
              Saturday, November 14th · 10:00 PM – 11:30 PM
            </p>
            <p className="mx-auto mt-3 max-w-xl text-base font-bold text-ink-soft sm:text-lg">
              The table is full, but you can watch the El Nerds leadership team play a D&amp;D
              one-shot live, while raising money for Gillette Children&rsquo;s Hospital.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[var(--shadow-soft)]">
            {stream?.embedUrl ? (
              <div className="aspect-video border-b border-line">
                <iframe
                  src={stream.embedUrl}
                  title={stream.name}
                  allowFullScreen
                  className="size-full"
                />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center border-b border-line bg-ink/[0.03] px-6 text-center">
                <p className="text-sm font-bold text-ink-soft sm:text-base">
                  The stream goes live at 10:00 PM on Saturday. Check back here then.
                </p>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 p-5">
              <a
                href={`${HOME}gameday`}
                className="text-sm font-extrabold text-teal transition-colors hover:text-teal-bright"
              >
                See all Game Day streams
              </a>
              {stream?.pageUrl && (
                <a
                  href={stream.pageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-extrabold text-teal transition-colors hover:text-teal-bright"
                >
                  Open channel <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
