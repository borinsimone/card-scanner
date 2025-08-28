import React, { useState } from 'react'
import { cardSearchService, PokemonTCGCard } from '../../services/card-search'
import CardResults from './CardResults'

const ExampleCardSearch: React.FC = () => {
  const [pokemonName, setPokemonName] = useState('')
  const [cards, setCards] = useState<PokemonTCGCard[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchPerformed, setSearchPerformed] = useState(false)

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
      const result = await cardSearchService.smartSearch(pokemonName)

      if (result.success && result.cards.length > 0) {
        setCards(result.cards)
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

  const handleAddToCollection = async (card: PokemonTCGCard) => {
    // Simula l'aggiunta alla collezione
    console.log('📚 Aggiunta alla collezione:', card.name)
    // Qui andresti a salvare nel database/stato della collezione

    // Simulazione di un delay per mostrare il loading
    await new Promise(resolve => setTimeout(resolve, 1000))

    alert(`✅ ${card.name} aggiunta alla collezione!`)
  }

  const handleAddToWishlist = async (card: PokemonTCGCard) => {
    // Simula l'aggiunta alla wishlist
    console.log('⭐ Aggiunta alla wishlist:', card.name)
    // Qui andresti a salvare nel database/stato della wishlist

    // Simulazione di un delay per mostrare il loading
    await new Promise(resolve => setTimeout(resolve, 1000))

    alert(`⭐ ${card.name} aggiunta alla wishlist!`)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        🎴 Ricerca Pokemon TCG - Con Collezione e Wishlist
      </h1>

      {/* Form di ricerca */}
      <form
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
        }}
      >
        <input
          type="text"
          value={pokemonName}
          onChange={e => setPokemonName(e.target.value)}
          placeholder="Inserisci il nome del Pokemon (es. Pikachu, Charizard)"
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '16px',
            border: '1px solid #ced4da',
            borderRadius: '6px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: isLoading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {isLoading ? '🔍 Ricerca...' : '🔍 Cerca'}
        </button>
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
        <strong>🚀 Nuove Funzionalità:</strong>
        <br />
        📚 Aggiungi alla Collezione | ⭐ Aggiungi alla Wishlist | 💰 Prezzi TCG in tempo reale
      </div>
    </div>
  )
}

export default ExampleCardSearch
