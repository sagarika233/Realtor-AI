-- Realtors AI Database Schema for Supabase

-- Create leads table
CREATE TABLE leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    property_type TEXT,
    budget TEXT,
    location TEXT,
    timeline TEXT,
    intent TEXT,
    call_status TEXT DEFAULT 'pending',
    appointment_booked BOOLEAN DEFAULT FALSE,
    call_transcript TEXT,
    recording_url TEXT,
    lead_score INTEGER,
    property_recommendations JSONB,
    sms_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Add RLS policies for security
-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the lead capture form)
DROP POLICY IF EXISTS "Allow public inserts" ON leads;
CREATE POLICY "Allow anonymous inserts" ON leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow authenticated reads (for your dashboard)
CREATE POLICY "Allow authenticated reads" ON leads
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Allow service role updates (for the Make.com or Node.js webhook server)
CREATE POLICY "Allow service role updates" ON leads
    FOR UPDATE
    USING (auth.role() = 'service_role');
