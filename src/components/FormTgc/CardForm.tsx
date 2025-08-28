import React, { useState } from 'react'
import { cardSearchService, PokemonTCGCard } from '../../services/card-search'
import { collectionService } from '../../services/collection'
import CardResults from './CardResults'
import pokemonSets from '../../pokemon-sets.json'
import pokemonNames from '../../pokemon.json'
const CardForm: React.FC = () => {
  const [pokemonName, setPokemonName] = useState('')
  const [setName, setSetName] = useState('')
  const [cards, setCards] = useState<PokemonTCGCard[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [isAddingToCollection, setIsAddingToCollection] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!pokemonName.trim()) {
      setError('Inserisci il nome di un Pokemon')
      return
    }

    setIsLoading(true)
    setError(null)
    setCards([])
    setSearchPerformed(true)

    try {
      console.log('🔍 Ricerca:', pokemonName, setName ? `nel set ${setName}` : '')
      const result = await cardSearchService.smartSearch(pokemonName, setName || undefined)

      if (result.success && result.cards.length > 0) {
        setCards(result.cards)
        console.log('✅ Trovate', result.cards.length, 'carte')
      } else {
        setError('Nessuna carta trovata')
      }
    } catch (err) {
      console.error('❌ Errore:', err)
      setError('Errore durante la ricerca')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setPokemonName('')
    setSetName('')
    setCards([])
    setError(null)
    setSearchPerformed(false)
  }

  // In CardForm.tsx - migliorare handleAddToCollection
  const handleAddToCollection = async (card: PokemonTCGCard) => {
    setIsAddingToCollection(card.id)

    try {
      // Mostra modal per selezione condizione/quantità
      const result = await showAddToCollectionModal(card)

      if (result.confirmed) {
        const success = await collectionService.addToCollection(card, {
          quantity: result.quantity,
          condition: result.condition,
          language: result.language,
        })

        if (success) {
          showSuccessToast(`${card.name} aggiunta alla collezione!`)
          // Opzionale: chiedere se aggiungere anche a un album
          const albumChoice = await showAddToAlbumPrompt()
          if (albumChoice.albumId) {
            await collectionService.addCardToAlbum(card.id, albumChoice.albumId)
          }
        }
      }
    } catch (error) {
      showErrorToast(`Errore nell'aggiunta di ${card.name}`)
    } finally {
      setIsAddingToCollection(null)
    }
  }
  // ...existing code...

  // Funzioni helper da implementare:
  const showAddToCollectionModal = async (card: PokemonTCGCard) => {
    // Per ora, returna valori di default
    // In futuro potresti creare un modal vero
    return {
      confirmed: true,
      quantity: 1,
      condition: 'Near Mint',
      language: 'en',
    }
  }

  const showSuccessToast = (message: string) => {
    // Per ora usa alert, in futuro potresti usare una libreria di toast
    alert(`✅ ${message}`)
  }

  const showErrorToast = (message: string) => {
    // Per ora usa alert, in futuro potresti usare una libreria di toast
    alert(`❌ ${message}`)
  }

  const showAddToAlbumPrompt = async () => {
    // Per ora, non aggiunge a nessun album
    // In futuro potresti mostrare una lista di album
    return { albumId: null }
  }

  // ...existing code...
  const handleAddToWishlist = async (card: PokemonTCGCard) => {
    try {
      console.log('⭐ Aggiungendo alla wishlist:', card.name)

      // Il servizio collection è già implementato per gestire le carte TCG
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const success = await collectionService.addToWishlist(card as any, {
        priority: 3,
        preferredCondition: 'Near Mint',
        preferredLanguage: 'en',
      })

      if (success) {
        alert(`⭐ ${card.name} aggiunta alla wishlist!`)
      } else {
        alert(`❌ Errore nell'aggiunta di ${card.name} alla wishlist`)
      }
    } catch (error) {
      console.error('Errore aggiunta wishlist:', error)
      alert(`❌ Errore nell'aggiunta di ${card.name} alla wishlist`)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        🎴 Ricerca Carte Pokemon
      </h1>

      {/* Form */}
      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            value={pokemonName}
            onChange={e => setPokemonName(e.target.value)}
            placeholder="Nome Pokemon (es: Pikachu, Charizard...)"
            disabled={isLoading}
            list="pokemon-names-list"
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '6px',
            }}
          />
          <datalist id="pokemon-names-list">
            {pokemonNames
              .filter(pokemon =>
                pokemon.name.english.toLowerCase().includes(pokemonName.toLowerCase())
              )
              .slice(0, 10) // Limita a 10 suggerimenti per performance
              .map(pokemon => (
                <option key={pokemon.id} value={pokemon.name.english} />
              ))}
          </datalist>

          <select
            value={setName}
            onChange={e => setSetName(e.target.value)}
            disabled={isLoading}
            style={{
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              minWidth: '200px',
            }}
          >
            <option value="">Tutti i set</option>
            {pokemonSets
              .sort(
                (a: any, b: any) =>
                  new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
              )
              .map((set: any) => (
                <option key={set.id} value={set.id}>
                  {set.name} - {set.id || 'N/A'}
                </option>
              ))}
          </select>

          <button
            type="submit"
            disabled={isLoading || !pokemonName.trim()}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: isLoading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Cercando...' : 'Cerca'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            style={{
              padding: '12px 20px',
              fontSize: '16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      </form>

      {/* Errore */}
      {error && (
        <div
          style={{
            padding: '15px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Risultati */}
      <CardResults
        cards={cards}
        isLoading={isLoading}
        searchPerformed={searchPerformed}
        searchSource="api"
        onAddToCollection={handleAddToCollection}
        onAddToWishlist={handleAddToWishlist}
      />

      {/* Info */}
      <div
        style={{
          marginTop: '40px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#666',
          textAlign: 'center',
        }}
      >
        <strong>� Nuove Funzionalità:</strong>
        <br />
        📚 Aggiungi alla Collezione | ⭐ Aggiungi alla Wishlist | 💰 Prezzi TCG in tempo reale
        <br />
        <strong>�📡 API Pokemon TCG</strong> - Ricerca diretta nel database ufficiale
      </div>
    </div>
  )
}

export default CardForm
