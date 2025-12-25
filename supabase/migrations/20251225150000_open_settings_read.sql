drop policy if exists "Admins can view system settings" on system_settings;

create policy "Anyone can view system settings"
  on system_settings for select
  using (true);
