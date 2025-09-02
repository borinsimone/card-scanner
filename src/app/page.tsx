'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { User, LogOut, Plus, Heart, Eye, Search, Package, FolderOpen } from 'lucide-react'
import { Container, Heading, Text, Card, Button } from '../components/ui'

import { UserCollection } from '../components/Collection/UserCollection'
import { AlbumManager } from '../components/Collection/AlbumManager'
import { Auth, useAuth } from '../components/Auth/Auth'
import { theme } from '../styles/theme'
import { PokemonTCGCard } from '../services/card-search'
import { collectionService } from '../services/collection'
import CardForm from '@/components/FormTgc/CardForm'
import Sidebar from '@/components/Sidebar/Sidebar'

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${theme.colors.backgroundDark} 0%,
    ${theme.colors.background} 100%
  );
  display: flex;
`

const MainContent = styled.div`
  flex: 1;
  padding: ${theme.spacing[4]};
  overflow-y: auto;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${theme.colors.background};
`

const Header = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.pokemonBlue});
  color: white;
  padding: ${theme.spacing[8]} 0;
  margin-bottom: ${theme.spacing[6]};
  border-radius: ${theme.borderRadius.lg};
`

const ErrorMessage = styled.div`
  background: ${theme.colors.danger}20;
  color: ${theme.colors.danger};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing[4]};
  border: 1px solid ${theme.colors.danger};
`

const SuccessMessage = styled.div`
  background: ${theme.colors.success}20;
  color: ${theme.colors.success};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing[4]};
  border: 1px solid ${theme.colors.success};
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[4]};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const CardSelectionContainer = styled(Card)`
  margin-bottom: ${theme.spacing[6]};
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[4]};
`

const CardOption = styled.div`
  border: 2px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[3]};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    box-shadow: ${theme.shadows.md};
  }
`

export default function Home() {
  const { user, loading, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [scannedCard, setScannedCard] = useState<PokemonTCGCard | null>(null)
  const [searchResults, setSearchResults] = useState<PokemonTCGCard[]>([])
  const [showCardSelection, setShowCardSelection] = useState(false)
  const [activeTab, setActiveTab] = useState<'search' | 'collection' | 'albums'>('search')

  if (loading) {
    return (
      <LoadingContainer>
        <Text>Caricamento...</Text>
      </LoadingContainer>
    )
  }

  // Show auth component if not logged in
  if (!user) {
    return (
      <AppContainer>
        <Container>
          <Auth />
        </Container>
      </AppContainer>
    )
  }

  const handleAddToCollection = async () => {
    if (!scannedCard) return

    try {
      setIsLoading(true)
      // Converti PokemonTCGCard al formato PokemonCard per il servizio collezione
      const pokemonCard = {
        ...scannedCard,
        hp: parseInt(scannedCard.hp || '0', 10) || undefined,
      }
      const success = await collectionService.addToCollection(pokemonCard)
      if (success) {
        setSuccessMessage('Carta aggiunta alla collezione!')
      } else {
        setError('Errore durante aggiunta alla collezione')
      }
    } catch (error) {
      console.error('Errore aggiunta collezione:', error)
      setError('Errore durante aggiunta alla collezione')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToWishlist = async () => {
    if (!scannedCard) return

    try {
      setIsLoading(true)
      const pokemonCard = {
        ...scannedCard,
        hp: parseInt(scannedCard.hp || '0', 10) || undefined,
      }
      const success = await collectionService.addToWishlist(pokemonCard)
      if (success) {
        setSuccessMessage('Carta aggiunta alla wishlist!')
      } else {
        setError('Errore durante aggiunta alla wishlist')
      }
    } catch (error) {
      console.error('Errore aggiunta wishlist:', error)
      setError('Errore durante aggiunta alla wishlist')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToWatchlist = async () => {
    if (!scannedCard) return

    try {
      setIsLoading(true)
      const pokemonCard = {
        ...scannedCard,
        hp: parseInt(scannedCard.hp || '0', 10) || undefined,
      }
      const success = await collectionService.addToWatchlist(pokemonCard, 20.0)
      if (success) {
        setSuccessMessage('Carta aggiunta alla watchlist!')
      } else {
        setError('Errore durante aggiunta alla watchlist')
      }
    } catch (error) {
      console.error('Errore aggiunta watchlist:', error)
      setError('Errore durante aggiunta alla watchlist')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardSelection = (card: PokemonTCGCard) => {
    setScannedCard(card)
    setShowCardSelection(false)
    setSearchResults([])
    setSuccessMessage(`Carta selezionata: ${card.name}`)
  }

  return (
    <AppContainer>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} logout={logout} />

      <MainContent>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

        {activeTab === 'search' ? (
          <>
            <CardForm />

            {/* Selezione carte multiple */}
            {showCardSelection && searchResults.length > 0 && (
              <CardSelectionContainer>
                <Heading size="lg" style={{ marginBottom: theme.spacing[4] }}>
                  🎯 Seleziona la carta desiderata ({searchResults.length} risultati)
                </Heading>

                <CardGrid>
                  {searchResults.map((card, index) => (
                    <CardOption
                      key={`${card.id}-${index}`}
                      onClick={() => handleCardSelection(card)}
                    >
                      <Button
                        style={{
                          width: '100%',
                          marginTop: theme.spacing[2],
                          backgroundColor: theme.colors.primary,
                        }}
                      >
                        Seleziona questa carta
                      </Button>
                    </CardOption>
                  ))}
                </CardGrid>
              </CardSelectionContainer>
            )}

            {scannedCard && (
              <Card>
                <Heading size="lg" style={{ marginBottom: theme.spacing[4] }}>
                  🎯 Carta trovata
                </Heading>

                <ActionButtons>
                  <Button
                    onClick={handleAddToCollection}
                    disabled={isLoading}
                    style={{ backgroundColor: theme.colors.success }}
                  >
                    <Plus size={16} />
                    Aggiungi alla Collezione
                  </Button>

                  <Button
                    onClick={handleAddToWishlist}
                    disabled={isLoading}
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    <Heart size={16} />
                    Aggiungi alla Wishlist
                  </Button>

                  <Button
                    onClick={handleAddToWatchlist}
                    disabled={isLoading}
                    style={{ backgroundColor: theme.colors.warning }}
                  >
                    <Eye size={16} />
                    Aggiungi alla Watchlist
                  </Button>
                </ActionButtons>
              </Card>
            )}
          </>
        ) : activeTab === 'collection' ? (
          <UserCollection />
        ) : (
          <AlbumManager />
        )}
      </MainContent>
    </AppContainer>
  )
}
