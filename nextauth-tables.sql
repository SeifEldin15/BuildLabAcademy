-- NextAuth.js required tables for PostgreSQL adapter

CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL,
  "userId" INTEGER NOT NULL,
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
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL,
  "sessionToken" VARCHAR(255) NOT NULL UNIQUE,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts("userId");
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions("userId");

-- Create unique constraint for provider accounts
CREATE UNIQUE INDEX IF NOT EXISTS provider_account_unique ON accounts(provider, "providerAccountId");
