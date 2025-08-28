/**
 * Type definitions for the Pokemon Card Scanner app
 */

// Pokemon TCG API types
export interface PokemonCard {
  id: string
  name: string
  supertype: string
  subtypes?: string[]
  level?: string
  hp?: number
  types?: string[]
  evolvesFrom?: string
  evolvesTo?: string[]
  rules?: string[]
  abilities?: Ability[]
  attacks?: Attack[]
  weaknesses?: Weakness[]
  resistances?: Resistance[]
  retreatCost?: string[]
  convertedRetreatCost?: number
  set: {
    id: string
    name: string
    series: string
    printedTotal: number
    total: number
    legalities: any
    ptcgoCode?: string
    releaseDate: string
    updatedAt: string
    images: {
      symbol: string
      logo: string
    }
  }
  number: string
  artist?: string
  rarity: string
  flavorText?: string
  nationalPokedexNumbers?: number[]
  legalities: any
  images: {
    small: string
    large: string
  }
  tcgplayer?: any
  cardmarket?: any
}

export interface Ability {
  name: string
  text: string
  type: string
}

export interface Attack {
  name: string
  cost: string[]
  convertedEnergyCost: number
  damage: string
  text: string
}

export interface Weakness {
  type: string
  value: string
}

export interface Resistance {
  type: string
  value: string
}

