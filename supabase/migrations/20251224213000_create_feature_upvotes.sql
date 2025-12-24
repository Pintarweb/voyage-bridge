create table if not exists feature_upvotes (
  id uuid primary key default gen_random_uuid(),
  feature_id uuid references feature_wishlist(feature_id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(feature_id, user_id)
);

alter table feature_upvotes enable row level security;

create policy "Users can view upvotes"
  on feature_upvotes for select
  using (true);

create policy "Users can vote once"
  on feature_upvotes for insert
  with check (auth.uid() = user_id);

create policy "Users can remove vote"
  on feature_upvotes for delete
  using (auth.uid() = user_id);
