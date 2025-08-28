'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  FolderPlus,
  Folder,
  Edit3,
  Trash2,
  Plus,
  ArrowLeft,
  Settings,
  Image as ImageIcon,
  Users,
  Lock,
} from 'lucide-react'
import { Heading, Text, Card, Button } from '../ui'

import { collectionService, Album, CollectionItem } from '../../services/collection'
import { theme } from '../../styles/theme'

const AlbumContainer = styled.div`
  padding: ${theme.spacing[4]} 0;
`

const AlbumHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[6]};
  flex-wrap: wrap;
  gap: ${theme.spacing[3]};
`

const AlbumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`

const AlbumCard = styled(Card)`
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  min-height: 180px;
  background: linear-gradient(135deg, ${theme.colors.primary}08, ${theme.colors.pokemonBlue}08);

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`

const AlbumCover = styled.div`
  height: 120px;
  background: linear-gradient(135deg, ${theme.colors.gray100}, ${theme.colors.gray200});
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing[3]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
`

const AlbumInfo = styled.div`
  padding: 0 ${theme.spacing[2]};
`

const AlbumTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0 0 ${theme.spacing[1]} 0;
  color: ${theme.colors.gray800};
`

const AlbumMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: ${theme.colors.gray500};
`

const AlbumActions = styled.div`
  position: absolute;
  top: ${theme.spacing[2]};
  right: ${theme.spacing[2]};
  display: flex;
  gap: ${theme.spacing[1]};
  opacity: 0;
  transition: opacity 0.2s ease;

  ${AlbumCard}:hover & {
    opacity: 1;
  }
`

const ActionButton = styled.button`
  background: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing[1]};
  cursor: pointer;
  box-shadow: ${theme.shadows.sm};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${theme.colors.gray50};
  }
`

const CreateAlbumCard = styled(AlbumCard)`
  border: 2px dashed ${theme.colors.gray300};
  background: ${theme.colors.gray50};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 200px;

  &:hover {
    border-color: ${theme.colors.primary};
    background: ${theme.colors.primary}05;
  }
`

const Modal = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.$show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[6]};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing[4]};
`

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing[2]};
  font-weight: 500;
  color: ${theme.colors.gray700};
`

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing[3]};
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}20;
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing[3]};
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}20;
  }
`

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[2]};
`

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
`

const ModalActions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  justify-content: flex-end;
  margin-top: ${theme.spacing[6]};
`

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[4]};
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[4]};
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.gray500};
`

const SetupMessage = styled(Card)`
  text-align: center;
  padding: ${theme.spacing[8]};
  background: linear-gradient(135deg, ${theme.colors.info}10, ${theme.colors.primary}10);
  border: 2px dashed ${theme.colors.info};
`

const CodeBlock = styled.div`
  background: ${theme.colors.gray900};
  color: ${theme.colors.white};
  padding: ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  font-family: monospace;
  font-size: 0.9rem;
  margin: ${theme.spacing[4]} 0;
  overflow-x: auto;
  white-space: pre;
