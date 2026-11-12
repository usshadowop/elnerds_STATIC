// The one place the site reaches into `2026_sponsors/`, the repo's source of
// authority for sponsor logos. Pages import these names, never the image
// files, so there is no second copy to drift and no page needs to know where
// the folder is.
//
// To add a logo: put the file in `2026_sponsors/` (a brand that belongs to a
// parent company goes in a subfolder, like `placemaker-hospitality/`), then add
// it here. Replacing a file in place, under the same name, needs no code change.
//
// Placemaker Hospitality's own logo is in its subfolder but is deliberately not
// imported: the site shows its restaurants instead (see `placemakerRestaurants.ts`).

import improving from "../../2026_sponsors/improving.svg";
import papaJohns from "../../2026_sponsors/papa-johns.svg";
import qsCue from "../../2026_sponsors/qs-cue.jpg";
import gilletteChildrens from "../../2026_sponsors/gillette-childrens.svg";
import mirageMakes from "../../2026_sponsors/mirage-makes.png";
import barbette from "../../2026_sponsors/placemaker-hospitality/barbette.png";
import bookClub from "../../2026_sponsors/placemaker-hospitality/book-club.png";
import breadAndPickle from "../../2026_sponsors/placemaker-hospitality/bread-and-pickle.png";
import gigisCafe from "../../2026_sponsors/placemaker-hospitality/gigis-cafe.png";
import patsTap from "../../2026_sponsors/placemaker-hospitality/pats-tap.png";

export const sponsorLogos = {
  improving,
  papaJohns,
  qsCue,
  gilletteChildrens,
  mirageMakes,
  barbette,
  bookClub,
  breadAndPickle,
  gigisCafe,
  patsTap,
};
