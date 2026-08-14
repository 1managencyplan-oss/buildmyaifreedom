/**
 * buildmyaifreedom — lead capture endpoint
 *
 * SETUP (2 minutes)
 * 1. Create a new Google Sheet. Name the first tab: Leads
 * 2. Extensions → Apps Script. Delete everything, paste this file.
 * 3. Deploy → New deployment → type "Web app"
 *      Execute as:        Me
 *      Who has access:    Anyone
 * 4. Copy the /exec URL.
 * 5. In index.html, set  CONFIG.FORM_ENDPOINT = 'https://script.google.com/macros/s/..../exec';
 *
 * Optional: set NOTIFY_EMAILS to get an instant email on every lead.
 */

var SHEET_NAME    = 'Leads';
var NOTIFY_EMAILS = '';   // e.g. 'palash@example.com,nitin@example.com' — leave empty to skip

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
             || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Reason', 'Source', 'Page', 'Referrer']);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      p.name   || '',
      p.email  || '',
      p.phone  || '',
      p.reason || '',
      p.source || '',
      p.page   || '',
      p.ref    || ''
    ]);

    if (NOTIFY_EMAILS) {
      MailApp.sendEmail({
        to      : NOTIFY_EMAILS,
        subject : 'New AI Growth Audit lead — ' + (p.name || 'Unknown'),
        body    : 'Name: '   + (p.name   || '-') + '\n'
                + 'Email: '  + (p.email  || '-') + '\n'
                + 'Phone: '  + (p.phone  || '-') + '\n'
                + 'Reason: ' + (p.reason || '-') + '\n'
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
