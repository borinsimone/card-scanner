-- Pokemon Card Scanner Database Schema
-- Execute this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USER PROFILES TABLE
-- ============================================================================
-- Extends the default auth.users table with app-specific user data
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  favorite_pokemon TEXT,
  collector_since DATE,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- POKEMON SETS TABLE
-- ============================================================================
-- Store Pokemon TCG set information
CREATE TABLE IF NOT EXISTS public.pokemon_sets (
  id TEXT PRIMARY KEY, -- TCG API set id
  name TEXT NOT NULL,
  series TEXT,
  printedTotal INTEGER,
  total INTEGER,
  legalities JSONB,
  ptcgoCode TEXT,
  releaseDate DATE,
  updatedAt TIMESTAMP WITH TIME ZONE,
  images JSONB, -- Store logo and symbol URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- POKEMON CARDS TABLE
-- ============================================================================
-- Store detailed Pokemon card information
CREATE TABLE IF NOT EXISTS public.pokemon_cards (
  id TEXT PRIMARY KEY, -- TCG API card id
  name TEXT NOT NULL,
  supertype TEXT, -- Pokemon, Trainer, Energy
  subtypes TEXT[], -- Basic, Stage 1, etc.
  level TEXT,
  hp INTEGER,
  types TEXT[], -- Fire, Water, etc.
  evolves_from TEXT,
  evolves_to TEXT[],
  rules TEXT[],
  abilities JSONB,
  attacks JSONB,
  weaknesses JSONB,
  resistances JSONB,
  retreat_cost TEXT[],
  converted_retreat_cost INTEGER,
  set_id TEXT REFERENCES pokemon_sets(id),
  number TEXT,
  artist TEXT,
  rarity TEXT,
  flavor_text TEXT,
  national_pokedex_numbers INTEGER[],
  legalities JSONB,
  images JSONB, -- Store small and large image URLs
  tcgplayer JSONB, -- TCGPlayer pricing data
  cardmarket JSONB, -- Cardmarket pricing data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- USER COLLECTIONS TABLE
-- ============================================================================
-- Store user's owned cards
CREATE TABLE IF NOT EXISTS public.user_collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  card_id TEXT REFERENCES public.pokemon_cards(id),
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  condition TEXT DEFAULT 'Near Mint', -- Near Mint, Lightly Played, etc.
  language TEXT DEFAULT 'en',
  is_first_edition BOOLEAN DEFAULT FALSE,
  is_shadowless BOOLEAN DEFAULT FALSE,
  is_reverse_holo BOOLEAN DEFAULT FALSE,
  is_holo BOOLEAN DEFAULT FALSE,
  purchase_price DECIMAL(10,2),
  purchase_date DATE,
  purchase_location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, card_id, condition, language, is_first_edition, is_shadowless, is_reverse_holo)
);

-- ============================================================================
-- USER WISHLISTS TABLE
-- ============================================================================
-- Store user's wanted cards
CREATE TABLE IF NOT EXISTS public.user_wishlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  card_id TEXT REFERENCES public.pokemon_cards(id),
  priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5), -- 1=Low, 5=High
  max_price DECIMAL(10,2), -- Maximum price willing to pay
  preferred_condition TEXT DEFAULT 'Near Mint',
  preferred_language TEXT DEFAULT 'en',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

-- ============================================================================
-- USER WATCHLISTS TABLE
-- ============================================================================
-- Store cards user is watching for price changes
CREATE TABLE IF NOT EXISTS public.user_watchlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  card_id TEXT REFERENCES public.pokemon_cards(id),
  target_price DECIMAL(10,2), -- Price alert threshold
  condition TEXT DEFAULT 'Near Mint',
  is_active BOOLEAN DEFAULT TRUE,
  last_notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, card_id, condition)
);

