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

## Meta Pixel verification

After deploy:

1. View page source — search for `@blango/studio Meta Pixel` and `fbevents.js`.
2. Network tab — request to `connect.facebook.net/en_US/fbevents.js`.
3. Console — `[Blango Meta Pixel] MetaPixel mounted` and a non-empty Pixel ID.
4. Meta Pixel Helper — should detect the pixel on load.
