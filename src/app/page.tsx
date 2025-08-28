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

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${theme.colors.backgroundDark} 0%,
    ${theme.colors.background} 100%
  );
  padding: ${theme.spacing[4]} 0;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${theme.colors.background};
`

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing[4]};
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing[6]};
  box-shadow: ${theme.shadows.sm};
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.pokemonBlue});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
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

const TabNavigation = styled.div`
  display: flex;
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing[6]};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
`

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${theme.spacing[4]};
  border: none;
  background: ${props => (props.$active ? theme.colors.primary : 'transparent')};
  color: ${props => (props.$active ? 'white' : theme.colors.gray600)};
  font-weight: ${props => (props.$active ? 'bold' : 'normal')};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  font-size: 1rem;

  &:hover {
    background: ${props => (props.$active ? theme.colors.primaryDark : theme.colors.gray50)};
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing[3]};
    font-size: 0.9rem;
  }
`

const TabContent = styled.div`
  min-height: 60vh;
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

  const handleSearchResults = (cards: PokemonTCGCard[]) => {
    if (cards.length === 1) {
      // Se c'è solo una carta, la selezioniamo automaticamente
      setScannedCard(cards[0])
      setSuccessMessage(`Carta trovata: ${cards[0].name}`)
      setShowCardSelection(false)
      setSearchResults([])
    } else if (cards.length > 1) {
      // Se ci sono più carte, mostriamo la selezione
      setSearchResults(cards)
      setShowCardSelection(true)
      setScannedCard(null)
      setSuccessMessage(`${cards.length} carte trovate. Seleziona quella desiderata.`)
    }
    setError('')
  }

  return (
    <AppContainer>
      <Container>
        <UserHeader>
          <UserInfo>
            <Avatar>
              <User size={20} />
            </Avatar>
            <div>
              <Text weight="bold">{user.displayName || user.email}</Text>
              <Text size="sm" style={{ opacity: 0.7 }}>
                Benvenuto nel Card Scanner!
              </Text>
            </div>
          </UserInfo>

          <Button onClick={logout} variant="outline">
            <LogOut size={16} />
            Logout
          </Button>
        </UserHeader>

        <TabNavigation>
          <TabButton $active={activeTab === 'search'} onClick={() => setActiveTab('search')}>
            <Search size={20} />
            Cerca Carte
          </TabButton>
          <TabButton
            $active={activeTab === 'collection'}
            onClick={() => setActiveTab('collection')}
          >
            <Package size={20} />
            Collezione
          </TabButton>
          <TabButton $active={activeTab === 'albums'} onClick={() => setActiveTab('albums')}>
            <FolderOpen size={20} />
            Album
          </TabButton>
        </TabNavigation>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

        <TabContent>
          {activeTab === 'search' ? (
            <>
              <Header>
                <Container>
                  <Heading size="2xl" style={{ marginBottom: theme.spacing[3] }}>
                    🔍 Cerca le tue carte Pokemon
                  </Heading>
                  <Text size="lg" style={{ opacity: 0.9 }}>
                    Trova carte Pokemon e gestisci la tua collezione
                  </Text>
                </Container>
              </Header>
              {/* Form di ricerca */}
              <CardForm />
              {'>>'}aggiunta multipla <br />
              {'>>'}ricerca avanzata
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
        </TabContent>
      </Container>
    </AppContainer>
  )
}
