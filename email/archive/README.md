# Email archive

Every campaign that has been sent, one folder per send, named
`YYYY-MM-<slug>` by the month it went out. Each folder holds the exact HTML
that was pasted into Brevo (plus any variants, like a VIP version). Nothing
here is edited after the fact; it is the record of what people received.

Each archived email also stays viewable on the site at
`https://elnerds.com/email/archive/<folder>/`, served from
`public/email/archive/<folder>/index.html`.

| Sent | Folder | Subject | Variants | On the site |
| --- | --- | --- | --- | --- |
| Aug 2026 | [`2026-08-announcement`](2026-08-announcement/) | New Website, New Venue, Bingo Night & Game Day 2026 | General, VIP | [/email/archive/2026-08-announcement/](https://elnerds.com/email/archive/2026-08-announcement/) |

## Archiving the current campaign

When a new campaign replaces the one at <https://elnerds.com/email/>:

1. `git mv` the campaign file(s) from `email/` into a new
   `email/archive/YYYY-MM-<slug>/` folder.
2. `git mv public/email/index.html public/email/archive/YYYY-MM-<slug>/index.html`
   so the old email keeps a permanent URL.
3. Add a row to the table above.
4. Copy the new campaign over `public/email/index.html`.
