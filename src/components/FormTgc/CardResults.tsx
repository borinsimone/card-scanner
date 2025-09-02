import React from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import { PokemonTCGCard } from '../../services/card-search'
import { collectionService } from '@/services/collection'

// Styled Components
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: #6b7280;
`

const CardContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`

const ImageContainer = styled.div`
  position: relative;
`

const CardImage = styled(Image)`
  width: 100%;
  height: 16rem;
  object-fit: contain;
  background: linear-gradient(to bottom right, #dbeafe, #fdf4ff);
`

const CardNumber = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
`

const CardInfo = styled.div`
  padding: 1rem;
`

const Header = styled.div`
  margin-bottom: 0.75rem;
`

const CardName = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.25rem;
`

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const RarityText = styled.span<{ $rarity: string }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => {
    const colors: { [key: string]: string } = {
      Common: '#4b5563',
      Uncommon: '#059669',
      Rare: '#2563eb',
      'Rare Holo': '#7c3aed',
      'Ultra Rare': '#d97706',
    }
    return colors[props.$rarity] || '#4b5563'
  }};
`

const HPText = styled.span`
  font-size: 0.875rem;
  font-weight: bold;
  color: #dc2626;
`

const TypesContainer = styled.div`
  margin-bottom: 0.75rem;
`

const TypesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`

const TypeBadge = styled.span<{ $type: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    const colors: { [key: string]: string } = {
      Grass: '#10b981',
      Fire: '#ef4444',
      Water: '#3b82f6',
      Lightning: '#eab308',
      Psychic: '#8b5cf6',
      Fighting: '#ea580c',
      Darkness: '#374151',
      Metal: '#6b7280',
      Fairy: '#ec4899',
      Dragon: '#4f46e5',
      Colorless: '#9ca3af',
    }
    return colors[props.$type] || '#9ca3af'
  }};
`

const SetInfo = styled.div`
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 0.25rem;
`

const SetName = styled.div`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`

const SetDetails = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`

const AttacksSection = styled.div`
  margin-bottom: 0.75rem;
`

const SectionTitle = styled.h4`
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`

const AttacksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const AttackCard = styled.div`
  background: #f9fafb;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
`

const AttackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
`

const AttackName = styled.span`
  font-weight: 500;
`

const AttackDamage = styled.span`
  color: #dc2626;
  font-weight: bold;
`

const EnergyCosts = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
`

const EnergyIcon = styled.span<{ $type: string }>`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: ${props => {
    const colors: { [key: string]: string } = {
      Grass: '#10b981',
      Fire: '#ef4444',
      Water: '#3b82f6',
      Lightning: '#eab308',
      Psychic: '#8b5cf6',
      Fighting: '#ea580c',
      Darkness: '#374151',
      Metal: '#6b7280',
      Fairy: '#ec4899',
      Dragon: '#4f46e5',
      Colorless: '#9ca3af',
    }
    return colors[props.$type] || '#9ca3af'
  }};
`

const AttackText = styled.p`
  color: #4b5563;
  font-size: 0.75rem;
`

const WeaknessResistanceContainer = styled.div`
  margin-bottom: 0.75rem;
  display: flex;
  gap: 1rem;
`

const WeaknessContainer = styled.div``

const ResistanceContainer = styled.div``

const WeaknessTitle = styled.h4`
  font-weight: 600;
  color: #374151;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
`

const WeaknessValue = styled.span`
  font-size: 0.75rem;
  color: #dc2626;
`

const ResistanceValue = styled.span`
  font-size: 0.75rem;
  color: #059669;
`

const PricingSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 0.75rem;
`

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  font-size: 0.75rem;
`

const PriceGroup = styled.div``

const PriceLabel = styled.div`
  font-weight: 500;
  color: #4b5563;
`

const PriceValue = styled.div`
  color: #059669;
`

const PriceLow = styled.div`
  color: #6b7280;
`

const CardMarketPrices = styled.div`
  grid-column: span 2;
`

const CardMarketRow = styled.div`
  display: flex;
  justify-content: space-between;
`

const FlavorSection = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
`

const FlavorText = styled.p`
  font-size: 0.75rem;
  color: #4b5563;
  font-style: italic;
`

const ArtistInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
`

interface CardResultsProps {
  results: {
    success: boolean
    cards: PokemonTCGCard[]
    totalCount: number
    source: string
    query: string
    processingTime: number
  }
}

function CardResults({ results }: CardResultsProps) {
  if (!results.success || results.cards.length === 0) {
    return <NoResultsMessage>Nessuna carta trovata</NoResultsMessage>
  }

  return (
    <Container>
      {results.cards.map(card => (
        <PokemonCard key={card.id} card={card} />
      ))}
    </Container>
  )
}

interface PokemonCardProps {
  card: PokemonTCGCard
}

