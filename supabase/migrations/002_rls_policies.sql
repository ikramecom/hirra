-- =====================================================================
-- HIRRA — Row Level Security Policies
-- Public can READ catalog data. All writes go through Edge Functions
-- (which use service_role key). Admin reads via admin_profiles check.
-- =====================================================================

-- =====================================================================
-- PRODUCTS — public can read active products
-- =====================================================================
alter table products enable row level security;

create policy "Public read active products"
  on products for select
  using (is_active = true);

create policy "Admins manage products"
  on products for all
  using (
    auth.uid() in (select id from admin_profiles where is_active = true)
  );

-- =====================================================================
-- PRODUCT IMAGES — public can read images of active products
-- =====================================================================
alter table product_images enable row level security;

create policy "Public read product images"
  on product_images for select
  using (
    exists (
      select 1 from products
      where products.id = product_images.product_id and products.is_active = true
    )
  );

create policy "Admins manage product images"
  on product_images for all
  using (
    auth.uid() in (select id from admin_profiles where is_active = true)
  );

-- =====================================================================
-- PRODUCT VARIANTS — public can read active variants
-- =====================================================================
alter table product_variants enable row level security;

create policy "Public read active variants"
  on product_variants for select
  using (
    is_active = true and
    exists (
      select 1 from products
      where products.id = product_variants.product_id and products.is_active = true
    )
  );

create policy "Admins manage variants"
  on product_variants for all
  using (
    auth.uid() in (select id from admin_profiles where is_active = true)
  );

-- =====================================================================
-- BUNDLES — public can read active bundles
-- =====================================================================
alter table bundles enable row level security;

create policy "Public read active bundles"
  on bundles for select
  using (is_active = true);

create policy "Admins manage bundles"
  on bundles for all
  using (
    auth.uid() in (select id from admin_profiles where is_active = true)
  );

alter table bundle_products enable row level security;

create policy "Public read bundle products"
  on bundle_products for select
  using (
    exists (
      select 1 from bundles
      where bundles.id = bundle_products.bundle_id and bundles.is_active = true
    )
  );

create policy "Admins manage bundle products"
  on bundle_products for all
  using (
    auth.uid() in (select id from admin_profiles where is_active = true)
  );

-- =====================================================================
-- REVIEWS — public can read published, admins manage
-- =====================================================================
alter table reviews enable row level security;

create policy "Public read published reviews"
  on reviews for select
  using (is_published = true);

create policy "Admins manage reviews"
  on reviews for all
  using (
    auth.uid() in (select id from admin_profiles where is_active = true)
  );

-- =====================================================================
-- CUSTOMERS — locked down; only admins can read
-- Inserts/updates happen via Edge Function with service_role
-- =====================================================================
alter table customers enable row level security;

create policy "Admins read customers"
  on customers for select
  using (
    auth.uid() in (select id from admin_profiles where is_active = true)
  );

create policy "Admins update customers"
  on customers for update
  using (
    auth.uid() in (select id from admin_profiles where is_active = true)
  );

-- =====================================================================
-- ORDERS — locked down; admin-only read/write from app side
-- Customer order lookup happens via Edge Function (track-order)
-- =====================================================================
alter table orders enable row level security;

create policy "Admins manage orders"
  on orders for all
  using (
    auth.uid() in (select id from admin_profiles where is_active = true)
  );

alter table order_items enable row level security;

create policy "Admins manage order items"
  on order_items for all
  using (
    auth.uid() in (select id from admin_profiles where is_active = true)
  );

-- =====================================================================
-- WHATSAPP MESSAGES — admin-only
-- =====================================================================
alter table whatsapp_messages enable row level security;

create policy "Admins manage whatsapp messages"
  on whatsapp_messages for all
  using (
    auth.uid() in (select id from admin_profiles where is_active = true)
  );

-- =====================================================================
-- ABANDONED CARTS — admin-only read (writes via Edge Function)
-- =====================================================================
alter table abandoned_carts enable row level security;

create policy "Admins read abandoned carts"
  on abandoned_carts for select
  using (
    auth.uid() in (select id from admin_profiles where is_active = true)
  );

-- =====================================================================
-- ANALYTICS EVENTS — admin-only read (writes via Edge Function or anon insert)
-- =====================================================================
alter table analytics_events enable row level security;

create policy "Public insert analytics events"
  on analytics_events for insert
  with check (true);

create policy "Admins read analytics events"
  on analytics_events for select
  using (
    auth.uid() in (select id from admin_profiles where is_active = true)
  );

-- =====================================================================
-- ADMIN PROFILES — admins read own + each other
-- =====================================================================
alter table admin_profiles enable row level security;

create policy "Admins read all profiles"
  on admin_profiles for select
  using (
    auth.uid() in (select id from admin_profiles where is_active = true)
  );

create policy "Owners manage profiles"
  on admin_profiles for all
  using (
    auth.uid() in (select id from admin_profiles where role = 'owner' and is_active = true)
  );
