'use client'

import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { Package, Grid3X3, Book } from 'lucide-react'

import { collectionService, CollectionItem } from '../../services/collection'
import CardDetails from './CardDetails'
import SetView from './SetView'
import { cardSearchService, PokemonTCGCard } from '../../services/card-search'
import { theme } from '../../styles/theme'
import GradualBlur from '../react-bits-components/GradualBlur'
import ScrollReveal from '../react-bits-components/ScrollReveal'
import CardOverlay from './CardOverlay'
import SpotlightCard from '../react-bits-components/SpotlightCard'
// Animations
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

const cardHover = keyframes`
  0% {
    transform: translateY(0) scale(1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  100% {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
`

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const imageSlideIn = keyframes`
  from {
    opacity: 0;
    transform:  translateY(100px);
  }
  to {
    opacity: 1;
    transform:  translateY(0);
  }
`

// Main Container
const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CollectionContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  height: 90vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.6s ease-out;
`

// Header Section
const Header = styled.div`
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  padding: 2rem;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
      repeat;
    opacity: 0.3;
  }
`

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const HeaderIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
`

const HeaderText = styled.div``

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const Subtitle = styled.p`
  margin: 0;
  opacity: 0.8;
  font-size: 1rem;
`

// View Controls
const ViewControls = styled.div`
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`

const ViewButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: ${props =>
    props.$active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
  color: ${props => (props.$active ? 'white' : 'rgba(255, 255, 255, 0.8)')};
  box-shadow: ${props => (props.$active ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none')};

  &:hover {
    background: ${props =>
      props.$active
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-1px);
  }
`

// Content Area
const ContentArea = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`

// Grid View
const CollectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: min-content;
  gap: 3rem;
  padding: 2rem;
  height: 100%;
  overflow-y: auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  }
`

const CollectionItemCard = styled.div`
  /* overflow: hidden; */
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  width: fit-content;
  height: fit-content;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }

  &:hover::before {
    opacity: 1;
  }
`

const CardImageContainer = styled.div`
  height: 100%;
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`

const ImageLoadingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  z-index: 1;
`

const ImageLoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(102, 126, 234, 0.2);
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const CardImage = styled.img<{ $loaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  opacity: ${props => (props.$loaded ? 1 : 0)};
  transform: ${props => (props.$loaded ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)')};
  animation: ${props => (props.$loaded ? imageSlideIn : 'none')} 0.6s ease-out;
  transition-delay: 1000ms;
  z-index: 2;
  position: relative;
`

const CardInfo = styled.div`
  padding: 1rem;
  position: relative;
  z-index: 2;
  background: white;
`

const CardName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #6b7280;
`

const CardSet = styled.span`
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
`

const CardQuantity = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
`

// States
const StateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 3rem;
`

const StateIcon = styled.div<{ $loading?: boolean }>`
  margin-bottom: 1.5rem;
  opacity: 0.6;
  animation: ${props => (props.$loading ? spin : 'none')} 1s linear infinite;
`

const StateTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`

const StateSubtitle = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 1rem;
  max-width: 400px;
`

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

export const UserCollection: React.FC = () => {
  const [collection, setCollection] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState<CollectionItem | null>(null)
  const [tcgInfo, setTcgInfo] = useState<PokemonTCGCard | null>(null)
  const [isLoadingTcg, setIsLoadingTcg] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'sets'>('grid')
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadCollection()
  }, [])

  const loadCollection = async () => {
    try {
      setLoading(true)
      const items = await collectionService.getUserCollection()
      setCollection(items)
      // Reset image loading states for new collection
      setImageLoadingStates({})
    } catch (error) {
      console.error('Error loading collection:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageLoad = (itemId: string) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [itemId]: true,
    }))
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, itemId: string) => {
    e.currentTarget.src = '/placeholder-card.png'
    setImageLoadingStates(prev => ({
      ...prev,
      [itemId]: true,
    }))
  }

  const getStatsFromTCGard = async (card: CollectionItem) => {
    if (!card.pokemon_cards) return

    setIsLoadingTcg(true)
    try {
      const result = await cardSearchService.searchCardById(card.pokemon_cards.id)
      if (result.success && result.cards.length > 0) {
        setTcgInfo(result.cards[0])
      } else {
        setTcgInfo(null)
      }
    } catch (error) {
      console.error('Error fetching card stats:', error)
      setTcgInfo(null)
    } finally {
      setIsLoadingTcg(false)
    }
  }

  const handleCardClick = (item: CollectionItem) => {
    // getStatsFromTCGard(item)
    // setSelectedCard(item)
    GetCardColor(item)
  }

  const handleCloseDetail = () => {
    setSelectedCard(null)
    setTcgInfo(null)
    setIsLoadingTcg(false)
  }

  if (loading) {
    return (
      <AppContainer>
        <CollectionContainer>
          <StateContainer>
            <StateIcon $loading>
              <LoadingSpinner />
            </StateIcon>
            <StateTitle>Caricamento collezione...</StateTitle>
            <StateSubtitle>Stiamo recuperando le tue carte Pokemon</StateSubtitle>
          </StateContainer>
        </CollectionContainer>
      </AppContainer>
    )
  }
  const GetCardColor = (card: CollectionItem) => {
    console.log(card.pokemon_cards?.rarity)
    const rarityColors = {
      Common: 'rgba(156, 163, 175, 1)', // Gray
      Uncommon: 'rgba(34, 197, 94, 1)', // Green
      Rare: 'rgba(59, 130, 246, 1)', // Blue
      'Rare Holo': 'rgba(168, 85, 247, 1)', // Purple
      'Rare Ultra': 'rgba(236, 72, 153, 1)', // Pink
      'Rare Secret': 'rgba(251, 191, 36, 1)', // Gold
      'Rare Rainbow': 'rgba(239, 68, 68, 1)', // Red
      'Amazing Rare': 'rgba(14, 165, 233, 1)', // Sky blue
      Promo: 'rgba(245, 158, 11, 1)', // Amber
      Legendary: 'rgba(147, 51, 234, 1)', // Violet
      Mythical: 'rgba(219, 39, 119, 1)', // Rose
    }

    const rarity = card.pokemon_cards?.rarity || 'Common'
    const glowColor = rarityColors[rarity as keyof typeof rarityColors] || rarityColors['Common']
    return glowColor
  }
  return (
    <AppContainer>
      <CollectionContainer>
        {/* Header */}
        <Header>
          <HeaderContent>
            <HeaderLeft>
              <HeaderIcon>
                <Package size={24} />
              </HeaderIcon>
              <HeaderText>
                <Title>🎮 La Mia Collezione</Title>
                <Subtitle>{collection.length} carte nella tua collezione</Subtitle>
              </HeaderText>
            </HeaderLeft>

            <ViewControls>
              <ViewButton $active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
                <Grid3X3 size={18} />
                Griglia
              </ViewButton>
              <ViewButton $active={viewMode === 'sets'} onClick={() => setViewMode('sets')}>
                <Book size={18} />
                Per Set
              </ViewButton>
            </ViewControls>
          </HeaderContent>
        </Header>

        {/* Content */}
        <ContentArea>
          {viewMode === 'sets' ? (
            <SetView collection={collection} onCardClick={handleCardClick} />
          ) : (
            <>
              {collection.length === 0 ? (
                <StateContainer>
                  <StateIcon>
                    <Package size={64} />
                  </StateIcon>
                  <StateTitle>Collezione vuota</StateTitle>
                  <StateSubtitle>
                    Inizia ad aggiungere carte alla tua collezione per vederle qui!
                  </StateSubtitle>
                </StateContainer>
              ) : (
                <CollectionGrid>
                  {collection.map(item => (
                    <CollectionItemCard key={item.id} onClick={() => handleCardClick(item)}>
                      <SpotlightCard
                        className="custom-spotlight-card"
                        spotlightColor={GetCardColor(item)}
                      >
                        <CardImageContainer>
                          {/* Loading spinner mostrato fino a quando l'immagine non è caricata */}
                          {!imageLoadingStates[item.id] && (
                            <ImageLoadingContainer>
                              <ImageLoadingSpinner />
                            </ImageLoadingContainer>
                          )}

                          <CardImage
                            $loaded={imageLoadingStates[item.id] || false}
                            src={item.pokemon_cards?.images.large}
                            alt={item.pokemon_cards?.name || 'Pokemon Card'}
                            onLoad={() => handleImageLoad(item.id)}
                            onError={e => handleImageError(e, item.id)}
                          />
                          {/* <CardOverlay card={item.pokemon_cards} /> */}
                        </CardImageContainer>
                      </SpotlightCard>
                    </CollectionItemCard>
                  ))}
                </CollectionGrid>
              )}
            </>
          )}
        </ContentArea>
      </CollectionContainer>

      <CardDetails
        card={selectedCard}
        tcgInfo={tcgInfo}
        isLoadingTcg={isLoadingTcg}
        isOpen={selectedCard !== null}
        onClose={handleCloseDetail}
      />
    </AppContainer>
  )
}

export default UserCollection
