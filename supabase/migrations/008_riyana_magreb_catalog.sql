-- =====================================================================
-- RIYANALUXE — Maghreb luxury catalog (MAD in price_sar) + checkout helpers
-- =====================================================================

-- Maghreb phone (Morocco primary)
create or replace function public.hirra_normalize_magreb_phone(raw text)
returns text
language plpgsql
immutable
security invoker
set search_path = public
as $fn$
declare
  digits text;
begin
  if raw is null or length(trim(both from raw)) < 8 then
    return null;
  end if;
  digits := regexp_replace(raw, '\D', '', 'g');

  if digits like '00212%' then return '+' || substring(digits from 3); end if;
  if digits like '212%' and length(digits) = 12 then return '+' || digits; end if;
  if (digits like '06%' or digits like '07%') and length(digits) = 10 then
    return '+212' || substring(digits from 2);
  end if;
  if (digits like '6%' or digits like '7%') and length(digits) = 9 then
    return '+212' || digits;
  end if;

  if digits like '00213%' then return '+' || substring(digits from 3); end if;
  if digits like '213%' and length(digits) = 12 then return '+' || digits; end if;
  if digits like '0%' and length(digits) = 10 and substring(digits, 1, 2) in ('05', '06', '07') then
    return '+213' || substring(digits from 2);
  end if;

  if digits like '00216%' then return '+' || substring(digits from 3); end if;
  if digits like '216%' and length(digits) = 11 then return '+' || digits; end if;
  if digits like '0%' and length(digits) = 8 then return '+216' || substring(digits from 2); end if;
  if length(digits) = 8 then return '+216' || digits; end if;

  return null;
end;
$fn$;

create or replace function public.hirra_normalize_saudi_phone(raw text)
returns text
language sql
immutable
security invoker
set search_path = public
as $fn$
  select public.hirra_normalize_magreb_phone(raw);
$fn$;

revoke all on function public.hirra_normalize_magreb_phone(text) from public;

create or replace function public.hirra_shipping_sar_for_city(city_value text, subtotal numeric)
returns numeric
language sql
immutable
security invoker
set search_path = public
as $fn$
  select case
    when subtotal >= 349 then 0::numeric
    else (
      case coalesce(city_value, '')
        when 'casablanca' then 25::numeric
        when 'rabat' then 25::numeric
        when 'marrakech' then 25::numeric
        when 'tangier' then 30::numeric
        when 'fes' then 30::numeric
        when 'agadir' then 30::numeric
        when 'meknes' then 30::numeric
        when 'kenitra' then 30::numeric
        when 'oujda' then 35::numeric
        when 'tetouan' then 35::numeric
        when 'algiers' then 35::numeric
        when 'oran' then 35::numeric
        when 'tunis' then 35::numeric
        when 'constantine' then 45::numeric
        when 'sfax' then 45::numeric
        else 35::numeric
      end
    )
  end;
$fn$;

-- Retire all legacy SKUs (pet products + old riyana slugs)
update public.products set is_active = false, is_hero = false
where slug in (
  'hirra-pro-roller', 'hirra-honeycomb-mat', 'hirra-aurora-fountain',
  'riyana-mabkhara-luxe', 'riyana-pierre-seche', 'riyana-armoire-seche'
);

update public.bundles set is_active = false
where slug in (
  'hirra-trio', 'clean-home-bundle', 'pampered-cat-set',
  'rituel-foyer', 'garde-robe-maison'
);

-- 1. RIYANALUXE Mabkhara Luxe (hero)
insert into public.products (
  slug, name_ar, name_en, subtitle_ar, subtitle_en,
  description_ar, description_en,
  price_sar, compare_at_price_sar, cost_sar, sku,
  inventory_count, is_active, is_hero, display_order
) values (
  'riyanaluxe-mabkhara-luxe',
  'ريانا لوكس — مبخرة لوكس',
  'RIYANALUXE Mabkhara Luxe',
  'بخور عصري بلا فحم — عبق الدار وكرم الضيافة',
  'Smokeless ritual — art of hospitality',
  'مبخرة كهربائية فاخرة بتسخين سريع، قفل أمان، ومنفذ Type-C. تصميم أسود مطفي مع تفاصيل ذهبية — للصالون، العيد، والهدايا التي تُذكر.',
  'Premium electric mabkhara with rapid heat, safety lock, and Type-C charging. Matte black with gold details — for salon, Eid, and memorable gifts.',
  249, 349, 95, 'RYN-MBK-001', 80, true, true, 1
) on conflict (slug) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  subtitle_ar = excluded.subtitle_ar,
  subtitle_en = excluded.subtitle_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  price_sar = excluded.price_sar,
  compare_at_price_sar = excluded.compare_at_price_sar,
  cost_sar = excluded.cost_sar,
  inventory_count = excluded.inventory_count,
  is_active = true,
  is_hero = true,
  display_order = 1,
  updated_at = now();

