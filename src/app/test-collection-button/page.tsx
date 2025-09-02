'use client'

import React from 'react'
import styled from 'styled-components'
import { AddToCollectionButton } from '../../components/ui'

const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
`

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
`

const TestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`

const TestCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

const TestTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
`

const TestDescription = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`

// Carta di esempio per il test
const sampleCard = {
  id: 'xy7-4',
  name: 'Bellossom',
  supertype: 'Pokémon',
  subtypes: ['Stage 2'],
  hp: '120',
  types: ['Grass'],
  evolvesFrom: 'Gloom',
  attacks: [
    {
      name: 'Windmill',
      cost: ['Grass'],
      convertedEnergyCost: 1,
      damage: '20',
      text: 'Switch this Pokémon with 1 of your Benched Pokémon.',
    },
    {
      name: 'Flower Tornado',
      cost: ['Grass', 'Colorless'],
      convertedEnergyCost: 2,
      damage: '60',
      text: 'Move as many Grass Energy attached to your Pokémon to your other Pokémon in any way you like.',
    },
  ],
  weaknesses: [
    {
      type: 'Fire',
      value: '×2',
    },
  ],
  retreatCost: ['Colorless'],
  convertedRetreatCost: 1,
  set: {
    id: 'xy7',
    name: 'Ancient Origins',
    series: 'XY',
    printedTotal: 98,
    total: 100,
    legalities: {
      unlimited: 'Legal',
      expanded: 'Legal',
    },
    ptcgoCode: 'AOR',
    releaseDate: '2015/08/12',
    updatedAt: '2020/08/14 09:35:00',
    images: {
      symbol: 'https://images.pokemontcg.io/xy7/symbol.png',
      logo: 'https://images.pokemontcg.io/xy7/logo.png',
    },
  },
  number: '4',
  artist: 'Mizue',
  rarity: 'Uncommon',
  flavorText:
    'When the heavy rainfall season ends, it is drawn out by warm sunlight to dance in the open.',
  nationalPokedexNumbers: [182],
  legalities: {
    unlimited: 'Legal',
    expanded: 'Legal',
  },
  images: {
    small: 'https://images.pokemontcg.io/xy7/4.png',
    large: 'https://images.pokemontcg.io/xy7/4_hires.png',
  },
  tcgplayer: {
    url: 'https://prices.pokemontcg.io/tcgplayer/xy7-4',
    updatedAt: '2025/08/29',
    prices: {
      normal: {
        low: 0.11,
        mid: 0.25,
        high: 4.95,
        market: 0.25,
        directLow: 0.24,
      },
    },
  },
}

export default function CollectionButtonTestPage() {
  return (
    <Container>
      <Header>
        <Title>🎮 Test AddToCollectionButton</Title>
        <Subtitle>Testa il componente riutilizzabile per aggiungere carte alla collezione</Subtitle>
      </Header>

      <TestGrid>
        <TestCard>
          <TestTitle>Variante Primary - Medium</TestTitle>
          <TestDescription>
            Pulsante standard con dimensioni medie e colore primario
          </TestDescription>
          <AddToCollectionButton card={sampleCard} variant="primary" size="md" />
        </TestCard>

        <TestCard>
          <TestTitle>Variante Small</TestTitle>
          <TestDescription>Pulsante più piccolo per spazi limitati</TestDescription>
          <AddToCollectionButton card={sampleCard} variant="primary" size="sm" />
        </TestCard>

        <TestCard>
          <TestTitle>Variante Large</TestTitle>
          <TestDescription>Pulsante più grande per maggiore visibilità</TestDescription>
          <AddToCollectionButton card={sampleCard} variant="primary" size="lg" />
        </TestCard>

        <TestCard>
          <TestTitle>Variante Secondary</TestTitle>
          <TestDescription>
            Pulsante con colore secondario per azioni meno importanti
          </TestDescription>
          <AddToCollectionButton card={sampleCard} variant="secondary" size="md" />
        </TestCard>

        <TestCard>
          <TestTitle>Full Width</TestTitle>
          <TestDescription>Pulsante che occupa tutta la larghezza del contenitore</TestDescription>
          <AddToCollectionButton card={sampleCard} variant="primary" size="md" fullWidth />
        </TestCard>

        <TestCard>
          <TestTitle>Con Opzioni Avanzate</TestTitle>
          <TestDescription>
            Pulsante che apre un modal con opzioni avanzate per la collezione
          </TestDescription>
          <AddToCollectionButton
            card={sampleCard}
            variant="primary"
            size="md"
            showAdvancedOptions
            onSuccess={() => console.log('Carta aggiunta con successo!')}
            onError={error => console.error('Errore:', error)}
          />
        </TestCard>
      </TestGrid>
    </Container>
  )
}
