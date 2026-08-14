/**
 * buildmyaifreedom — lead capture endpoint
 *
 * Writes every form submission to a Google Sheet with date and time,
 * and optionally emails you the moment a lead lands.
 *
 * SETUP (2 minutes)
 * 1. Create a new Google Sheet. Name the first tab: Leads
 * 2. Extensions → Apps Script. Delete everything, paste this file.
 * 3. Deploy → New deployment → type "Web app"
 *      Execute as:        Me
 *      Who has access:    Anyone
 *    (Google will ask you to authorise it — that is expected.)
 * 4. Copy the /exec URL.
 * 5. In index.html, set  CONFIG.FORM_ENDPOINT = 'https://script.google.com/macros/s/..../exec';
 *    Commit and push.
 *
 * To test without the website: Deploy, then open the /exec URL in a browser.
 * It should return {"ok":true,...}. A row only appears on a real POST.
 */

var SHEET_NAME    = 'Leads';
var TIMEZONE      = 'Asia/Kolkata';   // all Date/Time columns are written in this zone
var NOTIFY_EMAILS = '';               // 'palash@example.com,nitin@example.com' — empty to skip

var HEADERS = [
  'Timestamp', 'Date', 'Time', 'Day',
  'Name', 'Email', 'Phone', 'Reason',
  'Visitor Local Time', 'Visitor Timezone',
  'Source', 'Page', 'Referrer'
];

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    // Ignore anything that tripped the honeypot field.
    if (p.company_website) { return json({ ok: true, skipped: 'honeypot' }); }

    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
           .setFontWeight('bold')
           .setBackground('#DEDCF0');
      sheet.setFrozenRows(1);
    }

    var now = new Date();
    var fmt = function (pattern) {
      return Utilities.formatDate(now, TIMEZONE, pattern);
    };

    sheet.appendRow([
      fmt('yyyy-MM-dd HH:mm:ss'),   // Timestamp — sorts correctly as text
      fmt('dd MMM yyyy'),           // Date      — 14 Aug 2026
      fmt('hh:mm a'),               // Time      — 10:34 AM
      fmt('EEEE'),                  // Day       — Friday
      p.name      || '',
      p.email     || '',
      p.phone     || '',
      p.reason    || '',
      p.localTime || '',
      p.tz        || '',
      p.source    || '',
      p.page      || '',
      p.ref       || ''
    ]);

    sheet.autoResizeColumns(1, HEADERS.length);

    if (NOTIFY_EMAILS) {
      MailApp.sendEmail({
        to      : NOTIFY_EMAILS,
        subject : 'New AI Growth Audit lead — ' + (p.name || 'Unknown'),
        body    : 'Name: '   + (p.name   || '-') + '\n'
                + 'Email: '  + (p.email  || '-') + '\n'
                + 'Phone: '  + (p.phone  || '-') + '\n'
                + 'Reason: ' + (p.reason || '-') + '\n\n'
                + 'When: '   + fmt('dd MMM yyyy, hh:mm a') + ' IST\n'
                + 'Page: '   + (p.page   || '-') + '\n'
                + 'Ref: '    + (p.ref    || '-')
      });
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, service: 'buildmyaifreedom lead endpoint' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
