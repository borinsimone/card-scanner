-- Fix schema inconsistencies for Pokemon Card Scanner
-- Run this in your Supabase SQL Editor

-- First, let's check if the pokemon_sets table exists and its structure
-- If it doesn't have the releaseDate column, we'll add it

-- Add missing columns to pokemon_sets if they don't exist
ALTER TABLE public.pokemon_sets 
  ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT 'Unknown',
  ADD COLUMN IF NOT EXISTS series TEXT,
  ADD COLUMN IF NOT EXISTS printedTotal INTEGER,
  ADD COLUMN IF NOT EXISTS total INTEGER,
  ADD COLUMN IF NOT EXISTS legalities JSONB,
  ADD COLUMN IF NOT EXISTS ptcgoCode TEXT,
  ADD COLUMN IF NOT EXISTS releaseDate DATE,
  ADD COLUMN IF NOT EXISTS updatedAt TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS images JSONB;

-- Add missing columns to pokemon_cards if they don't exist
ALTER TABLE public.pokemon_cards 
  ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT 'Unknown',
  ADD COLUMN IF NOT EXISTS supertype TEXT,
  ADD COLUMN IF NOT EXISTS subtypes TEXT[],
  ADD COLUMN IF NOT EXISTS level TEXT,
  ADD COLUMN IF NOT EXISTS hp TEXT,
  ADD COLUMN IF NOT EXISTS types TEXT[],
  ADD COLUMN IF NOT EXISTS evolves_from TEXT,
  ADD COLUMN IF NOT EXISTS evolves_to TEXT[],
  ADD COLUMN IF NOT EXISTS abilities JSONB,
  ADD COLUMN IF NOT EXISTS attacks JSONB,
  ADD COLUMN IF NOT EXISTS weaknesses JSONB,
  ADD COLUMN IF NOT EXISTS resistances JSONB,
  ADD COLUMN IF NOT EXISTS retreat_cost TEXT[],
  ADD COLUMN IF NOT EXISTS converted_retreat_cost INTEGER,
  ADD COLUMN IF NOT EXISTS set_id TEXT,
  ADD COLUMN IF NOT EXISTS number TEXT,
  ADD COLUMN IF NOT EXISTS artist TEXT,
  ADD COLUMN IF NOT EXISTS rarity TEXT,
  ADD COLUMN IF NOT EXISTS flavor_text TEXT,
  ADD COLUMN IF NOT EXISTS national_pokedex_numbers INTEGER[],
  ADD COLUMN IF NOT EXISTS legalities JSONB,
  ADD COLUMN IF NOT EXISTS regulation_mark TEXT,
  ADD COLUMN IF NOT EXISTS images JSONB,
  ADD COLUMN IF NOT EXISTS tcgplayer JSONB,
  ADD COLUMN IF NOT EXISTS cardmarket JSONB;

-- Add foreign key constraint for set_id if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'pokemon_cards_set_id_fkey'
    ) THEN
        ALTER TABLE public.pokemon_cards 
        ADD CONSTRAINT pokemon_cards_set_id_fkey 
        FOREIGN KEY (set_id) REFERENCES public.pokemon_sets(id);
    END IF;
END $$;

-- Update any existing records to have valid data
UPDATE public.pokemon_sets 
SET name = 'Unknown' 
WHERE name IS NULL;

UPDATE public.pokemon_cards 
SET name = 'Unknown' 
WHERE name IS NULL;

-- Check final structure
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name = 'pokemon_sets' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name = 'pokemon_cards' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
