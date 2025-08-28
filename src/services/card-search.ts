import axios from 'axios'
import pokemonData from '../pokemon.json'

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
  attacks?: Array<{
    name: string
    cost: string[]
    convertedEnergyCost: number
    damage: string
    text: string
  }>
  weaknesses?: Array<{
    type: string
    value: string
  }>
  resistances?: Array<{
    type: string
    value: string
  }>
  retreatCost?: string[]
  convertedRetreatCost?: number
  set: {
    id: string
    name: string
    series: string
    printedTotal: number
    total: number
    legalities: {
      unlimited: string
      standard?: string
      expanded?: string
    }
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
  legalities: {
    unlimited: string
    standard?: string
    expanded?: string
  }
  images: {
    small: string
    large: string
  }
  tcgplayer?: {
    url: string
    updatedAt: string
    prices?: {
      holofoil?: {
        low: number
        mid: number
        high: number
        market: number
        directLow?: number
      }
      reverseHolofoil?: {
        low: number
        mid: number
        high: number
        market: number
        directLow?: number
      }
      normal?: {
        low: number
        mid: number
        high: number
        market: number
        directLow?: number
      }
      '1stEditionHolofoil'?: {
        low: number
        mid: number
        high: number
        market: number
        directLow?: number
      }
    }
  }
  cardmarket?: {
    url: string
    updatedAt: string
    prices: {
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
  }
}

export interface SearchResult {
  success: boolean
  cards: PokemonTCGCard[]
  totalCount: number
  source: 'pokemon-tcg-api' | 'local-database'
  query: string
  processingTime: number
}

export class CardSearchService {
  /**
   * Ricerca carte tramite Pokemon TCG API (usando API route per evitare CORS)
   */
  async searchPokemonTCG(query: string): Promise<SearchResult> {
    const startTime = Date.now()
    console.log('🌐 [POKEMON TCG] Ricerca via API route:', query)

    try {
      const url = `/api/pokemon-tcg?q=${encodeURIComponent(query)}&pageSize=50`
      console.log('🔗 [POKEMON TCG] API Route URL:', url)

      const response = await axios.get(url)

      const processingTime = Date.now() - startTime
      console.log('✅ [POKEMON TCG] Risposta ricevuta in', processingTime + 'ms')
      console.log('📊 [POKEMON TCG] Carte trovate:', response)

      return {
        success: response.data?.success || false,
        cards: response.data?.data || [],
        totalCount: response.data?.totalCount || 0,
        source: 'pokemon-tcg-api',
        query,
        processingTime,
      }
    } catch (error) {
      const processingTime = Date.now() - startTime
      console.error('❌ [POKEMON TCG] Errore API route:', error)

      return {
        success: false,
        cards: [],
        totalCount: 0,
        source: 'pokemon-tcg-api',
        query,
        processingTime,
      }
    }
  }

  /**
   * Ricerca nel database locale Pokemon
   */
  async searchLocalDatabase(query: string): Promise<SearchResult> {
    const startTime = Date.now()
    console.log('🗃️ [LOCAL DB] Ricerca:', query)

    try {
      const queryLower = query.toLowerCase()

      // Filtra Pokemon che matchano il nome
      const matchingPokemon = pokemonData.filter(pokemon => {
        const englishName = pokemon.name.english.toLowerCase()
        const japaneseName = pokemon.name.japanese?.toLowerCase() || ''
        const frenchName = pokemon.name.french?.toLowerCase() || ''

        return (
          englishName.includes(queryLower) ||
          japaneseName.includes(queryLower) ||
          frenchName.includes(queryLower)
        )
      })

      // Converti in formato PokemonTCGCard semplificato
      const cards: PokemonTCGCard[] = matchingPokemon.map(pokemon => ({
        id: `local-${pokemon.id}`,
        name: pokemon.name.english,
        supertype: 'Pokémon',
        subtypes: ['Basic'],
        hp: pokemon.base?.HP?.toString() || '60',
        types: this.mapPokemonTypes(pokemon.type),
        number: pokemon.id.toString(),
        rarity: 'Common',
        artist: 'Ken Sugimori',
        nationalPokedexNumbers: [pokemon.id],
        set: {
          id: 'local-db',
          name: 'Database Locale',
          series: 'Local',
          printedTotal: pokemonData.length,
          total: pokemonData.length,
          legalities: { unlimited: 'Legal' },
          releaseDate: '2024-01-01',
          updatedAt: new Date().toISOString(),
          images: {
            symbol: '',
            logo: '',
          },
        },
        legalities: { unlimited: 'Legal' },
        images: {
          small: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
          large: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
        },
      }))

      const processingTime = Date.now() - startTime
      console.log('✅ [LOCAL DB] Ricerca completata in', processingTime + 'ms')
      console.log('📊 [LOCAL DB] Pokemon trovati:', cards.length)

      return {
        success: true,
        cards,
        totalCount: cards.length,
        source: 'local-database',
        query,
        processingTime,
      }
    } catch (error) {
      const processingTime = Date.now() - startTime
      console.error('❌ [LOCAL DB] Errore:', error)

      return {
        success: false,
        cards: [],
        totalCount: 0,
        source: 'local-database',
        query,
        processingTime,
      }
    }
  }

  /**
   * Ricerca intelligente che prova diverse strategie di ricerca nella Pokemon TCG API
   */
  async smartSearch(cardName: string, setId?: string, cardNumber?: string): Promise<SearchResult> {
    console.log('🧠 [SMART SEARCH] Avvio ricerca intelligente')
    console.log('📝 [SMART SEARCH] Parametri:', { cardName, setId, cardNumber })

    // Strategia 1: Query esatta con tutti i filtri
    if (setId || cardNumber) {
      let tcgQuery = `name:"${cardName}"`

      if (setId) {
        tcgQuery += ` set.id:${setId}`
      }

      if (cardNumber) {
        tcgQuery += ` number:${cardNumber}`
      }

      console.log('🎯 [SMART SEARCH] Tentativo 1: Query esatta')
      const exactResult = await this.searchPokemonTCG(tcgQuery)

      if (exactResult.success && exactResult.cards.length > 0) {
        console.log('✅ [SMART SEARCH] Trovate carte con query esatta')
        return exactResult
      }
    }

    // Strategia 2: Cerca tutte le carte del Pokemon (senza virgolette per più flessibilità)
    console.log('🔍 [SMART SEARCH] Tentativo 2: Cerca tutte le carte del Pokemon')
    const allCardsQuery = `name:${cardName}`
    const allCardsResult = await this.searchPokemonTCG(allCardsQuery)

    if (allCardsResult.success && allCardsResult.cards.length > 0) {
      console.log('✅ [SMART SEARCH] Trovate carte del Pokemon tramite API')
      return allCardsResult
    }

    // Strategia 3: Ricerca parziale (wildcard)
    console.log('� [SMART SEARCH] Tentativo 3: Ricerca con wildcard')
    const wildcardQuery = `name:*${cardName}*`
    const wildcardResult = await this.searchPokemonTCG(wildcardQuery)

    if (wildcardResult.success && wildcardResult.cards.length > 0) {
      console.log('✅ [SMART SEARCH] Trovate carte con ricerca wildcard')
      return wildcardResult
    }

    console.log('❌ [SMART SEARCH] Nessun risultato trovato nella Pokemon TCG API')

    // Nessun risultato trovato
    return {
      success: false,
      cards: [],
      totalCount: 0,
      source: 'pokemon-tcg-api',
      query: `name:${cardName}`,
      processingTime: allCardsResult.processingTime + wildcardResult.processingTime,
    }
  }

  /**
   * Ottieni tutti i nomi Pokemon disponibili per autocomplete
   */
  getAllPokemonNames(): string[] {
    return pokemonData.map(pokemon => pokemon.name.english).sort()
  }

  /**
   * Ottieni informazioni su un Pokemon specifico dal database locale
   */
  getPokemonById(id: number): (typeof pokemonData)[0] | null {
    return pokemonData.find(pokemon => pokemon.id === id) || null
  }

  /**
   * Mappa i tipi Pokemon dal database locale ai tipi TCG
   */
  private mapPokemonTypes(types: string[]): string[] {
    const typeMap: { [key: string]: string } = {
      normal: 'Colorless',
      fire: 'Fire',
      water: 'Water',
      electric: 'Electric',
      grass: 'Grass',
      ice: 'Water',
      fighting: 'Fighting',
      poison: 'Grass',
      ground: 'Fighting',
      flying: 'Colorless',
      psychic: 'Psychic',
      bug: 'Grass',
      rock: 'Fighting',
      ghost: 'Psychic',
      dragon: 'Dragon',
      dark: 'Darkness',
      steel: 'Metal',
      fairy: 'Fairy',
    }

    return types.map(type => typeMap[type.toLowerCase()] || 'Colorless')
  }

  /**
   * Ottieni statistiche del servizio
   */
  getServiceStats(): {
    totalPokemon: number
    availableTypes: string[]
    generationsAvailable: number
  } {
    const types = [...new Set(pokemonData.flatMap(p => p.type))]
    const maxId = Math.max(...pokemonData.map(p => p.id))
    const generations = Math.ceil(maxId / 151) // Approssimativamente

    return {
      totalPokemon: pokemonData.length,
      availableTypes: types,
      generationsAvailable: generations,
    }
  }
}

// Singleton instance
export const cardSearchService = new CardSearchService()
