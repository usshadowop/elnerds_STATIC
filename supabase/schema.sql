-- RSVP storage for elnerds.com
--
-- Run this once in your Supabase project: Dashboard > SQL Editor > New query >
-- paste > Run. It creates the `rsvps` table and locks it down so the public
-- (anon) key shipped in the browser can INSERT rows but can never read or edit
-- anyone's data.

create table if not exists public.rsvps (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  email      text not null,
  event      text not null,
  attending  text not null check (attending in ('yes', 'no', 'maybe')),
  guests     integer not null default 0 check (guests >= 0 and guests <= 20),
  message    text
);

-- Turn on row-level security. With RLS on and no SELECT/UPDATE/DELETE policy,
-- the anon role is denied everything except what we explicitly allow below.
alter table public.rsvps enable row level security;

-- Allow anonymous visitors to submit an RSVP (INSERT only).
drop policy if exists "anon can insert rsvps" on public.rsvps;
create policy "anon can insert rsvps"
  on public.rsvps
  for insert
  to anon
  with check (true);

-- To read submissions: use the Supabase dashboard Table Editor, or export CSV
-- from there. The service_role key (server-side only, never in the browser)
-- bypasses RLS if you need programmatic reads.
