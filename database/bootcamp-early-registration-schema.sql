-- Bootcamp Early Registration Schema
-- For tracking April 15, 2026 bootcamp early registrations and holding fees

-- Bootcamp Cohorts Table
CREATE TABLE IF NOT EXISTS bootcamp_cohorts (
    id SERIAL PRIMARY KEY,
    cohort_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'upcoming', -- upcoming, active, completed, cancelled
    capacity INTEGER DEFAULT 30,
    enrolled_count INTEGER DEFAULT 0,
    holding_fee_amount DECIMAL(10, 2) DEFAULT 100.00,
    early_bird_discount DECIMAL(10, 2) DEFAULT 1500.00,
    regular_price DECIMAL(10, 2) DEFAULT 10000.00,
    discounted_price DECIMAL(10, 2) DEFAULT 8500.00, -- regular_price - early_bird_discount
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Early Registrations / Interest List Table
CREATE TABLE IF NOT EXISTS early_registrations (
    id SERIAL PRIMARY KEY,
    cohort_id INTEGER REFERENCES bootcamp_cohorts(id),
    
    -- User Information
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    
    -- Demographics (for learning about your audience)
    age_range VARCHAR(50), -- 18-24, 25-34, 35-44, 45+
    current_occupation VARCHAR(255),
    education_level VARCHAR(100), -- high-school, some-college, bachelors, masters, phd, other
    programming_experience VARCHAR(50), -- none, beginner, intermediate, advanced
    motivation TEXT, -- Why they want to join
    how_did_you_hear VARCHAR(255), -- social-media, google, friend, other
    
    -- Registration Status
    status VARCHAR(50) DEFAULT 'interested', -- interested, holding-paid, contacted, closed, withdrawn
    registration_type VARCHAR(50) DEFAULT 'interest', -- interest, holding-fee, full-payment
    
    -- Payment & Discount Tracking
    has_paid_holding_fee BOOLEAN DEFAULT FALSE,
    holding_fee_paid_at TIMESTAMP,
    has_early_bird_discount BOOLEAN DEFAULT FALSE,
    full_payment_status VARCHAR(50) DEFAULT 'pending', -- pending, partial, completed
    amount_paid DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Sales / Closer Notes
    assigned_closer VARCHAR(255), -- Name of sales person assigned
    closer_notes TEXT,
    last_contacted_at TIMESTAMP,
    next_follow_up_date DATE,
    contact_count INTEGER DEFAULT 0,
    
    -- Metadata
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    referral_code VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(cohort_id, email)
);

-- Holding Fee Payments Table
CREATE TABLE IF NOT EXISTS holding_fee_payments (
    id SERIAL PRIMARY KEY,
    registration_id INTEGER REFERENCES early_registrations(id),
    
    -- Payment Details
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    
    -- Payment Status
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, succeeded, failed, refunded
    payment_method VARCHAR(50), -- card, bank_transfer, etc
    
    -- Receipt & Confirmation
    receipt_url TEXT,
    confirmation_email_sent BOOLEAN DEFAULT FALSE,
    
    -- Refund Information
    refunded BOOLEAN DEFAULT FALSE,
    refund_amount DECIMAL(10, 2),
    refund_reason TEXT,
    refunded_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Log Table (for tracking conversations with prospective students)
CREATE TABLE IF NOT EXISTS registration_contact_log (
    id SERIAL PRIMARY KEY,
    registration_id INTEGER REFERENCES early_registrations(id),
    
    contact_type VARCHAR(50) NOT NULL, -- phone, email, video-call, in-person
    contacted_by VARCHAR(255), -- Staff member name
    
    notes TEXT,
    outcome VARCHAR(100), -- interested, not-interested, needs-follow-up, closed-deal, no-answer
    
    next_action VARCHAR(255),
    next_contact_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert the April 15, 2026 Cohort
INSERT INTO bootcamp_cohorts (
    cohort_name, 
    start_date, 
    status, 
    capacity,
    holding_fee_amount,
    early_bird_discount,
    regular_price,
    discounted_price,
    description
) VALUES (
    'Spring 2026 Bootcamp',
    '2026-04-15',
    'upcoming',
    30,
    100.00,
    1500.00,
    10000.00,
    8500.00,
    'Intensive 12-week coding bootcamp starting April 15, 2026. Learn full-stack development with hands-on projects and career support.'
) ON CONFLICT DO NOTHING;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_early_registrations_email ON early_registrations(email);
CREATE INDEX IF NOT EXISTS idx_early_registrations_status ON early_registrations(status);
CREATE INDEX IF NOT EXISTS idx_early_registrations_cohort ON early_registrations(cohort_id);
CREATE INDEX IF NOT EXISTS idx_early_registrations_holding_fee ON early_registrations(has_paid_holding_fee);
CREATE INDEX IF NOT EXISTS idx_holding_fee_payments_registration ON holding_fee_payments(registration_id);
CREATE INDEX IF NOT EXISTS idx_contact_log_registration ON registration_contact_log(registration_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_bootcamp_cohorts_updated_at ON bootcamp_cohorts;
CREATE TRIGGER update_bootcamp_cohorts_updated_at BEFORE UPDATE ON bootcamp_cohorts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_early_registrations_updated_at ON early_registrations;
CREATE TRIGGER update_early_registrations_updated_at BEFORE UPDATE ON early_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_holding_fee_payments_updated_at ON holding_fee_payments;
CREATE TRIGGER update_holding_fee_payments_updated_at BEFORE UPDATE ON holding_fee_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
