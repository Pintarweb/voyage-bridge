create table if not exists system_metrics (
  id uuid default gen_random_uuid() primary key,
  recorded_at timestamp with time zone default now() not null,
  active_users integer default 0,
  system_load integer default 0,
  health_status text default 'optimal',
  api_latency_ms integer default 0
);

-- Enable RLS
alter table system_metrics enable row level security;

-- Allow admins to read all
create policy "Admins can view system metrics"
  on system_metrics for select
  using (
    exists (
      select 1 from agent_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Allow service role (or admin) to insert (for cron jobs)
create policy "Admins/Service can insert system metrics"
  on system_metrics for insert
  with check (
    exists (
      select 1 from agent_profiles
      where id = auth.uid() and role = 'admin'
    )
    OR
    (auth.role() = 'service_role')
  );
