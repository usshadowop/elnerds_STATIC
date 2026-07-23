// RSVP submission client.
//
// Each per-event RSVP page POSTs to a Google Apps Script Web App, which
// appends the submission to a per-event tab in a Google Sheet and sends
// confirmation + notification emails (with Add-to-Calendar and Cancel links).
// See apps-script/README.md.
//
// The endpoint URL is public by design — it only accepts well-formed RSVP
// inserts and can't be used to read anyone's data.

const RSVP_ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT as string | undefined;

export const isRsvpConfigured = Boolean(RSVP_ENDPOINT);

export type RsvpAnswer = { id: string; label: string; value: string };

export type RsvpSubmission = {
  slug: string;
  title: string;
  name: string;
  email: string;
  fields: RsvpAnswer[];
};

export async function submitRsvp(submission: RsvpSubmission): Promise<void> {
  if (!RSVP_ENDPOINT) {
    throw new Error(
      "RSVP endpoint is not configured. Set VITE_RSVP_ENDPOINT (see apps-script/README.md).",
    );
  }

  // Apps Script Web Apps don't answer CORS preflights for JSON, so we send as
  // text/plain (a "simple" request the browser won't preflight) and parse the
  // JSON body server-side.
  const res = await fetch(RSVP_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(submission),
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`RSVP failed (${res.status}). Please try again.`);
  }

  const result = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!result || !result.ok) {
    throw new Error(result?.error || "Something went wrong. Please try again.");
  }
}