-- ============================================================================
-- PRICE HISTORY TABLE
-- ============================================================================
-- Store historical pricing data
CREATE TABLE IF NOT EXISTS public.price_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  card_id TEXT REFERENCES public.pokemon_cards(id),
  platform TEXT NOT NULL, -- ebay, cardmarket, tcgplayer
  condition TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  listing_url TEXT,
  seller_name TEXT,
  shipping_cost DECIMAL(10,2),
  date_recorded TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SCAN HISTORY TABLE
-- ============================================================================
-- Store user's card scan history
CREATE TABLE IF NOT EXISTS public.scan_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  card_id TEXT REFERENCES public.pokemon_cards(id),
  scan_method TEXT, -- camera, upload, manual
  confidence_score DECIMAL(3,2), -- OCR confidence 0.00-1.00
  detected_text TEXT, -- Raw OCR text
  scan_image_url TEXT, -- Uploaded image URL
  was_successful BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
-- Store user notifications (price alerts, etc.)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- price_alert, wishlist_available, etc.
  title TEXT NOT NULL,
  message TEXT,
  card_id TEXT REFERENCES public.pokemon_cards(id),
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB, -- Additional data like prices, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User collections indexes
CREATE INDEX IF NOT EXISTS idx_user_collections_user_id ON public.user_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_collections_card_id ON public.user_collections(card_id);

-- Wishlist indexes
CREATE INDEX IF NOT EXISTS idx_user_wishlists_user_id ON public.user_wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_user_wishlists_card_id ON public.user_wishlists(card_id);

-- Watchlist indexes
CREATE INDEX IF NOT EXISTS idx_user_watchlists_user_id ON public.user_watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_user_watchlists_active ON public.user_watchlists(is_active);

-- Price history indexes
CREATE INDEX IF NOT EXISTS idx_price_history_card_id ON public.price_history(card_id);
CREATE INDEX IF NOT EXISTS idx_price_history_date ON public.price_history(date_recorded);
CREATE INDEX IF NOT EXISTS idx_price_history_platform ON public.price_history(platform);

-- Scan history indexes
CREATE INDEX IF NOT EXISTS idx_scan_history_user_id ON public.scan_history(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_date ON public.scan_history(created_at);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read);

-- Pokemon cards indexes
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_name ON public.pokemon_cards(name);
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_set_id ON public.pokemon_cards(set_id);
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_rarity ON public.pokemon_cards(rarity);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User collections policies
CREATE POLICY "Users can manage own collection" ON public.user_collections
  FOR ALL USING (auth.uid() = user_id);

-- User wishlists policies
CREATE POLICY "Users can manage own wishlist" ON public.user_wishlists
  FOR ALL USING (auth.uid() = user_id);

-- User watchlists policies
CREATE POLICY "Users can manage own watchlist" ON public.user_watchlists
  FOR ALL USING (auth.uid() = user_id);

-- Scan history policies
CREATE POLICY "Users can view own scan history" ON public.scan_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scan history" ON public.scan_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- Public read access for cards and sets (no auth required)
ALTER TABLE public.pokemon_cards DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pokemon_sets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pokemon_cards_updated_at BEFORE UPDATE ON public.pokemon_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_collections_updated_at BEFORE UPDATE ON public.user_collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_wishlists_updated_at BEFORE UPDATE ON public.user_wishlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_watchlists_updated_at BEFORE UPDATE ON public.user_watchlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Insert some popular Pokemon sets
INSERT INTO public.pokemon_sets (id, name, series, printedTotal, releaseDate) VALUES
  ('base1', 'Base Set', 'Base', 102, '1999-01-09'),
  ('jungle', 'Jungle', 'Base', 64, '1999-06-16'),
  ('fossil', 'Fossil', 'Base', 62, '1999-10-10'),
  ('neo1', 'Neo Genesis', 'Neo', 111, '2000-12-16'),
  ('ex1', 'Ruby & Sapphire', 'EX', 109, '2003-07-18'),
  ('dp1', 'Diamond & Pearl', 'Diamond & Pearl', 130, '2007-05-01'),
  ('bw1', 'Black & White', 'Black & White', 114, '2011-04-25'),
  ('xy1', 'XY', 'XY', 146, '2014-02-05'),
  ('sm1', 'Sun & Moon', 'Sun & Moon', 149, '2017-02-03'),
  ('swsh1', 'Sword & Shield', 'Sword & Shield', 202, '2020-02-07')
