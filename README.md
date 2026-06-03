# RIYANALUXE — Premium Maghreb Home Fragrance

Self-hosted ecommerce storefront for **RIYANALUXE** (ريانا لوكس) — luxury Mabkhara and home ritual products for Morocco, Algeria, and Tunisia.

## Stack

- **Frontend:** React + Vite + Tailwind (`apps/web`)
- **Shared:** Types, brand constants, MAD shipping (`packages/shared`)
- **Database:** Supabase (`supabase/migrations`)

## Quick start

```bash
npm install
cd apps/web
cp .env.example .env.local   # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_WHATSAPP_PHONE
npm run dev
```

## Brand

- Identity: `docs/RIYANALUXE_BRAND_IDENTITY.md`
- Hero product: Mabkhara Luxe (`riyanaluxe-mabkhara-luxe`)
- Visual assets: `apps/web/public/images/riyana/`

## Deploy (Vercel)

- Root directory: `apps/web`
- Build: `npm run build`
- Output: `dist`
