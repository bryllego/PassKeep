-- PassKeep Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor
-- Note: Supabase handles JWT secrets automatically, no need to set them manually

-- Create passwords table
CREATE TABLE IF NOT EXISTS passwords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  website TEXT NOT NULL,
  username TEXT NOT NULL,
  encrypted_password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS passwords_user_id_idx ON passwords(user_id);
CREATE INDEX IF NOT EXISTS passwords_created_at_idx ON passwords(created_at DESC);

-- Enable Row Level Security
ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own passwords
CREATE POLICY "Users can view their own passwords"
  ON passwords FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own passwords
CREATE POLICY "Users can insert their own passwords"
  ON passwords FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own passwords
CREATE POLICY "Users can update their own passwords"
  ON passwords FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own passwords
CREATE POLICY "Users can delete their own passwords"
  ON passwords FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_passwords_updated_at
  BEFORE UPDATE ON passwords
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to log failed login attempts (for rate limiting)
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  ip_address TEXT,
  success BOOLEAN DEFAULT FALSE,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for login attempts
CREATE INDEX IF NOT EXISTS login_attempts_email_idx ON login_attempts(email, attempted_at DESC);
CREATE INDEX IF NOT EXISTS login_attempts_ip_idx ON login_attempts(ip_address, attempted_at DESC);

-- Clean up old login attempts (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM login_attempts
  WHERE attempted_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Note: Supabase Auth handles password hashing, rate limiting, and session management automatically
-- The above schema is for storing encrypted passwords only

