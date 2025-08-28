import React, { useState, useRef, useEffect } from 'react'
import pokemonData from '../../pokemon.json'
import { hybridCardSearchService } from '../../services/hybrid-card-search'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSelect: (value: string) => void
  placeholder: string
  disabled?: boolean
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSelect,
  placeholder,
  disabled = false,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Filtra suggerimenti basati sull'input - usa database ibrido
  useEffect(() => {
    if (value.length >= 2 && !disabled) {
      // Combina suggerimenti dal database originale e dal database locale
      const originalSuggestions = pokemonData
        .filter(pokemon => pokemon.name.english.toLowerCase().includes(value.toLowerCase()))
        .map(pokemon => pokemon.name.english)
        .slice(0, 5) // Limitiamo a 5 dal database originale

      const localSuggestions = hybridCardSearchService.getNameSuggestions(value, 5) // E 5 dal database locale

      // Combina e rimuovi duplicati
      const allSuggestions = [...originalSuggestions, ...localSuggestions]
      const uniqueSuggestions = [...new Set(allSuggestions)].slice(0, 10)

      setSuggestions(uniqueSuggestions)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [value, disabled])

  // Chiudi suggerimenti quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleSuggestionClick = (suggestion: string) => {
    onSelect(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: disabled ? '#f5f5f5' : 'white',
        }}
      />

      {/* Suggerimenti */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: '8px 10px',
                cursor: 'pointer',
                borderBottom: index < suggestions.length - 1 ? '1px solid #eee' : 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f0f0f0'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'white'
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchInput
