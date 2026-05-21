# HIRRA Admin

Premium operations dashboard for orders and KPIs.

## Setup

1. Configure the API (`apps/api/.env` from `apps/api/.env.example`):
   - `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (existing HIRRA database)
   - `ADMIN_API_KEY` — shared secret for dashboard login

2. Start the API:

```bash
npm run dev:api
```

3. Start the admin UI (proxies `/api` → `http://localhost:3001`):

```bash
npm run dev:admin
```

4. Open http://localhost:5175/login and paste your `ADMIN_API_KEY`.

## API routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/orders` | Create order (checkout payload) |
| GET | `/api/orders` | List orders with line items |
| PATCH | `/api/orders/:id/status` | Update status |
| GET | `/api/dashboard/stats` | Dashboard metrics |

Auth: `Authorization: Bearer <ADMIN_API_KEY>`

## Status mapping (no DB schema change)

API labels map to existing `order_status` enum values:

| API | Database |
|-----|----------|
| new | `pending_confirmation`, `fake_flagged` |
| confirmed | `confirmed`, `packed` |
| shipped | `shipped` |
| delivered | `delivered` |
| returned | `returned`, `refunded` |
| cancelled | `cancelled` |
