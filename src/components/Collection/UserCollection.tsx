'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Package, Search, Filter, Trash2, Edit3, FolderPlus, Folder } from 'lucide-react'
import { Heading, Text, Card, Button } from '../ui'

import { collectionService, CollectionItem, Album } from '../../services/collection'
import { theme } from '../../styles/theme'
import { log } from 'console'
import setsData from '../../pokemon-sets.json'
const CollectionContainer = styled.div`
  padding: ${theme.spacing[4]} 0;
`

const CollectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[6]};
  flex-wrap: wrap;
  gap: ${theme.spacing[3]};
`

const CollectionStats = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
  flex-wrap: wrap;
`

const StatCard = styled(Card)`
  flex: 1;
  min-width: 200px;
  text-align: center;
  background: linear-gradient(135deg, ${theme.colors.primary}10, ${theme.colors.pokemonBlue}10);
`

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing[1]};
`

const StatLabel = styled.div`
  color: ${theme.colors.gray500};
  font-size: 0.9rem;
`

const FilterBar = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[6]};
  align-items: center;
  flex-wrap: wrap;
`

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}20;
  }
`

const FilterSelect = styled.select`
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.md};
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`

const CollectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[4]};
`

const CollectionItemCard = styled(Card)`
  position: relative;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`
const ItemImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: ${theme.borderRadius.sm};
  /* position: absolute;
  z-index: -1;
  bottom: 0;
  left: 0; */
`
const ItemActions = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[3]};
  padding-top: ${theme.spacing[3]};
  border-top: 1px solid ${theme.colors.gray200};
`

const ItemDetails = styled.div`
  margin-top: ${theme.spacing[3]};
  padding: ${theme.spacing[2]};
  background: ${theme.colors.gray50};
  border-radius: ${theme.borderRadius.sm};
`

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[1]};
  font-size: 0.9rem;
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.gray500};
`

const LoadingState = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
`

const AlbumSelector = styled.select`
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.sm};
  background: white;
  font-size: 0.8rem;
  cursor: pointer;
  flex: 1;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`

