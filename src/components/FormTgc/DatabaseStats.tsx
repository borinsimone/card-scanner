import React from 'react'

interface DatabaseStatsData {
  totalCards: number
  recentCards: number
  uniqueSets: number
  favoriteCards: number
}

interface DatabaseStatsProps {
  stats: DatabaseStatsData | null
  isLoading: boolean
  onRefresh: () => void
}

const DatabaseStats: React.FC<DatabaseStatsProps> = ({ stats, isLoading, onRefresh }) => {
  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          margin: '20px 0',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '16px', color: '#666' }}>📊 Caricamento statistiche...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div
        style={{
          backgroundColor: '#fff3cd',
          padding: '20px',
          borderRadius: '8px',
          margin: '20px 0',
          border: '1px solid #ffeeba',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <div style={{ fontSize: '16px', color: '#856404' }}>
            ⚠️ Impossibile caricare le statistiche
          </div>
        </div>
        <button
          onClick={onRefresh}
          style={{
            display: 'block',
            margin: '0 auto',
            padding: '8px 16px',
            backgroundColor: '#856404',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🔄 Riprova
        </button>
      </div>
    )
  }

  const statItems = [
    {
      icon: '🎴',
      label: 'Carte Totali',
      value: stats.totalCards,
      color: '#007bff',
      bgColor: '#e7f3ff',
    },
    {
      icon: '✨',
      label: 'Carte Recenti',
      value: stats.recentCards,
      color: '#28a745',
      bgColor: '#e8f5e9',
    },
    {
      icon: '📦',
      label: 'Set Unici',
      value: stats.uniqueSets,
      color: '#17a2b8',
      bgColor: '#e6f7ff',
    },
    {
      icon: '❤️',
      label: 'Preferite',
      value: stats.favoriteCards,
      color: '#dc3545',
      bgColor: '#ffedef',
    },
  ]

  return (
    <div style={{ margin: '20px 0' }}>
      {/* Header statistiche */}
      <div
        style={{
          backgroundColor: '#e7f3ff',
          padding: '15px',
          borderRadius: '8px 8px 0 0',
          borderBottom: '1px solid #b3d9ff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 style={{ margin: 0, color: '#0066cc' }}>📊 Statistiche Collezione</h3>
        <button
          onClick={onRefresh}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          title="Aggiorna statistiche"
        >
          🔄 Aggiorna
        </button>
      </div>

      {/* Griglia statistiche */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '0 0 8px 8px',
          border: '1px solid #b3d9ff',
          borderTop: 'none',
        }}
      >
        {statItems.map(item => (
          <div
            key={item.label}
            style={{
              backgroundColor: item.bgColor,
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              border: `1px solid ${item.color}20`,
              transition: 'transform 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div
              style={{
                fontSize: '24px',
                marginBottom: '8px',
              }}
            >
              {item.icon}
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: item.color,
                marginBottom: '5px',
              }}
            >
              {item.value.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: '14px',
                color: '#666',
                fontWeight: '500',
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Insights aggiuntivi */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '10px',
          fontSize: '13px',
          color: '#666',
        }}
      >
        <div style={{ marginBottom: '8px' }}>
          <strong>💡 Quick Insights:</strong>
        </div>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {stats.totalCards === 0 && (
            <li>La tua collezione è vuota - inizia ad aggiungere carte!</li>
          )}
          {stats.totalCards > 0 && stats.recentCards === 0 && (
            <li>Non hai aggiunto carte di recente - cerca nuove carte da collezionare!</li>
          )}
          {stats.totalCards > 0 && (
            <li>
              Media carte per set:{' '}
              {stats.uniqueSets > 0 ? Math.round(stats.totalCards / stats.uniqueSets) : 0}
            </li>
          )}
          {stats.favoriteCards > 0 && (
            <li>
              {Math.round((stats.favoriteCards / stats.totalCards) * 100)}% delle tue carte sono nei
              preferiti
            </li>
          )}
          {stats.totalCards >= 100 && (
            <li>🏆 Ottimo lavoro! Hai già collezionato più di 100 carte!</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default DatabaseStats