`

interface AlbumManagerProps {
  collectionItems?: CollectionItem[]
  onAddToAlbum?: (cardId: string, albumId: string) => void
}

export const AlbumManager: React.FC<AlbumManagerProps> = ({
  collectionItems = [],
  onAddToAlbum,
}) => {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [albumCards, setAlbumCards] = useState<CollectionItem[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)

  // Form state
  const [albumName, setAlbumName] = useState('')
  const [albumDescription, setAlbumDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    loadAlbums()
  }, [])

  const loadAlbums = async () => {
    try {
      setLoading(true)
      const userAlbums = await collectionService.getUserAlbums()
      setAlbums(userAlbums)
    } catch (error) {
      console.error('Error loading albums:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAlbumCards = async (albumId: string) => {
    try {
      const cards = await collectionService.getAlbumCards(albumId)
      setAlbumCards(cards)
    } catch (error) {
      console.error('Error loading album cards:', error)
    }
  }

  const handleCreateAlbum = async () => {
    if (!albumName.trim()) return

    const album = await collectionService.createAlbum(
      albumName.trim(),
      albumDescription.trim() || undefined,
      isPublic
    )

    if (album) {
      await loadAlbums()
      setShowCreateModal(false)
      resetForm()
    }
  }

  const handleEditAlbum = async () => {
    if (!editingAlbum || !albumName.trim()) return

    const success = await collectionService.updateAlbum(editingAlbum.id, {
      name: albumName.trim(),
      description: albumDescription.trim() || undefined,
      is_public: isPublic,
    })

    if (success) {
      await loadAlbums()
      setShowEditModal(false)
      setEditingAlbum(null)
      resetForm()
    }
  }

  const handleDeleteAlbum = async (albumId: string) => {
    if (
      !confirm(
        'Sei sicuro di voler eliminare questo album? Le carte rimarranno nella tua collezione.'
      )
    ) {
      return
    }

    const success = await collectionService.deleteAlbum(albumId)
    if (success) {
      await loadAlbums()
      if (selectedAlbum?.id === albumId) {
        setSelectedAlbum(null)
      }
    }
  }

  const handleRemoveFromAlbum = async (cardId: string) => {
    if (!selectedAlbum) return

    const success = await collectionService.removeCardFromAlbum(cardId, selectedAlbum.id)
    if (success) {
      await loadAlbumCards(selectedAlbum.id)
      await loadAlbums() // Refresh card counts
    }
  }

  const openEditModal = (album: Album) => {
    setEditingAlbum(album)
    setAlbumName(album.name)
    setAlbumDescription(album.description || '')
    setIsPublic(album.is_public)
    setShowEditModal(true)
  }

  const resetForm = () => {
    setAlbumName('')
    setAlbumDescription('')
    setIsPublic(false)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setEditingAlbum(null)
    resetForm()
  }

  if (loading) {
    return (
      <AlbumContainer>
        <Text>Caricamento album...</Text>
      </AlbumContainer>
    )
  }

  // Vista album specifico
  if (selectedAlbum) {
    return (
      <AlbumContainer>
        <BackButton
          variant="outline"
          onClick={() => {
            setSelectedAlbum(null)
            setAlbumCards([])
          }}
        >
          <ArrowLeft size={16} />
          Torna agli Album
        </BackButton>

        <AlbumHeader>
          <div>
            <Heading size="xl">📁 {selectedAlbum.name}</Heading>
            {selectedAlbum.description && (
              <Text style={{ marginTop: theme.spacing[1], color: theme.colors.gray500 }}>
                {selectedAlbum.description}
              </Text>
            )}
            <Text size="sm" style={{ marginTop: theme.spacing[1], color: theme.colors.gray400 }}>
              {albumCards.length} carte • {selectedAlbum.is_public ? 'Pubblico' : 'Privato'}
            </Text>
          </div>
          <div style={{ display: 'flex', gap: theme.spacing[2] }}>
            <Button variant="outline" onClick={() => openEditModal(selectedAlbum)}>
              <Settings size={16} />
              Impostazioni
            </Button>
            <Button
              variant="outline"
              style={{ color: theme.colors.danger, borderColor: theme.colors.danger }}
              onClick={() => handleDeleteAlbum(selectedAlbum.id)}
            >
              <Trash2 size={16} />
              Elimina Album
            </Button>
          </div>
        </AlbumHeader>

        {/* Griglia delle carte dell'album */}
        {albumCards.length === 0 ? (
          <EmptyState>
            <ImageIcon size={48} style={{ marginBottom: theme.spacing[4], opacity: 0.3 }} />
            <Heading size="lg" style={{ marginBottom: theme.spacing[2] }}>
              Album Vuoto
            </Heading>
            <Text style={{ marginBottom: theme.spacing[4] }}>
              Questo album non contiene ancora nessuna carta.
              <br />
              Aggiungi carte alla tua collezione e poi aggiungile all&apos;album.
            </Text>
            <Button variant="outline" onClick={() => console.log('Redirect to collection')}>
              Vai alla Collezione
            </Button>
          </EmptyState>
        ) : (
          <CardGrid>
            {albumCards.map(item => (
              <Card key={item.id} style={{ position: 'relative' }}>
                {/* Immagine carta */}
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '3 / 4',
                    background: `url(${item.pokemon_cards?.images?.small || '/placeholder-card.png'}) center/cover`,

                    borderRadius: theme.borderRadius.md,
                    marginBottom: theme.spacing[3],
                    position: 'relative',
                  }}
                >
                  {/* Badge quantità */}
                  <div
                    style={{
                      position: 'absolute',
                      top: theme.spacing[2],
                      right: theme.spacing[2],
                      background: theme.colors.primary,
                      color: 'white',
                      borderRadius: theme.borderRadius.full,
                      padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                    }}
                  >
                    x{item.quantity}
                  </div>
                </div>

                {/* Info carta */}
                <div style={{ padding: `0 ${theme.spacing[3]} ${theme.spacing[3]}` }}>
                  <Heading size="sm" style={{ marginBottom: theme.spacing[1] }}>
                    {item.pokemon_cards?.name || 'Carta Sconosciuta'}
                  </Heading>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.spacing[2],
                    }}
                  >
                    <Text size="sm" style={{ color: theme.colors.gray600 }}>
                      {item.pokemon_cards?.set_id || 'Set sconosciuto'} #
                      {item.pokemon_cards?.number}
                    </Text>
                    <Text size="sm" style={{ color: theme.colors.gray600 }}>
                      {item.pokemon_cards?.rarity}
                    </Text>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: theme.spacing[2],
                    }}
                  >
                    <Text size="sm" style={{ color: theme.colors.gray600 }}>
                      Condizione: {item.condition}
                    </Text>
                    <Text size="sm" style={{ color: theme.colors.gray600 }}>
                      {item.language}
                    </Text>
                  </div>

                  {/* Azioni */}
                  <div
                    style={{ display: 'flex', gap: theme.spacing[2], marginTop: theme.spacing[3] }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFromAlbum(item.card_id)}
                      style={{
                        flex: 1,
                        color: theme.colors.danger,
                        borderColor: theme.colors.danger,
                      }}
                    >
                      <Trash2 size={14} />
                      Rimuovi
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </CardGrid>
        )}
      </AlbumContainer>
    )
  }

  // Vista principale degli album
  return (
    <AlbumContainer>
      <AlbumHeader>
        <div>
          <Heading size="xl">📁 I Miei Album</Heading>
          <Text style={{ marginTop: theme.spacing[1], color: theme.colors.gray500 }}>
            Organizza le tue carte in album personalizzati
          </Text>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <FolderPlus size={16} />
          Nuovo Album
        </Button>
      </AlbumHeader>

      {albums.length === 0 && !loading ? null : (
        <AlbumGrid>
          {/* Card per creare nuovo album */}
          <CreateAlbumCard onClick={() => setShowCreateModal(true)}>
            <FolderPlus size={32} style={{ marginBottom: theme.spacing[2], opacity: 0.5 }} />
            <Text weight="bold" style={{ marginBottom: theme.spacing[1] }}>
              Crea Nuovo Album
            </Text>
            <Text size="sm" style={{ opacity: 0.7 }}>
              Organizza le tue carte per tema
            </Text>
          </CreateAlbumCard>

          {/* Album esistenti */}
          {albums.map(album => (
            <AlbumCard
              key={album.id}
              onClick={() => {
                setSelectedAlbum(album)
                loadAlbumCards(album.id)
              }}
            >
              <AlbumActions>
                <ActionButton
                  onClick={e => {
                    e.stopPropagation()
                    openEditModal(album)
                  }}
                >
                  <Edit3 size={14} />
                </ActionButton>
                <ActionButton
                  onClick={e => {
                    e.stopPropagation()
                    handleDeleteAlbum(album.id)
                  }}
                >
                  <Trash2 size={14} />
                </ActionButton>
              </AlbumActions>

              <AlbumCover>
                <ImageIcon size={32} style={{ opacity: 0.3 }} />
              </AlbumCover>

              <AlbumInfo>
                <AlbumTitle>{album.name}</AlbumTitle>
                {album.description && (
                  <Text
                    size="sm"
                    style={{ color: theme.colors.gray600, marginBottom: theme.spacing[2] }}
                  >
                    {album.description.length > 50
                      ? `${album.description.substring(0, 50)}...`
                      : album.description}
                  </Text>
                )}
                <AlbumMeta>
                  <span>{album.card_count || 0} carte</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {album.is_public ? <Users size={12} /> : <Lock size={12} />}
                    {album.is_public ? 'Pubblico' : 'Privato'}
                  </span>
                </AlbumMeta>
              </AlbumInfo>
            </AlbumCard>
          ))}
        </AlbumGrid>
      )}

      {/* Modal Creazione Album */}
      <Modal $show={showCreateModal}>
        <ModalContent>
          <Heading size="lg" style={{ marginBottom: theme.spacing[4] }}>
            🎨 Crea Nuovo Album
          </Heading>

          <FormGroup>
            <Label>Nome Album</Label>
            <Input
              type="text"
              value={albumName}
              onChange={e => setAlbumName(e.target.value)}
              placeholder="es. Tutti i miei Pikachu"
              maxLength={50}
            />
          </FormGroup>

          <FormGroup>
            <Label>Descrizione (opzionale)</Label>
            <TextArea
              value={albumDescription}
              onChange={e => setAlbumDescription(e.target.value)}
              placeholder="Descrivi questo album..."
              maxLength={200}
            />
          </FormGroup>

          <FormGroup>
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
              />
              <Label style={{ margin: 0 }}>Rendi questo album pubblico</Label>
            </CheckboxContainer>
            <Text size="sm" style={{ color: theme.colors.gray500, marginTop: theme.spacing[1] }}>
              Gli album pubblici possono essere visti da altri utenti
            </Text>
          </FormGroup>

          <ModalActions>
            <Button variant="outline" onClick={closeModals}>
              Annulla
            </Button>
            <Button onClick={handleCreateAlbum} disabled={!albumName.trim()}>
              <Plus size={16} />
              Crea Album
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Modal Modifica Album */}
      <Modal $show={showEditModal}>
        <ModalContent>
          <Heading size="lg" style={{ marginBottom: theme.spacing[4] }}>
            ✏️ Modifica Album
          </Heading>

          <FormGroup>
            <Label>Nome Album</Label>
            <Input
              type="text"
              value={albumName}
              onChange={e => setAlbumName(e.target.value)}
              placeholder="es. Tutti i miei Pikachu"
              maxLength={50}
            />
          </FormGroup>

          <FormGroup>
            <Label>Descrizione (opzionale)</Label>
            <TextArea
              value={albumDescription}
              onChange={e => setAlbumDescription(e.target.value)}
              placeholder="Descrivi questo album..."
              maxLength={200}
            />
          </FormGroup>

          <FormGroup>
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
              />
              <Label style={{ margin: 0 }}>Rendi questo album pubblico</Label>
            </CheckboxContainer>
          </FormGroup>

          <ModalActions>
            <Button variant="outline" onClick={closeModals}>
              Annulla
            </Button>
            <Button onClick={handleEditAlbum} disabled={!albumName.trim()}>
              <Edit3 size={16} />
              Salva Modifiche
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>
    </AlbumContainer>
  )
}
