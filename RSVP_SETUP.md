# RSVP form setup

The RSVP page lives at **`/rsvp`** (e.g. `elnerds.com/rsvp`) and stores
submissions in a free [Supabase](https://supabase.com) Postgres database. No
email service, no Google Form, no backend to run yourself.

- Page component: `src/pages/Rsvp.tsx`
- DB helper: `src/lib/supabase.ts`
- Table + security: `supabase/schema.sql`

Until Supabase is configured, the page renders fine and shows a "setup needed"
notice; submissions fail loudly rather than silently dropping data.

## One-time Supabase setup (~5 min)

1. Create a free account at [supabase.com](https://supabase.com) and make a new
   project. Pick a strong database password (you won't need it for this form).
2. In the project, open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and click **Run**. This creates
   the `rsvps` table and a row-level-security policy that lets the public key
   INSERT rows but never read or edit them.
3. Open **Project Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Project API keys → `anon` / `public`** → `VITE_SUPABASE_ANON_KEY`

The `anon` key is designed to be public — it ships in the browser bundle.
Security comes from the row-level-security policy, not from hiding the key.

## Local development

```bash
cp .env.example .env.local     # .env.local is gitignored
# edit .env.local, paste your Project URL + anon key
bun run dev                    # visit http://localhost:5173/rsvp
```

## Live deploy (GitHub Pages)

The build reads the same two variables. Add them once as repository secrets so
the deployed site can talk to Supabase:

**GitHub repo → Settings → Secrets and variables → Actions → New repository
secret**, add both:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

`.github/workflows/deploy.yml` already passes them into `bun run build`. Push to
`main` (or re-run the workflow) and the live `/rsvp` page will start recording
submissions.

## Viewing / exporting RSVPs

Supabase Dashboard → **Table Editor → `rsvps`** to browse, filter, and export to
CSV. For programmatic access, use the `service_role` key **server-side only**
(it bypasses row-level security) — never put it in the site.

## Testing the end-to-end flow

1. Configure `.env.local` and run `bun run dev`.
2. Go to `/rsvp`, fill in the form, submit — you should see the success screen.
3. Confirm the row appears in Supabase's Table Editor.
