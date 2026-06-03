-- RIYANALUXE: Moroccan checkout validation in hirra_guest_checkout

do $patch$
declare
  fn_def text;
begin
  select pg_get_functiondef('public.hirra_guest_checkout(jsonb)'::regprocedure) into fn_def;
  if fn_def is null then
    return;
  end if;

  fn_def := replace(fn_def, 'Invalid Saudi phone number', 'Invalid Moroccan phone number');
  fn_def := replace(
    fn_def,
    E'if not starts_with(v_phone, ''+9665'') then\n    v_fake_flags := array_append(v_fake_flags, ''invalid_saudi_mobile'');',
    E'if not (starts_with(v_phone, ''+2126'') or starts_with(v_phone, ''+2127'')) then\n    v_fake_flags := array_append(v_fake_flags, ''invalid_moroccan_mobile'');'
  );

  execute fn_def;
end;
$patch$;
