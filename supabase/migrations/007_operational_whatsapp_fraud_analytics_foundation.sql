-- =====================================================================
-- HIRRA — Operational: WhatsApp confirmation workflow, COD fraud signals,
-- admin blacklist, analytics foundation tables.
-- Extends hirra_guest_checkout (non-breaking JSON contract) and adds
-- hirra_record_whatsapp_confirmation_opened for thank-you page.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Confirmation workflow (distinct from fulfillment order_status)
-- ---------------------------------------------------------------------
do $e$
begin
  create type public.confirmation_flow_status as enum (
    'pending_confirmation',
    'confirmed',
    'cancelled',
    'no_response'
  );
exception
  when duplicate_object then null;
end
$e$;

-- ---------------------------------------------------------------------
-- 2) Admin-managed phone / identifier blocklist (fast path)
-- ---------------------------------------------------------------------
create table if not exists public.blocked_identifiers (
  id uuid primary key default gen_random_uuid(),
  phone_e164 text not null,
  reason text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (phone_e164)
);

create index if not exists idx_blocked_identifiers_active_phone
  on public.blocked_identifiers (phone_e164) where is_active = true;

alter table public.blocked_identifiers enable row level security;

create policy "Admins manage blocked identifiers"
  on public.blocked_identifiers for all
  using (
    auth.uid() in (select id from public.admin_profiles where is_active = true)
  );

