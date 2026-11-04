// Game Day event sign-up form client (/gameday_events).
//
// Posts to the same Google Apps Script Web App as the RSVP, newsletter and
// MTG forms; `type: "gameday_signup"` routes it to handleGamedaySignup_ in
// apps-script/Code.gs, which writes one row per email to the "Event Signups"
// tab of the RSVP sheet and emails the captain.

const ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT as string | undefined;

export type GamedaySignup = {
  name: string;
  email: string;
  /** Event names exactly as in the "Gameday Signups" tab's Event column. */
  events: string[];
  notes: string;
  /** Honeypot — a hidden field only bots fill in. The backend drops those. */
  website: string;
};

export async function submitGamedaySignup(signup: GamedaySignup): Promise<void> {
  if (!ENDPOINT) {
    throw new Error("Sign-ups aren't configured yet. Please try again later.");
  }

  // text/plain keeps this a "simple" request, which Apps Script can answer
  // without a CORS preflight — same as the other forms.
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ type: "gameday_signup", ...signup }),
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`Submission failed (${res.status}). Please try again.`);
  }

  const result = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!result || !result.ok) {
    throw new Error(result?.error || "Something went wrong. Please try again.");
  }
}
