-- Applications table to store user applications
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);
