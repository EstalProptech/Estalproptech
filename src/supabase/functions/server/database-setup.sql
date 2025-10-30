-- KLZ PropTech Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- ============================================
-- IMPORTANT NOTE: USER PROFILES
-- ============================================
-- The KLZ PropTech app now uses the KV store (kv_store_96250128 table) to store user profiles.
-- This eliminates the need for a separate user_profiles table and simplifies the setup process.
-- 
-- User profiles are automatically created when users register and are stored with the key format:
-- "user_profile:{user_id}"
--
-- If you already have a user_profiles table from a previous setup, you can keep it or remove it.
-- The app will work either way, but new registrations will use the KV store.
--
-- ============================================

-- ============================================
-- 2. PROPERTIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Rented', 'Vacant', 'Under Maintenance')),
  rent NUMERIC(10, 2) DEFAULT 0,
  occupancy INTEGER DEFAULT 0 CHECK (occupancy >= 0 AND occupancy <= 100),
  owner_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. FINANCIAL REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS financial_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  revenue NUMERIC(12, 2) DEFAULT 0,
  expenses NUMERIC(12, 2) DEFAULT 0,
  profit NUMERIC(12, 2) GENERATED ALWAYS AS (revenue - expenses) STORED,
  roi NUMERIC(5, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(month, year)
);

-- ============================================
-- 4. MAINTENANCE REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  technician TEXT,
  status TEXT NOT NULL CHECK (status IN ('New', 'In Progress', 'Completed')),
  cost NUMERIC(10, 2) DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_maintenance_property ON maintenance_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_priority ON maintenance_requests(priority);
CREATE INDEX IF NOT EXISTS idx_maintenance_property_status ON maintenance_requests(property_id, status);
CREATE INDEX IF NOT EXISTS idx_financial_reports_date ON financial_reports(year, month);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Properties Policies
CREATE POLICY "Admins can view all properties"
  ON properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Owners can view their properties"
  ON properties FOR SELECT
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Accountants can view all properties"
  ON properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'accountant')
    )
  );

CREATE POLICY "Admins can insert properties"
  ON properties FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update properties"
  ON properties FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Financial Reports Policies
CREATE POLICY "Admins and Accountants can view financial reports"
  ON financial_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'accountant')
    )
  );

CREATE POLICY "Admins and Accountants can insert financial reports"
  ON financial_reports FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'accountant')
    )
  );

-- Maintenance Requests Policies
CREATE POLICY "All authenticated users can view maintenance requests"
  ON maintenance_requests FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "All authenticated users can insert maintenance requests"
  ON maintenance_requests FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "All authenticated users can update maintenance requests"
  ON maintenance_requests FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- ============================================
-- 7. TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_reports_updated_at
  BEFORE UPDATE ON financial_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_requests_updated_at
  BEFORE UPDATE ON maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. SEED DATA FOR TESTING
-- ============================================

-- NOTE: To create test users with login credentials, follow these steps:
-- 1. Use the Register page in the app to create users with email/password
-- 2. Or use the Supabase Dashboard -> Authentication -> Users -> "Add user"
-- 3. Or run the SQL commands in the "SQL_QUICK_REFERENCE.md" file

-- For quick testing, here are some example credentials you can create:
-- Admin: admin@klzproptech.com / AdminPass123!
-- Owner: owner@klzproptech.com / OwnerPass123!
-- Accountant: accountant@klzproptech.com / AccountPass123!

