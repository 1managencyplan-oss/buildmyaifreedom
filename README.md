# buildmyaifreedom.com

One-page site for **buildmyaifreedom** — AI-powered funnels, marketing and growth systems.
Built from the brochure shared at **Confluence 2026** (Hyatt Ahmedabad), where SUGH is a media partner.

Founders: **Palash Rajak** (+91 91096 37004) · **Nitin Joshi** (+91 78219 84708)

---

## Structure

```
index.html            the whole site (self-contained HTML + CSS + JS)
CNAME                 buildmyaifreedom.com
.nojekyll             skip Jekyll processing on GitHub Pages
assets/
  founders-confluence.jpg   hero photo — Confluence 2026
  founders-brand.jpg        brand photo from the brochure (spare)
  confluence-logo.png       Confluence 2026 logo (white, for dark backgrounds)
setup/
  apps-script.gs      Google Apps Script lead endpoint (optional, see below)
```

Page sections: Header → Hero → Proof of speed → What we do → The three systems →
How we work / Who it's for → Free AI Growth Audit form → Footer, plus a floating WhatsApp button.

---

## The one config block

Everything editable lives at the bottom of `index.html`:

```js
var CONFIG = {
  WHATSAPP_NUMBER : '917821984708',                 // digits only, with country code
  WHATSAPP_MESSAGE: 'Hi Ai Powered tech partners,', // floating-button prefill
  FORM_ENDPOINT   : ''                              // Apps Script /exec URL
};
```

**The form works with `FORM_ENDPOINT` empty.** In that mode a submit shows the success
state and hands the full lead straight to WhatsApp, so nothing is ever lost. Wire the
endpoint when you want leads landing in a Sheet as well.

### Wiring the Google Sheet (2 minutes)

1. New Google Sheet, first tab named `Leads`.
2. Extensions → Apps Script → paste `setup/apps-script.gs`.
3. Deploy → New deployment → **Web app**, Execute as **Me**, Access **Anyone**.
4. Copy the `/exec` URL into `CONFIG.FORM_ENDPOINT`, commit, push.
5. Optional: set `NOTIFY_EMAILS` in the script for an instant email on every lead.

---

## DNS — pointing buildmyaifreedom.com at GitHub Pages

At your domain registrar, on the **apex** (`buildmyaifreedom.com`, host `@`):

| Type | Host | Value           | TTL  |
|------|------|-----------------|------|
| A    | @    | 185.199.108.153 | 3600 |
| A    | @    | 185.199.109.153 | 3600 |
| A    | @    | 185.199.110.153 | 3600 |
| A    | @    | 185.199.111.153 | 3600 |

And for `www`:

| Type  | Host | Value                       | TTL  |
|-------|------|-----------------------------|------|
| CNAME | www  | 1managencyplan-oss.github.io | 3600 |

Optional IPv6 (add all four or none):

```
AAAA  @  2606:50c0:8000::153
AAAA  @  2606:50c0:8001::153
AAAA  @  2606:50c0:8002::153
AAAA  @  2606:50c0:8003::153
```

Delete any existing A / AAAA / CNAME records on `@` and `www` first — stale records are
the usual reason the domain check fails.

### GitHub side

Repo → **Settings → Pages**
- Source: **Deploy from a branch** → `main` / `/ (root)`
- Custom domain: `buildmyaifreedom.com` → Save
- Tick **Enforce HTTPS** once the certificate is issued (can take up to an hour)

DNS usually propagates in 5–30 minutes.

---

## Deploying a change

```bash
git add -A && git commit -m "Update copy" && git push origin main
```

GitHub Pages redeploys in 1–3 minutes.
