import { supabase } from '@/lib/supabase'
import { PokemonCard } from '@/types'

export interface CollectionStats {
  totalCards: number
  uniqueCards: number
  totalValue: number
  setsCollected: number
  completionPercentage: number
}

export interface CollectionItem {
  id: string
  card_id: string
  quantity: number
  condition: string
  language: string
  is_first_edition: boolean
  is_shadowless: boolean
  is_reverse_holo: boolean
  is_holo: boolean
  purchase_price?: number
  purchase_date?: string
  purchase_location?: string
  notes?: string
  created_at: string
  pokemon_cards?: PokemonCard
  set_id?: string // Aggiunto per facilitare l'accesso al set_id
}

export interface Album {
  id: string
  name: string
  description?: string
  user_id: string
  is_public: boolean
  cover_card_id?: string
  created_at: string
  updated_at: string
  card_count?: number
}

export interface AlbumCard {
  id: string
  album_id: string
  card_id: string
  added_at: string
  notes?: string
}

export class CollectionService {
  // Ensure user profile exists
  private async ensureUserProfile(user: {
    id: string
    email?: string
    user_metadata?: Record<string, unknown>
  }): Promise<void> {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!existingProfile) {
        // Create profile if it doesn't exist
        const { error } = await supabase.from('user_profiles').insert({
          id: user.id,
          email: user.email,
          created_at: new Date().toISOString(),
        })

        if (error && error.code !== '23505') {
          // Ignore duplicate key error
          console.error('Error creating user profile:', error)
        }
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error)
    }
  }

  // Add card to user's collection
  async addToCollection(
    card: PokemonCard,
    options: {
      quantity?: number
      condition?: string
      language?: string
      isFirstEdition?: boolean
      isShadowless?: boolean
      isReverseHolo?: boolean
      isHolo?: boolean
      purchasePrice?: number
      purchaseDate?: string
      purchaseLocation?: string
      notes?: string
    } = {}
  ): Promise<boolean> {
    try {
      console.log('Starting addToCollection for card:', card.id, card.name)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        console.error('User not authenticated')
        throw new Error('User must be logged in to add cards to collection')
      }

      console.log('User authenticated:', user.id)

      // Ensure user profile exists
      await this.ensureUserProfile(user)

      // Try to ensure the card exists, but don't fail if database access fails
      try {
        await this.ensureCardExists(card)
        console.log('Card exists or was created successfully')
      } catch (cardError) {
        console.warn('Failed to ensure card exists, trying without it:', cardError)

        throw new Error(`Cannot add card to collection: ${cardError.message}`)
      }

      console.log('Adding to collection with RPC call')
      // Use the PostgreSQL function for adding to collection
      const { error } = await supabase.rpc('add_to_collection', {
        user_uuid: user.id,
        card_uuid: card.id,
        card_quantity: options.quantity || 1,
        card_condition: options.condition || 'Near Mint',
        card_language: options.language || 'en',
      })

      if (error) {
        console.error('RPC add_to_collection failed:', error)

        throw error
      }

      // Update additional fields if provided
      if (options.purchasePrice || options.purchaseDate || options.notes) {
        const { error: updateError } = await supabase
          .from('user_collections')
          .update({
            is_first_edition: options.isFirstEdition || false,
            is_shadowless: options.isShadowless || false,
            is_reverse_holo: options.isReverseHolo || false,
            is_holo: options.isHolo || false,
            purchase_price: options.purchasePrice,
            purchase_date: options.purchaseDate,
            purchase_location: options.purchaseLocation,
            notes: options.notes,
          })
          .eq('user_id', user.id)
          .eq('card_id', card.id)
          .eq('condition', options.condition || 'Near Mint')

        if (updateError) console.error('Error updating collection details:', updateError)
      }

      console.log('Successfully added to collection')
      return true
    } catch (error) {
      console.error('Error adding to collection:', error)
      return false
    }
  }

  // Add card to user's wishlist
  async addToWishlist(
    card: PokemonCard,
    options: {
      priority?: number
      maxPrice?: number
      preferredCondition?: string
      preferredLanguage?: string
      notes?: string
    } = {}
  ): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('User must be logged in to add cards to wishlist')
      }

      // Ensure user profile exists
      await this.ensureUserProfile(user)

      // Ensure the card exists
      await this.ensureCardExists(card)

      const { error } = await supabase.from('user_wishlists').insert({
        user_id: user.id,
        card_id: card.id,
        priority: options.priority || 3,
        max_price: options.maxPrice,
        preferred_condition: options.preferredCondition || 'Near Mint',
        preferred_language: options.preferredLanguage || 'en',
        notes: options.notes,
      })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      return false
    }
  }

  // Add card to user's watchlist for price alerts
  async addToWatchlist(
    card: PokemonCard,
    targetPrice: number,
    condition: string = 'Near Mint'
  ): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('User must be logged in to add cards to watchlist')
      }

      // Ensure user profile exists
      await this.ensureUserProfile(user)

      // Ensure the card exists
      await this.ensureCardExists(card)

      const { error } = await supabase.from('user_watchlists').insert({
        user_id: user.id,
        card_id: card.id,
        target_price: targetPrice,
        condition: condition,
        is_active: true,
      })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      return false
    }
  }

  // Get user's collection with card details
  async getUserCollection(userId?: string): Promise<CollectionItem[]> {
    try {
      let targetUserId = userId

      if (!targetUserId) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return []
        targetUserId = user.id
      }

      const { data, error } = await supabase
        .from('user_collections')
        .select(
          `
          *,
          pokemon_cards (
            id,
            name,
            set_id,
            number,
            rarity,
            images,
            types,
            supertype,
            subtypes,
            hp
          )
        `
        )
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user collection:', error)
      return []
    }
  }

  // Get user's wishlist with card details
  async getUserWishlist(userId?: string): Promise<unknown[]> {
    try {
      let targetUserId = userId

      if (!targetUserId) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return []
        targetUserId = user.id
      }

      const { data, error } = await supabase
        .from('user_wishlists')
        .select(
          `
          *,
          pokemon_cards (
            id,
            name,
            set_id,
            number,
            rarity,
            images,
            types,
            supertype,
            subtypes,
            hp
          )
        `
        )
        .eq('user_id', targetUserId)
        .order('priority', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user wishlist:', error)
      return []
    }
  }

  // Get user's watchlist
  async getUserWatchlist(userId?: string): Promise<unknown[]> {
    try {
      let targetUserId = userId

      if (!targetUserId) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return []
        targetUserId = user.id
      }

      const { data, error } = await supabase
        .from('user_watchlists')
        .select(
          `
          *,
          pokemon_cards (
            id,
            name,
            set_id,
            number,
            rarity,
            images,
            types,
            supertype,
            subtypes,
            hp
          )
        `
        )
        .eq('user_id', targetUserId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user watchlist:', error)
      return []
    }
  }

  // Get user collection statistics
  async getCollectionStats(userId?: string): Promise<CollectionStats> {
    try {
      let targetUserId = userId

      if (!targetUserId) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return this.getEmptyStats()
        targetUserId = user.id
      }

      const { data, error } = await supabase.rpc('get_user_collection_stats', {
        user_uuid: targetUserId,
      })

      if (error) throw error

      const stats = data[0] || {}
      return {
        totalCards: parseInt(stats.total_cards) || 0,
        uniqueCards: parseInt(stats.unique_cards) || 0,
        totalValue: parseFloat(stats.total_value) || 0,
        setsCollected: parseInt(stats.sets_collected) || 0,
        completionPercentage: parseFloat(stats.completion_percentage) || 0,
      }
    } catch (error) {
      console.error('Error fetching collection stats:', error)
      return this.getEmptyStats()
    }
  }

  // Remove card from collection
  async removeFromCollection(collectionId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('user_collections').delete().eq('id', collectionId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error removing from collection:', error)
      return false
    }
  }

  // Update collection item quantity
  async updateCollectionQuantity(collectionId: string, quantity: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_collections')
        .update({ quantity })
        .eq('id', collectionId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating collection quantity:', error)
      return false
    }
  }

  // ============================================================================
  // ALBUM MANAGEMENT METHODS
  // ============================================================================

  // Create a new album
  async createAlbum(
    name: string,
    description?: string,
    isPublic: boolean = false
  ): Promise<Album | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('User must be logged in to create albums')

      await this.ensureUserProfile(user)

      const { data, error } = await supabase
        .from('user_albums')
        .insert({
          name,
          description,
          user_id: user.id,
          is_public: isPublic,
        })
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('user_albums')) {
          console.warn('Album tables not yet created. Please run the album schema SQL script.')
          return null
        }
        throw error
      }
      return data
    } catch (error) {
      console.error('Error creating album:', error)
      return null
    }
  }

  // Get user's albums
  async getUserAlbums(userId?: string): Promise<Album[]> {
    try {
      let targetUserId = userId
      if (!targetUserId) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return []
        targetUserId = user.id
      }

      const { data, error } = await supabase
        .from('user_albums')
        .select(
          `
          *,
          album_cards(count)
        `
        )
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })

      if (error) {
        // Check if the error is because the table doesn't exist
        if (error.code === 'PGRST205' || error.message?.includes('user_albums')) {
          console.warn('Album tables not yet created. Please run the album schema SQL script.')
          return []
        }
        throw error
      }

      return (data || []).map(album => ({
        ...album,
        card_count: album.album_cards?.[0]?.count || 0,
      }))
    } catch (error) {
      console.error('Error fetching albums:', error)
      return []
    }
  }

  // Add card to album
  async addCardToAlbum(cardId: string, albumId: string, notes?: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('User must be logged in')

      // Check if album belongs to user
      const { data: album } = await supabase
        .from('user_albums')
        .select('id')
        .eq('id', albumId)
        .eq('user_id', user.id)
        .single()

      if (!album) throw new Error('Album not found or access denied')

      // Check if card is already in album
      const { data: existing } = await supabase
        .from('album_cards')
        .select('id')
        .eq('album_id', albumId)
        .eq('card_id', cardId)
        .single()

      if (existing) {
        console.log('Card already in album')
        return true
      }

      const { error } = await supabase.from('album_cards').insert({
        album_id: albumId,
        card_id: cardId,
        notes,
      })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error adding card to album:', error)
      return false
    }
  }

  // Remove card from album
  async removeCardFromAlbum(cardId: string, albumId: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('User must be logged in')

      // Check if album belongs to user
      const { data: album } = await supabase
        .from('user_albums')
        .select('id')
        .eq('id', albumId)
        .eq('user_id', user.id)
        .single()

      if (!album) throw new Error('Album not found or access denied')

      const { error } = await supabase
        .from('album_cards')
        .delete()
        .eq('album_id', albumId)
        .eq('card_id', cardId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error removing card from album:', error)
      return false
    }
  }

  // Get cards in an album
  async getAlbumCards(albumId: string): Promise<CollectionItem[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return []

      // Check if album belongs to user or is public
      const { data: album } = await supabase
        .from('user_albums')
        .select('id, is_public')
        .eq('id', albumId)
        .or(`user_id.eq.${user.id},is_public.eq.true`)
        .single()

      if (!album) return []

      const { data, error } = await supabase
        .from('album_cards')
        .select('*')
        .eq('album_id', albumId)
        .order('added_at', { ascending: false })

      if (error) throw error

      // Get collection details and card details for each card
      const cardsWithCollection = await Promise.all(
        (data || []).map(async albumCard => {
          // Get collection data
          const { data: collectionData } = await supabase
            .from('user_collections')
            .select(
              `
              id,
              quantity,
              condition,
              language,
              is_first_edition,
              is_shadowless,
              is_reverse_holo,
              is_holo,
              purchase_price,
              purchase_date,
              purchase_location,
              notes,
              created_at
              `
            )
            .eq('card_id', albumCard.card_id)
            .eq('user_id', user.id)
            .single()

          // Try to get pokemon card data if the table exists
          let pokemonCardData = null
          try {
            const { data: cardData } = await supabase
              .from('pokemon_cards')
              .select(
                `
                id,
                name,
                set_id,
                number,
                rarity,
                images,
                types,
                supertype,
                subtypes,
                hp
                `
              )
              .eq('id', albumCard.card_id)
              .single()
            pokemonCardData = cardData
          } catch (cardError) {
            console.warn('Could not fetch pokemon_cards data:', cardError)
            // If pokemon_cards table doesn't exist, create a placeholder
            pokemonCardData = {
              id: albumCard.card_id,
              name: albumCard.card_id.split('-').pop() || 'Unknown Card',
              set_id: 'unknown',
              number: '1',
              rarity: 'Common',
              images: { small: '', large: '' },
              types: ['Unknown'],
              supertype: 'Unknown',
              subtypes: ['Unknown'],
              hp: '60',
            }
          }

          return {
            ...albumCard,
            user_collections: collectionData,
            pokemon_cards: pokemonCardData,
          }
        })
      )

      if (error) throw error

      return cardsWithCollection
        .filter(item => item.user_collections) // Solo carte che sono nella collezione dell'utente
        .map(item => ({
          id: item.user_collections.id,
          card_id: item.card_id,
          quantity: item.user_collections.quantity,
          condition: item.user_collections.condition,
          language: item.user_collections.language,
          is_first_edition: item.user_collections.is_first_edition,
          is_shadowless: item.user_collections.is_shadowless,
          is_reverse_holo: item.user_collections.is_reverse_holo,
          is_holo: item.user_collections.is_holo,
          purchase_price: item.user_collections.purchase_price,
          purchase_date: item.user_collections.purchase_date,
          purchase_location: item.user_collections.purchase_location,
          notes: item.user_collections.notes,
          created_at: item.user_collections.created_at,
          pokemon_cards: item.pokemon_cards,
        }))
    } catch (error) {
      console.error('Error fetching album cards:', error)
      return []
    }
  }

  // Update album
  async updateAlbum(
    albumId: string,
    updates: Partial<Pick<Album, 'name' | 'description' | 'is_public'>>
  ): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('User must be logged in')

      const { error } = await supabase
        .from('user_albums')
        .update(updates)
        .eq('id', albumId)
        .eq('user_id', user.id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating album:', error)
      return false
    }
  }

  // Delete album
  async deleteAlbum(albumId: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('User must be logged in')

      // First delete all album_cards entries
      await supabase.from('album_cards').delete().eq('album_id', albumId)

      // Then delete the album
      const { error } = await supabase
        .from('user_albums')
        .delete()
        .eq('id', albumId)
        .eq('user_id', user.id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting album:', error)
      return false
    }
  }

  // Get suggested albums for a card (based on name patterns)
  getSuggestedAlbums(cardName: string, existingAlbums: Album[]): string[] {
    const suggestions: string[] = []
    const lowerName = cardName.toLowerCase()

    // Pokemon-specific suggestions
    if (lowerName.includes('pikachu')) suggestions.push('Tutti i miei Pikachu')
    if (lowerName.includes('charizard')) suggestions.push('Charizard Collection')
    if (lowerName.includes('mewtwo')) suggestions.push('Legendary Mewtwo')
    if (
      lowerName.includes('eevee') ||
      lowerName.includes('vaporeon') ||
      lowerName.includes('jolteon') ||
      lowerName.includes('flareon') ||
      lowerName.includes('espeon') ||
      lowerName.includes('umbreon') ||
      lowerName.includes('leafeon') ||
      lowerName.includes('glaceon') ||
      lowerName.includes('sylveon')
    ) {
      suggestions.push('Eeveelutions')
    }

    // Rarity-based suggestions
    if (lowerName.includes('shiny')) suggestions.push('Shiny Collection')
    if (lowerName.includes('gx')) suggestions.push('GX Cards')
    if (lowerName.includes('ex')) suggestions.push('EX Cards')
    if (lowerName.includes('vmax')) suggestions.push('VMAX Collection')

    // Filter out albums that already exist
    const existingNames = existingAlbums.map(a => a.name.toLowerCase())
    return suggestions.filter(s => !existingNames.includes(s.toLowerCase()))
  }

  // Ensure set exists
  private async ensureSetExists(set: {
    id: string
    name: string
    series?: string
    releaseDate?: string
  }): Promise<void> {
    try {
      console.log('Checking if set exists:', set.id)

      const { data: existingSet, error: selectError } = await supabase
        .from('pokemon_sets')
        .select('id')
        .eq('id', set.id)
        .single()

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error checking set existence:', selectError)
        return
      }

      if (!existingSet) {
        console.log('Creating new set:', set)

        // Prova con i nomi di colonna più comuni
        const setData = {
          id: set.id,
          name: set.name,
          series: set.series || 'Unknown',
          // Prova sia release_date che releaseDate
          ...(set.releaseDate && { release_date: set.releaseDate }),
        }

        const { error } = await supabase.from('pokemon_sets').insert(setData)

        if (error) {
          if (error.code === '23505') {
            // Ignore duplicate key error
            console.log('Set already exists (duplicate key), continuing...')
          } else if (error.code === 'PGRST204' || error.message?.includes('releaseDate')) {
            // Prova senza la data se la colonna non esiste
            console.warn('releaseDate column not found, retrying without it')
            const setDataWithoutDate = {
              id: set.id,
              name: set.name,
              series: set.series || 'Unknown',
            }
            const { error: retryError } = await supabase
              .from('pokemon_sets')
              .insert(setDataWithoutDate)
            if (retryError && retryError.code !== '23505') {
              console.error('Error creating set without date:', retryError)
              throw retryError
            } else {
              console.log('Set created successfully without date:', set.id)
            }
          } else {
            console.error('Error creating set:', error)
            throw error
          }
        } else {
          console.log('Set created successfully:', set.id)
        }
      } else {
        console.log('Set already exists:', set.id)
      }
    } catch (error) {
      console.error('Error ensuring set exists:', error)
      // Non fare throw dell'errore, continua senza il set
      console.warn('Continuing without set creation due to schema issues')
    }
  }

  private async ensureCardExists(card: PokemonCard): Promise<void> {
    try {
      console.log('Ensuring card exists:', card.id, card.name)

      let setExists = false
      if (card.set?.id && card.set?.name) {
        try {
          await this.ensureSetExists(card.set)
          setExists = true
          console.log('Set exists or was created successfully')
        } catch (setError) {
          console.warn('Failed to create set, will insert card without set_id:', setError)
          setExists = false
        }
      }

      console.log('Checking if card exists:', card.id)
      const { data: existingCard, error: selectError } = await supabase
        .from('pokemon_cards')
        .select('id')
        .eq('id', card.id)
        .single()

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error checking card existence:', selectError)
        throw selectError
      }

      if (!existingCard) {
        console.log('Creating new card:', card.id)

        // Prepara i dati della carta
        const cardData = {
          id: card.id,
          name: card.name || 'Unknown Card',
          supertype: card.supertype || 'Unknown',
          subtypes: card.subtypes || [],
          hp: card.hp ? parseInt(card.hp.toString()) : null,
          types: card.types || [],
          // Include set_id solo se il set esiste
          set_id: setExists ? card.set?.id : null,
          number: card.number || '1',
          rarity: card.rarity || 'Common',
          artist: card.artist || null,
          images: card.images || { small: '', large: '' },
          abilities: card.abilities || null,
          attacks: card.attacks || null,
          weaknesses: card.weaknesses || null,
          resistances: card.resistances || null,
          retreat_cost: card.retreatCost || [],
          converted_retreat_cost: card.convertedRetreatCost || null,
          national_pokedex_numbers: card.nationalPokedexNumbers || [],
          legalities: card.legalities || null,
        }

        console.log('Inserting card data:', cardData)
        const { error } = await supabase.from('pokemon_cards').insert(cardData)

        if (error) {
          if (error.code === '23505') {
            // Carta già esistente, ignora l'errore
            console.log('Card already exists (duplicate key), continuing...')
          } else if (error.code === '23503' && error.message.includes('set_id')) {
            // Problema con il set, prova senza set_id
            console.warn('Set foreign key issue, retrying without set_id')
            const cardDataWithoutSet = { ...cardData, set_id: null }
            const { error: retryError } = await supabase
              .from('pokemon_cards')
              .insert(cardDataWithoutSet)
            if (retryError && retryError.code !== '23505') {
              console.error('Error inserting card without set:', retryError)
              throw retryError
            } else {
              console.log('Card created successfully without set:', card.id)
            }
          } else {
            console.error('Error inserting card:', error)
            throw error
          }
        } else {
          console.log('Card created successfully:', card.id)
        }
      } else {
        console.log('Card already exists:', card.id)
      }
    } catch (error) {
      console.error('Error ensuring card exists:', error)
      throw error
    }
  }

  private getEmptyStats(): CollectionStats {
    return {
      totalCards: 0,
      uniqueCards: 0,
      totalValue: 0,
      setsCollected: 0,
      completionPercentage: 0,
    }
  }
}

export const collectionService = new CollectionService()
