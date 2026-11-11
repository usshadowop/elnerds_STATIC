# 2026 sponsors

Logos for the sponsors and donors of the 2026 Extra Life Nerds 24-hour gaming
FUNdraiser (Game Day, November 14), kept in one place so anyone can grab them.

This folder is the **one home for sponsor logos**. The site imports them from
here, through `src/lib/sponsorLogos.ts` and nowhere else, so there is no second
copy to drift. Replace a file here (same name) and the site picks it up on the
next build. To use a new logo, drop it in and add it to `sponsorLogos.ts`.

The email-sized renditions in `public/email/assets/sponsor-*` are separate,
hand-made files, because emails need stable public URLs. Nothing generates
them from this folder.

A copy of every logo here (Bread & Pickle at its full 1800px) was put in the
captain's Google Drive on 2026-11-11, in `DONOR LOGOS/2026`, with Placemaker's
in a `Placemaker Hospitality` subfolder. That copy doesn't update itself: if a
logo changes here, replace it there too.

| File | Sponsor | Role | Where it came from |
| --- | --- | --- | --- |
| `improving.svg` | Improving | Game Day venue | Their site |
| `papa-johns.svg` | Papa Johns Roseville | Pizza | Wikimedia |
| `qs-cue.jpg` | Q’s Cue | BBQ catering | Their Facebook profile picture (480×480) |
| `gillette-childrens.svg` | Gillette Children’s | Where the money goes | Their site |
| `placemaker-hospitality/` | Placemaker Hospitality | Food | See below |

The four top-level files were moved here from `src/assets/logos/sponsors/` on
2026-11-11.

## Placemaker Hospitality

Placemaker is the parent company of several restaurants. The five brand logos
were extracted from the Word file *PH Logos for Gillette
Childrens_Extra Life Nerds_24 hr Gaming FUNdraiser 2026.docx* (shared in Google
Drive) on 2026-11-11, unchanged except that Bread & Pickle was scaled down for
the web (see the table). All five have transparent backgrounds and are cropped
tight to the artwork, with no padding.

| File | Brand | Size (px) |
| --- | --- | --- |
| `barbette.png` | Barbette | 600×213 |
| `book-club.png` | Book Club | 794×425 |
| `bread-and-pickle.png` | Bread & Pickle (Lake Harriet) | 400×400, round badge (scaled down from the 1800×1800, 127 KB original in the Word file) |
| `gigis-cafe.png` | gigi’s cafe | 893×225 |
| `pats-tap.png` | Pat’s Tap | 792×294 |
| `placemaker-hospitality.png` | Placemaker Hospitality, the parent company’s own logo (not used on the site, which shows the five restaurants instead) | 500×359 |

`placemaker-hospitality.png` was `src/assets/logos/sponsors/placemaker.png`
(their site’s share image, with the white background made transparent).
