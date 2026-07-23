/**
 * elnerds.com RSVP backend — Google Apps Script
 *
 * Each event on the site has its own RSVP page (/rsvp/<slug>) with its own set
 * of fields. This Web App:
 *   - Receives an RSVP (POST) as JSON: { slug, title, name, email, fields:[{id,label,value}] }
 *   - Appends it to a per-event tab in a Google Sheet ("elnerds RSVPs") in this
 *     account's Drive (tabs + columns are created automatically)
 *   - Emails the registrant a confirmation with Add-to-Calendar + Cancel buttons
 *   - Emails the captain account a notification
 *   - Handles cancel links (GET ?action=cancel&token=...): marks the row
 *     "Cancelled" and notifies the captain
 *
 * Setup: see apps-script/README.md in the repo.
 */

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// Where "new RSVP" / "cancelled" notifications go.
const CAPTAIN_EMAIL = "captainextralifenerds@gmail.com";

// Name shown as the email sender.
const SENDER_NAME = "Extra Life Nerds";

// Spreadsheet that stores RSVPs (created automatically on first submission).
const SPREADSHEET_NAME = "elnerds RSVPs";

// Per-event details for the Add-to-Calendar button, keyed by slug. Keys must
// match the slugs in src/lib/rsvpEvents.ts. Times are ISO 8601 with a UTC
// offset (Minnesota: -05:00 CDT in summer, -06:00 CST in winter).
const EVENTS = {
  bingo: {
    start: "2026-08-08T15:00:00-05:00",
    end: "2026-08-08T18:00:00-05:00",
    location: "Truplayerz Sports Training & Upper Deck Lounge",
    description: "Extra Life Bingo with the Extra Life Nerds. Details: https://elnerds.com/#schedule",
  },
  marathon: {
    start: "2026-11-14T08:00:00-06:00",
    end: "2026-11-15T08:00:00-06:00",
    location: "",
    description: "The Extra Life Nerds 24-hour gaming marathon main event. Details: https://elnerds.com/#schedule",
  },
};

// ---------------------------------------------------------------------------
// Spreadsheet helpers
// ---------------------------------------------------------------------------

function getSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty("SPREADSHEET_ID");
  if (id) {
    try {
      return SpreadsheetApp.openById(id);
    } catch (e) {
      // was deleted — fall through and recreate
    }
  }
  const ss = SpreadsheetApp.create(SPREADSHEET_NAME);
  props.setProperty("SPREADSHEET_ID", ss.getId());
  // Drop the default empty "Sheet1" once real event tabs exist (handled lazily).
  return ss;
}

// Returns the tab for an event, creating it (with headers) if needed.
// Headers: Timestamp, Name, Email, <field labels...>, Status, Token
function getEventSheet_(ss, title, fieldLabels) {
  const tabName = title.slice(0, 90) || "RSVPs";
  let sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    // Reuse the blank default sheet if it's still empty & unnamed-ish.
    const first = ss.getSheets()[0];
    if (ss.getSheets().length === 1 && first.getLastRow() === 0) {
      sheet = first.setName(tabName);
    } else {
      sheet = ss.insertSheet(tabName);
    }
  }
  if (sheet.getLastRow() === 0) {
    const headers = ["Timestamp", "Name", "Email"].concat(fieldLabels).concat(["Status", "Token"]);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ---------------------------------------------------------------------------
// POST — new RSVP
// ---------------------------------------------------------------------------

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const slug = String(data.slug || "").trim().slice(0, 60);
    const title = String(data.title || "").trim().slice(0, 120);
    const name = String(data.name || "").trim().slice(0, 200);
    const email = String(data.email || "").trim().slice(0, 200);
    const fields = Array.isArray(data.fields) ? data.fields : [];

    if (!name || !title || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json_({ ok: false, error: "Invalid submission." });
    }

    // Normalize field entries to {label, value, id}
    const clean = fields.slice(0, 40).map(function (f) {
      return {
        id: String(f.id || "").slice(0, 60),
        label: String(f.label || "").slice(0, 120),
        value: String(f.value == null ? "" : f.value).slice(0, 1000),
      };
    });

    const findVal = function (id) {
      for (let i = 0; i < clean.length; i++) if (clean[i].id === id) return clean[i].value;
      return "";
    };
    const attending = findVal("attending"); // "yes" | "maybe" | "no" | ""
    const guests = parseInt(findVal("guests"), 10) || 0;

    const token = Utilities.getUuid();

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const ss = getSpreadsheet_();
      const sheet = getEventSheet_(ss, title, clean.map(function (f) { return f.label; }));
      const row = [new Date(), name, email]
        .concat(clean.map(function (f) { return f.value; }))
        .concat(["Confirmed", token]);
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    sendConfirmationEmail_(name, email, title, slug, attending, guests, token);
    sendCaptainEmail_(name, email, title, clean);

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
  return HtmlService.createHtmlOutput(
    page_("Extra Life Nerds RSVP", 'This is the RSVP service for <a href="https://elnerds.com">elnerds.com</a>. Nothing to see here!'),
  );
}

