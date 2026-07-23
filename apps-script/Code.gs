/**
 * elnerds.com RSVP backend — Google Apps Script
 *
 * What this does:
 *   - Receives RSVP submissions (POST) from the form at elnerds.com/rsvp
 *   - Appends each RSVP to a Google Sheet ("elnerds RSVPs") in this
 *     account's Drive (auto-created on first submission)
 *   - Emails the registrant a confirmation with Add-to-Calendar and
 *     Cancel buttons
 *   - Emails the captain account a notification
 *   - Handles cancel links (GET ?action=cancel&token=...) by marking the
 *     row "Cancelled" and notifying the captain
 *
 * Setup: see apps-script/README.md in the repo.
 */

// ---------------------------------------------------------------------------
// Config — edit these
// ---------------------------------------------------------------------------

// Where "new RSVP" notifications go. Defaults to the account that owns this
// script. Replace with a string like "captain@example.com" to override.
const CAPTAIN_EMAIL = Session.getEffectiveUser().getEmail();

// Name shown as the email sender.
const SENDER_NAME = "Extra Life Nerds";

// Spreadsheet that stores RSVPs (created automatically on first submission).
const SPREADSHEET_NAME = "elnerds RSVPs";

// Event details used for the Add-to-Calendar button. Keys must exactly match
// the event titles used on the site. Times are ISO 8601 with UTC offset
// (Minnesota: -05:00 in summer/CDT, -06:00 in winter/CST).
const EVENTS = {
  "Extra Life Bingo": {
    start: "2026-08-08T15:00:00-05:00",
    end: "2026-08-08T18:00:00-05:00",
    location: "Truplayerz Sports Training & Upper Deck Lounge",
    description: "Extra Life Bingo with the Extra Life Nerds leadership. Details: https://elnerds.com/#schedule",
  },
  "15-Hours of Board Gaming": {
    start: "2026-11-07T09:00:00-06:00",
    end: "2026-11-07T23:59:00-06:00",
    location: "St Paul Masonic Center, 200 E Plato Blvd, St Paul, MN 55107",
    description: "15 hours of marathon board gaming with our partner team. Details: https://elnerds.com/#schedule",
  },
  "24-Hour Marathon": {
    start: "2026-11-14T08:00:00-06:00",
    end: "2026-11-15T08:00:00-06:00",
    location: "",
    description: "The Extra Life Nerds 24-hour gaming marathon main event. Details: https://elnerds.com/#schedule",
  },
};

// ---------------------------------------------------------------------------
// Sheet columns
// ---------------------------------------------------------------------------

const HEADERS = ["Timestamp", "Name", "Email", "Event", "Attending", "Guests", "Message", "Status", "Token"];
const COL = { TIMESTAMP: 1, NAME: 2, EMAIL: 3, EVENT: 4, ATTENDING: 5, GUESTS: 6, MESSAGE: 7, STATUS: 8, TOKEN: 9 };

function getSheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty("SPREADSHEET_ID");
  let ss;
  if (id) {
    try {
      ss = SpreadsheetApp.openById(id);
    } catch (e) {
      id = null; // was deleted — recreate below
    }
  }
  if (!id) {
    ss = SpreadsheetApp.create(SPREADSHEET_NAME);
    props.setProperty("SPREADSHEET_ID", ss.getId());
  }
  const sheet = ss.getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ---------------------------------------------------------------------------
// POST — new RSVP from the site
// ---------------------------------------------------------------------------

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Validate + sanitize (the site validates too; never trust the client)
    const name = String(data.name || "").trim().slice(0, 200);
    const email = String(data.email || "").trim().slice(0, 200);
    const eventName = String(data.event || "").trim().slice(0, 200);
    const attending = String(data.attending || "").trim();
    const guests = Math.max(0, Math.min(20, parseInt(data.guests, 10) || 0));
    const message = String(data.message || "").trim().slice(0, 1000);

    if (!name || !eventName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json_({ ok: false, error: "Invalid submission." });
    }
    if (["yes", "no", "maybe"].indexOf(attending) === -1) {
      return json_({ ok: false, error: "Invalid submission." });
    }

    const token = Utilities.getUuid();

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      getSheet_().appendRow([new Date(), name, email, eventName, attending, guests, message, "Confirmed", token]);
    } finally {
      lock.releaseLock();
    }

    sendConfirmationEmail_(name, email, eventName, attending, guests, token);
    sendCaptainEmail_(name, email, eventName, attending, guests, message);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: "Server error: " + err.message });
  }
}

