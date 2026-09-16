# buildmyaifreedom.com

Site for **Build My AI Freedom** — AI-powered performance marketing, funnels and growth systems.

Founders: **Palash Rajak** (+91 91096 37004) · **Nitin Joshi** (+91 78219 84708)

---

## Pages

| URL | File | What it is |
|-----|------|------------|
| `/` | `index.html` | **Homepage** — performance-marketing page (dark/gold). Every CTA opens WhatsApp; no form. |
| `/confluence/` | `confluence/index.html` | Page built from the **Confluence 2026** brochure (Hyatt Ahmedabad). Lead form in a modal → Google Sheet. |
| `/new/` | `new/index.html` | Redirect to `/`, keeping any `?utm_…` tags and `#anchor`. `/new` was the homepage's address before 16 Sep 2026. |

## Structure

```
index.html              homepage
confluence/index.html   Confluence brochure page (references ../assets/)
new/index.html          redirect stub
images/
  logo/                 Build My AI Freedom logo
  proof/                campaign tracker screenshot (Live Proof section)
  team/                 team portraits, self-hosted
assets/
  founders-confluence.jpg   founders photo — homepage Team section + Confluence hero
  founders-brand.jpg        brand photo from the brochure (spare)
  confluence-logo.png       Confluence 2026 logo (white, for dark backgrounds)
setup/
  apps-script.gs        Google Apps Script lead endpoint for the Confluence form
CNAME                   buildmyaifreedom.com
.nojekyll               skip Jekyll processing on GitHub Pages
```

Homepage sections: Nav → Hero → Problem → Difference → Process → Services → Comparison →
Results → Live Proof → Team → FAQ → Final CTA → Footer, plus a floating WhatsApp button.

Before editing the homepage, search it for `fill-me` — those spans are placeholders
(dashed gold underline) waiting for real numbers.

---

## Confluence page config

The editable block sits at the bottom of `confluence/index.html`:

```js
var CONFIG = {
  WHATSAPP_NUMBER : '917821984708',                 // digits only, with country code
  WHATSAPP_MESSAGE: 'Hi Ai Powered tech partners,', // floating-button prefill
  FORM_ENDPOINT   : 'https://script.google.com/macros/s/…/exec'  // live Sheet endpoint
};
```

If `FORM_ENDPOINT` is ever emptied, the form still works: a submit shows the success state
and hands the full lead to WhatsApp, so nothing is lost.

### Re-wiring the Google Sheet

1. Google Sheet with a tab named `Leads`.
2. Extensions → Apps Script → paste `setup/apps-script.gs`.
3. Deploy → New deployment → **Web app**, Execute as **Me**, Access **Anyone**.
4. Run it once from the editor and approve the permissions — until you do, the `/exec` URL
   returns 403 "Access denied" even with Access set to Anyone.
5. Copy the `/exec` URL into `CONFIG.FORM_ENDPOINT`, commit, push.
6. Optional: set `NOTIFY_EMAILS` in the script for an instant email on every lead.

Testing the endpoint with curl: use `curl -L --data-urlencode …` and **don't** pass `-X POST`.
Apps Script answers with a redirect, and `-X POST` forces POST onto the redirected URL,
which returns a misleading 405.

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
