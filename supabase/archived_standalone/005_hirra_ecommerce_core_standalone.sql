-- =====================================================================
-- HIRRA — ecommerce core schema (standalone for empty databases)
--
-- Covers: products, product_variants, bundles, orders, order_items
-- Includes: FKs, basic indexes, RLS (public INSERT orders + seed reads),
--           sample inserts (roller / mat / fountain + bundles).
--
-- ⚠️  Apply ONLY on an empty Postgres or after removing superseded migrations.
--     If migrations 001–004 already ran successfully, SKIP this file to avoid
--     duplicate CREATE TABLE failures.
--
-- Admin access policy uses JWT app_metadata: { "hirra_role": "admin" }
-- Set via Supabase Auth → Users → User metadata, or signup hook.
--
-- =====================================================================

create extension if not exists pgcrypto;

-- =====================================================================
-- Orders status enum
-- =====================================================================

create type public.hirra_order_status as enum (
  'pending',
  'confirmed',
  'packed',
  'shipped',
  'delivered',
  'cancelled',
  'returned'
);

-- =====================================================================
-- Helper: admins (JWT app_metadata.hirra_role = 'admin')
-- =====================================================================

create or replace function public.hirra_is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'hirra_role') = 'admin',
    false
  );
$$;

-- =====================================================================
-- 1. products
-- =====================================================================

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  subtitle_ar text,
  subtitle_en text,
  description_ar text,
  description_en text,
  price_sar numeric(10, 2) not null default 0 check (price_sar >= 0),
  compare_at_price_sar numeric(10, 2),
  sku text unique,
  inventory_count integer not null default 0 check (inventory_count >= 0),
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_products_slug on public.products (slug);
create index idx_products_active_order on public.products (is_active, display_order);

-- =====================================================================
-- 2. product_variants
-- =====================================================================

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  name_ar text not null,
  name_en text not null,
  sku text unique,
  inventory_count integer not null default 0 check (inventory_count >= 0),
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_product_variants_product_id on public.product_variants (product_id);
create index idx_product_variants_product_display on public.product_variants (
  product_id,
  display_order
);

-- =====================================================================
-- 3. bundles
-- =====================================================================

create table public.bundles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  description_ar text,
  description_en text,
  price_sar numeric(10, 2) not null default 0 check (price_sar >= 0),
  savings_sar numeric(10, 2),
  image_url text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_bundles_slug on public.bundles (slug);
create index idx_bundles_active_order on public.bundles (is_active, display_order);

-- =====================================================================
-- 4. orders
-- =====================================================================

create sequence if not exists public.hirra_order_number_seq minvalue 1000;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique
    default ('HIR-' || to_char(now() at time zone 'UTC', 'YYYY') || '-' || lpad(nextval('public.hirra_order_number_seq')::text, 5, '0')),
  customer_name text not null,
  phone text not null,
  city text not null,
  status public.hirra_order_status not null default 'pending',
  total_sar numeric(10, 2) not null check (total_sar >= 0),
  created_at timestamptz not null default now(),
  constraint orders_phone_min_len check (char_length(trim(phone)) >= 8)
);

create index idx_orders_status on public.orders (status);
create index idx_orders_created_at on public.orders (created_at desc);
create index idx_orders_phone on public.orders (phone);

-- =====================================================================
-- 5. order_items
-- =====================================================================

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete restrict,
  product_variant_id uuid references public.product_variants (id) on delete restrict,
  bundle_id uuid references public.bundles (id) on delete restrict,
  quantity integer not null check (quantity >= 1),
  unit_price_sar numeric(10, 2) not null check (unit_price_sar >= 0),
  line_total_sar numeric(10, 2) not null check (line_total_sar >= 0),
  created_at timestamptz not null default now(),
  constraint order_items_xor_product_bundle check (
    (product_id is not null and bundle_id is null)
    or (bundle_id is not null and product_id is null)
  ),
  constraint order_items_variant_needs_product check (
    product_variant_id is null or product_id is not null
  )
);

create index idx_order_items_order_id on public.order_items (order_id);
create index idx_order_items_product on public.order_items (product_id)
  where product_id is not null;
create index idx_order_items_bundle on public.order_items (bundle_id)
  where bundle_id is not null;

-- Grants: anon/checkout must invoke nextval for order_number default
grant usage, select on sequence public.hirra_order_number_seq to anon, authenticated, service_role;

-- =====================================================================
-- RLS — enable on all tables
-- =====================================================================

alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.bundles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- =====================================================================
-- RLS policies — storefront read (anonymous + authenticated)
-- =====================================================================

create policy products_select_public
  on public.products for select to anon, authenticated
  using (is_active = true or hirra_is_admin());

create policy product_variants_select_public
  on public.product_variants for select to anon, authenticated
  using (
    hirra_is_admin()
    or (
      exists (
        select 1 from public.products p
        where p.id = product_id and p.is_active = true
      )
      and is_active = true
    )
  );

create policy bundles_select_public
  on public.bundles for select to anon, authenticated
  using (is_active = true or hirra_is_admin());

-- =====================================================================
-- RLS policies — public order submission (checkout from browser)
-- =====================================================================

create policy orders_insert_public
  on public.orders for insert to anon, authenticated
  with check (true);

create policy order_items_insert_public
  on public.order_items for insert to anon, authenticated
  with check (true);

-- =====================================================================
-- RLS policies — admin read / write
-- =====================================================================

create policy products_admin_all
  on public.products for all to authenticated
  using (hirra_is_admin())
  with check (hirra_is_admin());

