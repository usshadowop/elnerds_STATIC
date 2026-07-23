// Single source of truth for the per-event RSVP pages.
//
// Each event gets its own page at /rsvp/<slug> with the event name prominent
// at the top and its own tailored set of fields. The event cards in
// Schedule.tsx link here by slug, and the Google Apps Script backend
// (apps-script/Code.gs) mirrors these slugs + field labels so each event's
// submissions land in their own sheet tab with matching columns.

export type FieldType = "text" | "number" | "select" | "textarea";

export interface RsvpField {
  id: string;
  label: string;
  type: FieldType;
  /** Required fields must be non-empty (selects are always effectively required). */
  required?: boolean;
  /** Options for `select` fields. */
  options?: { value: string; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
  /** Render at half width (pairs up into two columns); default is full width. */
  half?: boolean;
  /** Show a subtle "(optional)" hint next to the label. */
  optionalHint?: boolean;
}

export interface RsvpEvent {
  slug: string;
  title: string;
  dateLabel: string;
  location?: string;
  /** Short line under the title. */
  tagline: string;
  /** Tailwind accent classes for this event's theming. */
  accentText: string;
  accentBg: string;
  accentBgHover: string;
  /** Details for the "Add to Calendar" button in the confirmation email. */
  calendar: { start: string; end: string; location: string; description: string };
  /** Tailored fields shown between Email and the Submit button. */
  fields: RsvpField[];
}

const ATTENDING: RsvpField = {
  id: "attending",
  label: "Will you attend?",
  type: "select",
  half: true,
  options: [
    { value: "yes", label: "Yes, I'll be there" },
    { value: "maybe", label: "Maybe" },
    { value: "no", label: "Can't make it" },
  ],
};

const ADULT_GUESTS: RsvpField = {
  id: "adult_guests",
  label: "Additional adult guests",
  type: "number",
  half: true,
  min: 0,
  max: 20,
};

const MINOR_GUESTS: RsvpField = {
  id: "minor_guests",
  label: "Additional guests under 18",
  type: "number",
  half: true,
  min: 0,
  max: 20,
};

const NOTES: RsvpField = {
  id: "notes",
  label: "Any questions or notes for the team?",
  type: "textarea",
  optionalHint: true,
};

export const RSVP_EVENTS: Record<string, RsvpEvent> = {
  bingo: {
    slug: "bingo",
    title: "Extra Life Bingo",
    dateLabel: "Aug 8, 2026 · 3:00 – 6:00 PM",
    location: "Truplayerz Sports Training & Upper Deck Lounge",
    tagline: "A thrilling night of Bingo with the Extra Life leadership.",
    accentText: "text-purple",
    accentBg: "bg-purple",
    accentBgHover: "hover:brightness-110",
    calendar: {
      start: "2026-08-08T15:00:00-05:00",
      end: "2026-08-08T18:00:00-05:00",
      location: "Truplayerz Sports Training & Upper Deck Lounge",
      description: "Extra Life Bingo with the Extra Life Nerds. Details: https://elnerds.com/#schedule",
    },
    fields: [ATTENDING, ADULT_GUESTS, MINOR_GUESTS, NOTES],
  },

  // NOTE: The "15-Hours of Board Gaming" partner event intentionally has no
  // RSVP page for now — RSVPs are handled by the partner team. Add a config
  // block here (slug "board-gaming") if that changes.

  marathon: {
    slug: "marathon",
    title: "24-Hour Marathon",
    dateLabel: "Nov 14, 8 AM → Nov 15, 8 AM, 2026",
    tagline: "The main event — 24 straight hours of gaming for the kids.",
    accentText: "text-magenta",
    accentBg: "bg-magenta",
    accentBgHover: "hover:brightness-110",
    calendar: {
      start: "2026-11-14T08:00:00-06:00",
      end: "2026-11-15T08:00:00-06:00",
      location: "",
      description: "The Extra Life Nerds 24-hour gaming marathon main event. Details: https://elnerds.com/#schedule",
    },
    fields: [
      ATTENDING,
      ADULT_GUESTS,
      MINOR_GUESTS,
      {
        id: "rig",
        label: "Bringing a gaming PC or console?",
        type: "select",
        half: true,
        options: [
          { value: "none", label: "Neither" },
          { value: "pc", label: "PC" },
          { value: "console", label: "Console" },
          { value: "both", label: "Both" },
        ],
      },
      {
        id: "duration",
        label: "How long do you think you'll attend?",
        type: "select",
        half: true,
        options: [
          { value: "an_hour", label: "An hour" },
          { value: "a_few_hours", label: "A few hours" },
          { value: "entire_day", label: "The entire day" },
          { value: "full_24", label: "The Full 24!" },
        ],
      },
      NOTES,
    ],
  },
};

export const RSVP_EVENT_LIST: RsvpEvent[] = Object.values(RSVP_EVENTS);

export function getRsvpEvent(slug: string): RsvpEvent | undefined {
  return RSVP_EVENTS[slug];
}