// ---------------------------------------------------------------------------
// GET — cancel links (and a health check)
// ---------------------------------------------------------------------------

function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : null;

  if (action === "cancel" && e.parameter.token) {
    return handleCancel_(String(e.parameter.token));
  }

  return HtmlService.createHtmlOutput(page_("Extra Life Nerds RSVP", "This is the RSVP service for <a href=\"https://elnerds.com\">elnerds.com</a>. Nothing to see here!"));
}

function handleCancel_(token) {
  const sheet = getSheet_();
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][COL.TOKEN - 1]) === token) {
        if (rows[i][COL.STATUS - 1] === "Cancelled") {
          return HtmlService.createHtmlOutput(page_("Already cancelled", "This RSVP was already cancelled. Changed your mind? Just <a href=\"https://elnerds.com/rsvp\">RSVP again</a>."));
        }
        sheet.getRange(i + 1, COL.STATUS).setValue("Cancelled");

        const name = rows[i][COL.NAME - 1];
        const eventName = rows[i][COL.EVENT - 1];
        MailApp.sendEmail({
          to: CAPTAIN_EMAIL,
          subject: "RSVP cancelled: " + name + " — " + eventName,
          htmlBody: "<p><strong>" + esc_(name) + "</strong> (" + esc_(rows[i][COL.EMAIL - 1]) + ") cancelled their RSVP for <strong>" + esc_(eventName) + "</strong>.</p>",
          name: SENDER_NAME,
        });

        return HtmlService.createHtmlOutput(page_("RSVP cancelled", "Your RSVP for <strong>" + esc_(eventName) + "</strong> has been cancelled. Sorry you can't make it! Changed your mind? <a href=\"https://elnerds.com/rsvp\">RSVP again</a> any time."));
      }
    }
    return HtmlService.createHtmlOutput(page_("Not found", "We couldn't find that RSVP — it may have already been removed. Questions? Email <a href=\"mailto:info@elnerds.com\">info@elnerds.com</a>."));
  } finally {
    lock.releaseLock();
  }
}

// ---------------------------------------------------------------------------
// Emails
// ---------------------------------------------------------------------------

function sendConfirmationEmail_(name, email, eventName, attending, guests, token) {
  const cancelUrl = ScriptApp.getService().getUrl() + "?action=cancel&token=" + encodeURIComponent(token);
  const ev = EVENTS[eventName];

  const attendLine = {
    yes: "You're confirmed for",
    maybe: "You're pencilled in (maybe) for",
    no: "We've noted you can't make it to",
  }[attending];

  let calendarHtml = "";
  const attachments = [];
  if (ev && attending !== "no") {
    const gcalUrl = googleCalendarUrl_(eventName, ev);
    calendarHtml =
      '<p style="margin:24px 0;text-align:center;">' +
      '<a href="' + gcalUrl + '" style="background:#0d9488;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 28px;border-radius:999px;display:inline-block;">📅 Add to Calendar</a>' +
      "</p>" +
      '<p style="font-size:12px;color:#666;text-align:center;">Not a Google Calendar user? Open the attached <em>event.ics</em> file instead.</p>';
    attachments.push(Utilities.newBlob(buildIcs_(eventName, ev), "text/calendar", "event.ics"));
  }

  const htmlBody =
    '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">' +
    '<h2 style="color:#0d9488;">You\'re on the list! 🎉</h2>' +
    "<p>Hi " + esc_(name) + ",</p>" +
    "<p>" + attendLine + " <strong>" + esc_(eventName) + "</strong>" +
    (guests > 0 ? " with <strong>" + guests + "</strong> additional guest" + (guests > 1 ? "s" : "") : "") +
    ".</p>" +
    (ev && ev.location ? "<p><strong>Where:</strong> " + esc_(ev.location) + "</p>" : "") +
    calendarHtml +
    '<p style="margin-top:32px;">Plans changed? No problem:</p>' +
    '<p style="text-align:center;margin:16px 0;">' +
    '<a href="' + cancelUrl + '" style="background:#ffffff;color:#be185d;border:2px solid #be185d;text-decoration:none;font-weight:bold;padding:10px 24px;border-radius:999px;display:inline-block;">Cancel my RSVP</a>' +
    "</p>" +
    '<hr style="border:none;border-top:1px solid #e5e5e5;margin:32px 0 16px;">' +
    '<p style="font-size:12px;color:#666;">Extra Life Nerds · <a href="https://elnerds.com" style="color:#0d9488;">elnerds.com</a> · Playing games to heal kids at Gillette Children\'s Hospital</p>' +
    "</div>";

  MailApp.sendEmail({
    to: email,
    subject: "RSVP confirmed: " + eventName,
    htmlBody: htmlBody,
    body: "Hi " + name + ", " + attendLine.toLowerCase() + " " + eventName + ". Cancel: " + cancelUrl,
    name: SENDER_NAME,
    attachments: attachments,
  });
}

