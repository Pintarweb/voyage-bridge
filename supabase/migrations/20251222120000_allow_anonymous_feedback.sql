-- Make user_id nullable in feedback_entries to support anonymous feedback (Exit Intent)
alter table feedback_entries alter column user_id drop not null;

-- Update RLS policy to allow anonymous inserts
drop policy if exists "Users can insert their own feedback" on feedback_entries;

create policy "Anyone can insert feedback"
  on feedback_entries for insert
  with check (
    -- Allow authenticated users to insert their own id
    (auth.uid() = user_id) 
    OR 
    -- Allow anonymous inserts (where user_id is null)
    (user_id is null)
  );
