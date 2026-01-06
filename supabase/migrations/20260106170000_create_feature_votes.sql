
create table if not exists feature_votes (
  feature_id uuid references feature_wishlist(feature_id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  weight integer default 1,
  created_at timestamptz default now(),
  primary key (feature_id, user_id)
);

alter table feature_votes enable row level security;

create policy "Users can view their own votes"
  on feature_votes for select
  using (auth.uid() = user_id);

create policy "Users can vote"
  on feature_votes for insert
  with check (auth.uid() = user_id);

-- Optional: Create a view or function if needed, but we'll handle logic in API for now.
