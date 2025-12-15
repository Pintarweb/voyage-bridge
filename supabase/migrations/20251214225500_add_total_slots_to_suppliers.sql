-- Add total_slots column to suppliers table if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'suppliers' and column_name = 'total_slots') then
    alter table public.suppliers add column total_slots integer default 1;
  end if;
end $$;
