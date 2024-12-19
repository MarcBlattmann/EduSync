
-- Create the search_suggestions table if it doesn't exist
CREATE TABLE IF NOT EXISTS search_suggestions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the initialization function
CREATE OR REPLACE FUNCTION init_search_suggestions(suggestions jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY definer
AS $$
BEGIN
  -- Check if table is empty
  IF NOT EXISTS (SELECT 1 FROM search_suggestions LIMIT 1) THEN
    -- Insert initial data
    INSERT INTO search_suggestions (title, category)
    SELECT 
      x.value->>'title',
      x.value->>'category'
    FROM jsonb_array_elements(suggestions) x;
  END IF;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION init_search_suggestions(jsonb) TO anon;
GRANT ALL ON TABLE search_suggestions TO anon;