function handleCancel_(token) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = getSpreadsheet_();
    const sheets = ss.getSheets();
    for (let s = 0; s < sheets.length; s++) {
      const sheet = sheets[s];
      const values = sheet.getDataRange().getValues();
      if (values.length < 2) continue;
      const header = values[0];
      const tokenCol = header.indexOf("Token");
      const statusCol = header.indexOf("Status");
      const nameCol = header.indexOf("Name");
      const emailCol = header.indexOf("Email");
      if (tokenCol === -1 || statusCol === -1) continue;

      for (let i = 1; i < values.length; i++) {
        if (String(values[i][tokenCol]) === token) {
          if (values[i][statusCol] === "Cancelled") {
            return HtmlService.createHtmlOutput(
              page_("Already cancelled", 'This RSVP was already cancelled. Changed your mind? Just <a href="https://elnerds.com">RSVP again</a>.'),
            );
          }
          sheet.getRange(i + 1, statusCol + 1).setValue("Cancelled");
          const eventName = sheet.getName();
          const name = nameCol > -1 ? values[i][nameCol] : "";
          const email = emailCol > -1 ? values[i][emailCol] : "";
          MailApp.sendEmail({
            to: CAPTAIN_EMAIL,
            subject: "RSVP cancelled: " + name + " — " + eventName,
            htmlBody: "<p><strong>" + esc_(name) + "</strong> (" + esc_(email) + ") cancelled their RSVP for <strong>" + esc_(eventName) + "</strong>.</p>",
            name: SENDER_NAME,
          });
          return HtmlService.createHtmlOutput(
            page_("RSVP cancelled", "Your RSVP for <strong>" + esc_(eventName) + "</strong> has been cancelled. Sorry you can't make it! Changed your mind? <a href=\"https://elnerds.com\">RSVP again</a> any time."),
          );
        }
      }
    }
    return HtmlService.createHtmlOutput(
      page_("Not found", 'We couldn\'t find that RSVP — it may have already been removed. Questions? Email <a href="mailto:info@elnerds.com">info@elnerds.com</a>.'),
    );
  } finally {
    lock.releaseLock();
  }
}

// ---------------------------------------------------------------------------
// Emails
// ---------------------------------------------------------------------------

function sendConfirmationEmail_(name, email, title, slug, attending, guests, token) {
  const cancelUrl = ScriptApp.getService().getUrl() + "?action=cancel&token=" + encodeURIComponent(token);
  const ev = EVENTS[slug];

  const attendLine =
    attending === "no"
      ? "We've noted you can't make it to"
      : attending === "maybe"
      ? "You're pencilled in (maybe) for"
      : "You're confirmed for";

  let calendarHtml = "";
  const attachments = [];
  if (ev && attending !== "no") {
    const gcalUrl = googleCalendarUrl_(title, ev);
    calendarHtml =
      '<p style="margin:24px 0;text-align:center;">' +
      '<a href="' + gcalUrl + '" style="background:#0d9488;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 28px;border-radius:999px;display:inline-block;">📅 Add to Calendar</a>' +
      "</p>" +
      '<p style="font-size:12px;color:#666;text-align:center;">Not a Google Calendar user? Open the attached <em>event.ics</em> file instead.</p>';
    attachments.push(Utilities.newBlob(buildIcs_(title, ev), "text/calendar", "event.ics"));
  }

  const htmlBody =
    '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">' +
    '<h2 style="color:#0d9488;">You\'re on the list! 🎉</h2>' +
    "<p>Hi " + esc_(name) + ",</p>" +
    "<p>" + attendLine + " <strong>" + esc_(title) + "</strong>" +
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
    subject: "RSVP confirmed: " + title,
    htmlBody: htmlBody,
    body: "Hi " + name + ", " + attendLine.toLowerCase() + " " + title + ". Cancel: " + cancelUrl,
    name: SENDER_NAME,
    attachments: attachments,
  });
}

function sendCaptainEmail_(name, email, title, fields) {
  let rows =
    "<tr><td><strong>Name</strong></td><td>" + esc_(name) + "</td></tr>" +
    "<tr><td><strong>Email</strong></td><td>" + esc_(email) + "</td></tr>";
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].value === "") continue;
    rows += "<tr><td><strong>" + esc_(fields[i].label) + "</strong></td><td>" + esc_(fields[i].value) + "</td></tr>";
  }
  MailApp.sendEmail({
    to: CAPTAIN_EMAIL,
    subject: "New RSVP: " + name + " — " + title,
    htmlBody:
      '<div style="font-family:Arial,Helvetica,sans-serif;">' +
      "<p><strong>New RSVP received for " + esc_(title) + "</strong></p>" +
      '<table cellpadding="4">' + rows + "</table>" +
      '<p>Full list: open "' + SPREADSHEET_NAME + '" in Google Drive (tab: ' + esc_(title) + ").</p>" +
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
    '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc_(title) + "</title></head>" +
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
  const ss = getSpreadsheet_();
  Logger.log("Spreadsheet ready: " + ss.getUrl());
  Logger.log("Notifications will go to: " + CAPTAIN_EMAIL);
}
