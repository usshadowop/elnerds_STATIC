// Placemaker Hospitality's restaurants, as shown by `PlacemakerCarousel`.
//
// Placemaker is the parent company of these restaurants and asked to be shown
// as them rather than under its own logo, so each one gets its own slide: its
// logo (from `2026_sponsors/`, through `sponsorLogos`), its name linking to its
// own site, and a "by Placemaker Hospitality" credit.
//
// The order here is the order the carousel cycles in, and it never changes
// (alphabetical). Only the restaurant it opens on is random.

import { sponsorLogos } from "./sponsorLogos";

export type PlacemakerRestaurant = { name: string; href: string; logo: string };

export const PLACEMAKER_NAME = "Placemaker Hospitality";

export const PLACEMAKER_RESTAURANTS: PlacemakerRestaurant[] = [
  { name: "Barbette", href: "https://www.barbette.com/", logo: sponsorLogos.barbette },
  { name: "Book Club", href: "https://www.bookclubrestaurant.com/", logo: sponsorLogos.bookClub },
  { name: "Bread & Pickle", href: "https://www.breadandpickle.com/", logo: sponsorLogos.breadAndPickle },
  { name: "gigi’s cafe", href: "https://www.gigisuptown.com/", logo: sponsorLogos.gigisCafe },
  { name: "Pat’s Tap", href: "https://www.patstap.com/", logo: sponsorLogos.patsTap },
];
