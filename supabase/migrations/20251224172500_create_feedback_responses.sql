-- Create Feedback Responses Table
create table if not exists feedback_responses (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid references feedback_entries(entry_id) on delete cascade not null,
  responder_id uuid references auth.users(id), -- Nullable if generic admin
  response_text text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table feedback_responses enable row level security;

-- Policies
create policy "Everyone can view responses"
  on feedback_responses for select
  using (true);

create policy "Admins can insert responses"
  on feedback_responses for insert
  with check (true); -- In prod, check for admin role