-- 2. RIYANALUXE Pierre Sèche
insert into public.products (
  slug, name_ar, name_en, subtitle_ar, subtitle_en,
  description_ar, description_en,
  price_sar, compare_at_price_sar, cost_sar, sku,
  inventory_count, is_active, is_hero, display_order
) values (
  'riyanaluxe-pierre-seche',
  'ريانا لوكس — بيير سيك',
  'RIYANALUXE Pierre Sèche',
  'حجر طبيعي يشرب الماء في ثوانٍ',
  'Natural stone — water vanishes in seconds',
  'بساط حمام من حجر الدياتوميت: امتصاص فوري، قاعدة مانعة للانزلاق، ومظهر فندقي يليق بمنزلك المغربي.',
  'Diatomite quick-dry stone bath mat: instant absorption, anti-slip base, hotel-grade elegance.',
  249, 349, 55, 'RYN-STM-001', 100, true, false, 2
) on conflict (slug) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  subtitle_ar = excluded.subtitle_ar,
  subtitle_en = excluded.subtitle_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  price_sar = excluded.price_sar,
  compare_at_price_sar = excluded.compare_at_price_sar,
  is_active = true,
  is_hero = false,
  display_order = 2,
  updated_at = now();

-- 3. RIYANALUXE Armoire Sèche
insert into public.products (
  slug, name_ar, name_en, subtitle_ar, subtitle_en,
  description_ar, description_en,
  price_sar, compare_at_price_sar, cost_sar, sku,
  inventory_count, is_active, is_hero, display_order
) values (
  'riyanaluxe-armoire-seche',
  'ريانا لوكس — أرمور سيك',
  'RIYANALUXE Armoire Sèche',
  'مزيل رطوبة الدولاب — صامت وأنيق',
  'Wardrobe dehumidifier — quiet & refined',
  'جهاز مدمج يحمي ملابسك من الرطوبة والرائحة الكريهة — مثالي للدار البيضاء، طنجة، والمدن الساحلية.',
  'Compact closet mini dehumidifier protecting garments from humidity and musty odours.',
  449, 549, 110, 'RYN-DSH-001', 60, true, false, 3
) on conflict (slug) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  subtitle_ar = excluded.subtitle_ar,
  subtitle_en = excluded.subtitle_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  price_sar = excluded.price_sar,
  compare_at_price_sar = excluded.compare_at_price_sar,
  is_active = true,
  is_hero = false,
  display_order = 3,
  updated_at = now();

-- Bundles
insert into public.bundles (slug, name_ar, name_en, description_ar, description_en, price_sar, savings_sar, is_active, display_order)
values (
  'rituel-du-foyer',
  'طقس الضيافة',
  'Rituel d''Hospitalité',
  'مبخرة لوكس + بيير سيك — مجموعة الضيافة',
  'Mabkhara Luxe + Pierre Sèche',
  399, 99, true, 1
) on conflict (slug) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  price_sar = excluded.price_sar,
  savings_sar = excluded.savings_sar,
  is_active = true,
  display_order = 1;

insert into public.bundles (slug, name_ar, name_en, description_ar, description_en, price_sar, savings_sar, is_active, display_order)
values (
  'coffret-eid',
  'ليالي ريانا',
  'Nuits Riyana',
  'المجموعة الثلاثية — مبخرة لوكس + بيير سيك + أرمور سيك',
  'Mabkhara Luxe + Pierre Sèche + Armoire Sèche',
  599, 348, true, 2
) on conflict (slug) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  price_sar = excluded.price_sar,
  savings_sar = excluded.savings_sar,
  is_active = true,
  display_order = 2;

insert into public.bundles (slug, name_ar, name_en, description_ar, description_en, price_sar, savings_sar, is_active, display_order)
values (
  'maison-seche',
  'لمسة فخامة',
  'Touche de Prestige',
  'بيير سيك + أرمور سيك — راحة الحمام والدولاب',
  'Pierre Sèche + Armoire Sèche',
  499, 199, true, 3
) on conflict (slug) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  price_sar = excluded.price_sar,
  savings_sar = excluded.savings_sar,
  is_active = true,
  display_order = 3;

-- Link bundle products (idempotent)
insert into public.bundle_products (bundle_id, product_id, quantity)
select b.id, p.id, 1
from public.bundles b
cross join public.products p
where b.slug = 'rituel-du-foyer'
  and p.slug in ('riyanaluxe-mabkhara-luxe', 'riyanaluxe-pierre-seche')
on conflict (bundle_id, product_id) do nothing;

insert into public.bundle_products (bundle_id, product_id, quantity)
select b.id, p.id, 1
from public.bundles b
cross join public.products p
where b.slug = 'coffret-eid'
  and p.slug in ('riyanaluxe-mabkhara-luxe', 'riyanaluxe-pierre-seche', 'riyanaluxe-armoire-seche')
on conflict (bundle_id, product_id) do nothing;

insert into public.bundle_products (bundle_id, product_id, quantity)
select b.id, p.id, 1
from public.bundles b
cross join public.products p
where b.slug = 'maison-seche'
  and p.slug in ('riyanaluxe-pierre-seche', 'riyanaluxe-armoire-seche')
on conflict (bundle_id, product_id) do nothing;
