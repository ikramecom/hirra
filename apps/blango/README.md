# Blango Studio (`@blango/studio`)

Luxury RTL agency site (Vite + React).

## Local dev

```bash
# from repo root
npm install
npm run dev:blango
```

## Vercel production

Create a **separate** Vercel project for Blango (not the RIYANALUXE `apps/web` project).

| Setting | Value |
|--------|--------|
| Root Directory | `apps/blango` |
| Framework | Vite |
| Build Command | `npm run build` (default) |
| Output Directory | `dist` |
| Install Command | `cd ../.. && npm ci` (see `vercel.json`) |

### Required environment variable

Set in Vercel → **Settings → Environment Variables** (Production + Preview):

- `VITE_META_PIXEL_ID` — numeric Meta Pixel ID

Vite bakes this into the bundle and `index.html` at **build** time. Changing the variable requires a **redeploy**.

Optional:

- `VITE_SITE_URL` — canonical / Open Graph absolute URLs
- `VITE_GA4_ID` — defaults to `G-6PJH1GP650` if unset

## Google Analytics 4 (GA4)

Measurement ID: **G-6PJH1GP650**

- Official `gtag.js` is injected into `index.html` at build time.
- `GoogleAnalytics` in `AppLayout` sends `page_path` on each React Router navigation.

### Verify GA4 after deploy

1. **View page source** — search for `@blango/studio Google Analytics` and `googletagmanager.com/gtag/js?id=G-6PJH1GP650`.
2. **Network** — `gtag/js?id=G-6PJH1GP650` loads with status 200.
3. **GA4 Realtime** — [analytics.google.com](https://analytics.google.com) → Reports → Realtime; open the site in another tab and confirm an active user.
4. **Tag Assistant** (Chrome) — detects Google tag `G-6PJH1GP650`.
5. Navigate to `/pricing` or `/contact` — Realtime should show additional page views (SPA `page_path` updates).

## Meta Pixel verification

After deploy:

1. View page source — search for `@blango/studio Meta Pixel` and `fbevents.js`.
2. Network tab — request to `connect.facebook.net/en_US/fbevents.js`.
3. Console — `[Blango Meta Pixel] MetaPixel mounted` and a non-empty Pixel ID.
4. Meta Pixel Helper — should detect the pixel on load.
