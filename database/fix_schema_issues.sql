-- Fix database schema issues
-- Execute this in Supabase SQL Editor

-- Add missing releaseDate column if it doesn't exist (both snake_case and camelCase)
DO $$ 
BEGIN
    -- Check for snake_case version
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'pokemon_sets' 
        AND column_name = 'release_date'
    ) THEN
        -- Check for camelCase version
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'pokemon_sets' 
            AND column_name = 'releaseDate'
        ) THEN
            ALTER TABLE public.pokemon_sets ADD COLUMN "releaseDate" DATE;
        END IF;
    END IF;
END $$;

-- Update any existing records that might have null releaseDate
UPDATE public.pokemon_sets 
SET "releaseDate" = '2000-01-01'::DATE 
WHERE "releaseDate" IS NULL;

-- Also handle snake_case if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'pokemon_sets' 
        AND column_name = 'release_date'
    ) THEN
        UPDATE public.pokemon_sets 
        SET release_date = '2000-01-01'::DATE 
        WHERE release_date IS NULL;
    END IF;
END $$;

-- Ensure we have proper indexes
CREATE INDEX IF NOT EXISTS idx_pokemon_sets_id ON public.pokemon_sets(id);
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_id ON public.pokemon_cards(id);
CREATE INDEX IF NOT EXISTS idx_pokemon_cards_set_id ON public.pokemon_cards(set_id);