-- Insert sample properties
INSERT INTO properties (name, location, status, rent, occupancy, image_url) VALUES
('Skyline Tower', 'North Riyadh', 'Rented', 85000, 100, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'),
('Garden Villa 12', 'West Riyadh', 'Rented', 48000, 100, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'),
('Downtown Loft', 'Central Riyadh', 'Under Maintenance', 32000, 0, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'),
('Riverside Apartments', 'East Riyadh', 'Vacant', 0, 0, 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=400'),
('Palm Residences', 'North Riyadh', 'Rented', 62000, 100, 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400')
ON CONFLICT DO NOTHING;

-- Insert sample financial reports
INSERT INTO financial_reports (month, year, revenue, expenses, roi) VALUES
('October', 2025, 120000, 50000, 58.33),
('September', 2025, 115000, 48000, 58.26),
('August', 2025, 110000, 52000, 52.73)
ON CONFLICT DO NOTHING;

-- Insert sample maintenance requests
INSERT INTO maintenance_requests (property_id, category, priority, technician, status, cost, description)
SELECT 
  p.id,
  'AC Repair',
  'high',
  'Khaled Ibrahim',
  'In Progress',
  3500,
  'Air conditioning unit needs repair in unit 401'
FROM properties p
WHERE p.name = 'Skyline Tower'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO maintenance_requests (property_id, category, priority, technician, status, cost, description)
SELECT 
  p.id,
  'Plumbing',
  'medium',
  'Ahmed Al-Qahtani',
  'New',
  1200,
  'Kitchen sink leak reported'
FROM properties p
WHERE p.name = 'Garden Villa 12'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- 9. FUNCTIONS FOR DASHBOARD KPIs (Role-Aware)
-- ============================================
CREATE OR REPLACE FUNCTION get_dashboard_kpis()
RETURNS JSON AS $
DECLARE
  user_role TEXT;
  user_id UUID;
  result JSON;
BEGIN
  -- Get current user's ID and role
  user_id := auth.uid();
  
  SELECT role INTO user_role
  FROM user_profiles
  WHERE id = user_id;
  
  -- Return role-specific KPIs
  IF user_role = 'owner' THEN
    -- Owner sees only their properties
    SELECT json_build_object(
      'total_properties', (SELECT COUNT(*) FROM properties WHERE owner_id = user_id),
      'monthly_revenue', (
        SELECT COALESCE(SUM(rent), 0)
        FROM properties
        WHERE owner_id = user_id AND status = 'Rented'
      ),
      'total_expenses', (
        SELECT COALESCE(SUM(cost), 0)
        FROM maintenance_requests mr
        JOIN properties p ON mr.property_id = p.id
        WHERE p.owner_id = user_id
        AND EXTRACT(MONTH FROM mr.created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM mr.created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
      ),
      'active_tenants', (SELECT COUNT(*) FROM properties WHERE owner_id = user_id AND status = 'Rented'),
      'pending_maintenance', (
        SELECT COUNT(*)
        FROM maintenance_requests mr
        JOIN properties p ON mr.property_id = p.id
        WHERE p.owner_id = user_id AND mr.status IN ('New', 'In Progress')
      ),
      'occupancy_rate', (
        SELECT CASE 
          WHEN COUNT(*) = 0 THEN 0 
          ELSE ROUND(AVG(occupancy), 0) 
        END
        FROM properties
        WHERE owner_id = user_id
      )
    ) INTO result;
  ELSE
    -- Admin and Accountant see all data
    SELECT json_build_object(
      'total_properties', (SELECT COUNT(*) FROM properties),
      'monthly_revenue', (
        SELECT COALESCE(SUM(revenue), 0)
        FROM financial_reports
        WHERE year = EXTRACT(YEAR FROM CURRENT_DATE)
        AND month = TO_CHAR(CURRENT_DATE, 'Month')
      ),
      'total_expenses', (
        SELECT COALESCE(SUM(expenses), 0)
        FROM financial_reports
        WHERE year = EXTRACT(YEAR FROM CURRENT_DATE)
        AND month = TO_CHAR(CURRENT_DATE, 'Month')
      ),
      'active_tenants', (SELECT COUNT(*) FROM properties WHERE status = 'Rented'),
      'pending_maintenance', (SELECT COUNT(*) FROM maintenance_requests WHERE status IN ('New', 'In Progress')),
      'occupancy_rate', (
        SELECT CASE 
          WHEN COUNT(*) = 0 THEN 0 
          ELSE ROUND(AVG(occupancy), 0) 
        END
        FROM properties
      )
    ) INTO result;
  END IF;
  
  RETURN result;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_dashboard_kpis() TO authenticated;
