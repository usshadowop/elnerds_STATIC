# Branding

Design source of truth for everything the Extra Life Nerds put in front of
people outside the website itself.

| Directory | What |
| --- | --- |
| [`email/`](email/) | The email template, block library and design tokens |

The website's own styling is not duplicated here — it lives in
`src/styles.css` as Tailwind v4 theme tokens, and the site is the authority
for it. What's in this directory is for surfaces that *can't* read those
tokens (email clients, print, third-party platforms) and therefore need the
values written down where a human can copy them.

Keep these documents honest the same way the feature cards are kept honest:
if you change a design, change the document in the same commit. A branding
doc that disagrees with what actually shipped is worse than no doc.
