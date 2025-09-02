import axios from 'axios'
import { SearchResult } from './card-search'

export class PopularCardsService {
  private baseURL = 'https://api.pokemontcg.io/v2'

  /**
   * Recupera carte rare e di valore (simula "popolarità")
   */
  async getPopularCards(): Promise<SearchResult> {
    const startTime = Date.now()
    console.log('🔥 [POPULAR CARDS] Recupero carte popolari...')

    try {
      // Usa l'API route per evitare CORS
      const queries = [
        // Carte Ultra Rare e Secret Rare
        'rarity:"Ultra Rare" OR rarity:"Secret Rare"',
        // Carte con prezzo elevato
        'tcgplayer.prices.holofoil.market:[20 TO *]',
        // Pokemon leggendari/speciali
        'name:"*ex" OR name:"*GX" OR name:"*V" OR name:"*VMAX"',
      ]

      // Combina le query per ottenere carte "popolari"
      const combinedQuery = `(${queries.join(' OR ')}) AND hp:[100 TO *]`

      const url = `/api/pokemon-tcg?q=${encodeURIComponent(combinedQuery)}&pageSize=12&orderBy=-set.releaseDate`
      console.log('🔗 [POPULAR CARDS] API Route URL:', url)

      const response = await axios.get(url)
      const processingTime = Date.now() - startTime

      console.log('✅ [POPULAR CARDS] Carte popolari recuperate in', processingTime + 'ms')
      console.log('📊 [POPULAR CARDS] Risultato:', response.data)

      return {
        success: true,
        cards: response.data.data || [],
        totalCount: response.data.totalCount || 0,
        source: 'pokemon-tcg-api',
        query: 'popular-cards',
        processingTime,
      }
    } catch (error) {
      console.error('❌ [POPULAR CARDS] Errore:', error)

      return {
        success: false,
        cards: [],
        totalCount: 0,
        source: 'pokemon-tcg-api',
        query: 'popular-cards',
        processingTime: Date.now() - startTime,
      }
    }
  }

  /**
   * Recupera carte rare per rarità
   */
  async getRareCards(): Promise<SearchResult> {
    const startTime = Date.now()

    try {
      const query = 'rarity:"Rare Holo" OR rarity:"Ultra Rare" OR rarity:"Secret Rare"'
      const url = `/api/pokemon-tcg?q=${encodeURIComponent(query)}&pageSize=10&orderBy=-set.releaseDate`

      const response = await axios.get(url)
      const processingTime = Date.now() - startTime

      return {
        success: true,
        cards: response.data.data || [],
        totalCount: response.data.totalCount || 0,
        source: 'pokemon-tcg-api',
        query: 'rare-cards',
        processingTime,
      }
    } catch (error) {
      console.error('❌ [RARE CARDS] Errore:', error)
      return {
        success: false,
        cards: [],
        totalCount: 0,
        source: 'pokemon-tcg-api',
        query: 'rare-cards',
        processingTime: Date.now() - startTime,
      }
    }
  }

  /**
   * Recupera carte recenti
   */
  async getRecentCards(): Promise<SearchResult> {
    const startTime = Date.now()

    try {
      const currentYear = new Date().getFullYear()
      const query = `set.releaseDate:[${currentYear}-01-01 TO *]`
      const url = `/api/pokemon-tcg?q=${encodeURIComponent(query)}&pageSize=10&orderBy=-set.releaseDate`

      const response = await axios.get(url)
      const processingTime = Date.now() - startTime

      return {
        success: true,
        cards: response.data.data || [],
        totalCount: response.data.totalCount || 0,
        source: 'pokemon-tcg-api',
        query: 'recent-cards',
        processingTime,
      }
    } catch (error) {
      console.error('❌ [RECENT CARDS] Errore:', error)
      return {
        success: false,
        cards: [],
        totalCount: 0,
        source: 'pokemon-tcg-api',
        query: 'recent-cards',
        processingTime: Date.now() - startTime,
      }
    }
  }
}
