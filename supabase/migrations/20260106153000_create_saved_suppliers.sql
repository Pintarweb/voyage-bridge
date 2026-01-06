create table if not exists saved_suppliers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  supplier_id uuid references public.suppliers(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, supplier_id)
);

-- RLS Policies
alter table saved_suppliers enable row level security;

create policy "Users can view their own saved suppliers"
  on saved_suppliers for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own saved suppliers"
  on saved_suppliers for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own saved suppliers"
  on saved_suppliers for delete
  using ( auth.uid() = user_id );
