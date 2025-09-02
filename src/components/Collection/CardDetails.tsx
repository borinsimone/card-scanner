'use client'

import React, { useEffect } from 'react'
import styled from 'styled-components'
import { X } from 'lucide-react'
import { CollectionItem } from '../../services/collection'
import { PokemonTCGCard } from '../../services/card-search'
import { theme } from '../../styles/theme'
import { log } from 'console'

interface CardDetailsProps {
  card: CollectionItem | null
  isOpen: boolean
  onClose: () => void
  tcgInfo?: PokemonTCGCard | null
  isLoadingTcg?: boolean
}

const Overlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: ${props => (props.$show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
`

const ModalContent = styled.div`
  display: flex;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  position: relative;
`

const CardImageSection = styled.div`
  width: 300px;
  padding: ${theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.gray50};
`

const CardImage = styled.img`
  width: 100%;
  max-width: 250px;
  height: auto;
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
`

const DetailsSection = styled.div`
  flex: 1;
  padding: ${theme.spacing[6]};
  overflow-y: auto;
`

const CardTitle = styled.h2`
  margin: 0 0 ${theme.spacing[2]} 0;
  color: ${theme.colors.gray900};
  font-size: 1.8rem;
  font-weight: bold;
`

const CardSubtitle = styled.h3`
  margin: 0 0 ${theme.spacing[4]} 0;
  color: ${theme.colors.gray600};
  font-size: 1.2rem;
  font-weight: 500;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${theme.spacing[3]};
  margin: ${theme.spacing[4]} 0;
`

const StatItem = styled.div`
  background: ${theme.colors.gray50};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  text-align: center;
`

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing[1]};
`

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.gray600};
`

const LoadingSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[4]};
  color: ${theme.colors.gray600};
  font-style: italic;
`

const PriceSection = styled.div`
  margin: ${theme.spacing[4]} 0;
  padding: ${theme.spacing[4]};
  background: ${theme.colors.gray50};
  border-radius: ${theme.borderRadius.md};
  border-left: 4px solid ${theme.colors.primary};
`

const PriceSectionTitle = styled.h4`
  margin: 0 0 ${theme.spacing[3]} 0;
  color: ${theme.colors.gray800};
  font-size: 1.1rem;
  font-weight: 600;
`

const PriceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${theme.spacing[3]};
`

const PriceItem = styled.div`
  background: ${theme.colors.white};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  text-align: center;
  border: 1px solid ${theme.colors.gray200};
`

const PriceValue = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing[1]};
`

const PriceLabel = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.gray600};
`

const Section = styled.div`
  margin: ${theme.spacing[4]} 0;
`

const SectionTitle = styled.h4`
  margin: 0 0 ${theme.spacing[3]} 0;
  color: ${theme.colors.gray800};
  font-size: 1.1rem;
  font-weight: 600;
`

const AttackCard = styled.div`
  margin: ${theme.spacing[2]} 0;
  padding: ${theme.spacing[3]};
  background: ${theme.colors.gray50};
  border-radius: ${theme.borderRadius.md};
  border-left: 4px solid ${theme.colors.primary};
`

const AttackName = styled.div`
  font-weight: bold;
  color: ${theme.colors.gray800};
  margin-bottom: ${theme.spacing[1]};
`

const AttackDetails = styled.div`
  font-size: 0.9rem;
  color: ${theme.colors.gray600};
  margin-bottom: ${theme.spacing[1]};
`

const AttackDescription = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.gray700};
  margin: ${theme.spacing[2]} 0 0 0;
  line-height: 1.4;
`

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing[4]};
  right: ${theme.spacing[4]};
  background: ${theme.colors.white};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.shadows.md};
  transition: all 0.2s ease;
  z-index: 1001;

  &:hover {
    background: ${theme.colors.gray100};
    transform: scale(1.1);
  }
`

export const CardDetails: React.FC<CardDetailsProps> = ({
  card,
  isOpen,
  onClose,
  tcgInfo,
  isLoadingTcg = false,
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'
  }, [isOpen])
  if (!card || !isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  return (
    <Overlay $show={isOpen} onClick={handleOverlayClick}>
      <ModalContent>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <CardImageSection>
          <CardImage
            onClick={() => {
              if (tcgInfo) {
                console.log('Card image clicked:', tcgInfo)
              } else {
                console.log('Card image clicked, but no tcgInfo available')
              }
            }}
            src={card.pokemon_cards?.images.large}
            alt={card.pokemon_cards?.name}
          />
        </CardImageSection>

        <DetailsSection>
          <CardTitle>{card.pokemon_cards?.name}</CardTitle>
          <CardSubtitle>{card.pokemon_cards?.set?.name}</CardSubtitle>

          <StatsGrid>
            <StatItem>
              <StatValue>{card.pokemon_cards?.hp || 'N/A'}</StatValue>
              <StatLabel>HP</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{card.pokemon_cards?.rarity}</StatValue>
              <StatLabel>Rarità</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>#{card.pokemon_cards?.number}</StatValue>
              <StatLabel>Numero</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{card.quantity}</StatValue>
              <StatLabel>Possedute</StatLabel>
            </StatItem>
          </StatsGrid>

          {/* Sezione Loading o Prezzi */}
          {isLoadingTcg ? (
            <LoadingSection>📡 Scaricando informazioni...</LoadingSection>
          ) : tcgInfo?.tcgplayer?.prices ? (
            <PriceSection>
              <PriceSectionTitle>💰 Prezzi TCGPlayer</PriceSectionTitle>
              <PriceGrid>
                {tcgInfo.tcgplayer.prices.holofoil && (
                  <>
                    <PriceItem>
                      <PriceValue>{formatPrice(tcgInfo.tcgplayer.prices.holofoil.low)}</PriceValue>
                      <PriceLabel>Holo Low</PriceLabel>
                    </PriceItem>
                    <PriceItem>
                      <PriceValue>{formatPrice(tcgInfo.tcgplayer.prices.holofoil.mid)}</PriceValue>
                      <PriceLabel>Holo Mid</PriceLabel>
                    </PriceItem>
                    <PriceItem>
                      <PriceValue>{formatPrice(tcgInfo.tcgplayer.prices.holofoil.high)}</PriceValue>
                      <PriceLabel>Holo High</PriceLabel>
                    </PriceItem>
                    <PriceItem>
                      <PriceValue>
                        {formatPrice(tcgInfo.tcgplayer.prices.holofoil.market)}
                      </PriceValue>
                      <PriceLabel>Market Price</PriceLabel>
                    </PriceItem>
                  </>
                )}
                {tcgInfo.tcgplayer.prices.normal && (
                  <>
                    <PriceItem>
                      <PriceValue>{formatPrice(tcgInfo.tcgplayer.prices.normal.low)}</PriceValue>
                      <PriceLabel>Normal Low</PriceLabel>
                    </PriceItem>
                    <PriceItem>
                      <PriceValue>{formatPrice(tcgInfo.tcgplayer.prices.normal.mid)}</PriceValue>
                      <PriceLabel>Normal Mid</PriceLabel>
                    </PriceItem>
                    <PriceItem>
                      <PriceValue>{formatPrice(tcgInfo.tcgplayer.prices.normal.market)}</PriceValue>
                      <PriceLabel>Normal Market</PriceLabel>
                    </PriceItem>
                  </>
                )}
              </PriceGrid>
            </PriceSection>
          ) : null}
        </DetailsSection>
      </ModalContent>
    </Overlay>
  )
}

export default CardDetails
