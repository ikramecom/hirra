-- =====================================================================
-- HIRRA — Performance Indexes
-- =====================================================================

-- Products
create index if not exists idx_products_active_order
  on products(is_active, display_order) where is_active = true;

create index if not exists idx_products_hero
  on products(is_hero) where is_hero = true;

create index if not exists idx_products_slug
  on products(slug);

-- Product images
create index if not exists idx_product_images_product
  on product_images(product_id, display_order);

create index if not exists idx_product_images_primary
  on product_images(product_id, is_primary) where is_primary = true;

-- Variants
create index if not exists idx_product_variants_product
  on product_variants(product_id, is_active);

-- Bundles
create index if not exists idx_bundles_active_order
  on bundles(is_active, display_order) where is_active = true;

create index if not exists idx_bundle_products_bundle
  on bundle_products(bundle_id);

-- Customers
create index if not exists idx_customers_phone
  on customers(phone);

create index if not exists idx_customers_blacklist
  on customers(is_blacklisted) where is_blacklisted = true;

-- Orders
create index if not exists idx_orders_status
  on orders(status);

create index if not exists idx_orders_status_created
  on orders(status, created_at desc);

create index if not exists idx_orders_phone
  on orders(customer_phone);

create index if not exists idx_orders_created
  on orders(created_at desc);

create index if not exists idx_orders_number
  on orders(order_number);

create index if not exists idx_orders_pending_confirmation
  on orders(created_at) where status = 'pending_confirmation';

-- Order items
create index if not exists idx_order_items_order
  on order_items(order_id);

create index if not exists idx_order_items_product
  on order_items(product_id);

create index if not exists idx_order_items_bundle
  on order_items(bundle_id) where bundle_id is not null;

-- Reviews
create index if not exists idx_reviews_product_published
  on reviews(product_id, is_published, display_order);

-- WhatsApp messages
create index if not exists idx_whatsapp_order_created
  on whatsapp_messages(order_id, created_at desc);

create index if not exists idx_whatsapp_phone_created
  on whatsapp_messages(customer_phone, created_at desc);

-- Analytics events
create index if not exists idx_analytics_event_created
  on analytics_events(event_name, created_at desc);

create index if not exists idx_analytics_session
  on analytics_events(session_id, created_at desc);

-- Abandoned carts
create index if not exists idx_abandoned_carts_phone
  on abandoned_carts(customer_phone) where customer_phone is not null;

create index if not exists idx_abandoned_carts_not_recovered
  on abandoned_carts(created_at) where recovery_sent_at is null and converted_to_order_id is null;
