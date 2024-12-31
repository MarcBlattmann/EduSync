-- Drop existing table if it exists
DROP TABLE IF EXISTS change_requests;

-- Recreate the change_requests table with proper schema
CREATE TABLE change_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id TEXT NOT NULL,
    content_type TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    original_content TEXT NOT NULL,
    suggested_content TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewer_comment TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_change_requests_content_id ON change_requests(content_id);
CREATE INDEX idx_change_requests_user_id ON change_requests(user_id);
CREATE INDEX idx_change_requests_status ON change_requests(status);

-- Add RLS policies
ALTER TABLE change_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests and admins can view all
CREATE POLICY "Users can view their own change requests"
ON change_requests FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin')
);

-- Users can create requests
CREATE POLICY "Users can create change requests"
ON change_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their pending requests
CREATE POLICY "Users can update their pending requests"
ON change_requests FOR UPDATE
TO authenticated
USING (
    user_id = auth.uid() AND 
    status = 'pending'
);

-- Only admins can manage all requests
CREATE POLICY "Admins can manage all requests"
ON change_requests FOR ALL
TO authenticated
USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin')
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_change_requests_updated_at
    BEFORE UPDATE ON change_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
