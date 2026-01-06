create table if not exists product_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  destination text not null,
  category text not null,
  budget text,
  details text,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table product_requests enable row level security;

create policy "Users can insert their own requests"
  on product_requests for insert
  with check ( auth.uid() = user_id );

create policy "Users can view their own requests"
  on product_requests for select
  using ( auth.uid() = user_id );
