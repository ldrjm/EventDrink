-- Migration: create user_accounts table
-- Run this SQL in your Supabase SQL editor or psql connected to the database.

CREATE TABLE IF NOT EXISTS public.user_accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  auth_id uuid NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NULL,
  birth_date date NULL,
  badge_id uuid NULL,
  role text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  events_count integer NOT NULL DEFAULT 0,
  password text NULL,
  CONSTRAINT user_accounts_pkey PRIMARY KEY (id),
  CONSTRAINT user_accounts_auth_id_key UNIQUE (auth_id),
  CONSTRAINT user_accounts_email_key UNIQUE (email),
  CONSTRAINT user_accounts_auth_id_fkey FOREIGN KEY (auth_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT user_accounts_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.user_badges (id) ON DELETE SET NULL,
  CONSTRAINT user_accounts_role_check CHECK (
    role IN ('FREE','VIP','ADMIN','GERENTE','FUNCIONARIO','CLIENTE')
  )
);

CREATE INDEX IF NOT EXISTS idx_user_accounts_email ON public.user_accounts USING btree (email);
CREATE INDEX IF NOT EXISTS idx_user_accounts_role ON public.user_accounts USING btree (role);

-- Optional: enable row level security and a permissive policy for testing only
-- ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public access" ON public.user_accounts FOR ALL USING (true) WITH CHECK (true);
