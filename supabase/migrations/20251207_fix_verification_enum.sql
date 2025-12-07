-- Migration: Allow 'rejected' status in verification_status
-- Description: Updates the check constraint on agent_profiles to include 'rejected'.

DO $$
BEGIN
    -- Drop the constraint if it exists (using standard naming convention or known names)
    -- We try multiple potential names just in case
    BEGIN
        ALTER TABLE agent_profiles DROP CONSTRAINT IF EXISTS agent_profiles_verification_status_check;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;
END $$;

-- Re-add the constraint with 'rejected' allowed
ALTER TABLE agent_profiles 
ADD CONSTRAINT agent_profiles_verification_status_check 
CHECK (verification_status IN ('pending', 'approved', 'rejected'));