ON CONFLICT (id) DO NOTHING;

-- Insert some iconic Pokemon cards
INSERT INTO public.pokemon_cards (id, name, supertype, subtypes, hp, types, set_id, number, rarity, images) VALUES
  ('base1-4', 'Charizard', 'Pokémon', ARRAY['Stage 2'], 120, ARRAY['Fire'], 'base1', '4', 'Rare Holo', '{"small": "https://images.pokemontcg.io/base1/4.png", "large": "https://images.pokemontcg.io/base1/4_hires.png"}'),
  ('base1-25', 'Pikachu', 'Pokémon', ARRAY['Basic'], 40, ARRAY['Lightning'], 'base1', '25', 'Common', '{"small": "https://images.pokemontcg.io/base1/25.png", "large": "https://images.pokemontcg.io/base1/25_hires.png"}'),
  ('jungle-1', 'Clefable', 'Pokémon', ARRAY['Stage 1'], 70, ARRAY['Colorless'], 'jungle', '1', 'Rare Holo', '{"small": "https://images.pokemontcg.io/jungle/1.png", "large": "https://images.pokemontcg.io/jungle/1_hires.png"}'),
  ('neo1-1', 'Ampharos', 'Pokémon', ARRAY['Stage 2'], 90, ARRAY['Lightning'], 'neo1', '1', 'Rare Holo', '{"small": "https://images.pokemontcg.io/neo1/1.png", "large": "https://images.pokemontcg.io/neo1/1_hires.png"}')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- FUNCTIONS FOR APP LOGIC
-- ============================================================================

-- Function to get user collection stats
CREATE OR REPLACE FUNCTION get_user_collection_stats(user_uuid UUID)
RETURNS TABLE (
  total_cards BIGINT,
  unique_cards BIGINT,
  total_value DECIMAL,
  sets_collected BIGINT,
  completion_percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(uc.quantity), 0) as total_cards,
    COUNT(DISTINCT uc.card_id) as unique_cards,
    COALESCE(SUM(uc.purchase_price * uc.quantity), 0) as total_value,
    COUNT(DISTINCT pc.set_id) as sets_collected,
    CASE 
      WHEN COUNT(DISTINCT pc.set_id) > 0 
      THEN ROUND((COUNT(DISTINCT uc.card_id)::DECIMAL / COUNT(DISTINCT pc.id)) * 100, 2)
      ELSE 0
    END as completion_percentage
  FROM public.user_collections uc
  JOIN public.pokemon_cards pc ON uc.card_id = pc.id
  WHERE uc.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add card to collection
CREATE OR REPLACE FUNCTION add_to_collection(
  user_uuid UUID,
  card_uuid TEXT,
  card_quantity INTEGER DEFAULT 1,
  card_condition TEXT DEFAULT 'Near Mint',
  card_language TEXT DEFAULT 'en'
)
RETURNS UUID AS $$
DECLARE
  collection_id UUID;
BEGIN
  INSERT INTO public.user_collections (
    user_id, card_id, quantity, condition, language
  ) VALUES (
    user_uuid, card_uuid, card_quantity, card_condition, card_language
  )
  ON CONFLICT (user_id, card_id, condition, language, is_first_edition, is_shadowless, is_reverse_holo)
  DO UPDATE SET 
    quantity = user_collections.quantity + card_quantity,
    updated_at = NOW()
  RETURNING id INTO collection_id;
  
  RETURN collection_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
