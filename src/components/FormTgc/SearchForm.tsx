import React, { useState } from 'react'
import SearchInput from './SearchInput'
import { SearchFormData, SearchFilters } from './types'

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void
  isLoading: boolean
  onReset: () => void
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading, onReset }) => {
  const [formData, setFormData] = useState<SearchFormData>({
    pokemonName: '',
    setId: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Costruisci i filtri solo con i campi non vuoti
    const filters: SearchFilters = {}
    if (formData.pokemonName.trim()) {
      filters.pokemonName = formData.pokemonName.trim()
    }
    if (formData.setId.trim()) {
      filters.setId = formData.setId.trim()
    }

    // Il nome Pokemon è obbligatorio
    if (!filters.pokemonName) {
      return
    }

    onSearch(filters)
  }

  const handleReset = () => {
    setFormData({ pokemonName: '', setId: '' })
    onReset()
  }

  const updatePokemonName = (value: string) => {
    setFormData(prev => ({ ...prev, pokemonName: value }))
  }

  const updateSetId = (value: string) => {
    setFormData(prev => ({ ...prev, setId: value }))
  }

  const isSearchDisabled = isLoading || !formData.pokemonName.trim()

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          marginBottom: '15px',
        }}
      >
        {/* Campo Nome Pokemon */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Nome Pokemon:
          </label>
          <SearchInput
            value={formData.pokemonName}
            onChange={updatePokemonName}
            onSelect={updatePokemonName}
            placeholder="Es: Pikachu, Charizard..."
            disabled={isLoading}
          />
        </div>

        {/* Campo Set ID */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Set ID (opzionale):
          </label>
          <input
            type="text"
            value={formData.setId}
            onChange={e => updateSetId(e.target.value)}
            placeholder="Es: base1, neo1, ex1..."
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: isLoading ? '#f5f5f5' : 'white',
            }}
          />
        </div>
      </div>

      {/* Informazioni sui filtri */}
      <div
        style={{
          fontSize: '12px',
          color: '#666',
          marginBottom: '15px',
          padding: '8px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
        }}
      >
        💡 <strong>Suggerimenti:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>
            <strong>Nome Pokemon è obbligatorio</strong>
          </li>
          <li>Set ID è opzionale per filtri più precisi</li>
          <li>Combinare entrambi per risultati specifici</li>
          <li>Set ID esempi: base1, jungle, fossil, neo1, ex1, dp1, bw1, xy1, sm1, swsh1</li>
        </ul>
      </div>

      {/* Bottoni */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="submit"
          disabled={isSearchDisabled}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: isSearchDisabled ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSearchDisabled ? 'not-allowed' : 'pointer',
            flex: 1,
          }}
        >
          {isLoading ? 'Ricerca in corso...' : 'Cerca Carte'}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          Reset
        </button>
      </div>

      {/* Riepilogo ricerca */}
      {(formData.pokemonName || formData.setId) && (
        <div
          style={{
            marginTop: '10px',
            padding: '8px',
            backgroundColor: '#e7f3ff',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          <strong>Ricerca attiva:</strong>
          {formData.pokemonName && <span> Nome: &ldquo;{formData.pokemonName}&rdquo;</span>}
          {formData.pokemonName && formData.setId && <span> +</span>}
          {formData.setId && <span> Set: &ldquo;{formData.setId}&rdquo;</span>}
        </div>
      )}
    </form>
  )
}

export default SearchForm
