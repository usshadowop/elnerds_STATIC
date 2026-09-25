// Newsletter signup client.
//
// Posts to the same Google Apps Script Web App as the RSVP forms (see
// src/lib/rsvp.ts); `type: "newsletter"` routes it to handleNewsletter_ in
// apps-script/Code.gs, which appends a row to the sheet's "Newsletter" tab.

const ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT as string | undefined;

export const isNewsletterConfigured = Boolean(ENDPOINT);

export type NewsletterSignup = {
  email: string;
  referral: string;
  /** Honeypot — a hidden field only bots fill in. The backend drops those. */
  website: string;
};

export async function submitNewsletter(signup: NewsletterSignup): Promise<void> {
  if (!ENDPOINT) {
    throw new Error("Newsletter signup isn't configured yet. Please try again later.");
  }

  // text/plain keeps this a "simple" request, which Apps Script can answer
  // without a CORS preflight — same as the RSVP client.
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ type: "newsletter", ...signup }),
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`Signup failed (${res.status}). Please try again.`);
  }

  const result = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!result || !result.ok) {
    throw new Error(result?.error || "Something went wrong. Please try again.");
  }
}
