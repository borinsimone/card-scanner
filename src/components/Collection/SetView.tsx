import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Book, Package, ChevronRight, Grid3X3 } from 'lucide-react'
import { theme } from '../../styles/theme'
import { CollectionItem } from '../../services/collection'
import pokemonSets from '../../pokemon-sets.json'

// Types
interface SetData {
  id: string
  name: string
  series: string
  printedTotal: number
  total: number
  releaseDate: string
  images: {
    symbol: string
    logo: string
  }
}

interface SetWithCards extends SetData {
  cards: CollectionItem[]
  completionPercentage: number
}

// Styled Components
const SetViewContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: ${theme.spacing[4]};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[6]};
  padding-bottom: ${theme.spacing[4]};
  border-bottom: 2px solid ${theme.colors.gray200};
`

const HeaderIcon = styled.div`
  padding: ${theme.spacing[3]};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: ${theme.borderRadius.lg};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HeaderText = styled.div`
  flex: 1;
`

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${theme.colors.gray900};
  margin: 0 0 ${theme.spacing[1]} 0;
`

const Subtitle = styled.p`
  color: ${theme.colors.gray600};
  margin: 0;
  font-size: 1rem;
`

const SetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`

const SetCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${theme.colors.primary};
  }
`

const SetHeader = styled.div`
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray200};
`

const SetLogo = styled.img`
  width: 100%;
  height: 60px;
  object-fit: contain;
  margin-bottom: ${theme.spacing[3]};
`

const SetName = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${theme.colors.gray900};
  margin: 0 0 ${theme.spacing[1]} 0;
`

const SetSeries = styled.p`
  color: ${theme.colors.gray600};
  margin: 0;
  font-size: 0.9rem;
`

const SetBody = styled.div`
  padding: ${theme.spacing[4]};
`

const SetStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[3]};
`

const StatItem = styled.div`
  text-align: center;
`

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${theme.colors.primary};
`

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.gray600};
  text-transform: uppercase;
  font-weight: 500;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${theme.colors.gray200};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: ${theme.spacing[3]};
`

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  width: ${props => props.$percentage}%;
  transition: width 0.3s ease;
`

const CompletionText = styled.div`
  text-align: center;
  color: ${theme.colors.gray600};
  font-size: 0.9rem;
  font-weight: 500;
`

const SetCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[4]};
`

const SetCardItem = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
`

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`

const CardInfo = styled.div`
  padding: ${theme.spacing[2]};
  border-top: 1px solid ${theme.colors.gray200};
`

const CardName = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${theme.colors.gray900};
  margin-bottom: ${theme.spacing[1]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CardQuantity = styled.div`
  font-size: 0.7rem;
  color: ${theme.colors.gray600};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`

const EmptySetState = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.gray500};
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  background: ${theme.colors.gray100};
  border: none;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  color: ${theme.colors.gray700};
  font-weight: 500;
  margin-bottom: ${theme.spacing[4]};
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.gray200};
    color: ${theme.colors.gray900};
  }
`

interface Props {
  collection: CollectionItem[]
  onCardClick: (card: CollectionItem) => void
}

export const SetView: React.FC<Props> = ({ collection, onCardClick }) => {
  const [selectedSet, setSelectedSet] = useState<string | null>(null)
  const [setsWithCards, setSetsWithCards] = useState<SetWithCards[]>([])

  useEffect(() => {
    // Raggruppa le carte per set
    const setMap = new Map<string, CollectionItem[]>()

    collection.forEach(item => {
      if (item.pokemon_cards?.set_id) {
        const setId = item.pokemon_cards.set_id
        if (!setMap.has(setId)) {
          setMap.set(setId, [])
        }
        setMap.get(setId)!.push(item)
      }
    })

    // Crea array di set con le carte e statistiche
    const setsWithCardsData: SetWithCards[] = Array.from(setMap.entries())
      .map(([setId, cards]) => {
        const setData = pokemonSets.find(set => set.id === setId) as SetData
        if (!setData) return null

        const completionPercentage = Math.round((cards.length / setData.total) * 100)

        return {
          ...setData,
          cards,
          completionPercentage,
        }
      })
      .filter((set): set is SetWithCards => set !== null)
      .sort((a, b) => b.completionPercentage - a.completionPercentage)

    setSetsWithCards(setsWithCardsData)
  }, [collection])

  const selectedSetData = selectedSet ? setsWithCards.find(set => set.id === selectedSet) : null

  if (selectedSet && selectedSetData) {
    return (
      <SetViewContainer>
        <BackButton onClick={() => setSelectedSet(null)}>
          <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
          Torna ai Set
        </BackButton>

        <Header>
          <HeaderIcon>
            <Grid3X3 size={24} />
          </HeaderIcon>
          <HeaderText>
            <Title>{selectedSetData.name}</Title>
            <Subtitle>
              {selectedSetData.series} • {selectedSetData.cards.length} di {selectedSetData.total}{' '}
              carte
            </Subtitle>
          </HeaderText>
        </Header>

        <SetCardsGrid>
          {selectedSetData.cards.map(item => (
            <SetCardItem key={item.id} onClick={() => onCardClick(item)}>
              <CardImage
                src={item.pokemon_cards?.images.small}
                alt={item.pokemon_cards?.name || ''}
              />
              <CardInfo>
                <CardName>{item.pokemon_cards?.name}</CardName>
                <CardQuantity>
                  <Package size={12} />
                  Quantità: {item.quantity}
                </CardQuantity>
              </CardInfo>
            </SetCardItem>
          ))}
        </SetCardsGrid>
      </SetViewContainer>
    )
  }

  return (
    <SetViewContainer>
      <Header>
        <HeaderIcon>
          <Book size={24} />
        </HeaderIcon>
        <HeaderText>
          <Title>Collezione per Set</Title>
          <Subtitle>Visualizza le tue carte organizzate per set Pokemon</Subtitle>
        </HeaderText>
      </Header>

      {setsWithCards.length === 0 ? (
        <EmptySetState>
          <Book size={64} style={{ marginBottom: theme.spacing[4], opacity: 0.3 }} />
          <h3>Nessun set trovato</h3>
          <p>Inizia ad aggiungere carte alla tua collezione per visualizzarle per set!</p>
        </EmptySetState>
      ) : (
        <SetsGrid>
          {setsWithCards.map(set => (
            <SetCard key={set.id} onClick={() => setSelectedSet(set.id)}>
              <SetHeader>
                <SetLogo
                  src={set.images.logo}
                  alt={set.name}
                  onError={e => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <SetName>{set.name}</SetName>
                <SetSeries>{set.series}</SetSeries>
              </SetHeader>

              <SetBody>
                <SetStats>
                  <StatItem>
                    <StatValue>{set.cards.length}</StatValue>
                    <StatLabel>Possedute</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{set.total}</StatValue>
                    <StatLabel>Totali</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{set.completionPercentage}%</StatValue>
                    <StatLabel>Completato</StatLabel>
                  </StatItem>
                </SetStats>

                <ProgressBar>
                  <ProgressFill $percentage={set.completionPercentage} />
                </ProgressBar>

                <CompletionText>
                  {set.completionPercentage === 100
                    ? '🎉 Set Completato!'
                    : `${set.total - set.cards.length} carte mancanti`}
                </CompletionText>
              </SetBody>
            </SetCard>
          ))}
        </SetsGrid>
      )}
    </SetViewContainer>
  )
}

export default SetView
