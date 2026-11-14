// Every page on elnerds.com, grouped, with the file each one is built from.
// /sitemap shows the list for the team; /library shows the same list plus
// where each page lives in the repo and every file served from public/.
// The routes themselves live in App.tsx: when a route is added there, add it
// here too. The RSVP pages are listed from rsvpEvents.ts, so a new event
// shows up on its own.

import { RSVP_EVENT_LIST, hasEventEnded } from "@/lib/rsvpEvents";

/** `path` is relative to the site root ("" is home, "#x" a home-page anchor). */
export type SitePage = { path: string; title: string; note: string; source: string };
export type SiteGroup = { title: string; blurb?: string; pages: SitePage[] };

export function sitePageGroups(): SiteGroup[] {
  return [
    {
      title: "Main pages",
      pages: [
        { path: "", title: "Home", note: "Countdown, events, incentives, donors, the team: everything at a glance.", source: "src/pages/Home.tsx" },
        { path: "registration", title: "Join the team", note: "Registration steps for Extra Life and our team.", source: "src/pages/Registration.tsx" },
        { path: "incentives", title: "Donation incentives", note: "What donors get on Game Day, plus Gillette's Game Week drawing.", source: "src/pages/Incentives.tsx" },
        { path: "patient-profiles", title: "Meet the kids", note: "The Gillette patient profiles.", source: "src/pages/PatientProfiles.tsx" },
        { path: "newsletter", title: "Newsletter sign-up", note: "Join the mailing list. Add ?ref=Name to fill in “Referred by”.", source: "src/pages/Newsletter.tsx" },
      ],
    },
    {
      title: "Home page sections",
      blurb: "Jump links into the home page, handy for emails and texts.",
      pages: [
        { path: "#schedule", title: "Events", note: "Upcoming and past events.", source: "src/components/site/Schedule.tsx" },
        { path: "#gameday-schedule", title: "Game Day schedule", note: "The run of show for the 24 hours.", source: "src/components/site/Schedule.tsx" },
        { path: "#incentives", title: "Leadership team incentives", note: "The $75 / $25 / $5 cards.", source: "src/components/site/TeamIncentives.tsx" },
        { path: "#story", title: "Why we play", note: "Our story.", source: "src/components/site/WhyWePlay.tsx" },
        { path: "#donors", title: "2026 donors", note: "Extra Life donors, the venue, food and in-kind donations.", source: "src/components/site/Donors.tsx" },
        { path: "#active-roster", title: "Team roster", note: "Who's on the team and how much each has raised.", source: "src/components/site/ActiveRoster.tsx" },
        { path: "#team", title: "Leadership team", note: "The people running it.", source: "src/components/site/Team.tsx" },
      ],
    },
    {
      title: "Game Day",
      pages: [
        {
          path: "gameday",
          title: "Game Day",
          note: "A countdown until 8 AM Saturday, Nov 14, then the Command Center.",
          source: "src/pages/GamedayCountdown.tsx, then src/pages/CommandCenter.tsx",
        },
        {
          path: "gameday_holding",
          title: "Command Center preview (the testing page)",
          note: "Always the Command Center, so you can check it before Game Day starts.",
          source: "src/pages/CommandCenter.tsx",
        },
        { path: "parking", title: "Parking & getting in", note: "Where to park, with a map and a photo of each step from the lot to Improving.", source: "src/pages/Parking.tsx, images in public/photos/parking/" },
        { path: "prizes", title: "Prizes & silent auctions", note: "The hourly prize drawings, the silent auctions, event prizes (live from the sheet) and photos of the prize tables.", source: "src/pages/Prizes.tsx, images in public/photos/prizes/" },
        { path: "gameday_events", title: "Game Day event sign-ups", note: "Sign up for individual events during the marathon.", source: "src/pages/GamedayEvents.tsx" },
        { path: "leadership_DandD", title: "Leadership D&D one-shot", note: "The leadership team's D&D game, streamed on Game Day night.", source: "src/pages/LeadershipDnD.tsx" },
      ],
    },
    {
      title: "RSVPs and forms",
      pages: [
        { path: "rsvp", title: "All RSVPs", note: "Every event's RSVP form in one list.", source: "src/pages/Rsvp.tsx" },
        ...RSVP_EVENT_LIST.map((e) => ({
          path: `rsvp/${e.slug}`,
          title: `RSVP: ${e.title}`,
          note: hasEventEnded(e) ? "RSVPs are closed: this event has happened." : "Open for RSVPs.",
          source: "src/pages/Rsvp.tsx, configured in src/lib/rsvpEvents.ts",
        })),
        { path: "mtginterest", title: "Magic: The Gathering interest", note: "Interest form; linked only from the Halloween email.", source: "src/pages/MtgInterest.tsx" },
      ],
    },
    {
      title: "Emails",
      blurb: "Plain pages that sit beside the site rather than inside it.",
      pages: [
        { path: "email/", title: "Email index", note: "Every campaign we've sent, with links to each.", source: "public/email/index.html" },
        { path: "email/current/", title: "Email under review", note: "The draft being written; with none, it forwards to the latest send.", source: "public/email/current/index.html" },
        { path: "email/template/", title: "Email template", note: "The template with every block, placeholders showing.", source: "public/email/template/index.html, built by branding/email/build-bundle.sh" },
      ],
    },
    {
      title: "For the team",
      blurb: "Not linked anywhere and hidden from search engines.",
      pages: [
        { path: "sitemap", title: "Site map", note: "This list of pages, without the file locations.", source: "src/pages/SiteMap.tsx" },
        { path: "library", title: "Library", note: "Every page and every file the site serves, with where each one lives in the repo.", source: "src/pages/Library.tsx" },
      ],
    },
    {
      title: "Not built yet",
      pages: [
        {
          path: "gillette-childrens-hospital",
          title: "Gillette Children's Hospital",
          note: "The address works but the page is empty, and nothing links to it.",
          source: "src/pages/GilletteChildrensHospital.tsx",
        },
      ],
    },
  ];
}
