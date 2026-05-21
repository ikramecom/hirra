-- =====================================================================
-- Guest checkout via anon key (temporary until order-confirm is deployed).
-- SECURITY DEFINER RPC replicates storefront logic from Edge Function:
-- blacklist check, customer upsert, DB-priced line items, shipping zones,
-- fake-order score, inserts into orders + order_items.
--
-- Frontend: supabase.rpc('hirra_guest_checkout', { payload: <json> })
-- =====================================================================

-- Internal helper — not granted to anon
create or replace function public.hirra_normalize_saudi_phone(raw text)
returns text
language plpgsql
immutable
security invoker
set search_path = public
as $fn$
declare
  d text;
begin
  if raw is null then
    return null;
  end if;
  d := regexp_replace(raw, '\D', '', 'g');
  if d like '00966%' then
    return '+' || substring(d from 3);
  end if;
  if d like '966%' then
    return '+' || d;
  end if;
  if d like '05%' and length(d) = 10 then
    return '+966' || substring(d from 2);
  end if;
  if d like '5%' and length(d) = 9 then
    return '+966' || d;
  end if;
  return null;
end;
$fn$;

revoke all on function public.hirra_normalize_saudi_phone(text) from public;

-- Zone costs match packages/shared/src/constants/shipping.ts
create or replace function public.hirra_shipping_sar_for_city(city_value text, subtotal numeric)
returns numeric
language sql
immutable
security invoker
set search_path = public
as $fn$
  select case
    when subtotal >= 199 then 0::numeric
    else (
      case coalesce(city_value, '')
        when 'riyadh' then 18::numeric
        when 'jeddah' then 18::numeric
        when 'dammam' then 18::numeric
        when 'khobar' then 18::numeric
        when 'dhahran' then 18::numeric
        when 'mecca' then 23::numeric
        when 'medina' then 23::numeric
        when 'taif' then 23::numeric
        else 28::numeric
      end
    )
  end;
$fn$;

revoke all on function public.hirra_shipping_sar_for_city(text, numeric) from public;

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
  v_blacklisted boolean;
  v_customer_id uuid;
  v_order_id uuid;
  v_order_number text;
  v_addr_words int;
  v_hour int;
  v_utm jsonb;
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

  select c.is_blacklisted
    into v_blacklisted
    from public.customers c
   where c.phone = v_phone
   limit 1;

  if coalesce(v_blacklisted, false) then
    return jsonb_build_object('error', 'Order cannot be processed at this time. Please contact support.');
  end if;

  if not jsonb_typeof(payload -> 'items') = 'array' or jsonb_array_length(payload -> 'items') < 1 then
    return jsonb_build_object('error', 'items must be a non-empty array');
  end if;

  -- Build line snapshots + subtotal (authoritative DB prices)
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

  -- Fake-order score (parity with Edge Function thresholds)
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
    v_payment::payment_method,
    case when v_fake_score >= 50 then 'fake_flagged'::order_status else 'pending_confirmation'::order_status end,
    v_fake_score,
    v_fake_flags,
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

-- Refresh PostgREST schema cache so supabase.rpc() sees the function immediately
select pg_notify('pgrst', 'reload schema');
