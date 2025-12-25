alter table system_reports 
add column if not exists summary text,
add column if not exists action_items text;
