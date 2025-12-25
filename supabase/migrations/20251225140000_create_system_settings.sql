create table if not exists system_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamp with time zone default now(),
  updated_by uuid references auth.users(id)
);

-- Enable RLS
alter table system_settings enable row level security;

-- Policies
create policy "Admins can view system settings"
  on system_settings for select
  using (
    exists (
      select 1 from agent_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update system settings"
  on system_settings for update
  using (
    exists (
      select 1 from agent_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Insert default maintenance mode
insert into system_settings (key, value, description)
values ('maintenance_mode', 'false'::jsonb, 'System-wide maintenance mode flag')
on conflict (key) do nothing;
