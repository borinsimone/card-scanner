import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { PopularCardsService } from '../../services/popular-cards'
import { SearchResult } from '../../services/card-search'
import CardResults from './CardResults'

// Animazioni
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

// Styled Components
const Container = styled.div`
  padding: 2rem;

  margin: 0 auto;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
`

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${props => (props.$active ? '#3b82f6' : '#e5e7eb')};
  background: ${props => (props.$active ? '#3b82f6' : 'white')};
  color: ${props => (props.$active ? 'white' : '#374151')};
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${props => (props.$active ? '#2563eb' : '#f3f4f6')};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
`

const LoadingSpinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const LoadingText = styled.div`
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 500;
  animation: ${pulse} 2s ease-in-out infinite;
`

const LoadingCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
  margin-top: 2rem;
`

const LoadingCard = styled.div`
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1rem;
  animation: ${pulse} 1.5s ease-in-out infinite;
  height: 400px;
  border: 1px solid #e5e7eb;
`

const LoadingCardImage = styled.div`
  background: #e5e7eb;
  height: 200px;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  animation: ${pulse} 2s ease-in-out infinite;
`

const LoadingCardTitle = styled.div`
  background: #e5e7eb;
  height: 1.5rem;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  animation: ${pulse} 1.8s ease-in-out infinite;
`

const LoadingCardSubtitle = styled.div`
  background: #f3f4f6;
  height: 1rem;
  border-radius: 0.25rem;
  width: 60%;
  animation: ${pulse} 2.2s ease-in-out infinite;
`

const ResultsContainer = styled.div`
  animation: ${fadeIn} 0.6s ease-out;
`

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #ef4444;
`

const ErrorTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`

const ErrorMessage = styled.p`
  color: #6b7280;
`

const RetryButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }
`

type CardCategory = 'popular' | 'rare' | 'recent'

interface CategoryInfo {
  label: string
  description: string
  emoji: string
}

const categories: Record<CardCategory, CategoryInfo> = {
  popular: {
    label: 'Carte Popolari',
    description: 'Le carte più ricercate e di valore',
    emoji: '🔥',
  },
  rare: {
    label: 'Carte Rare',
    description: 'Carte con rarità elevata',
    emoji: '💎',
  },
  recent: {
    label: 'Carte Recenti',
    description: 'Le ultime carte rilasciate',
    emoji: '✨',
  },
}

function PopularCards() {
  const [activeCategory, setActiveCategory] = useState<CardCategory>('popular')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const popularCardsService = new PopularCardsService()

  const loadCards = async (category: CardCategory) => {
    setLoading(true)
    setError(null)

    try {
      let result: SearchResult

      switch (category) {
        case 'popular':
          result = await popularCardsService.getPopularCards()
          break
        case 'rare':
          result = await popularCardsService.getRareCards()
          break
        case 'recent':
          result = await popularCardsService.getRecentCards()
          break
        default:
          result = await popularCardsService.getPopularCards()
      }

      if (result.success) {
        setResults(result)
      } else {
        setError('Errore nel caricamento delle carte')
      }
    } catch (err) {
      console.error('Errore nel caricamento delle carte:', err)
      setError('Errore di connessione. Riprova più tardi.')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category: CardCategory) => {
    setActiveCategory(category)
    loadCards(category)
  }

  const handleRetry = () => {
    loadCards(activeCategory)
  }

  useEffect(() => {
    loadCards(activeCategory)
  }, []) // Carica solo all'avvio, handleCategoryChange gestisce i cambi

  return (
    <Container>
      <TabContainer>
        {Object.entries(categories).map(([key, info]) => (
          <Tab
            key={key}
            $active={activeCategory === key}
            onClick={() => handleCategoryChange(key as CardCategory)}
          >
            {info.emoji} {info.label}
          </Tab>
        ))}
      </TabContainer>

      {loading && (
        <>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>
              Caricamento {categories[activeCategory].label.toLowerCase()}...
            </LoadingText>
          </LoadingContainer>

          <LoadingCards>
            {[...Array(6)].map((_, index) => (
              <LoadingCard key={index}>
                <LoadingCardImage />
                <LoadingCardTitle />
                <LoadingCardSubtitle />
              </LoadingCard>
            ))}
          </LoadingCards>
        </>
      )}

      {error && (
        <ErrorContainer>
          <ErrorTitle>Oops! Qualcosa è andato storto</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={handleRetry}>Riprova</RetryButton>
        </ErrorContainer>
      )}

      {!loading && !error && results && (
        <ResultsContainer>
          <CardResults results={results} />
        </ResultsContainer>
      )}
    </Container>
  )
}

export default PopularCards
