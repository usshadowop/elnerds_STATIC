# Stripo version of our emails

Stripo (stripo.email) is a drag-and-drop email builder that exports straight
to Brevo. This folder holds our emails rewritten in **MJML**, the format
Stripo imports as a fully editable template. HTML imported into Stripo only
lets you change text and images; MJML gets the full drag-and-drop editor.

| File | What it is |
| --- | --- |
| `elnerds-signup-recruit.mjml` | The Sep 2026 sign-up/recruit email (`../elnerds-signup-recruit.html`), rebuilt in MJML. Use it as the team's starting template. |

## Import it into Stripo

1. Sign in to Stripo and start a new email using its **import** option
   (Stripo's help pages describe it as the import arrow at the top left of
   the account, or "New message → Basic templates → My HTML"; the wording
   moves around between versions).
2. Choose **HTML / MJML**, then upload `elnerds-signup-recruit.mjml` or
   paste its contents.
3. Stripo converts it and saves it to your email library.

## Set it up once after importing

- **Font:** add **Nunito** from Google Fonts in Stripo's appearance or
  general settings and make it the default. Stripo's docs warn that custom
  fonts often need this step after an import. Fallback is Helvetica/Arial.
- **Brand colours:** save these in Stripo so they're one click away:

  | Colour | Hex | Used for |
  | --- | --- | --- |
  | Ink | `#1a2b4a` | Headlines |
  | Ink soft | `#4a5a73` | Body text |
  | Teal | `#1d6e7a` | Links, Game Day and Step 3 accents |
  | Magenta | `#c8327c` | "Heal Kids.", emphasis |
  | Orange | `#e87722` | The main button |
  | Purple | `#6b3d8a` | Step 2 accents |
  | Gold | `#d4a017` | Bullet accent |
  | Cream | `#fdfaf6` | Page background |
  | Teal band | `#e6f2f3` | Tinted sections |
  | Purple band | `#f3ecf7` | Tinted sections |
  | Line | `#e6eaed` | Card borders, divider |

- **Save it as a template** so teammates copy it instead of editing the
  original.

## Check before every send

- The three Brevo tags must survive exactly as written:
  - `{{ contact.FULL_NAME|default:"there" }}` in the greeting. The
    attribute is `FULL_NAME`, not `FIRSTNAME`, and the `|default:` part is
    needed, or everyone gets a blank or "Hi there".
  - `{{ mirror }}` behind "View it in your browser".
  - `{{ unsubscribe }}` in the footer. Brevo won't save a campaign without it.
- RSVP buttons must point at real event pages: today only
  `https://elnerds.com/rsvp/marathon` and `/rsvp/bingo` exist. An unknown
  slug silently lands on the generic RSVP list.
- Directions links use the `https://www.google.com/maps/dir/?api=1&destination=…`
  form, so the route starts from the reader's location.
- Don't paste shell commands or code snippets into the email content.
  Brevo's firewall blocked the owner once for that (see `../../CLAUDE.md`).

## Send it through Brevo

Stripo's **Export** button (above the email) has a **Brevo** option. It asks
for a Brevo API key (in Brevo: your account menu → **SMTP & API** → API
keys) and whether to create a campaign or a template. Exported emails stay
editable in Brevo. Alternatively, export the HTML and paste it into Brevo
with **Import a code / Rich HTML**, as we do today.

## How it differs from the hand-coded HTML

- **Hero background** is flat teal-mist (`#eef7f7`) instead of the subtle
  teal-to-pink gradient; MJML has no gradient setting.
- **Outlook for Windows** shows square-cornered buttons and a square card.
  MJML doesn't generate the Outlook-only rounded-button code our HTML
  carries. Every other client shows the rounded pills.
- **Phones fit better.** The cards drop their side spacer columns and go
  full width, so the email fits a 375px screen. The hand-coded HTML renders
  about 418px wide there.
- Reward cards, the address card and the venue card are each a single text
  block holding a small table, so in Stripo you edit the words in place and
  move the card as one piece.

## Updating the MJML

Edit the `.mjml` file, then check it compiles cleanly and looks right. The
official compiler is on npm as `mjml`; run it with strict validation and
open the HTML it writes in a browser at desktop and phone width. Once the
team is working in Stripo, Stripo's copy becomes the source of truth: export
each sent email's HTML into `../archive/` as usual.
