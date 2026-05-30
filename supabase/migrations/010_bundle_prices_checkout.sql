-- Bundle price updates (MAD)
update public.bundles
set price_sar = 399, savings_sar = 99, updated_at = now()
where slug = 'rituel-du-foyer';

update public.bundles
set price_sar = 599, savings_sar = 348, updated_at = now()
where slug = 'coffret-eid';

update public.bundles
set price_sar = 499, savings_sar = 199, updated_at = now()
where slug = 'maison-seche';
