// Magic: The Gathering interest form client.
//
// Posts to the same Google Apps Script Web App as the RSVP and newsletter
// forms; `type: "mtg"` routes it to handleMtgInterest_ in
// apps-script/Code.gs, which writes a row to a separate spreadsheet,
// "elnerds_mtginterest" (not the RSVP sheet).

const ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT as string | undefined;

export const isMtgInterestConfigured = Boolean(ENDPOINT);

export const MTG_FORMATS = ["Commander", "Draft", "Other"] as const;
export const MTG_INTEREST_LEVELS = ["Competitive", "Casual"] as const;

export type MtgInterestSignup = {
  email: string;
  /** Formats the visitor plays, from MTG_FORMATS. */
  formats: string[];
  /** Free text when "Other" is ticked; stored as "Other: …" in the sheet. */
  formatOther: string;
  /** Competitive and/or Casual, from MTG_INTEREST_LEVELS. */
  interest: string[];
  /** Opted in to news and emails about EL Nerds MTG events. */
  emailOptIn: boolean;
  /** Honeypot — a hidden field only bots fill in. The backend drops those. */
  website: string;
};

export async function submitMtgInterest(signup: MtgInterestSignup): Promise<void> {
  if (!ENDPOINT) {
    throw new Error("The MTG interest form isn't configured yet. Please try again later.");
  }

  // text/plain keeps this a "simple" request, which Apps Script can answer
  // without a CORS preflight — same as the RSVP client.
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ type: "mtg", ...signup }),
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