create policy product_variants_admin_all
  on public.product_variants for all to authenticated
  using (hirra_is_admin())
  with check (hirra_is_admin());

create policy bundles_admin_all
  on public.bundles for all to authenticated
  using (hirra_is_admin())
  with check (hirra_is_admin());

create policy orders_admin_select
  on public.orders for select to authenticated
  using (hirra_is_admin());

create policy orders_admin_update
  on public.orders for update to authenticated
  using (hirra_is_admin())
  with check (hirra_is_admin());

create policy orders_admin_insert
  on public.orders for insert to authenticated
  with check (hirra_is_admin());

create policy orders_admin_delete
  on public.orders for delete to authenticated
  using (hirra_is_admin());

create policy order_items_admin_select
  on public.order_items for select to authenticated
  using (hirra_is_admin());

create policy order_items_admin_update
  on public.order_items for update to authenticated
  using (hirra_is_admin())
  with check (hirra_is_admin());

create policy order_items_admin_insert
  on public.order_items for insert to authenticated
  with check (hirra_is_admin());

create policy order_items_admin_delete
  on public.order_items for delete to authenticated
  using (hirra_is_admin());

-- Table privileges (RLS still enforces row access)
grant usage on schema public to anon, authenticated, service_role;

grant select on table public.products to anon, authenticated;
grant select on table public.product_variants to anon, authenticated;
grant select on table public.bundles to anon, authenticated;

grant insert on table public.orders to anon, authenticated;
grant insert on table public.order_items to anon, authenticated;

grant select, insert, update, delete on table public.products to authenticated;
grant select, insert, update, delete on table public.product_variants to authenticated;
grant select, insert, update, delete on table public.bundles to authenticated;
grant select, insert, update, delete on table public.orders to authenticated;
grant select, insert, update, delete on table public.order_items to authenticated;

grant all privileges on table public.products to service_role;
grant all privileges on table public.product_variants to service_role;
grant all privileges on table public.bundles to service_role;
grant all privileges on table public.orders to service_role;
grant all privileges on table public.order_items to service_role;

-- =====================================================================
-- Sample inserts — HIRRA catalogue (roller, litter mat, fountain + bundles)
-- =====================================================================

insert into public.products (
  slug, name_ar, name_en, subtitle_ar, subtitle_en,
  description_ar, description_en,
  price_sar, compare_at_price_sar,
  sku, inventory_count, is_active, display_order
) values
(
  'hirra-pro-roller',
  'هِرّة برو — رولر شعر القطط',
  'Hirra Pro Lint-Free Cat Hair Roller',
  'رولر سيليكون فاخر، قابل لإعادة الاستخدام',
  'Premium reusable silicone — for the Saudi home',
  'هِرّة برو رولر مصمم للبيت السعودي.',
  'The Hirra Pro Roller picks up cat hair in a single swipe.',
  99.00,
  129.00,
  'HRR-PRO-001',
  50,
  true,
  1
),
(
  'hirra-honeycomb-mat',
  'حصيرة هِرّة العسلية لحبس الرمل',
  'Hirra Honeycomb Litter Trap Mat XL',
  'حصيرة مزدوجة الطبقات تحبس كل حبة رمل',
  'Double-layer mat that traps every grain',
  'حصيرة هِرّة العسلية بحجم XL.',
  'The Hirra Honeycomb Mat traps litter before it reaches your floors.',
  119.00,
  149.00,
  'HRR-MAT-001',
  30,
  true,
  2
),
(
  'hirra-aurora-fountain',
  'نافورة هِرّة أورورا للقطط',
  'Hirra Aurora Cat Water Fountain',
  'نافورة هادئة بإضاءة LED',
  'Silent LED fountain',
  'نافورة هِرّة أورورا — ماء بارد متجدد لقطتك.',
  'Hirra Aurora Fountain — cool, filtered water for your cat.',
  229.00,
  279.00,
  'HRR-FNT-001',
  20,
  true,
  3
)
on conflict (slug) do nothing;

insert into public.product_variants (product_id, name_ar, name_en, sku, inventory_count, display_order)
select p.id, v.name_ar, v.name_en, v.sku, v.inventory_count, v.display_order
from public.products p
cross join lateral (
  values
    ('زيتي', 'Olive', 'HRR-PRO-001-OLV', 20, 1),
    ('كريمي', 'Cream', 'HRR-PRO-001-CRM', 20, 2),
    ('بني داكن', 'Walnut', 'HRR-PRO-001-WAL', 10, 3)
) as v(name_ar, name_en, sku, inventory_count, display_order)
where p.slug = 'hirra-pro-roller'
on conflict (sku) do nothing;

insert into public.bundles (
  slug, name_ar, name_en,
  description_ar, description_en,
  price_sar, savings_sar, image_url, is_active, display_order
)
values
(
  'hirra-trio',
  'مجموعة هِرّة الثلاثية',
  'The Hirra Trio',
  'الرولر + الحصيرة + النافورة بسعر مجموعة.',
  'Roller + mat + fountain at a bundle price.',
  397.00,
  50.00,
  null,
  true,
  1
),
(
  'clean-home-bundle',
  'مجموعة البيت النظيف',
  'The Clean-Home Bundle',
  'الرولر + الحصيرة.',
  'Roller + mat.',
  189.00,
  29.00,
  null,
  true,
  2
),
(
  'pampered-cat-set',
  'مجموعة الدلال',
  'The Pampered Cat Set',
  'الرولر + النافورة.',
  'Roller + fountain.',
  289.00,
  39.00,
  null,
  true,
  3
)
on conflict (slug) do nothing;
