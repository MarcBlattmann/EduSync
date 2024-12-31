-- Create the edit_suggestions table
CREATE TABLE IF NOT EXISTS edit_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL,
    user_id UUID NOT NULL,
    original_content TEXT NOT NULL,
    suggested_content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_by UUID,
    resolved_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY (resolved_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_edit_suggestions_updated_at
    BEFORE UPDATE ON edit_suggestions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_edit_suggestions_content_id ON edit_suggestions(content_id);
CREATE INDEX idx_edit_suggestions_user_id ON edit_suggestions(user_id);
CREATE INDEX idx_edit_suggestions_status ON edit_suggestions(status);

-- Add RLS (Row Level Security) policies
ALTER TABLE edit_suggestions ENABLE ROW LEVEL SECURITY;

-- Users can view their own suggestions and admins can view all
CREATE POLICY "Users can view their own suggestions"
ON edit_suggestions
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Users can create suggestions
CREATE POLICY "Users can create suggestions"
ON edit_suggestions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending suggestions
CREATE POLICY "Users can update their own pending suggestions"
ON edit_suggestions
FOR UPDATE
TO authenticated
USING (
    user_id = auth.uid() AND 
    status = 'pending'
)
WITH CHECK (
    user_id = auth.uid() AND 
    status = 'pending'
);

-- Only admins can approve/reject suggestions
CREATE POLICY "Admins can manage all suggestions"
ON edit_suggestions
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
