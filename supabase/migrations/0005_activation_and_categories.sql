-- Activation keys table
-- This table stores hashed activation keys for application access
-- No plaintext keys are ever stored
CREATE TABLE IF NOT EXISTS activation_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_hash TEXT NOT NULL UNIQUE,
  label TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  last_verified_at TIMESTAMPTZ,
  metadata JSONB
);

-- Business categories table
CREATE TABLE IF NOT EXISTS business_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead categories junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS lead_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES business_categories(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lead_id, category_id)
);

-- Create indexes for activation keys
CREATE INDEX IF NOT EXISTS idx_activation_keys_hash ON activation_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_activation_keys_status ON activation_keys(status);

-- Create indexes for business categories
CREATE INDEX IF NOT EXISTS idx_categories_name ON business_categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_is_system ON business_categories(is_system);
CREATE INDEX IF NOT EXISTS idx_categories_is_favorite ON business_categories(is_favorite);

-- Create indexes for lead categories
CREATE INDEX IF NOT EXISTS idx_lead_categories_lead_id ON lead_categories(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_categories_category_id ON lead_categories(category_id);

-- Enable RLS on new tables
ALTER TABLE activation_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_categories ENABLE ROW LEVEL SECURITY;

-- Activation keys policies
CREATE POLICY "Application can read activation keys"
  ON activation_keys FOR SELECT
  USING (true);

CREATE POLICY "Application can insert activation keys"
  ON activation_keys FOR INSERT
  WITH CHECK (true);

-- Business categories policies
CREATE POLICY "Everyone can view business categories"
  ON business_categories FOR SELECT
  USING (true);

CREATE POLICY "Application can manage business categories"
  ON business_categories FOR ALL
  USING (true);

-- Lead categories policies
CREATE POLICY "Everyone can view lead categories"
  ON lead_categories FOR SELECT
  USING (true);

CREATE POLICY "Application can manage lead categories"
  ON lead_categories FOR ALL
  USING (true);
