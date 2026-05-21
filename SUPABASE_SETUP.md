# Supabase Setup — Step by Step

This guide takes you from zero to a working Supabase backend for Hirra.
Estimated time: **30–45 minutes**.

---

## 1. Create your Supabase project

1. Go to <https://supabase.com> → **Sign up** (use your Hirra business email)
2. Click **New project**
3. Settings:
   - **Name**: `hirra-prod`
   - **Database password**: generate a strong password — **save it in a password manager**
   - **Region**: **Frankfurt (eu-central-1)** ← lowest latency to KSA
   - **Pricing plan**: Free (we'll upgrade to Pro at ~$25/mo when we hit 1000+ orders)
4. Click **Create new project** and wait ~2 minutes for provisioning

## 2. Get your project keys

1. Once provisioned, go to **Settings → API**
2. Copy these two values into `apps/web/.env.local`:
   - `VITE_SUPABASE_URL` ← the **Project URL**
   - `VITE_SUPABASE_ANON_KEY` ← the **anon / public** key
3. **DO NOT** copy the `service_role` key to the frontend — it's admin-only, used by Edge Functions

## 3. Install the Supabase CLI

```bash
# macOS / Linux
brew install supabase/tap/supabase

# Windows (via scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or via npm (cross-platform)
npm install -g supabase
```

Verify install:
```bash
supabase --version
```

## 4. Link the CLI to your project

From the repo root (`C:\Users\dell\Desktop\hirra`):

```bash
supabase login            # opens browser to authenticate
supabase link --project-ref YOUR_PROJECT_REF
```

> Your project ref is the random string in your project URL: `https://YOUR_PROJECT_REF.supabase.co`

## 5. Apply the 4 migrations

```bash
supabase db push
```

This applies, in order:
1. `001_initial_schema.sql` — creates all 13 tables + enums
2. `002_rls_policies.sql` — enables Row-Level Security
3. `003_indexes.sql` — adds performance indexes
4. `004_seed_data.sql` — inserts 3 products, 3 bundles, 7 anchor reviews

> Verify in the Supabase dashboard → **Table Editor**. You should see all 13 tables populated.

## 6. Create your admin user

1. Go to **Authentication → Users → Add user**
2. Email: `hello@hirra.com` (or your real founder email)
3. Password: strong, save it
4. Click **Send invite** (or **Create user** if you don't want an email)

Then add the admin profile row via the SQL editor:

```sql
insert into admin_profiles (id, full_name, role, is_active)
select id, 'Founder', 'owner', true
from auth.users
where email = 'hello@hirra.com';
```

## 7. Deploy the `order-confirm` Edge Function

```bash
supabase functions deploy order-confirm --no-verify-jwt
```

> The `--no-verify-jwt` flag is REQUIRED because customers don't have auth tokens. The function validates the payload server-side.

Test it:
```bash
curl -X POST \
  "https://YOUR_PROJECT_REF.supabase.co/functions/v1/order-confirm" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "phone": "+966500000000",
      "name": "Test Customer",
      "city": "Riyadh",
      "district": "Olaya",
      "street_address": "Test Street"
    },
    "items": [
      { "product_id": "PUT_REAL_PRODUCT_ID_HERE", "quantity": 1 }
    ],
    "payment_method": "cod"
  }'
```

You should get a JSON response with `order_number` and the order should appear in the `orders` table.

## 8. Set up Storage buckets (for product images)

1. Go to **Storage → Create bucket**
2. Name: `product-images`
3. **Public bucket**: ✅ Yes
4. Click **Create bucket**

Repeat for: `review-images` (also public), `lifestyle-images` (public)

## 9. Verify Row-Level Security (RLS)

Go to **Authentication → Policies**. Confirm each table has at least one policy:
- `products`, `bundles`, `product_images`, `product_variants` → "public can read active"
- `reviews` → "public can read published"
- `orders` → "admin full access"
- `admin_profiles` → "admins read own profile"

If any table shows "RLS disabled" warning → re-run migration `002_rls_policies.sql`.

---

## Common troubleshooting

| Problem | Fix |
|---|---|
| `supabase db push` fails with "permission denied" | Check `supabase login` is active; check linked project ref |
| Edge Function fails with "JWT required" | Add `--no-verify-jwt` flag when deploying |
| Frontend can't fetch products | Check `.env.local` has correct URL + anon key; check RLS policy allows public read |
| Orders not inserting | Check Edge Function logs in Supabase dashboard → Functions → order-confirm → Logs |

---

## Free tier limits (Supabase)

| Resource | Free | Pro ($25/mo) |
|---|---|---|
| Database | 500 MB | 8 GB |
| Storage | 1 GB | 100 GB |
| Bandwidth | 5 GB/mo | 250 GB/mo |
| Edge Functions | 500K invocations | 2M invocations |
| Realtime | 200 concurrent | 500 concurrent |

You'll exhaust the free tier around **1000–2000 orders/month**. Upgrade to Pro when you hit that.

---

✅ Once all 9 steps are done, your backend is live.
Now move to `HOSTINGER_SETUP.md` for frontend deployment.
