-- Add album tables to the existing schema

-- User Albums Table
CREATE TABLE IF NOT EXISTS public.user_albums (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  cover_card_id TEXT, -- Reference to a card that represents the album
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Album Cards Junction Table  
CREATE TABLE IF NOT EXISTS public.album_cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  album_id UUID REFERENCES public.user_albums(id) ON DELETE CASCADE NOT NULL,
  card_id TEXT NOT NULL, -- This should match pokemon_cards.id
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  UNIQUE(album_id, card_id) -- Prevent duplicate cards in same album
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_albums_user_id ON public.user_albums(user_id);
CREATE INDEX IF NOT EXISTS idx_user_albums_created_at ON public.user_albums(created_at);
CREATE INDEX IF NOT EXISTS idx_album_cards_album_id ON public.album_cards(album_id);
CREATE INDEX IF NOT EXISTS idx_album_cards_card_id ON public.album_cards(card_id);

-- RLS Policies for Albums
ALTER TABLE public.user_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_cards ENABLE ROW LEVEL SECURITY;

-- Users can manage their own albums
CREATE POLICY "Users can manage own albums" ON public.user_albums
  FOR ALL USING (auth.uid() = user_id);

-- Users can view public albums
CREATE POLICY "Users can view public albums" ON public.user_albums
  FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);

-- Users can manage album cards for their own albums
CREATE POLICY "Users can manage own album cards" ON public.album_cards
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_albums 
      WHERE id = album_cards.album_id 
      AND user_id = auth.uid()
    )
  );

-- Users can view album cards for public albums or their own albums
CREATE POLICY "Users can view album cards" ON public.album_cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_albums 
      WHERE id = album_cards.album_id 
      AND (user_id = auth.uid() OR is_public = TRUE)
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_albums_updated_at 
  BEFORE UPDATE ON public.user_albums 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Optional: Add some sample albums for testing
-- INSERT INTO public.user_albums (name, description, user_id, is_public) VALUES
-- ('Pikachu Collection', 'All my favorite Pikachu cards', auth.uid(), false),
-- ('Legendary Cards', 'Rare legendary Pokemon cards', auth.uid(), true),
-- ('Eeveelutions', 'Complete Eevee evolution set', auth.uid(), false);