function PokemonCard({ card }: PokemonCardProps) {
  const formatPrice = (price: number | undefined) => {
    return price ? `$${price.toFixed(2)}` : 'N/A'
  }

  return (
    <CardContainer>
      {/* Card Image */}
      <ImageContainer>
        <CardImage
          src={card.images.large}
          alt={card.name}
          width={250}
          height={350}
          onError={e => {
            e.currentTarget.src = '/placeholder-card.png'
          }}
        />
        <CardNumber>#{card.number}</CardNumber>
        <button
          onClick={() => {
            console.log('Aggiungi alla collezione:', card)
            collectionService
              .addToCollection(card)
              .then(() => {
                alert(`${card.name} aggiunta alla collezione!`)
              })
              .catch(() => {
                alert(`Errore nell'aggiungere ${card.name} alla collezione.`)
              })
          }}
        >
          aggiungi alla collezione
        </button>
        <button
          onClick={() => {
            console.log('Aggiungi alla wishlist:', card)
            collectionService
              .addToWishlist(card)
              .then(() => {
                alert(`${card.name} aggiunta alla wishlist!`)
              })
              .catch(() => {
                alert(`Errore nell'aggiungere ${card.name} alla wishlist.`)
              })
          }}
        >
          aggiungi alla wishlist
        </button>
      </ImageContainer>
    </CardContainer>
  )
}

// {/* Card Info */}
// <CardInfo>
//   {/* Header */}
//   <Header>
//     <CardName>{card.name}</CardName>
//     <HeaderRow>
//       <RarityText $rarity={card.rarity}>{card.rarity}</RarityText>
//       {card.hp && <HPText>HP {card.hp}</HPText>}
//     </HeaderRow>
//   </Header>

//   {/* Types */}
//   {card.types && (
//     <TypesContainer>
//       <TypesWrapper>
//         {card.types.map((type, index) => (
//           <TypeBadge key={index} $type={type}>
//             {type}
//           </TypeBadge>
//         ))}
//       </TypesWrapper>
//     </TypesContainer>
//   )}

//   {/* Set Info */}
//   <SetInfo>
//     <SetName>{card.set.name}</SetName>
//     <SetDetails>
//       {card.set.series} • {card.set.releaseDate}
//     </SetDetails>
//   </SetInfo>

//   {/* Attacks */}
//   {card.attacks && card.attacks.length > 0 && (
//     <AttacksSection>
//       <SectionTitle>Attacchi:</SectionTitle>
//       <AttacksList>
//         {card.attacks.map((attack, index) => (
//           <AttackCard key={index}>
//             <AttackHeader>
//               <AttackName>{attack.name}</AttackName>
//               <AttackDamage>{attack.damage}</AttackDamage>
//             </AttackHeader>
//             <EnergyCosts>
//               {attack.cost.map((energy, i) => (
//                 <EnergyIcon key={i} $type={energy} />
//               ))}
//             </EnergyCosts>
//             <AttackText>{attack.text}</AttackText>
//           </AttackCard>
//         ))}
//       </AttacksList>
//     </AttacksSection>
//   )}

//   {/* Weaknesses & Resistances */}
//   <WeaknessResistanceContainer>
//     {card.weaknesses && (
//       <WeaknessContainer>
//         <WeaknessTitle>Debolezza:</WeaknessTitle>
//         {card.weaknesses.map((weakness, index) => (
//           <WeaknessValue key={index}>
//             {weakness.type} {weakness.value}
//           </WeaknessValue>
//         ))}
//       </WeaknessContainer>
//     )}
//     {card.resistances && (
//       <ResistanceContainer>
//         <WeaknessTitle>Resistenza:</WeaknessTitle>
//         {card.resistances.map((resistance, index) => (
//           <ResistanceValue key={index}>
//             {resistance.type} {resistance.value}
//           </ResistanceValue>
//         ))}
//       </ResistanceContainer>
//     )}
//   </WeaknessResistanceContainer>

//   {/* Pricing */}
//   {(card.tcgplayer?.prices || card.cardmarket?.prices) && (
//     <PricingSection>
//       <SectionTitle>Prezzi:</SectionTitle>
//       <PricingGrid>
//         {card.tcgplayer?.prices?.normal && (
//           <PriceGroup>
//             <PriceLabel>TCGPlayer Normal</PriceLabel>
//             <PriceValue>
//               Market: {formatPrice(card.tcgplayer.prices.normal.market)}
//             </PriceValue>
//             <PriceLow>Low: {formatPrice(card.tcgplayer.prices.normal.low)}</PriceLow>
//           </PriceGroup>
//         )}
//         {card.tcgplayer?.prices?.reverseHolofoil && (
//           <PriceGroup>
//             <PriceLabel>TCGPlayer Reverse</PriceLabel>
//             <PriceValue>
//               Market: {formatPrice(card.tcgplayer.prices.reverseHolofoil.market)}
//             </PriceValue>
//             <PriceLow>Low: {formatPrice(card.tcgplayer.prices.reverseHolofoil.low)}</PriceLow>
//           </PriceGroup>
//         )}
//         {card.cardmarket?.prices && (
//           <CardMarketPrices>
//             <PriceLabel>CardMarket</PriceLabel>
//             <CardMarketRow>
//               <span>Trend: {formatPrice(card.cardmarket.prices.trendPrice)}</span>
//               <span>Low: {formatPrice(card.cardmarket.prices.lowPrice)}</span>
//             </CardMarketRow>
//           </CardMarketPrices>
//         )}
//       </PricingGrid>
//     </PricingSection>
//   )}

//   {/* Flavor Text */}
//   {card.flavorText && (
//     <FlavorSection>
//       <FlavorText>&ldquo;{card.flavorText}&rdquo;</FlavorText>
//     </FlavorSection>
//   )}

//   {/* Artist */}
//   {card.artist && <ArtistInfo>Illustratore: {card.artist}</ArtistInfo>}
// </CardInfo>
export default CardResults
