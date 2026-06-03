-- RIYANALUXE: delivery included in product price — no shipping line at checkout.

create or replace function public.hirra_shipping_sar_for_city(city_value text, subtotal numeric)
returns numeric
language sql
immutable
security invoker
set search_path = public
as $fn$
  select 0::numeric;
$fn$;

create or replace function public.hirra_cod_fee_sar(payment_method text)
returns numeric
language sql
immutable
security invoker
set search_path = public
as $fn$
  select 0::numeric;
$fn$;

do $patch$
declare
  fn_def text;
begin
  select pg_get_functiondef('public.hirra_guest_checkout(jsonb)'::regprocedure) into fn_def;
  if fn_def is null then
    return;
  end if;
  fn_def := replace(
    fn_def,
    E'  if v_payment = ''cod'' then\n    v_cod := 10::numeric(10, 2);\n  else\n    v_cod := 0::numeric(10, 2);\n  end if;',
    E'  v_cod := public.hirra_cod_fee_sar(v_payment);'
  );
  execute fn_def;
end;
$patch$;