function sendCaptainEmail_(name, email, eventName, attending, guests, message) {
  MailApp.sendEmail({
    to: CAPTAIN_EMAIL,
    subject: "New RSVP: " + name + " — " + eventName + " (" + attending + ")",
    htmlBody:
      '<div style="font-family:Arial,Helvetica,sans-serif;">' +
      "<p><strong>New RSVP received</strong></p>" +
      "<table cellpadding=\"4\">" +
      "<tr><td><strong>Name</strong></td><td>" + esc_(name) + "</td></tr>" +
      "<tr><td><strong>Email</strong></td><td>" + esc_(email) + "</td></tr>" +
      "<tr><td><strong>Event</strong></td><td>" + esc_(eventName) + "</td></tr>" +
      "<tr><td><strong>Attending</strong></td><td>" + esc_(attending) + "</td></tr>" +
      "<tr><td><strong>Guests</strong></td><td>" + guests + "</td></tr>" +
      (message ? "<tr><td><strong>Message</strong></td><td>" + esc_(message) + "</td></tr>" : "") +
      "</table>" +
      "<p>Full list: open \"" + SPREADSHEET_NAME + "\" in Google Drive.</p>" +
      "</div>",
    name: SENDER_NAME,
  });
}

// ---------------------------------------------------------------------------
// Calendar helpers
// ---------------------------------------------------------------------------

function utcStamp_(iso) {
  return Utilities.formatDate(new Date(iso), "UTC", "yyyyMMdd'T'HHmmss'Z'");
}

function googleCalendarUrl_(title, ev) {
  return (
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(title + " — Extra Life Nerds") +
    "&dates=" + utcStamp_(ev.start) + "/" + utcStamp_(ev.end) +
    "&details=" + encodeURIComponent(ev.description || "") +
    "&location=" + encodeURIComponent(ev.location || "")
  );
}

function buildIcs_(title, ev) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//elnerds.com//RSVP//EN",
    "BEGIN:VEVENT",
    "UID:" + Utilities.getUuid() + "@elnerds.com",
    "DTSTAMP:" + utcStamp_(new Date().toISOString()),
    "DTSTART:" + utcStamp_(ev.start),
    "DTEND:" + utcStamp_(ev.end),
    "SUMMARY:" + title + " — Extra Life Nerds",
    "DESCRIPTION:" + (ev.description || "").replace(/\n/g, "\\n"),
    "LOCATION:" + (ev.location || ""),
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

// ---------------------------------------------------------------------------
// Small utilities
// ---------------------------------------------------------------------------

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function esc_(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function page_(title, bodyHtml) {
  return (
    "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>" + esc_(title) + "</title></head>" +
    '<body style="font-family:Arial,Helvetica,sans-serif;background:#faf7f2;margin:0;padding:40px 16px;">' +
    '<div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.08);">' +
    '<h1 style="color:#0d9488;font-size:24px;margin:0 0 12px;">' + title + "</h1>" +
    '<p style="color:#444;line-height:1.6;">' + bodyHtml + "</p>" +
    "</div></body></html>"
  );
}

/**
 * Run this once from the editor (Run > setup) to trigger the permissions
 * prompt and create the spreadsheet before going live.
 */
function setup() {
  const sheet = getSheet_();
  Logger.log("Spreadsheet ready: " + sheet.getParent().getUrl());
  Logger.log("Notifications will go to: " + CAPTAIN_EMAIL);
}
