
-- HangrMap SaaS Database Schema
-- Run this in your Supabase SQL Editor

-- 1. COMPANIES TABLE
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_type TEXT NOT NULL DEFAULT 'solo', -- 'solo', 'crew', 'agency'
  subscription_status TEXT NOT NULL DEFAULT 'incomplete',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS TABLE
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'crew', -- 'admin', 'crew'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CAMPAIGNS TABLE
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  qr_code_url TEXT,
  target_neighborhood TEXT,
  stats JSONB DEFAULT '{"totalDrops": 0, "scans": 0, "leads": 0}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DROPS TABLE
CREATE TABLE drops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL, -- 'dropped', 'skipped', 'no-soliciting', 'existing-client'
  address TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE drops ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Users profile: Users can read their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Companies: Users can only see their own company
CREATE POLICY "Users can view own company" ON companies
  FOR SELECT USING (
    id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

-- Campaigns: Filtered by company_id
CREATE POLICY "Users can view company campaigns" ON campaigns
  FOR SELECT USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can manage campaigns" ON campaigns
  FOR ALL USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Drops: Filtered by company_id
CREATE POLICY "Users can view company drops" ON drops
  FOR SELECT USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Crew can insert drops" ON drops
  FOR INSERT WITH CHECK (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can manage drops" ON drops
  FOR ALL USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid() AND role = 'admin')
  );
