-- =====================================================================
-- HIRRA — Initial Schema
-- Created: 2026-05
-- Description: All core tables for products, customers, orders, reviews,
-- bundles, and admin operations.
-- =====================================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =====================================================================
-- ENUMS
-- =====================================================================

create type order_status as enum (
  'pending_confirmation',
  'confirmed',
  'packed',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
  'refunded',
  'fake_flagged'
);

create type payment_method as enum (
  'cod',
  'whatsapp',
  'mada',
  'apple_pay',
  'stc_pay',
  'tabby',
  'tamara',
  'visa_mc'
);

create type message_direction as enum ('outbound', 'inbound');
create type message_status as enum ('queued', 'sent', 'delivered', 'read', 'failed');

-- =====================================================================
-- PRODUCTS
-- =====================================================================

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ar text not null,
  name_en text not null,
  subtitle_ar text,
  subtitle_en text,
  description_ar text,
  description_en text,
  price_sar numeric(10, 2) not null check (price_sar >= 0),
  compare_at_price_sar numeric(10, 2),
  cost_sar numeric(10, 2),
  sku text unique,
  inventory_count integer default 0 check (inventory_count >= 0),
  is_active boolean default true,
  is_hero boolean default false,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  url text not null,
  alt_ar text,
  alt_en text,
  display_order integer default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  name_ar text not null,
  name_en text not null,
  sku text unique,
  inventory_count integer default 0 check (inventory_count >= 0),
  is_active boolean default true,
  display_order integer default 0,
  created_at timestamptz default now()
);

-- =====================================================================
-- BUNDLES
-- =====================================================================

create table bundles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ar text not null,
  name_en text not null,
  description_ar text,
  description_en text,
  price_sar numeric(10, 2) not null check (price_sar >= 0),
  savings_sar numeric(10, 2),
  image_url text,
  is_active boolean default true,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table bundle_products (
  id uuid primary key default gen_random_uuid(),
  bundle_id uuid references bundles(id) on delete cascade,
  product_id uuid references products(id) on delete restrict,
  quantity integer default 1 check (quantity >= 1),
  unique (bundle_id, product_id)
);

-- =====================================================================
-- CUSTOMERS (lightweight; no login at MVP stage)
-- =====================================================================

create table customers (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text,
  email text,
  city text,
  district text,
  street_address text,
  building text,
  landmarks text,
  whatsapp_opted_in boolean default true,
  total_orders integer default 0,
  total_spent_sar numeric(10, 2) default 0,
  is_blacklisted boolean default false,
  blacklist_reason text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================================
-- ORDERS
-- =====================================================================

create sequence order_number_seq start 1000;

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null
    default ('HIRRA-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('order_number_seq')::text, 5, '0')),
  customer_id uuid references customers(id) on delete set null,

  -- Snapshot of customer info at order time (immutable history)
  customer_phone text not null,
  customer_name text not null,
  customer_email text,
  shipping_city text not null,
  shipping_district text,
  shipping_address text not null,
  shipping_building text,
  shipping_landmarks text,

  -- Order totals
  subtotal_sar numeric(10, 2) not null check (subtotal_sar >= 0),
  shipping_sar numeric(10, 2) default 18 check (shipping_sar >= 0),
  cod_fee_sar numeric(10, 2) default 0 check (cod_fee_sar >= 0),
  discount_sar numeric(10, 2) default 0 check (discount_sar >= 0),
  total_sar numeric(10, 2) not null check (total_sar >= 0),

  payment_method payment_method default 'cod',
  status order_status default 'pending_confirmation',

  -- WhatsApp confirmation tracking
  whatsapp_confirmation_sent_at timestamptz,
  whatsapp_confirmed_at timestamptz,
  confirmation_attempts integer default 0,

  -- Shipping
  courier text,
  tracking_number text,
  shipped_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,

  -- Fake-order filter
  fake_score integer default 0 check (fake_score >= 0 and fake_score <= 100),
  fake_flags text[] default '{}',

  -- Marketing attribution
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,
  user_agent text,
  ip_country text,

  -- Tracking event idempotency
  pixel_purchase_sent boolean default false,

  internal_notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_variant_id uuid references product_variants(id) on delete set null,
  bundle_id uuid references bundles(id) on delete set null,

  -- Snapshot of names (immutable history)
  product_name_ar text not null,
  product_name_en text not null,
  variant_name_ar text,
  variant_name_en text,

  unit_price_sar numeric(10, 2) not null check (unit_price_sar >= 0),
  quantity integer default 1 check (quantity >= 1),
  line_total_sar numeric(10, 2) not null check (line_total_sar >= 0),

  created_at timestamptz default now()
);

-- =====================================================================
-- REVIEWS
-- =====================================================================

create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  order_id uuid references orders(id) on delete set null,
  customer_name text not null,
  customer_city text,
  rating integer not null check (rating >= 1 and rating <= 5),
  title_ar text,
  body_ar text not null,
  image_urls text[] default '{}',
  is_verified boolean default false,
  is_published boolean default false,
  display_order integer default 0,
  created_at timestamptz default now()
);

-- =====================================================================
-- WHATSAPP MESSAGE LOG
-- =====================================================================

create table whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete set null,
  customer_id uuid references customers(id) on delete set null,
  customer_phone text not null,
  direction message_direction not null,
  template_key text,
  body text not null,
  status message_status default 'queued',
  meta_wamid text,
  error_message text,
  created_at timestamptz default now()
);

-- =====================================================================
-- ABANDONED CARTS
-- =====================================================================

create table abandoned_carts (
  id uuid primary key default gen_random_uuid(),
  customer_phone text,
  customer_email text,
  customer_name text,
  cart_data jsonb not null,
  total_sar numeric(10, 2),
  recovery_sent_at timestamptz,
  converted_to_order_id uuid references orders(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================================
-- ANALYTICS EVENTS (lightweight first-party tracking)
-- =====================================================================

create table analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  session_id text,
  customer_id uuid references customers(id) on delete set null,
  product_id uuid references products(id) on delete set null,
  order_id uuid references orders(id) on delete set null,
  metadata jsonb default '{}',
  user_agent text,
  url text,
  created_at timestamptz default now()
);

-- =====================================================================
-- ADMIN PROFILES (extends auth.users)
-- =====================================================================

create table admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'cs' check (role in ('owner', 'ops', 'cs')),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- =====================================================================
-- TRIGGERS — updated_at auto-update
-- =====================================================================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_products
  before update on products
  for each row execute function set_updated_at();

create trigger set_updated_at_bundles
  before update on bundles
  for each row execute function set_updated_at();

create trigger set_updated_at_customers
  before update on customers
  for each row execute function set_updated_at();

create trigger set_updated_at_orders
  before update on orders
  for each row execute function set_updated_at();

create trigger set_updated_at_abandoned_carts
  before update on abandoned_carts
  for each row execute function set_updated_at();

-- =====================================================================
-- TRIGGER — increment customer stats on new order
-- =====================================================================

create or replace function increment_customer_stats()
returns trigger as $$
begin
  if new.customer_id is not null then
    update customers
    set
      total_orders = total_orders + 1,
      total_spent_sar = total_spent_sar + new.total_sar
    where id = new.customer_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger increment_customer_stats_on_order
  after insert on orders
  for each row execute function increment_customer_stats();
