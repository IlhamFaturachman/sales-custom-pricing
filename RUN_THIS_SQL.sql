-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- pricing_pages table
CREATE TABLE pricing_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  company_name TEXT,
  header_title TEXT DEFAULT 'Solusi terintegrasi untuk hubungan pelanggan, penjualan, dan komunikasi massa bisnis anda',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'expired', 'archived')),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- pricing_categories table (tab kategori: Omnichannel, WA API Only, etc)
CREATE TABLE pricing_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pricing_page_id UUID NOT NULL REFERENCES pricing_pages(id) ON DELETE CASCADE,
  category_name TEXT NOT NULL,
  category_icon TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- pricing_durations table (6 Bulan, 12 Bulan, etc)
CREATE TABLE pricing_durations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pricing_page_id UUID NOT NULL REFERENCES pricing_pages(id) ON DELETE CASCADE,
  duration_label TEXT NOT NULL,
  duration_months INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- pricing_plans table (Pro, Business, Enterprise per kategori + durasi)
CREATE TABLE pricing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pricing_page_id UUID NOT NULL REFERENCES pricing_pages(id) ON DELETE CASCADE,
  pricing_category_id UUID NOT NULL REFERENCES pricing_categories(id) ON DELETE CASCADE,
  pricing_duration_id UUID NOT NULL REFERENCES pricing_durations(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  plan_description TEXT,
  price NUMERIC,
  price_suffix TEXT DEFAULT 'per bulan',
  cta_text TEXT DEFAULT 'Contact us',
  cta_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- pricing_features table (fitur per plan)
CREATE TABLE pricing_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pricing_plan_id UUID NOT NULL REFERENCES pricing_plans(id) ON DELETE CASCADE,
  feature_category_name TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_pricing_pages_slug ON pricing_pages(slug);
CREATE INDEX idx_pricing_pages_status ON pricing_pages(status);
CREATE INDEX idx_pricing_categories_page ON pricing_categories(pricing_page_id);
CREATE INDEX idx_pricing_durations_page ON pricing_durations(pricing_page_id);
CREATE INDEX idx_pricing_plans_page ON pricing_plans(pricing_page_id);
CREATE INDEX idx_pricing_plans_category ON pricing_plans(pricing_category_id);
CREATE INDEX idx_pricing_plans_duration ON pricing_plans(pricing_duration_id);
CREATE INDEX idx_pricing_features_plan ON pricing_features(pricing_plan_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to pricing_pages
CREATE TRIGGER update_pricing_pages_updated_at
  BEFORE UPDATE ON pricing_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) policies
ALTER TABLE pricing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_durations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_features ENABLE ROW LEVEL SECURITY;

-- Allow public read access for published pages
CREATE POLICY "Allow public read for published pages"
  ON pricing_pages FOR SELECT
  USING (status = 'published');

CREATE POLICY "Allow public read categories for published pages"
  ON pricing_categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pricing_pages
      WHERE pricing_pages.id = pricing_categories.pricing_page_id
      AND pricing_pages.status = 'published'
    )
  );

CREATE POLICY "Allow public read durations for published pages"
  ON pricing_durations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pricing_pages
      WHERE pricing_pages.id = pricing_durations.pricing_page_id
      AND pricing_pages.status = 'published'
    )
  );

CREATE POLICY "Allow public read plans for published pages"
  ON pricing_plans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pricing_pages
      WHERE pricing_pages.id = pricing_plans.pricing_page_id
      AND pricing_pages.status = 'published'
    )
  );

CREATE POLICY "Allow public read features for published pages"
  ON pricing_features FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pricing_plans
      JOIN pricing_pages ON pricing_pages.id = pricing_plans.pricing_page_id
      WHERE pricing_plans.id = pricing_features.pricing_plan_id
      AND pricing_pages.status = 'published'
    )
  );

-- Allow authenticated users full access (for dashboard)
CREATE POLICY "Allow authenticated full access to pricing_pages"
  ON pricing_pages FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated full access to pricing_categories"
  ON pricing_categories FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated full access to pricing_durations"
  ON pricing_durations FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated full access to pricing_plans"
  ON pricing_plans FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated full access to pricing_features"
  ON pricing_features FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