export const UserCollection: React.FC = () => {
  const [collection, setCollection] = useState<CollectionItem[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    loadCollection()
    loadAlbums()
  }, [])

  const loadCollection = async () => {
    try {
      setLoading(true)
      const items = await collectionService.getUserCollection()
      setCollection(items)
    } catch (error) {
      console.error('Error loading collection:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAlbums = async () => {
    try {
      const userAlbums = await collectionService.getUserAlbums()
      setAlbums(userAlbums)
    } catch (error) {
      console.error('Error loading albums:', error)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    if (confirm('Sei sicuro di voler rimuovere questa carta dalla collezione?')) {
      const success = await collectionService.removeFromCollection(itemId)
      if (success) {
        await loadCollection() // Ricarica la collezione
      }
    }
  }

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId)
      return
    }

    const success = await collectionService.updateCollectionQuantity(itemId, newQuantity)
    if (success) {
      // Aggiorna solo l'item specifico invece di ricaricare tutto
      setCollection(prev =>
        prev.map(item => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
      )
    }
  }

  const handleAddToAlbum = async (cardId: string, albumId: string) => {
    if (!albumId || albumId === '') return

    const success = await collectionService.addCardToAlbum(cardId, albumId)
    if (success) {
      console.log('Card added to album successfully')
      // Opzionalmente mostra un messaggio di successo
    }
  }

  // Filtra e ordina la collezione
  const filteredCollection = collection
    .filter(item => {
      if (!item.pokemon_cards) return false

      const matchesSearch =
        !searchTerm || item.pokemon_cards.name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter =
        filterBy === 'all' ||
        (filterBy === 'holo' && item.is_holo) ||
        (filterBy === 'first-edition' && item.is_first_edition) ||
        (filterBy === 'rare' && item.pokemon_cards.rarity?.toLowerCase().includes('rare'))

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'name':
          return (a.pokemon_cards?.name || '').localeCompare(b.pokemon_cards?.name || '')
        case 'quantity':
          return b.quantity - a.quantity
        default:
          return 0
      }
    })

  // Calcola statistiche
  const stats = {
    totalCards: collection.reduce((sum, item) => sum + item.quantity, 0),
    uniqueCards: collection.length,
    holoCards: collection.filter(item => item.is_holo).length,
    firstEdition: collection.filter(item => item.is_first_edition).length,
  }

  if (loading) {
    return (
      <CollectionContainer>
        <LoadingState>
          <Package size={48} style={{ marginBottom: theme.spacing[3], opacity: 0.3 }} />
          <Text>Caricamento collezione...</Text>
        </LoadingState>
      </CollectionContainer>
    )
  }

  return (
    <CollectionContainer>
      <CollectionHeader>
        <div>
          <Heading size="xl">📦 La Mia Collezione</Heading>
          <Text style={{ marginTop: theme.spacing[1], color: theme.colors.gray500 }}>
            Gestisci e visualizza le tue carte Pokemon
          </Text>
        </div>
        <Button onClick={loadCollection}>
          <Package size={16} />
          Aggiorna
        </Button>
      </CollectionHeader>

      {/* Statistiche */}
      {/* <CollectionStats>
        <StatCard>
          <StatNumber>{stats.totalCards}</StatNumber>
          <StatLabel>Carte Totali</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.uniqueCards}</StatNumber>
          <StatLabel>Carte Uniche</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.holoCards}</StatNumber>
          <StatLabel>Carte Holo</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.firstEdition}</StatNumber>
          <StatLabel>Prima Edizione</StatLabel>
        </StatCard>
      </CollectionStats> */}

      {/* Filtri e ricerca */}
      <FilterBar>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
          <Search size={20} style={{ color: theme.colors.gray500 }} />
          <SearchInput
            type="text"
            placeholder="Cerca carte per nome..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
          <Filter size={20} style={{ color: theme.colors.gray500 }} />
          <FilterSelect value={filterBy} onChange={e => setFilterBy(e.target.value)}>
            <option value="all">Tutte le carte</option>
            <option value="holo">Solo Holo</option>
            <option value="first-edition">Prima Edizione</option>
            <option value="rare">Rare</option>
          </FilterSelect>
        </div>

        <FilterSelect value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Più recenti</option>
          <option value="oldest">Più vecchie</option>
          <option value="name">Nome A-Z</option>
          <option value="quantity">Quantità</option>
        </FilterSelect>
      </FilterBar>

      {/* Griglia collezione */}
      {filteredCollection.length === 0 ? (
        <EmptyState>
          <Package size={64} style={{ marginBottom: theme.spacing[4], opacity: 0.3 }} />
          <Heading size="lg" style={{ marginBottom: theme.spacing[2] }}>
            {collection.length === 0 ? 'Collezione vuota' : 'Nessun risultato'}
          </Heading>
          <Text>
            {collection.length === 0
              ? 'Inizia ad aggiungere carte alla tua collezione!'
              : 'Prova a modificare i filtri di ricerca.'}
          </Text>
        </EmptyState>
      ) : (
        <CollectionGrid>
          {filteredCollection.map(item => (
            <CollectionItemCard key={item.id} onClick={() => console.log(item)}>
              <div>
                {/* <ItemImage
                  src={
                    setsData.find(set => set.id === item.pokemon_cards?.set_id)?.images?.logo || ''
                  }
                  alt=""
                /> */}
                <Heading size="md" style={{ marginBottom: theme.spacing[2] }}>
                  {item.pokemon_cards?.name}
                </Heading>
              </div>
              <img src={item.pokemon_cards?.images.large} alt="" />
              <ItemDetails>
                <Text style={{ color: theme.colors.gray600, marginBottom: theme.spacing[2] }}>
                  {item.pokemon_cards?.set_id} • #{item.pokemon_cards?.number}
                </Text>
                {item.pokemon_cards?.rarity && (
                  <Text style={{ fontSize: '0.9rem', color: theme.colors.gray500 }}>
                    Rarità: {item.pokemon_cards.rarity}
                  </Text>
                )}
                <DetailRow>
                  <strong>Quantità:</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                    >
                      +
                    </Button>
                  </div>
                </DetailRow>
                <DetailRow>
                  <span>Condizione:</span>
                  <span>{item.condition}</span>
                </DetailRow>
                <DetailRow>
                  <span>Lingua:</span>
                  <span>{item.language}</span>
                </DetailRow>
                {item.is_holo && (
                  <DetailRow>
                    <span>✨ Holo</span>
                    <span>Sì</span>
                  </DetailRow>
                )}
                {item.is_first_edition && (
                  <DetailRow>
                    <span>🥇 Prima Edizione</span>
                    <span>Sì</span>
                  </DetailRow>
                )}
                {item.purchase_price && (
                  <DetailRow>
                    <span>Prezzo acquisto:</span>
                    <span>€{item.purchase_price}</span>
                  </DetailRow>
                )}
              </ItemDetails>
              <ItemActions>
                <div
                  style={{ display: 'flex', gap: theme.spacing[2], marginBottom: theme.spacing[2] }}
                >
                  <AlbumSelector
                    onChange={e => handleAddToAlbum(item.card_id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="">Aggiungi ad album...</option>
                    {albums.map(album => (
                      <option key={album.id} value={album.id}>
                        📁 {album.name}
                      </option>
                    ))}
                  </AlbumSelector>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // TODO: Implementare creazione rapida album
                      console.log('Create quick album for:', item.pokemon_cards?.name)
                    }}
                    style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                  >
                    <FolderPlus size={14} />
                  </Button>
                </div>
                <div style={{ display: 'flex', gap: theme.spacing[2] }}>
                  <Button
                    variant="outline"
                    style={{ flex: 1, fontSize: '0.9rem' }}
                    onClick={() => {
                      // TODO: Implementare modifica dettagli
                      console.log('Edit item:', item.id)
                    }}
                  >
                    <Edit3 size={14} />
                    Modifica
                  </Button>
                  <Button
                    variant="outline"
                    style={{
                      color: theme.colors.danger,
                      borderColor: theme.colors.danger,
                      fontSize: '0.9rem',
                    }}
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 size={14} />
                    Rimuovi
                  </Button>
                </div>
              </ItemActions>
            </CollectionItemCard>
          ))}
        </CollectionGrid>
      )}
    </CollectionContainer>
  )
}
