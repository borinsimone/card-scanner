import React, { useState } from 'react'
import Image from 'next/image'
import { PokemonTCGCard } from '../../services/card-search'

interface CardResultsProps {
  cards: PokemonTCGCard[]
  isLoading: boolean
  searchPerformed: boolean
  searchSource?: string // Aggiunta per mostrare la fonte dei dati
  onAddToCollection: (card: PokemonTCGCard) => void
  onAddToWishlist?: (card: PokemonTCGCard) => void
}

const CardResults: React.FC<CardResultsProps> = ({
  cards,
  isLoading,
  searchPerformed,
  searchSource,
  onAddToCollection,
  onAddToWishlist,
}) => {
  const [selectedCard, setSelectedCard] = useState<PokemonTCGCard | null>(null)
  const [addingToCollection, setAddingToCollection] = useState<string | null>(null)
  const [addingToWishlist, setAddingToWishlist] = useState<string | null>(null)

  const handleAddToCollection = async (card: PokemonTCGCard) => {
    setAddingToCollection(card.id)
    try {
      await onAddToCollection(card)
    } finally {
      setAddingToCollection(null)
    }
  }

  const handleAddToWishlist = async (card: PokemonTCGCard) => {
    if (!onAddToWishlist) return
    setAddingToWishlist(card.id)
    try {
      await onAddToWishlist(card)
    } finally {
      setAddingToWishlist(null)
    }
  }

  // Funzione per formattare i prezzi
  const formatPrice = (price: number | undefined) => {
    if (!price) return 'N/A'
    return `$${price.toFixed(2)}`
  }

  // Funzione per ottenere i migliori prezzi disponibili
  const getBestPrices = (card: PokemonTCGCard) => {
    const prices: { source: string; type: string; price: number }[] = []

    // TCGPlayer prezzi
    if (card.tcgplayer?.prices) {
      const tcgPrices = card.tcgplayer.prices
      if (tcgPrices.holofoil?.market) {
        prices.push({ source: 'TCGPlayer', type: 'Holofoil', price: tcgPrices.holofoil.market })
      }
      if (tcgPrices.normal?.market) {
        prices.push({ source: 'TCGPlayer', type: 'Normal', price: tcgPrices.normal.market })
      }
      if (tcgPrices.reverseHolofoil?.market) {
        prices.push({
          source: 'TCGPlayer',
          type: 'Reverse Holo',
          price: tcgPrices.reverseHolofoil.market,
        })
      }
    }

    // CardMarket prezzi
    if (card.cardmarket?.prices) {
      const cmPrices = card.cardmarket.prices
      if (cmPrices.averageSellPrice) {
        prices.push({ source: 'CardMarket', type: 'Avg', price: cmPrices.averageSellPrice })
      }
      if (cmPrices.trendPrice) {
        prices.push({ source: 'CardMarket', type: 'Trend', price: cmPrices.trendPrice })
      }
    }

    return prices.slice(0, 3) // Mostra max 3 prezzi
  }

  if (isLoading) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          margin: '20px 0',
        }}
      >
        <div style={{ fontSize: '18px', color: '#666' }}>🔍 Ricerca in corso...</div>
        <div style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
          Sto cercando le carte nella TCG API
        </div>
      </div>
    )
  }

  if (!searchPerformed) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          margin: '20px 0',
        }}
      >
        <div style={{ fontSize: '18px', color: '#666' }}>🎯 Pronto per la ricerca</div>
        <div style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
          Inserisci un nome Pokemon e/o un Set ID per iniziare
        </div>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          margin: '20px 0',
          border: '1px solid #ffeeba',
        }}
      >
        <div style={{ fontSize: '18px', color: '#856404' }}>⚠️ Nessuna carta trovata</div>
        <div style={{ fontSize: '14px', color: '#856404', marginTop: '10px' }}>
          Prova a modificare i criteri di ricerca o verifica l&apos;ortografia
        </div>
      </div>
    )
  }

  return (
    <div style={{ margin: '20px 0' }}>
      {/* Header risultati */}
      <div
        style={{
          backgroundColor: '#e7f3ff',
          padding: '15px',
          borderRadius: '8px 8px 0 0',
          borderBottom: '1px solid #b3d9ff',
        }}
      >
        <h3 style={{ margin: 0, color: '#0066cc' }}>
          🎴 Risultati trovati: {cards.length} {cards.length === 1 ? 'carta' : 'carte'}
        </h3>
        {searchSource && (
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            📍 Fonte:{' '}
            {searchSource === 'local-database'
              ? '🚀 Database Locale (veloce)'
              : '🌐 Pokemon TCG API (completo)'}
          </div>
        )}
      </div>

      {/* Griglia carte */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '0 0 8px 8px',
          border: '1px solid #b3d9ff',
          borderTop: 'none',
        }}
      >
        {cards.map(card => (
          <div
            key={card.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#fafafa',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            onClick={() => setSelectedCard(card)}
          >
            {/* Header carta */}
            <div style={{ marginBottom: '10px' }}>
              <h4
                style={{
                  margin: '0 0 5px 0',
                  color: '#333',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                {card.name}
              </h4>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Set: {card.set?.name || 'N/A'} | ID: {card.set?.id || 'N/A'}
              </div>
            </div>

            {/* Immagine carta */}
            {card.images?.small && (
              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <Image
                  src={card.images.small}
                  alt={card.name}
                  width={120}
                  height={168}
                  style={{
                    maxWidth: '120px',
                    height: 'auto',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                  }}
                />
              </div>
            )}

            {/* Dettagli carta */}
            <div style={{ fontSize: '13px', color: '#555', marginBottom: '10px' }}>
              {card.supertype && (
                <div>
                  <strong>Tipo:</strong> {card.supertype}
                </div>
              )}
              {card.subtypes && card.subtypes.length > 0 && (
                <div>
                  <strong>Sottotipo:</strong> {card.subtypes.join(', ')}
                </div>
              )}
              {card.rarity && (
                <div>
                  <strong>Rarità:</strong> {card.rarity}
                </div>
              )}
              {card.number && (
                <div>
                  <strong>Numero:</strong> {card.number}/{card.set?.total || '?'}
                </div>
              )}
            </div>

            {/* Sezione Prezzi */}
            {getBestPrices(card).length > 0 && (
              <div
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  backgroundColor: '#f0f8ff',
                  borderRadius: '4px',
                  border: '1px solid #b3d9ff',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#0066cc',
                    marginBottom: '4px',
                  }}
                >
                  💰 Prezzi di Mercato
                </div>
                {getBestPrices(card).map((priceInfo, index) => (
                  <div key={index} style={{ fontSize: '11px', color: '#333', marginBottom: '2px' }}>
                    <strong>{priceInfo.source}</strong> ({priceInfo.type}):{' '}
                    {formatPrice(priceInfo.price)}
                  </div>
                ))}
              </div>
            )}

            {/* Pulsanti azione */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={e => {
                  e.stopPropagation()
                  handleAddToCollection(card)
                }}
                disabled={addingToCollection === card.id}
                style={{
                  flex: 1,
                  padding: '8px',
                  fontSize: '12px',
                  backgroundColor: addingToCollection === card.id ? '#28a745' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: addingToCollection === card.id ? 'default' : 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                {addingToCollection === card.id ? '✓' : '📚'}{' '}
                {addingToCollection === card.id ? 'Aggiunta!' : 'Collezione'}
              </button>

              {onAddToWishlist && (
                <button
                  onClick={e => {
                    e.stopPropagation()
                    handleAddToWishlist(card)
                  }}
                  disabled={addingToWishlist === card.id}
                  style={{
                    flex: 1,
                    padding: '8px',
                    fontSize: '12px',
                    backgroundColor: addingToWishlist === card.id ? '#28a745' : '#ffc107',
                    color: addingToWishlist === card.id ? 'white' : '#212529',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: addingToWishlist === card.id ? 'default' : 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                >
                  {addingToWishlist === card.id ? '✓' : '⭐'}{' '}
                  {addingToWishlist === card.id ? 'Aggiunta!' : 'Wishlist'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal dettagli carta */}
      {selectedCard && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedCard(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Bottone chiudi */}
            <button
              onClick={() => setSelectedCard(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
              }}
            >
              ×
            </button>

            {/* Contenuto modal */}
            <h2 style={{ marginTop: 0 }}>{selectedCard.name}</h2>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {selectedCard.images?.large && (
                <Image
                  src={selectedCard.images.large}
                  alt={selectedCard.name}
                  width={250}
                  height={350}
                  style={{
                    maxWidth: '250px',
                    height: 'auto',
                    borderRadius: '8px',
                  }}
                />
              )}

              <div style={{ flex: 1, minWidth: '250px' }}>
                <h3>Dettagli</h3>
                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  <p>
                    <strong>Set:</strong> {selectedCard.set?.name}
                  </p>
                  <p>
                    <strong>Set ID:</strong> {selectedCard.set?.id}
                  </p>
                  <p>
                    <strong>Numero:</strong> {selectedCard.number}/{selectedCard.set?.total}
                  </p>
                  <p>
                    <strong>Rarità:</strong> {selectedCard.rarity}
                  </p>
                  <p>
                    <strong>Tipo:</strong> {selectedCard.supertype}
                  </p>
                  {selectedCard.subtypes && (
                    <p>
                      <strong>Sottotipi:</strong> {selectedCard.subtypes.join(', ')}
                    </p>
                  )}
                  {selectedCard.hp && (
                    <p>
                      <strong>HP:</strong> {selectedCard.hp}
                    </p>
                  )}
                  {selectedCard.types && (
                    <p>
                      <strong>Tipi Pokemon:</strong> {selectedCard.types.join(', ')}
                    </p>
                  )}
                </div>

                {/* Sezione Prezzi Dettagliata */}
                {(selectedCard.tcgplayer?.prices || selectedCard.cardmarket?.prices) && (
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ color: '#0066cc', marginBottom: '10px' }}>💰 Prezzi di Mercato</h4>

                    {/* TCGPlayer */}
                    {selectedCard.tcgplayer?.prices && (
                      <div style={{ marginBottom: '15px' }}>
                        <h5 style={{ margin: '0 0 8px 0', color: '#333' }}>🏪 TCGPlayer</h5>
                        <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
                          {selectedCard.tcgplayer.prices.normal && (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '4px',
                              }}
                            >
                              <span>Normal:</span>
                              <span>
                                <strong>
                                  {formatPrice(selectedCard.tcgplayer.prices.normal.market)}
                                </strong>
                              </span>
                            </div>
                          )}
                          {selectedCard.tcgplayer.prices.holofoil && (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '4px',
                              }}
                            >
                              <span>Holofoil:</span>
                              <span>
                                <strong>
                                  {formatPrice(selectedCard.tcgplayer.prices.holofoil.market)}
                                </strong>
                              </span>
                            </div>
                          )}
                          {selectedCard.tcgplayer.prices.reverseHolofoil && (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '4px',
                              }}
                            >
                              <span>Reverse Holo:</span>
                              <span>
                                <strong>
                                  {formatPrice(
                                    selectedCard.tcgplayer.prices.reverseHolofoil.market
                                  )}
                                </strong>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* CardMarket */}
                    {selectedCard.cardmarket?.prices && (
                      <div>
                        <h5 style={{ margin: '0 0 8px 0', color: '#333' }}>🌍 CardMarket</h5>
                        <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: '4px',
                            }}
                          >
                            <span>Prezzo Medio:</span>
                            <span>
                              <strong>
                                {formatPrice(selectedCard.cardmarket.prices.averageSellPrice)}
                              </strong>
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: '4px',
                            }}
                          >
                            <span>Trend:</span>
                            <span>
                              <strong>
                                {formatPrice(selectedCard.cardmarket.prices.trendPrice)}
                              </strong>
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: '4px',
                            }}
                          >
                            <span>Più Basso:</span>
                            <span>
                              <strong>
                                {formatPrice(selectedCard.cardmarket.prices.lowPrice)}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CardResults
