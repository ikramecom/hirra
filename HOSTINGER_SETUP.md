# Hostinger Setup — Step by Step

This guide takes you from a finished Hirra build to a live `https://hirra.com`.
Estimated time: **45–90 minutes** (including DNS propagation).

---

## 1. Sign up for Hostinger

1. Go to <https://www.hostinger.com>
2. Choose **Premium Web Hosting** ($2.99/mo first year, $7.99/mo after) — sufficient for launch
3. Optional but recommended: get the **3-year plan** for the lowest per-month price
4. Complete signup

## 2. Set up your domain

### Option A — Buy through Hostinger (simplest)
1. Hostinger checkout will offer a free domain for the first year
2. Choose `hirra.com` (or your variant)

### Option B — Buy through Namecheap/Cloudflare Registrar
1. Buy `hirra.com` separately
2. Use Cloudflare nameservers in front of Hostinger (recommended for speed)

## 3. Point DNS via Cloudflare (recommended)

1. Sign up at <https://www.cloudflare.com>
2. Add `hirra.com` as a site → Free plan
3. Cloudflare will show 2 nameservers — copy them
4. In Hostinger / Namecheap, change nameservers to Cloudflare's
5. Wait 5–60 minutes for DNS propagation

In **Cloudflare → DNS**, add:
| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `@` | `<your Hostinger IP>` | ✅ Proxied |
| A | `www` | `<your Hostinger IP>` | ✅ Proxied |

> Find your Hostinger IP in hPanel → **Hosting → Manage → IP info**

## 4. Enable SSL

In **Cloudflare → SSL/TLS**:
- Set **SSL mode** to **Full (Strict)**
- Enable **Always Use HTTPS**
- Enable **Automatic HTTPS Rewrites**

In **Hostinger → SSL**:
- Click **Install free SSL certificate** (Let's Encrypt — auto-renewing)

Test: visit `https://hirra.com` — should resolve with green padlock.

## 5. Build the frontend locally

```bash
cd C:\Users\dell\Desktop\hirra
npm install
npm run build
```

The build output lives at `apps/web/dist/`.

## 6. Deploy — choose one method

### Method A — Manual FTP upload (simplest, one-off)
1. Hostinger hPanel → **Files → File Manager**
2. Navigate to `public_html/`
3. Delete the default `default.php` or any placeholder files
4. Upload everything from `apps/web/dist/` into `public_html/`
5. Make sure `index.html` and `.htaccess` are at the **root** of `public_html/`

### Method B — GitHub Actions auto-deploy (recommended)

#### Step 6.B.1 — Push your code to GitHub
```bash
cd C:\Users\dell\Desktop\hirra
git init
git add .
git commit -m "initial hirra storefront"
git remote add origin git@github.com:YOUR_USERNAME/hirra.git
git push -u origin main
```

#### Step 6.B.2 — Get Hostinger FTP credentials
1. hPanel → **Files → FTP Accounts**
2. Create new FTP account OR use the default one
3. Note these values:
   - **FTP Host**: usually `ftp.hirra.com` or shown as IP
   - **Username**: e.g., `u123456789`
   - **Password**: set during creation
   - **Port**: 21 (default FTP)

#### Step 6.B.3 — Add secrets to GitHub
1. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**
2. Add these secrets:
   - `HOSTINGER_FTP_HOST` → your FTP host
   - `HOSTINGER_FTP_USER` → your FTP username
   - `HOSTINGER_FTP_PASS` → your FTP password
   - `VITE_SUPABASE_URL` → your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key
   - `VITE_SITE_URL` → `https://hirra.com`
   - `VITE_WHATSAPP_PHONE` → your Saudi WhatsApp number (digits only)

#### Step 6.B.4 — Trigger first deploy
```bash
git commit --allow-empty -m "trigger first deploy"
git push
```

Watch the deploy in **GitHub → Actions** tab. Should complete in 2–4 minutes.

## 7. Verify the `.htaccess` is in place

After deploy, visit:
- `https://hirra.com` → homepage loads
- `https://hirra.com/products/hirra-pro-roller` → Hero LP loads (NOT 404)

If the second URL returns 404, the `.htaccess` file is missing or wrong.
Check `public_html/.htaccess` exists and contains the React Router fallback rules
(included in the build automatically from `apps/web/public/.htaccess`).

## 8. Performance tuning

### Cloudflare cache rules
1. **Cloudflare → Caching → Configuration**
2. Set **Browser Cache TTL** to 4 hours minimum
3. Enable **Tiered Caching**

### Cloudflare Speed
1. **Speed → Optimization**
2. Enable: Auto Minify (JS, CSS, HTML), Brotli, Early Hints
3. **Speed → Image Resizing** (paid) — optional

### Hostinger PHP settings
1. **Advanced → PHP Configuration**
2. Set **PHP version** to 8.2+
3. Increase `memory_limit` to 256M

## 9. Set up uptime monitoring

1. Sign up at <https://uptimerobot.com> (free, 50 monitors)
2. Add HTTP(s) monitor for `https://hirra.com`
3. Add HTTP(s) monitor for `https://hirra.com/products/hirra-pro-roller`
4. Set check interval to 5 minutes
5. Add your email + WhatsApp (via webhook) for alerts

## 10. Set up error monitoring

1. Sign up at <https://sentry.io> (free tier: 5K errors/month)
2. Create new project → React
3. Get the DSN
4. Add to `apps/web/.env.local`: `VITE_SENTRY_DSN=https://...`
5. Edit `apps/web/src/main.tsx` to initialize Sentry (Phase 2 — not in MVP)

---

## Common troubleshooting

| Problem | Fix |
|---|---|
| 404 on direct URL like `/products/...` | `.htaccess` missing or Hostinger doesn't have mod_rewrite. Check File Manager for `.htaccess` |
| Site loads but no products | Supabase env vars wrong. Check GitHub secrets match `.env.example` |
| Fonts not loading | Check `apps/web/public/fonts/` was uploaded; check `index.css` font paths |
| Images broken | Supabase Storage URLs wrong, or `product-images` bucket not public |
| Site loads slow | Enable Cloudflare proxy (orange cloud) for all DNS records |
| SSL "Not secure" warning | Cloudflare SSL mode should be **Full (Strict)**, not Flexible |

---

## Hostinger plan upgrade path

| When you hit... | Upgrade to |
|---|---|
| 50 concurrent users + occasional slowness | Business Web Hosting ($7/mo) |
| 100+ orders/day + need backend Node.js | Cloud Startup ($10/mo) |
| 500+ orders/day + need multi-region | VPS Cloud ($30+/mo) |

---

✅ Once all 10 steps are done, `https://hirra.com` is live and auto-deploys on every git push.
Time to start packing orders. 🐾
