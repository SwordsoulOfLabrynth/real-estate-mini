-- Real Estate Intelligence Map - Supabase Database Schema
-- Version 1.0 (PostgreSQL + PostGIS)

-- 1. Enable PostGIS Extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Profiles Table (sync with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'agent', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('sale', 'rent')),
  property_type TEXT NOT NULL CHECK (property_type IN ('house', 'apartment', 'condo', 'land', 'townhouse')),
  price NUMERIC(15, 2) NOT NULL,
  currency TEXT DEFAULT 'MMK' CHECK (currency IN ('MMK', 'USD')),
  area_sqft NUMERIC(10, 2) NOT NULL,
  price_per_sqft NUMERIC(15, 2) GENERATED ALWAYS AS (
    CASE WHEN area_sqft > 0 THEN ROUND(price / area_sqft, 2) ELSE 0 END
  ) STORED,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  parking INTEGER DEFAULT 0,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location GEOMETRY(Point, 4326) GENERATED ALWAYS AS (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
  ) STORED,
  address TEXT NOT NULL,
  township TEXT NOT NULL,
  city TEXT NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_verified BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'under_offer', 'sold')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Facilities Table
CREATE TABLE IF NOT EXISTS public.facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('school', 'hospital', 'market', 'bank', 'bus_stop', 'park')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location GEOMETRY(Point, 4326) GENERATED ALWAYS AS (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
  ) STORED,
  address TEXT,
  township TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, property_id)
);

-- 6. Spatial & Filtering Indexes
CREATE INDEX IF NOT EXISTS idx_properties_location ON public.properties USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_facilities_location ON public.facilities USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties (status);
CREATE INDEX IF NOT EXISTS idx_properties_township ON public.properties (township);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON public.properties (listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON public.properties (property_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties (price);

-- 7. Row Level Security (RLS)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Properties Policies
CREATE POLICY "Public users can view published properties" 
  ON public.properties FOR SELECT 
  USING (status IN ('available', 'under_offer'));

CREATE POLICY "Admins have full access to properties" 
  ON public.properties FOR ALL 
  TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Facilities Policies
CREATE POLICY "Public users can view facilities" 
  ON public.facilities FOR SELECT 
  USING (true);

CREATE POLICY "Admins have full access to facilities" 
  ON public.facilities FOR ALL 
  TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Favorites Policies
CREATE POLICY "Users can view their own favorites" 
  ON public.favorites FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Users can add favorites" 
  ON public.favorites FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove their own favorites" 
  ON public.favorites FOR DELETE 
  TO authenticated 
  USING (user_id = auth.uid());

-- Profiles Policies
CREATE POLICY "Users can view public profiles" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  TO authenticated 
  USING (id = auth.uid());

-- 8. Spatial RPC Functions

-- Get properties inside viewport bounding box
CREATE OR REPLACE FUNCTION public.get_properties_in_view(
  min_lat DOUBLE PRECISION,
  min_lng DOUBLE PRECISION,
  max_lat DOUBLE PRECISION,
  max_lng DOUBLE PRECISION
)
RETURNS SETOF public.properties
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM public.properties
  WHERE status IN ('available', 'under_offer')
    AND location && ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326);
$$;

-- Find nearby facilities within radius (meters)
CREATE OR REPLACE FUNCTION public.get_nearby_facilities(
  center_lat DOUBLE PRECISION,
  center_lng DOUBLE PRECISION,
  radius_meters DOUBLE PRECISION
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  type TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  address TEXT,
  township TEXT,
  distance_meters DOUBLE PRECISION
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    f.id,
    f.name,
    f.type,
    f.latitude,
    f.longitude,
    f.address,
    f.township,
    ST_Distance(
      f.location::geography,
      ST_SetSRID(ST_MakePoint(center_lng, center_lat), 4326)::geography
    ) AS distance_meters
  FROM public.facilities f
  WHERE ST_DWithin(
    f.location::geography,
    ST_SetSRID(ST_MakePoint(center_lng, center_lat), 4326)::geography,
    radius_meters
  )
  ORDER BY distance_meters ASC;
$$;
