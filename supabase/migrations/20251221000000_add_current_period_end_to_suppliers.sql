alter table suppliers 
add column if not exists current_period_end timestamp with time zone;
