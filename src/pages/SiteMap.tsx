// /sitemap: every page on elnerds.com in one place, mostly for the team (it is
// not linked from the nav). The routes themselves live in App.tsx; when a route
// is added there, add it here too. The RSVP pages are listed from rsvpEvents.ts,
// so a new event shows up on its own.

import { ArrowUpRight } from "lucide-react";
import { RSVP_EVENT_LIST, hasEventEnded } from "@/lib/rsvpEvents";

const BASE = import.meta.env.BASE_URL;

type Page = { path: string; title: string; note: string };
type Group = { title: string; blurb?: string; pages: Page[] };

function groups(): Group[] {
  return [
    {
      title: "Main pages",
      pages: [
        { path: "", title: "Home", note: "Countdown, events, incentives, donors, the team: everything at a glance." },
        { path: "registration", title: "Join the team", note: "Registration steps for Extra Life and our team." },
        { path: "incentives", title: "Donation incentives", note: "What donors get on Game Day, plus Gillette's Game Week drawing." },
        { path: "patient-profiles", title: "Meet the kids", note: "The Gillette patient profiles." },
        { path: "newsletter", title: "Newsletter sign-up", note: "Join the mailing list. Add ?ref=Name to fill in “Referred by”." },
      ],
    },
    {
      title: "Home page sections",
      blurb: "Jump links into the home page, handy for emails and texts.",
      pages: [
        { path: "#schedule", title: "Events", note: "Upcoming and past events." },
        { path: "#gameday-schedule", title: "Game Day schedule", note: "The run of show for the 24 hours." },
        { path: "#incentives", title: "Leadership team incentives", note: "The $75 / $25 / $5 cards." },
        { path: "#story", title: "Why we play", note: "Our story." },
        { path: "#donors", title: "2026 donors", note: "Extra Life donors, the venue, food and in-kind donations." },
        { path: "#active-roster", title: "Team roster", note: "Who's on the team and how much each has raised." },
        { path: "#team", title: "Leadership team", note: "The people running it." },
      ],
    },
    {
      title: "Game Day",
      pages: [
        { path: "gameday", title: "Game Day", note: "A countdown until 8 AM Saturday, Nov 14, then the Command Center." },
        {
          path: "gameday_holding",
          title: "Command Center preview (the testing page)",
          note: "Always the Command Center, so you can check it before Game Day starts.",
        },
        { path: "gameday_events", title: "Game Day event sign-ups", note: "Sign up for individual events during the marathon." },
        { path: "leadership_DandD", title: "Leadership D&D one-shot", note: "The leadership team's D&D game, streamed on Game Day night." },
      ],
    },
    {
      title: "RSVPs and forms",
      pages: [
        { path: "rsvp", title: "All RSVPs", note: "Every event's RSVP form in one list." },
        ...RSVP_EVENT_LIST.map((e) => ({
          path: `rsvp/${e.slug}`,
          title: `RSVP: ${e.title}`,
          note: hasEventEnded(e) ? "RSVPs are closed: this event has happened." : "Open for RSVPs.",
        })),
        { path: "mtginterest", title: "Magic: The Gathering interest", note: "Interest form; linked only from the Halloween email." },
      ],
    },
    {
      title: "Emails",
      blurb: "Plain pages that sit beside the site rather than inside it.",
      pages: [
        { path: "email/", title: "Email index", note: "Every campaign we've sent, with links to each." },
        { path: "email/current/", title: "Email under review", note: "The draft being written; with none, it forwards to the latest send." },
        { path: "email/template/", title: "Email template", note: "The template with every block, placeholders showing." },
      ],
    },
    {
      title: "Not built yet",
      pages: [
        {
          path: "gillette-childrens-hospital",
          title: "Gillette Children's Hospital",
          note: "The address works but the page is empty, and nothing links to it.",
        },
      ],
    },
  ];
}

export function SiteMap() {
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
            {groups().map((g) => (
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
