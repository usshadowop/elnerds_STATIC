// The one place the site reaches into `2026_sponsors/`, the repo's source of
// authority for sponsor logos. Pages import these names, never the image
// files, so there is no second copy to drift and no page needs to know where
// the folder is.
//
// To add a logo: put the file in `2026_sponsors/` (a brand that belongs to a
// parent company goes in a subfolder, like `placemaker-hospitality/`), then add
// it here. Replacing a file in place, under the same name, needs no code change.
//
// Placemaker's five brand logos are in that subfolder but are not imported yet;
// add them here when a page starts showing them.

import improving from "../../2026_sponsors/improving.svg";
import papaJohns from "../../2026_sponsors/papa-johns.svg";
import qsCue from "../../2026_sponsors/qs-cue.jpg";
import gilletteChildrens from "../../2026_sponsors/gillette-childrens.svg";
import placemakerHospitality from "../../2026_sponsors/placemaker-hospitality/placemaker-hospitality.png";

export const sponsorLogos = {
  improving,
  papaJohns,
  qsCue,
  gilletteChildrens,
  placemakerHospitality,
};
