-- Drop existing function and policies
DROP FUNCTION IF EXISTS public.check_user_status();
DROP POLICY IF EXISTS "Users can read their own requests" ON change_requests;
DROP POLICY IF EXISTS "Users can create requests" ON change_requests;
DROP POLICY IF EXISTS "Users can update their pending requests" ON change_requests;
DROP POLICY IF EXISTS "Admins can delete requests" ON change_requests;

-- Create new function to check user permissions
CREATE OR REPLACE FUNCTION public.check_user_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow any authenticated user to create requests
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid()
    AND auth.role() = 'authenticated'
  ) THEN
    RETURN NEW;
  ELSE
    RAISE EXCEPTION 'User not authenticated';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new policies with simpler authentication checks
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

CREATE POLICY "Allow delete for owners and admins"
ON change_requests FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Grant necessary permissions
GRANT ALL ON change_requests TO authenticated;

-- Recreate the trigger
DROP TRIGGER IF EXISTS check_user_before_insert ON change_requests;
CREATE TRIGGER check_user_before_insert
  BEFORE INSERT ON change_requests
  FOR EACH ROW
  EXECUTE FUNCTION check_user_status();
