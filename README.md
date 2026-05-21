# HIRRA — Premium Saudi Cat-Owner Essentials

Self-hosted ecommerce storefront for **Hirra** — the premium Saudi feline-care brand.

> 🐾 لأن قطتك تستاهل الأفضل

---

## Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS (RTL)
- **Backend**: Supabase (Postgres + Auth + Storage + Edge Functions)
- **Hosting**: Hostinger (static frontend) + Cloudflare (CDN/DNS)
- **Payments**: COD at launch; Mada / Apple Pay / Tabby / Tamara in Phase 2

## Monorepo layout

```
hirra/
├── apps/
│   ├── web/                 # Customer-facing storefront
│   └── admin/               # Admin dashboard (placeholder for Phase 2)
├── packages/
│   └── shared/              # Shared types, constants, utils
├── supabase/
│   ├── migrations/          # SQL schema + RLS + indexes + seed data
│   └── functions/           # Edge Functions (Deno)
├── docs/                    # All HIRRA_*.md strategy/brand documents
└── .github/workflows/       # Hostinger FTP auto-deploy
```

## Quick start (local dev)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example apps/web/.env.local
#    → fill in VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY

# 3. Start the dev server
npm run dev
#    → http://localhost:5173
```

## Supabase setup

Read **`SUPABASE_SETUP.md`** for step-by-step instructions to:
1. Create a Supabase project (Frankfurt region)
2. Run the 4 migrations (schema, RLS, indexes, seed data)
3. Get your `URL` and `anon key`
4. Deploy the `order-confirm` Edge Function

## Hostinger deployment

Read **`HOSTINGER_SETUP.md`** for step-by-step instructions to:
1. Set up Hostinger hosting + FTP credentials
2. Point your domain via Cloudflare
3. Configure GitHub Actions auto-deploy
4. Install the `.htaccess` SPA fallback

## Available scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the web app at `localhost:5173` |
| `npm run build` | Build the web app for production → `apps/web/dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run TypeScript checks across the monorepo |
| `npm run db:push` | Apply Supabase migrations to remote |
| `npm run fn:serve` | Run Edge Functions locally |
| `npm run fn:deploy:order-confirm` | Deploy the order-confirm function |

## Documentation

The `docs/` folder contains the full brand and operational playbook:
- `HIRRA_BRAND_GUIDE.md` — brand system, voice, identity
- `HIRRA_STORE_ARCHITECTURE.md` — full technical architecture
- `HIRRA_LP.md` — landing page copy + structure
- `HIRRA_CREATIVES.md` — 75 hooks + 15 scripts + UGC concepts
- `HIRRA_OPERATIONS.md` — WhatsApp/COD/CS playbook
- `HIRRA_SUPPLIERS.md` — sourcing + QC playbook
- `HIRRA_14_DAY_EXECUTION.md` — day-by-day launch plan

---

**Built with restraint. Shipped with love. 🐾**
