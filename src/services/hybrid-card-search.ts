import { PokemonTCGCard, SearchResult } from './card-search'
import { TCGPCard, TCGPAttackCost } from '../types/tcgp-cards'
import pokemonTCGPCards from '../data/pokemon-tcgp-cards.json'

export class HybridCardSearchService {
  private localCards: TCGPCard[] = pokemonTCGPCards as TCGPCard[]

  /**
   * Ricerca ibrida: prima locale, poi API
   */
  async hybridSearch(pokemonName: string, setId?: string): Promise<SearchResult> {
    const startTime = performance.now()

    // STEP 1: Ricerca locale (veloce)
    console.log('🔍 [HYBRID] Ricerca locale per:', pokemonName)
    const localResults = this.searchLocal(pokemonName, setId)

    if (localResults.length > 0) {
      console.log('✅ [HYBRID] Trovate', localResults.length, 'carte locali')
      return {
        success: true,
        cards: localResults.map(card => this.convertToTCGFormat(card)),
        totalCount: localResults.length,
        query: pokemonName,
        processingTime: performance.now() - startTime,
        source: 'local-database',
      }
    }

    // STEP 2: Fallback API (completo)
    console.log('🌐 [HYBRID] Fallback su API Pokemon TCG')
    const { cardSearchService } = await import('./card-search')
    const apiResult = await cardSearchService.smartSearch(pokemonName, setId)

    return apiResult
  }

  /**
   * Ricerca nel database locale
   */
  private searchLocal(pokemonName: string, _setId?: string): TCGPCard[] {
    return this.localCards.filter(card => {
      const nameMatch = card.name.toLowerCase().includes(pokemonName.toLowerCase())
      // Il database locale non ha set ID chiari, quindi per ora ignoriamo il filtro setId
      return nameMatch
    })
  }

  /**
   * Converte formato TCGP in formato Pokemon TCG API
   */
  private convertToTCGFormat(tcgpCard: TCGPCard): PokemonTCGCard {
    // Genera un ID unico basato sul nome
    const cardId = `tcgp-${tcgpCard.name.toLowerCase().replace(/\s+/g, '-')}-${tcgpCard.stage.toLowerCase()}`

    return {
      id: cardId,
      name: tcgpCard.name,
      supertype: 'Pokémon',
      subtypes: [tcgpCard.stage],
      hp: tcgpCard.hp?.toString() || '',
      types: tcgpCard.type ? [tcgpCard.type] : [],
      attacks:
        tcgpCard.attacks?.map(attack => ({
          name: attack.name,
          cost: this.convertAttackCost(attack.cost),
          convertedEnergyCost: this.calculateEnergyCost(attack.cost),
          damage: attack.damage?.toString() || '',
          text: attack.effect || '',
        })) || [],
      weaknesses: tcgpCard.weakness
        ? [
            {
              type: tcgpCard.weakness,
              value: '×2',
            },
          ]
        : undefined,
      resistances: tcgpCard.resistance
        ? [
            {
              type: tcgpCard.resistance,
              value: '-20',
            },
          ]
        : undefined,
      retreatCost: Array(tcgpCard.retreat_cost || 0).fill('Colorless'),
      rarity: tcgpCard.rarity || 'Common',
      legalities: {
        unlimited: 'Legal',
      },
      set: {
        id: 'tcgp-local',
        name: 'Pokemon TCG Pocket (Local DB)',
        series: 'Pokemon TCG Pocket',
        printedTotal: this.localCards.length,
        total: this.localCards.length,
        legalities: {
          unlimited: 'Legal',
        },
        releaseDate: '2024/10/30',
        updatedAt: '2024/10/30',
        images: {
          symbol: '/placeholder-set-symbol.png',
          logo: '/placeholder-set-logo.png',
        },
      },
      number: '1', // Placeholder
      artist: 'Pokemon Company',
      images: {
        small: `/api/card-image/${cardId}?size=small`,
        large: `/api/card-image/${cardId}?size=large`,
      },
      evolvesFrom: tcgpCard.evolves_from,
      rules: tcgpCard.effect ? [tcgpCard.effect] : undefined,
    }
  }

  /**
   * Converte il costo degli attacchi dal formato TCGP al formato TCG API
   */
  private convertAttackCost(cost: TCGPAttackCost): string[] {
    const energyTypes: string[] = []

    // Mappa i tipi di energia
    const energyMapping = {
      colorless: 'Colorless',
      grass: 'Grass',
      fire: 'Fire',
      water: 'Water',
      lightning: 'Lightning',
      psychic: 'Psychic',
      fighting: 'Fighting',
      darkness: 'Darkness',
      metal: 'Metal',
    }

    for (const [energyType, count] of Object.entries(cost)) {
      const tcgEnergyType = energyMapping[energyType as keyof typeof energyMapping]
      if (tcgEnergyType && count) {
        for (let i = 0; i < count; i++) {
          energyTypes.push(tcgEnergyType)
        }
      }
    }

    return energyTypes
  }

  /**
   * Calcola il costo totale di energia convertita
   */
  private calculateEnergyCost(cost: TCGPAttackCost): number {
    return Object.values(cost).reduce((total, count) => total + (count || 0), 0)
  }

  /**
   * Statistiche database locale
   */
  getLocalStats() {
    const uniqueNames = [...new Set(this.localCards.map(c => c.name))]
    const uniqueTypes = [...new Set(this.localCards.map(c => c.type))]
    const stages = [...new Set(this.localCards.map(c => c.stage))]

    return {
      totalCards: this.localCards.length,
      uniquePokemon: uniqueNames.length,
      types: uniqueTypes,
      stages: stages,
      averageHP: Math.round(
        this.localCards.reduce((sum, card) => sum + (card.hp || 0), 0) / this.localCards.length
      ),
      cardsWithAttacks: this.localCards.filter(card => card.attacks && card.attacks.length > 0)
        .length,
    }
  }

  /**
   * Ricerca suggerimenti per autocomplete
   */
  getNameSuggestions(query: string, limit = 10): string[] {
    if (query.length < 2) return []

    const suggestions = this.localCards
      .filter(card => card.name.toLowerCase().includes(query.toLowerCase()))
      .map(card => card.name)
      .filter((name, index, arr) => arr.indexOf(name) === index) // Rimuovi duplicati
      .slice(0, limit)

    return suggestions
  }
}

export const hybridCardSearchService = new HybridCardSearchService()
