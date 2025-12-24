-- Create Response Templates Table
create table if not exists response_templates (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  content text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table response_templates enable row level security;

-- Policies
create policy "Everyone can view templates"
  on response_templates for select
  using (true);

create policy "Admins can manage templates"
  on response_templates for all
  using (true)
  with check (true); -- In prod, check for admin role

-- Insert default templates
insert into response_templates (label, content) values
('Added to List', 'Thank you, Pioneer! We''ve added this to our build list.'),
('Friction Fix', 'Sorry for the friction—here is the fix.'),
('Praise', 'Thanks for the love! We appreciate it.');
