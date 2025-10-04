-- Fix NextAuth tables to work with UUID user IDs

-- Drop existing tables and recreate with correct data types
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS verification_tokens CASCADE;

-- Create accounts table with UUID userId
CREATE TABLE accounts (
  id SERIAL,
  "userId" UUID NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Create sessions table with UUID userId
CREATE TABLE sessions (
  id SERIAL,
  "sessionToken" VARCHAR(255) NOT NULL UNIQUE,
  "userId" UUID NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Create verification_tokens table (this doesn't need userId)
CREATE TABLE verification_tokens (
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Create indexes for better performance
CREATE INDEX accounts_user_id_idx ON accounts("userId");
CREATE INDEX sessions_user_id_idx ON sessions("userId");

-- Create unique constraint for provider accounts
CREATE UNIQUE INDEX provider_account_unique ON accounts(provider, "providerAccountId");
