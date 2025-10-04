-- Student Portal Database Schema
-- This schema handles student verification and discount management

-- Student verification applications table
CREATE TABLE IF NOT EXISTS student_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    school_name VARCHAR(255),
    graduation_date DATE,
    student_id VARCHAR(100),
    verification_method VARCHAR(50) DEFAULT 'email', -- 'email', 'sheerid', 'manual'
    verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected', 'expired'
    verification_token VARCHAR(255), -- SheerID verification token
    verification_data JSONB, -- Store SheerID response data
    discount_percentage INTEGER DEFAULT 20, -- Default 20% student discount
    discount_code VARCHAR(50), -- Generated unique discount code
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year'),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_discount_percentage CHECK (discount_percentage >= 0 AND discount_percentage <= 100)
);

-- Student email domains table (for basic email verification)
CREATE TABLE IF NOT EXISTS student_email_domains (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(255) UNIQUE NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    country VARCHAR(100),
    verification_level VARCHAR(20) DEFAULT 'basic', -- 'basic', 'verified', 'premium'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discount usage tracking
CREATE TABLE IF NOT EXISTS discount_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_id UUID REFERENCES student_verifications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id VARCHAR(255), -- Stripe payment intent ID or order reference
    discount_amount DECIMAL(10,2) NOT NULL,
    original_amount DECIMAL(10,2) NOT NULL,
    final_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_amounts CHECK (
        discount_amount >= 0 AND 
        original_amount > 0 AND 
        final_amount >= 0 AND 
        final_amount <= original_amount
    )
);

-- Student verification audit log
CREATE TABLE IF NOT EXISTS student_verification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_id UUID REFERENCES student_verifications(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL, -- 'created', 'submitted', 'verified', 'rejected', 'expired', 'renewed'
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_verifications_user_id ON student_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_student_verifications_email ON student_verifications(email);
CREATE INDEX IF NOT EXISTS idx_student_verifications_status ON student_verifications(verification_status);
CREATE INDEX IF NOT EXISTS idx_student_verifications_discount_code ON student_verifications(discount_code);
CREATE INDEX IF NOT EXISTS idx_student_verifications_expires_at ON student_verifications(expires_at);

CREATE INDEX IF NOT EXISTS idx_student_email_domains_domain ON student_email_domains(domain);
CREATE INDEX IF NOT EXISTS idx_student_email_domains_active ON student_email_domains(is_active);

CREATE INDEX IF NOT EXISTS idx_discount_usage_verification_id ON discount_usage(verification_id);
CREATE INDEX IF NOT EXISTS idx_discount_usage_user_id ON discount_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_discount_usage_used_at ON discount_usage(used_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic updated_at
CREATE TRIGGER update_student_verifications_updated_at 
    BEFORE UPDATE ON student_verifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_email_domains_updated_at 
    BEFORE UPDATE ON student_email_domains 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some common student email domains
INSERT INTO student_email_domains (domain, school_name, country) VALUES
-- US Universities
('@edu', 'Generic US Educational Institution', 'United States'),
('@student.edu', 'Generic US Student Email', 'United States'),
('@mit.edu', 'Massachusetts Institute of Technology', 'United States'),
('@stanford.edu', 'Stanford University', 'United States'),
('@harvard.edu', 'Harvard University', 'United States'),
('@berkeley.edu', 'UC Berkeley', 'United States'),
('@ucla.edu', 'UCLA', 'United States'),
('@nyu.edu', 'New York University', 'United States'),

-- Canadian Universities
('@utoronto.ca', 'University of Toronto', 'Canada'),
('@ubc.ca', 'University of British Columbia', 'Canada'),
('@mcgill.ca', 'McGill University', 'Canada'),
('@ryerson.ca', 'Toronto Metropolitan University', 'Canada'),
('@torontomu.ca', 'Toronto Metropolitan University', 'Canada'),
('@queensu.ca', 'Queens University', 'Canada'),
('@uwaterloo.ca', 'University of Waterloo', 'Canada'),
('@yorku.ca', 'York University', 'Canada'),
('@carleton.ca', 'Carleton University', 'Canada'),
('@uottawa.ca', 'University of Ottawa', 'Canada'),

-- UK Universities
('@ox.ac.uk', 'University of Oxford', 'United Kingdom'),
('@cam.ac.uk', 'University of Cambridge', 'United Kingdom'),
('@imperial.ac.uk', 'Imperial College London', 'United Kingdom'),
('@ucl.ac.uk', 'University College London', 'United Kingdom'),
('@ed.ac.uk', 'University of Edinburgh', 'United Kingdom'),

-- Australian Universities
('@sydney.edu.au', 'University of Sydney', 'Australia'),
('@unimelb.edu.au', 'University of Melbourne', 'Australia'),
('@monash.edu', 'Monash University', 'Australia'),

-- Generic student domains
('@student.', 'Generic Student Email Domain', 'Various')
ON CONFLICT (domain) DO NOTHING;
