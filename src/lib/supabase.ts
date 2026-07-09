// Minimal Supabase REST helper for inserting RSVPs.
//
// We talk to Supabase's PostgREST endpoint directly with `fetch` so the site
// needs no extra dependency. The anon key is safe to ship in the browser: the
// `rsvps` table has row-level security that allows INSERT only (see
// supabase/schema.sql), so visitors can submit but can never read or edit data.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export type RsvpInput = {
  name: string;
  email: string;
  event: string;
  attending: "yes" | "no" | "maybe";
  guests: number;
  message?: string;
};

export async function insertRsvp(rsvp: RsvpInput): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).",
    );
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rsvps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(rsvp),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`RSVP failed (${res.status}). ${detail}`.trim());
  }
}
