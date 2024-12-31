-- Drop existing policies and triggers with CASCADE
DROP POLICY IF EXISTS "Users can view their own change requests" ON change_requests;
DROP POLICY IF EXISTS "Users can create change requests" ON change_requests;
DROP POLICY IF EXISTS "Users can update their pending requests" ON change_requests;
DROP POLICY IF EXISTS "Admins can manage all requests" ON change_requests;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON change_requests;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON change_requests;
DROP POLICY IF EXISTS "Enable update access for owners and admins" ON change_requests;
DROP POLICY IF EXISTS "Enable delete access for owners and admins" ON change_requests;

-- Drop trigger and function with CASCADE to handle dependencies
DROP TRIGGER IF EXISTS check_user_before_insert ON change_requests CASCADE;
DROP FUNCTION IF EXISTS public.check_user_status() CASCADE;

-- Create new function for user status check
CREATE OR REPLACE FUNCTION public.check_user_status()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = NEW.user_id 
    AND auth.jwt() ->> 'role' IS NOT NULL
  ) THEN
    RETURN NEW;
  ELSE
    RAISE EXCEPTION 'User not authenticated or missing role';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new trigger
CREATE TRIGGER check_user_before_insert
  BEFORE INSERT ON change_requests
  FOR EACH ROW
  EXECUTE FUNCTION check_user_status();

-- Create simplified policies
CREATE POLICY "Allow read for authenticated users"
ON change_requests FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow create for authenticated users"
ON change_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update for owners"
ON change_requests FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status = 'pending');

-- Grant permissions
GRANT ALL ON change_requests TO authenticated;
