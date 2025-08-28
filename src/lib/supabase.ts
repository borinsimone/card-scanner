import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export interface PokemonCard {
  id: string
  name: string
  set_name: string
  set_id: string
  number: string
  rarity: string
  artist: string
  image_url: string
  small_image_url: string
  market_price?: number
  low_price?: number
  mid_price?: number
  high_price?: number
  created_at: string
  updated_at: string
}

export interface UserCollection {
  id: string
  user_id: string
  card_id: string
  condition: 'mint' | 'near_mint' | 'excellent' | 'good' | 'light_played' | 'played' | 'poor'
  quantity: number
  is_wishlist: boolean
  is_watching: boolean
  purchase_price?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface PriceAlert {
  id: string
  user_id: string
  card_id: string
  target_price: number
  is_active: boolean
  created_at: string
}

export interface MarketplaceListing {
  id: string
  user_id: string
  card_id: string
  condition: string
  price: number
  quantity: number
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}
