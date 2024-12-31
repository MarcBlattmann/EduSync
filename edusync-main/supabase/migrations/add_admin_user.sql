-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for reading profiles
CREATE POLICY "Allow users to read profiles"
    ON profiles FOR SELECT
    USING (true);

-- Create policy for updating profiles
CREATE POLICY "Allow users to update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Create policy for inserting profiles
CREATE POLICY "Allow users to insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Insert your admin user
-- Replace 'your-user-id' with your actual Supabase user ID
-- Replace 'your-email@example.com' with your actual email
INSERT INTO profiles (id, email, role)
VALUES (
    'your-user-id', -- Replace with your actual user ID from auth.users
    'your-email@example.com', -- Replace with your actual email
    'admin'
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- Create function to get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$;
