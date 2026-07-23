// RSVP submission client.
//
// The RSVP form POSTs to a Google Apps Script Web App, which appends the
// submission to a Google Sheet in Drive and sends confirmation + notification
// emails (with Add-to-Calendar and Cancel links). See apps-script/README.md.
//
// The endpoint URL is public by design — it only accepts well-formed RSVP
// inserts and can't be used to read anyone's data.

const RSVP_ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT as string | undefined;

export const isRsvpConfigured = Boolean(RSVP_ENDPOINT);

export type RsvpInput = {
  name: string;
  email: string;
  event: string;
  attending: "yes" | "no" | "maybe";
  guests: number;
  message?: string;
};

export async function submitRsvp(rsvp: RsvpInput): Promise<void> {
  if (!RSVP_ENDPOINT) {
    throw new Error(
      "RSVP endpoint is not configured. Set VITE_RSVP_ENDPOINT (see apps-script/README.md).",
    );
  }

  // Apps Script Web Apps don't return CORS headers for JSON content-type
  // preflights, so we send as text/plain (a "simple" request the browser
  // won't preflight) and parse JSON on the server side.
  const res = await fetch(RSVP_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(rsvp),
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
