// Game Day 2026 prize facts, shared by /prizes (src/pages/Prizes.tsx) and the
// Gameday Week Runup homepage (src/components/site/GamedayRunup.tsx), so the two
// can't drift apart. The Game Day email lists the same facts by hand
// (email/elnerds-gameday-parking-prizes.html): change it too.

export const SOURCE_URL = "https://sourcecomicsandgames.com/";
export const LEVEL_UP_URL = "https://www.levelupshoponline.com/";

// Nine drawings, one every 1½ hours from 10 AM to 10 PM on Saturday (the
// owner, 2026-11-14). The Game Day email lists the same times.
export const DRAWING_TIMES = ["10 AM", "11:30 AM", "1 PM", "2:30 PM", "4 PM", "5:30 PM", "7 PM", "8:30 PM", "10 PM"];

// Silent-auction items, from the owner's list of 2026-11-14 (no photos except
// the poster, which is featured on its own below the list). The Game Day email
// lists the same items.
export const AUCTION_ITEMS: { group: string; items: string[] }[] = [
  {
    group: "Squishmallows",
    items: ["Sussie and Derpy from KPop Demon Hunters", "Grogu from The Mandalorian"],
  },
  {
    group: "Board games",
    items: [
      "Hoplomachus: Victorum (Chip Theory Games)",
      "A Too Many Bones pack (Chip Theory Games)",
      "Kutná Hora (Czech Games Edition)",
      "Hexeh, out of print (Hexeh Games)",
      "Hubworld: Aidalon, signed and unreleased, still crowdfunding (Earthborne Games)",
    ],
  },
  { group: "Jewelry", items: ["Handmade stone jewelry"] },
];


// What the setup-night photos show, so people can tell what's up for grabs.
export const SPOTTED = [
  "Codenames",
  "Codenames Duet",
  "Eternal Palace",
  "Wispwood",
  "Mystic Paths",
  "Distant Suns",
  "Biomos",
  "Ahoy",
  "Kingyo",
  "Fort",
  "Get 9",
  "Schitt's Creek: Love That Journey",
  "Neighborhood Hide & Seek",
];
