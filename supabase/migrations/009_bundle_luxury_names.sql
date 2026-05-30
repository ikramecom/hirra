-- Premium Arabic bundle display names (RIYANALUXE)
update public.bundles
set
  name_ar = 'طقس الضيافة',
  name_en = 'Rituel d''Hospitalité',
  updated_at = now()
where slug = 'rituel-du-foyer';

update public.bundles
set
  name_ar = 'ليالي ريانا',
  name_en = 'Nuits Riyana',
  updated_at = now()
where slug = 'coffret-eid';

update public.bundles
set
  name_ar = 'لمسة فخامة',
  name_en = 'Touche de Prestige',
  updated_at = now()
where slug = 'maison-seche';
