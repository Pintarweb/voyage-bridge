create table if not exists system_reports (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now() not null,
  period text check (period in ('day', 'week', 'month')) not null,
  avg_load integer not null,
  peak_users integer not null,
  total_requests integer not null,
  email_sent boolean default false,
  status text default 'generated', -- generated, emailed, failed
  generated_by uuid references auth.users(id)
);

-- Enable RLS
alter table system_reports enable row level security;

-- Policies
create policy "Admins can view all reports"
  on system_reports for select
  using (
    exists (
      select 1 from agent_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can insert reports"
  on system_reports for insert
  with check (
    exists (
      select 1 from agent_profiles
      where id = auth.uid() and role = 'admin'
    )
  );
