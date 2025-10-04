-- Applications table to store user applications
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_type VARCHAR(50) NOT NULL CHECK (course_type IN ('group', 'individual')),
  interest TEXT NOT NULL,
  additional_info TEXT NOT NULL,
  work_experience TEXT NOT NULL,
  existing_skills TEXT NOT NULL,
  team_role TEXT NOT NULL,
  can_commit BOOLEAN NOT NULL,
  has_steel_boots BOOLEAN NOT NULL,
  interested_in_bootcamp BOOLEAN NOT NULL,
  final_comments TEXT NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'stripe',
  total_amount DECIMAL(10, 2) DEFAULT 0.00,
  payment_completed BOOLEAN DEFAULT FALSE,
  payment_intent_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_applications_timestamp ON applications;
CREATE TRIGGER update_applications_timestamp
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_applications_updated_at();