// Legacy database types (keeping for backward compatibility)
export interface LegacyPokemonCard {
  id: string
  name: string
  set_name: string
  set_id: string
  number: string
  rarity: string
  artist?: string
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
  condition: CardCondition
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
  condition: CardCondition
  price: number
  quantity: number
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Card conditions
export type CardCondition =
  | 'mint'
  | 'near_mint'
  | 'excellent'
  | 'good'
  | 'light_played'
  | 'played'
  | 'poor'

// Card rarities
export type CardRarity =
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Rare Holo'
  | 'Ultra Rare'
  | 'Secret Rare'
  | 'Promo'

// Price tracking platforms
export type PricePlatform = 'ebay' | 'cardmarket' | 'tcgplayer' | 'troll_and_toad'

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// Price data
export interface PriceData {
  platform: PricePlatform
  price: number
  condition: string
  url: string
  seller: string
  shipping?: number
  timestamp: Date
}

export interface CardPrices {
  cardId: string
  cardName: string
  prices: PriceData[]
  averagePrice: number
  lowestPrice: number
  highestPrice: number
  lastUpdated: Date
}

// Card recognition
export interface CardRecognitionResult {
  confidence: number
  card: PokemonTCGCard | null
  extractedText: string
  cardName?: string
  setInfo?: string
  cardNumber?: string
}

// Pokemon TCG API types
export interface PokemonTCGCard {
  id: string
  name: string
  supertype: string
  subtypes: string[]
  level?: string
  hp?: string
  types?: string[]
  evolvesFrom?: string
  evolvesTo?: string[]
  rules?: string[]
  attacks?: Attack[]
  weaknesses?: Weakness[]
  resistances?: Resistance[]
  retreatCost?: string[]
  convertedRetreatCost?: number
  set: PokemonSet
  number: string
  artist?: string
  rarity: string
  flavorText?: string
  nationalPokedexNumbers?: number[]
  legalities: Legalities
  images: CardImages
  tcgplayer?: TCGPlayerData
  cardmarket?: CardmarketData
}

export interface Attack {
  name: string
  cost: string[]
  convertedEnergyCost: number
  damage: string
  text: string
}

export interface Weakness {
  type: string
  value: string
}

export interface Resistance {
  type: string
  value: string
}

export interface PokemonSet {
  id: string
  name: string
  series: string
  printedTotal: number
  total: number
  legalities: Legalities
  ptcgoCode?: string
  releaseDate: string
  updatedAt: string
  images: SetImages
}

export interface Legalities {
  unlimited: string
  standard?: string
  expanded?: string
}

export interface CardImages {
  small: string
  large: string
}

export interface SetImages {
  symbol: string
  logo: string
}

export interface TCGPlayerData {
  url: string
  updatedAt: string
  prices?: TCGPlayerPrices
}

export interface TCGPlayerPrices {
  holofoil?: PriceRange
  reverseHolofoil?: PriceRange
  normal?: PriceRange
  '1stEditionHolofoil'?: PriceRange
}

export interface PriceRange {
  low: number
  mid: number
  high: number
  market: number
  directLow?: number
}

export interface CardmarketData {
  url: string
  updatedAt: string
  prices: CardmarketPrices
}

export interface CardmarketPrices {
  averageSellPrice: number
  lowPrice: number
  trendPrice: number
  germanProLow: number
  suggestedPrice: number
  reverseHoloSell?: number
  reverseHoloLow?: number
  reverseHoloTrend?: number
  lowPriceExPlus: number
  avg1: number
  avg7: number
  avg30: number
  reverseHoloAvg1?: number
  reverseHoloAvg7?: number
  reverseHoloAvg30?: number
}

// User types
export interface User {
  id: string
  email: string
  username?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface UserProfile extends User {
  collection_count: number
  wishlist_count: number
  watching_count: number
  total_collection_value: number
}

// Search and filter types
export interface CardSearchFilters {
  name?: string
  set?: string
  rarity?: CardRarity[]
  type?: string[]
  minPrice?: number
  maxPrice?: number
  condition?: CardCondition[]
  inCollection?: boolean
  inWishlist?: boolean
  isWatching?: boolean
}

export interface SearchResult<T> {
  items: T[]
  total: number
  hasMore: boolean
}

// Collection statistics
export interface CollectionStats {
  totalCards: number
  totalValue: number
  cardsBySet: Record<string, number>
  cardsByRarity: Record<string, number>
  cardsByCondition: Record<string, number>
  recentAdditions: PokemonCard[]
  mostValuableCards: PokemonCard[]
}

// Wishlist and watching
export interface WishlistItem {
  id: string
  card: PokemonCard
  targetPrice?: number
  notes?: string
  created_at: string
}

export interface WatchingItem {
  id: string
  card: PokemonCard
  alertPrice?: number
  priceHistory: PriceHistory[]
  created_at: string
}

export interface PriceHistory {
  date: string
  price: number
  platform: PricePlatform
}

// Notification types
export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  data?: any
  read: boolean
  created_at: string
}

export type NotificationType =
  | 'price_alert'
  | 'new_card_added'
  | 'collection_milestone'
  | 'marketplace_sale'
  | 'marketplace_purchase'

// App configuration
export interface AppConfig {
  features: {
    scanner: boolean
    collection: boolean
    marketplace: boolean
    priceTracking: boolean
    notifications: boolean
  }
  limits: {
    maxCollectionSize: number
    maxWishlistSize: number
    maxWatchingSize: number
    maxPriceAlerts: number
  }
  pricing: {
    defaultCurrency: string
    supportedCurrencies: string[]
  }
}

// Form types
export interface CollectionForm {
  cardId: string
  condition: CardCondition
  quantity: number
  purchasePrice?: number
  notes?: string
}

export interface WishlistForm {
  cardId: string
  targetPrice?: number
  notes?: string
}

export interface PriceAlertForm {
  cardId: string
  targetPrice: number
}

// Theme types
export interface ThemeColors {
  primary: string
  primaryDark: string
  secondary: string
  success: string
  danger: string
  warning: string
  info: string
  white: string
  black: string
  gray50: string
  gray100: string
  gray200: string
  gray300: string
  gray400: string
  gray500: string
  gray600: string
  gray700: string
  gray800: string
  gray900: string
  pokemonRed: string
  pokemonBlue: string
  pokemonYellow: string
  common: string
  uncommon: string
  rare: string
  ultraRare: string
  secretRare: string
  background: string
  backgroundDark: string
  surface: string
  surfaceDark: string
}

export interface Theme {
  colors: ThemeColors
  fonts: {
    primary: string
    heading: string
    mono: string
  }
  fontSizes: Record<string, string>
  fontWeights: Record<string, number>
  lineHeights: Record<string, number>
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  shadows: Record<string, string>
  transitions: Record<string, string>
  breakpoints: Record<string, string>
  zIndex: Record<string, number>
}
