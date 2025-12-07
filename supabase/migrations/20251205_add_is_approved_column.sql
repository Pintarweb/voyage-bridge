-- Add is_approved column to agent_profiles table
ALTER TABLE agent_profiles 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;

-- Update existing approved agents to have is_approved = TRUE
UPDATE agent_profiles 
SET is_approved = TRUE 
WHERE verification_status = 'approved';

-- Create or replace the trigger function to update is_approved
CREATE OR REPLACE FUNCTION update_agent_approval_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update is_approved based on verification_status
  IF NEW.verification_status = 'approved' THEN
    NEW.is_approved = TRUE;
  ELSE
    NEW.is_approved = FALSE;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to automatically update is_approved
DROP TRIGGER IF EXISTS agent_approval_status_trigger ON agent_profiles;
CREATE TRIGGER agent_approval_status_trigger
  BEFORE INSERT OR UPDATE ON agent_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_approval_status();