-- ---------------------------------------------------------------------
-- 3) Analytics / ops foundation (ETL & admin populate later)
-- ---------------------------------------------------------------------
create table if not exists public.ad_spend_entries (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  campaign_name text,
  amount_sar numeric(14, 2) not null check (amount_sar >= 0),
  spend_date date not null,
  notes text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_ad_spend_date on public.ad_spend_entries (spend_date desc);

alter table public.ad_spend_entries enable row level security;

create policy "Admins manage ad spend"
  on public.ad_spend_entries for all
  using (
    auth.uid() in (select id from public.admin_profiles where is_active = true)
  );

create table if not exists public.order_financials (
  order_id uuid primary key references public.orders(id) on delete cascade,
  estimated_cogs_sar numeric(14, 2),
  estimated_profit_sar numeric(14, 2),
  actual_shipping_cost_sar numeric(14, 2),
  cod_fee_actual_sar numeric(14, 2),
  allocated_ad_spend_sar numeric(14, 2),
  admin_notes text,
  updated_at timestamptz not null default now()
);

alter table public.order_financials enable row level security;

create policy "Admins manage order financials"
  on public.order_financials for all
  using (
    auth.uid() in (select id from public.admin_profiles where is_active = true)
  );

create table if not exists public.order_return_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  reason text,
  status text not null default 'requested'
    check (status in ('requested', 'approved', 'received', 'refunded', 'rejected')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists idx_order_returns_order on public.order_return_requests (order_id);

alter table public.order_return_requests enable row level security;

create policy "Admins manage order returns"
  on public.order_return_requests for all
  using (
    auth.uid() in (select id from public.admin_profiles where is_active = true)
  );

create table if not exists public.analytics_daily_metrics (
  bucket_date date primary key,
  orders_count integer default 0,
  revenue_sar numeric(16, 2) default 0,
  cancellations_count integer default 0,
  returns_count integer default 0,
  confirmations_count integer default 0,
  meta jsonb default '{}',
  updated_at timestamptz not null default now()
);

alter table public.analytics_daily_metrics enable row level security;

create policy "Admins manage analytics daily metrics"
  on public.analytics_daily_metrics for all
  using (
    auth.uid() in (select id from public.admin_profiles where is_active = true)
  );

-- ---------------------------------------------------------------------
-- 4) Orders: confirmation + suspicion mirror (keep fake_score for compat)
-- ---------------------------------------------------------------------
alter table public.orders
  add column if not exists confirmation_status public.confirmation_flow_status
    not null default 'pending_confirmation';

alter table public.orders
  add column if not exists confirmation_sent_at timestamptz;

-- Confirmed by customer via WhatsApp / ops (separate from shipped/delivered)
alter table public.orders
  add column if not exists confirmed_at timestamptz;

alter table public.orders
  add column if not exists whatsapp_clicked boolean not null default false;

alter table public.orders
  add column if not exists suspicious_order_score integer not null default 0
    check (suspicious_order_score >= 0 and suspicious_order_score <= 100);

create index if not exists idx_orders_confirmation_flow
  on public.orders (confirmation_status);

create index if not exists idx_orders_suspicious_score
  on public.orders (suspicious_order_score desc) where suspicious_order_score >= 40;

-- Backfill from legacy WhatsApp + suspicion columns
update public.orders o
set suspicious_order_score = o.fake_score
where o.suspicious_order_score = 0 and coalesce(o.fake_score, 0) > 0;

update public.orders o
set confirmation_sent_at = o.whatsapp_confirmation_sent_at
where o.confirmation_sent_at is null
  and o.whatsapp_confirmation_sent_at is not null;

update public.orders o
set confirmed_at = coalesce(o.confirmed_at, o.whatsapp_confirmed_at)
where o.whatsapp_confirmed_at is not null;

update public.orders o
set confirmation_status = 'cancelled'::public.confirmation_flow_status
where o.status = 'cancelled'::public.order_status;

update public.orders o
set confirmation_status = 'confirmed'::public.confirmation_flow_status
where o.whatsapp_confirmed_at is not null
  and o.status <> 'cancelled'::public.order_status;

-- ---------------------------------------------------------------------
-- 5) Replace guest checkout RPC — same return shape; stronger signals only
-- ---------------------------------------------------------------------
create or replace function public.hirra_guest_checkout(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_raw_phone text;
  v_phone text;
  v_name text;
  v_email text;
  v_city text;
  v_district text;
  v_street text;
  v_building text;
  v_landmarks text;
  v_payment text;
  v_elem jsonb;
  v_subtotal numeric(10, 2) := 0;
  v_line_items jsonb := '[]'::jsonb;
  v_product record;
  v_bundle record;
  v_var_ar text;
  v_var_en text;
  v_line_total numeric(10, 2);
  v_qty int;
  v_pid uuid;
  v_vid uuid;
  v_bid uuid;
  v_shipping numeric(10, 2);
  v_cod numeric(10, 2);
  v_total numeric(10, 2);
  v_fake_score int := 0;
  v_fake_flags text[] := array[]::text[];
  v_lower_name text;
  v_blacklisted boolean := false;
  v_blocked_list boolean := false;
  v_customer_id uuid;
  v_order_id uuid;
  v_order_number text;
  v_addr_words int;
  v_hour int;
  v_utm jsonb;
  v_dup_48h int := 0;
  v_dup_2h int := 0;
  v_cancel_hist int := 0;
  v_orders_today int := 0;
begin
  if payload is null or jsonb_typeof(payload) <> 'object' then
    return jsonb_build_object('error', 'Invalid payload');
  end if;

  v_raw_phone := payload #>> '{customer,phone}';
  v_name := nullif(trim(payload #>> '{customer,name}'), '');
  v_email := nullif(trim(payload #>> '{customer,email}'), '');
  v_city := nullif(trim(payload #>> '{customer,city}'), '');
  v_district := nullif(trim(payload #>> '{customer,district}'), '');
  v_street := nullif(trim(payload #>> '{customer,street_address}'), '');
  v_building := nullif(trim(payload #>> '{customer,building}'), '');
  v_landmarks := nullif(trim(payload #>> '{customer,landmarks}'), '');
  v_payment := coalesce(nullif(trim(payload #>> '{payment_method}'), ''), 'cod');

  if v_raw_phone is null or v_name is null or length(v_name) < 2 then
    return jsonb_build_object('error', 'customer.phone and customer.name are required');
  end if;
  if v_city is null or length(v_city) < 1 then
    return jsonb_build_object('error', 'customer.city is required');
  end if;
  if v_street is null or length(v_street) < 5 then
    return jsonb_build_object('error', 'customer.street_address is required (min 5 chars)');
  end if;

  if not (v_payment = any (array['cod', 'whatsapp']::text[])) then
    return jsonb_build_object('error', 'payment_method must be "cod" or "whatsapp"');
  end if;

  v_phone := public.hirra_normalize_saudi_phone(v_raw_phone);
  if v_phone is null then
    return jsonb_build_object('error', 'Invalid Saudi phone number');
  end if;

  select coalesce(c.is_blacklisted, false)
    into v_blacklisted
    from public.customers c
   where c.phone = v_phone
   limit 1;

  if coalesce(v_blacklisted, false) then
    return jsonb_build_object('error', 'Order cannot be processed at this time. Please contact support.');
  end if;

  select exists(
    select 1 from public.blocked_identifiers bi
    where bi.phone_e164 = v_phone and bi.is_active = true
  ) into v_blocked_list;

  if v_blocked_list then
    return jsonb_build_object('error', 'Order cannot be processed at this time. Please contact support.');
  end if;

  if not jsonb_typeof(payload -> 'items') = 'array' or jsonb_array_length(payload -> 'items') < 1 then
    return jsonb_build_object('error', 'items must be a non-empty array');
  end if;

  for v_elem in select * from jsonb_array_elements(payload -> 'items')
  loop
    v_var_ar := null;
    v_var_en := null;
    v_pid := null;
    v_vid := null;
    v_bid := null;
    if v_elem ->> 'bundle_id' is not null and length(trim(v_elem ->> 'bundle_id')) > 0 then
      v_bid := (v_elem ->> 'bundle_id')::uuid;
    end if;
    if v_elem ->> 'product_id' is not null and length(trim(v_elem ->> 'product_id')) > 0 then
      v_pid := (v_elem ->> 'product_id')::uuid;
    end if;
    if v_elem ->> 'product_variant_id' is not null and length(trim(v_elem ->> 'product_variant_id')) > 0 then
      v_vid := (v_elem ->> 'product_variant_id')::uuid;
    end if;

    v_qty := (v_elem ->> 'quantity')::int;
    if v_qty is null or v_qty < 1 or v_qty > 20 then
      return jsonb_build_object('error', 'item.quantity must be 1–20');
    end if;

    if v_bid is not null and v_pid is not null then
      return jsonb_build_object('error', 'each item needs product_id or bundle_id, not both');
    end if;
    if v_bid is null and v_pid is null then
      return jsonb_build_object('error', 'each item needs product_id or bundle_id');
    end if;

    if v_bid is not null then
      select b.id, b.name_ar, b.name_en, b.price_sar, b.is_active
        into v_bundle
        from public.bundles b
       where b.id = v_bid;
      if not found or not v_bundle.is_active then
        return jsonb_build_object('error', format('Bundle not available: %s', v_bid));
      end if;
      v_line_total := (v_bundle.price_sar::numeric) * v_qty;
      v_subtotal := v_subtotal + v_line_total;
      v_line_items := v_line_items || jsonb_build_array(
        jsonb_build_object(
          'product_id', null,
          'product_variant_id', null,
          'bundle_id', v_bundle.id,
          'product_name_ar', v_bundle.name_ar,
          'product_name_en', v_bundle.name_en,
          'variant_name_ar', null,
          'variant_name_en', null,
          'unit_price_sar', v_bundle.price_sar,
          'quantity', v_qty,
          'line_total_sar', v_line_total
        )
      );
    else
      select p.id, p.name_ar, p.name_en, p.price_sar, p.is_active
        into v_product
        from public.products p
       where p.id = v_pid;
      if not found or not v_product.is_active then
        return jsonb_build_object('error', format('Product not available: %s', v_pid));
      end if;

      if v_vid is not null then
        select pv.name_ar, pv.name_en
          into v_var_ar, v_var_en
          from public.product_variants pv
         where pv.id = v_vid
         limit 1;
      else
        v_var_ar := null;
        v_var_en := null;
      end if;

      v_line_total := (v_product.price_sar::numeric) * v_qty;
      v_subtotal := v_subtotal + v_line_total;
      v_line_items := v_line_items || jsonb_build_array(
        jsonb_build_object(
          'product_id', v_product.id,
          'product_variant_id', v_vid,
          'bundle_id', null,
          'product_name_ar', v_product.name_ar,
          'product_name_en', v_product.name_en,
          'variant_name_ar', v_var_ar,
          'variant_name_en', v_var_en,
          'unit_price_sar', v_product.price_sar,
          'quantity', v_qty,
          'line_total_sar', v_line_total
        )
      );
    end if;
  end loop;

  -- Risk signals (flag only; do not hard-block except blacklist above)
  if not starts_with(v_phone, '+9665') then
    v_fake_flags := array_append(v_fake_flags, 'invalid_saudi_mobile');
    v_fake_score := v_fake_score + 40;
  end if;

  v_addr_words :=
    cardinality(
      regexp_split_to_array(trim(both from v_street), '\s+')
    );

  if v_addr_words < 3 then
    v_fake_flags := array_append(v_fake_flags, 'short_address');
    v_fake_score := v_fake_score + 20;
  end if;

  v_lower_name := lower(trim(both from v_name));
  if length(v_lower_name) < 3 or v_lower_name ~* '^(test|x{1,3}|asdf|aaa)' then
    v_fake_flags := array_append(v_fake_flags, 'suspicious_name');
    v_fake_score := v_fake_score + 30;
  end if;

  v_hour := ((extract(hour from (now() at time zone 'utc'))::int + 3) % 24 + 24) % 24;
  if v_hour >= 1 and v_hour <= 5 then
    v_fake_flags := array_append(v_fake_flags, 'late_night_order');
    v_fake_score := v_fake_score + 10;
  end if;

  select count(*)::int into v_dup_48h
    from public.orders o
   where o.customer_phone = v_phone
     and o.created_at > now() - interval '48 hours';

  if v_dup_48h >= 1 then
    v_fake_score := v_fake_score + 12;
    v_fake_flags := array_append(v_fake_flags, 'repeat_phone_48h');
  end if;

  select count(*)::int into v_dup_2h
    from public.orders o
   where o.customer_phone = v_phone
     and o.created_at > now() - interval '2 hours';

  if v_dup_2h >= 1 then
    v_fake_score := v_fake_score + 18;
    v_fake_flags := array_append(v_fake_flags, 'cooldown_2h');
  end if;

  select count(*)::int into v_cancel_hist
    from public.orders o
   where o.customer_phone = v_phone
     and o.status = 'cancelled'::public.order_status;

  if v_cancel_hist >= 2 then
    v_fake_score := v_fake_score + least(10 + v_cancel_hist * 3, 34);
    v_fake_flags := array_append(v_fake_flags, 'repeat_cancellations');
  end if;

  select count(*)::int into v_orders_today
    from public.orders o
   where o.customer_phone = v_phone
     and (timezone('Asia/Riyadh', o.created_at))::date
       = (timezone('Asia/Riyadh', now()))::date;

  if v_orders_today >= 3 then
    v_fake_score := v_fake_score + 15;
    v_fake_flags := array_append(v_fake_flags, 'high_frequency_same_day');
  end if;

  if v_fake_score > 100 then
    v_fake_score := 100;
  end if;

  v_shipping := public.hirra_shipping_sar_for_city(v_city, v_subtotal);

  if v_payment = 'cod' then
    v_cod := 10::numeric(10, 2);
  else
    v_cod := 0::numeric(10, 2);
  end if;

  v_total := v_subtotal + v_shipping + v_cod;

  v_utm := payload -> 'utm';

  insert into public.customers as c (
    phone, name, email, city, district, street_address, building, landmarks
  ) values (
    v_phone, v_name, v_email, v_city, nullif(v_district, ''),
    v_street, nullif(v_building, ''),
    nullif(v_landmarks, '')
  )
  on conflict (phone) do update set
    name = excluded.name,
    email = coalesce(excluded.email, c.email),
    city = excluded.city,
    district = excluded.district,
    street_address = excluded.street_address,
    building = excluded.building,
    landmarks = excluded.landmarks
  returning id into v_customer_id;

  insert into public.orders (
    customer_id,
    customer_phone,
    customer_name,
    customer_email,
    shipping_city,
    shipping_district,
    shipping_address,
    shipping_building,
    shipping_landmarks,
    subtotal_sar,
    shipping_sar,
    cod_fee_sar,
    discount_sar,
    total_sar,
    payment_method,
    status,
    fake_score,
    fake_flags,
    confirmation_status,
    confirmation_sent_at,
    confirmed_at,
    whatsapp_clicked,
    suspicious_order_score,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referrer,
    user_agent
  ) values (
    v_customer_id,
    v_phone,
    v_name,
    v_email,
    v_city,
    nullif(v_district, ''),
    v_street,
    nullif(v_building, ''),
    nullif(v_landmarks, ''),
    v_subtotal,
    v_shipping,
    v_cod,
    0,
    v_total,
    v_payment::public.payment_method,
    case when v_fake_score >= 50 then 'fake_flagged'::public.order_status else 'pending_confirmation'::public.order_status end,
    v_fake_score,
    v_fake_flags,
    'pending_confirmation'::public.confirmation_flow_status,
    null,
    null,
    false,
    v_fake_score,
    nullif(v_utm ->> 'source', ''),
    nullif(v_utm ->> 'medium', ''),
    nullif(v_utm ->> 'campaign', ''),
    nullif(v_utm ->> 'term', ''),
    nullif(v_utm ->> 'content', ''),
    nullif(payload ->> 'referrer', ''),
    nullif(payload ->> 'user_agent', '')
  )
  returning id, order_number into v_order_id, v_order_number;

  for v_elem in select * from jsonb_array_elements(v_line_items)
  loop
    insert into public.order_items (
      order_id,
      product_id,
      product_variant_id,
      bundle_id,
      product_name_ar,
      product_name_en,
      variant_name_ar,
      variant_name_en,
      unit_price_sar,
      quantity,
      line_total_sar
    ) values (
      v_order_id,
      nullif(v_elem ->> 'product_id', '')::uuid,
      nullif(v_elem ->> 'product_variant_id', '')::uuid,
      nullif(v_elem ->> 'bundle_id', '')::uuid,
      v_elem ->> 'product_name_ar',
      v_elem ->> 'product_name_en',
      v_elem ->> 'variant_name_ar',
      v_elem ->> 'variant_name_en',
      (v_elem ->> 'unit_price_sar')::numeric(10, 2),
      (v_elem ->> 'quantity')::int,
      (v_elem ->> 'line_total_sar')::numeric(10, 2)
    );
  end loop;

  return jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'order_number', v_order_number,
    'total_sar', v_total
  );
exception
  when others then
    raise warning 'hirra_guest_checkout: % %', sqlstate, sqlerrm;
    return jsonb_build_object('error', 'Could not complete checkout. Please try again.');
end;
$fn$;

revoke all on function public.hirra_guest_checkout(jsonb) from public;
grant execute on function public.hirra_guest_checkout(jsonb) to anon;
grant execute on function public.hirra_guest_checkout(jsonb) to authenticated;
grant execute on function public.hirra_guest_checkout(jsonb) to service_role;

-- ---------------------------------------------------------------------
-- 6) Thank-you page: log WhatsApp intent + outbound template (idempotent)
-- ---------------------------------------------------------------------
create or replace function public.hirra_record_whatsapp_confirmation_opened(p_order_number text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $wfn$
declare
  v_id uuid;
  v_customer_id uuid;
  v_phone text;
  v_prev_sent timestamptz;
  v_body text;
  v_first_touch boolean;
begin
  if p_order_number is null or length(trim(both from p_order_number)) < 3 then
    return jsonb_build_object('success', false, 'error', 'invalid_order_number');
  end if;

  select o.id, o.customer_id, o.customer_phone, o.confirmation_sent_at
    into v_id, v_customer_id, v_phone, v_prev_sent
    from public.orders o
   where o.order_number = trim(both from p_order_number)
   limit 1;

  if v_id is null then
    return jsonb_build_object('success', false, 'error', 'not_found');
  end if;

  v_first_touch := (v_prev_sent is null);

  v_body :=
    'مرحباً 👋
شكراً لطلبك من هِرّة 🐾

رقم الطلب:
' || trim(both from p_order_number) || '

يرجى الرد لتأكيد الطلب:
1️⃣ تأكيد
2️⃣ تعديل
3️⃣ إلغاء';

  update public.orders o
     set whatsapp_clicked = true,
         confirmation_sent_at = coalesce(o.confirmation_sent_at, now())
   where o.id = v_id;

  if v_first_touch then
    insert into public.whatsapp_messages (
      order_id,
      customer_id,
      customer_phone,
      direction,
      template_key,
      body,
      status
    ) values (
      v_id,
      v_customer_id,
      v_phone,
      'outbound'::public.message_direction,
      'hirra_cod_confirmation_v1',
      v_body,
      'sent'::public.message_status
    );
  end if;

  return jsonb_build_object(
    'success', true,
    'order_id', v_id,
    'logged', v_first_touch
  );
exception
  when others then
    raise warning 'hirra_record_whatsapp_confirmation_opened: % %', sqlstate, sqlerrm;
    return jsonb_build_object('success', false, 'error', 'server_error');
end;
$wfn$;

revoke all on function public.hirra_record_whatsapp_confirmation_opened(text) from public;
grant execute on function public.hirra_record_whatsapp_confirmation_opened(text) to anon;
grant execute on function public.hirra_record_whatsapp_confirmation_opened(text) to authenticated;
grant execute on function public.hirra_record_whatsapp_confirmation_opened(text) to service_role;

select pg_notify('pgrst', 'reload schema');