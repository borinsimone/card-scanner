import { cardSearchService } from '@/services/card-search'
import { log } from 'console'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import CardResults from './CardResults'
import PopularCards from './PopularCards'
import styled from 'styled-components'
const CardFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`
const Form = styled.form`
  display: flex;

  align-items: center;
  width: 100%;
`
function CardForm() {
  const [cardName, setCardName] = useState('')
  const [setName, setSetname] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Stati per autocomplete
  const [pokemonSuggestions, setPokemonSuggestions] = useState<string[]>([])
  const [setSuggestions, setSetSuggestions] = useState<
    Array<{
      id: string
      name: string
      series: string
      releaseDate: string
      images: { logo: string; symbol: string }
    }>
  >([])
  const [showPokemonSuggestions, setShowPokemonSuggestions] = useState(false)
  const [showSetSuggestions, setShowSetSuggestions] = useState(false)
  const [cardNumberSuggestions, setCardNumberSuggestions] = useState<string[]>([])
  const [showCardNumberSuggestions, setShowCardNumberSuggestions] = useState(false)
  const [totalCardsInSet, setTotalCardsInSet] = useState<number>(0)
  const [results, setResults] = useState(null)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await cardSearchService.smartSearchV2(cardName, setName, cardNumber)
    if (result && 'cards' in result) {
      console.log('Found cards:', result.cards)
      setResults(result)
    }
    console.log('result:', result)
  }

  // Gestione suggerimenti Pokemon
  const handlePokemonNameChange = (value: string) => {
    setCardName(value)
    if (value.length > 1) {
      const allPokemon = cardSearchService.getAllPokemonNames()
      const filtered = allPokemon
        .filter(name => name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5)
      setPokemonSuggestions(filtered)
      setShowPokemonSuggestions(true)
    } else {
      setShowPokemonSuggestions(false)
    }
  }

  // Gestione suggerimenti Set
  const handleSetNameChange = (value: string) => {
    setSetname(value)
    if (value.length > 0) {
      const suggestions = cardSearchService.getSetSuggestions(value)
      setSetSuggestions(suggestions)
      setShowSetSuggestions(true)
    } else {
      setShowSetSuggestions(false)
    }
  }

  // Seleziona suggerimento Pokemon
  const selectPokemonSuggestion = (pokemon: string) => {
    setCardName(pokemon)
    setShowPokemonSuggestions(false)
  }

  // Seleziona suggerimento Set
  const selectSetSuggestion = async (set: {
    id: string
    name: string
    series: string
    releaseDate: string
    images: { logo: string; symbol: string }
  }) => {
    setSetname(set.id)
    setShowSetSuggestions(false)

    // Carica il numero di carte nel set
    const totalCards = await getNumberOfCards(set.id)
    if (typeof totalCards === 'number' && totalCards > 0) {
      setTotalCardsInSet(totalCards)
    }
  }
  const getNumberOfCards = async (setId: string) => {
    const setInfo = await cardSearchService.getSetById(setId)
    const cardNumber = setInfo?.total || 'N/A'

    return cardNumber
  }

  // Gestione suggerimenti numero carta
  const handleCardNumberChange = (value: string) => {
    setCardNumber(value)

    if (value.length > 0 && totalCardsInSet > 0) {
      // Genera suggerimenti basati sul numero inserito
      const suggestions: string[] = []
      const numValue = parseInt(value)

      if (!isNaN(numValue)) {
        // Suggerisci numeri vicini
        for (let i = Math.max(1, numValue - 2); i <= Math.min(totalCardsInSet, numValue + 2); i++) {
          if (i.toString().startsWith(value)) {
            suggestions.push(i.toString())
          }
        }
      } else {
        // Se non è un numero, suggerisci i primi numeri che iniziano con il testo
        for (let i = 1; i <= totalCardsInSet; i++) {
          if (i.toString().startsWith(value)) {
            suggestions.push(i.toString())
            if (suggestions.length >= 5) break // Limita a 5 suggerimenti
          }
        }
      }

      setCardNumberSuggestions(suggestions)
      setShowCardNumberSuggestions(suggestions.length > 0)
    } else if (value.length === 0 && totalCardsInSet > 0) {
      // Se il campo è vuoto ma abbiamo un set, mostra alcuni numeri comuni
      const commonNumbers = ['1', '2', '3', '4', '5', totalCardsInSet.toString()]
      setCardNumberSuggestions(commonNumbers.filter(num => parseInt(num) <= totalCardsInSet))
      setShowCardNumberSuggestions(true)
    } else {
      setShowCardNumberSuggestions(false)
    }
  }

  // Seleziona suggerimento numero carta
  const selectCardNumberSuggestion = (number: string) => {
    setCardNumber(number)
    setShowCardNumberSuggestions(false)
  }

  return (
    <CardFormContainer style={{ position: 'relative', margin: '20px auto' }}>
      <Form onSubmit={handleSubmit}>
        {/* Input Pokemon con autocomplete */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search for a Pokemon..."
            value={cardName}
            onChange={e => handlePokemonNameChange(e.target.value)}
            onBlur={() => setTimeout(() => setShowPokemonSuggestions(false), 200)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          {showPokemonSuggestions && pokemonSuggestions.length > 0 && (
            <div
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
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              {pokemonSuggestions.map((pokemon, index) => (
                <div
                  key={index}
                  onClick={() => selectPokemonSuggestion(pokemon)}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    borderBottom: index < pokemonSuggestions.length - 1 ? '1px solid #eee' : 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
                >
                  {pokemon}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Set con autocomplete */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Set name..."
            value={setName}
            onChange={e => handleSetNameChange(e.target.value)}
            onBlur={() => setTimeout(() => setShowSetSuggestions(false), 200)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          {showSetSuggestions && setSuggestions.length > 0 && (
            <div
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
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              {setSuggestions.map((set, index) => (
                <div
                  key={set.id}
                  onClick={() => {
                    console.log(set)
                    selectSetSuggestion(set)
                  }}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    borderBottom: index < setSuggestions.length - 1 ? '1px solid #eee' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
                >
                  <Image
                    src={set.images.symbol}
                    alt={set.name}
                    width={20}
                    height={20}
                    style={{
                      objectFit: 'contain',
                    }}
                    onError={e => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>{set.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {set.series} • {set.id} • {new Date(set.releaseDate).getFullYear()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Card Number con autocomplete */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder={
              totalCardsInSet > 0 ? `Card number (1-${totalCardsInSet})...` : 'Card number...'
            }
            value={cardNumber}
            onChange={e => handleCardNumberChange(e.target.value)}
            onBlur={() => setTimeout(() => setShowCardNumberSuggestions(false), 200)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          {showCardNumberSuggestions && cardNumberSuggestions.length > 0 && (
            <div
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
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              {cardNumberSuggestions.map((number, index) => (
                <div
                  key={number}
                  onClick={() => selectCardNumberSuggestion(number)}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    borderBottom:
                      index < cardNumberSuggestions.length - 1 ? '1px solid #eee' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
                >
                  <span>#{number}</span>
                  {number === totalCardsInSet.toString() && (
                    <span style={{ fontSize: '12px', color: '#666' }}>Last card</span>
                  )}
                  {number === '1' && (
                    <span style={{ fontSize: '12px', color: '#666' }}>First card</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0056b3')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#007bff')}
        >
          Search
        </button>
      </Form>
      {results ? <CardResults results={results} /> : null}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          caricando..
        </div>
      )}
    </CardFormContainer>
  )
}

export default CardForm
