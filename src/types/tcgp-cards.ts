// Interfacce per il database Pokemon TCG Pocket
export interface TCGPAttackCost {
  colorless?: number
  grass?: number
  fire?: number
  water?: number
  lightning?: number
  psychic?: number
  fighting?: number
  darkness?: number
  metal?: number
}

export interface TCGPAttack {
  name: string
  cost: TCGPAttackCost
  damage: number
  effect: string | null
}

export interface TCGPCard {
  name: string
  type: string
  hp: number
  weakness: string | null
  resistance?: string | null
  attacks: TCGPAttack[]
  retreat_cost: number
  stage: 'Basic' | 'Stage 1' | 'Stage 2' | 'ex'
  effect: string | null
  rarity?: string
  set?: string
  evolves_from?: string
}

// Interfaccia per i risultati della ricerca ibrida
export interface HybridSearchResult {
  success: boolean
  cards: unknown[] // PokemonTCGCard[] dal servizio esistente
  totalCount: number
  source: 'local-database' | 'pokemon-tcg-api-fallback'
  query: string
  processingTime: number
}
