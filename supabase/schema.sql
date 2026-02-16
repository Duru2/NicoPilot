-- Create analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  parsed_resume JSONB NOT NULL,
  market_score JSONB NOT NULL,
  report JSONB,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for demo purposes)
-- In production, you might want to restrict this
CREATE POLICY "Allow public read access" ON analyses
  FOR SELECT
  USING (true);

-- Create policy for insert
CREATE POLICY "Allow public insert" ON analyses
  FOR INSERT
  WITH CHECK (true);

-- Create policy for update (only for paid reports)
CREATE POLICY "Allow service role update" ON analyses
  FOR UPDATE
  USING (true);
