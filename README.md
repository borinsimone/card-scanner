# 🎴 Pokémon Card Scanner

Un'applicazione Next.js per scansionare, riconoscere e tracciare i prezzi delle
carte Pokémon. L'app include funzionalità di riconoscimento automatico tramite
camera, tracking dei prezzi da multiple piattaforme, gestione della collezione
personale e molto altro.

## ✨ Funzionalità Principali

- 📸 **Scansione Intelligente**: Riconosci carte Pokémon automaticamente usando
  la camera
- 💰 **Tracking Prezzi**: Ottieni prezzi in tempo reale da eBay, Cardmarket,
  TCGPlayer
- 📚 **Gestione Collezione**: Organizza la tua collezione con dettagli su
  condizioni e valore
- ❤️ **Wishlist**: Crea liste dei desideri personalizzate
- 👁️ **Monitoraggio**: Tieni d'occhio i prezzi delle carte che ti interessano
- 🔔 **Notifiche**: Ricevi avvisi quando i prezzi scendono
- 🛍️ **Marketplace**: (Futuro) Marketplace interno per vendita/acquisto

## 🚀 Setup del Progetto

### Prerequisiti

- Node.js 18+
- npm, yarn, pnpm o bun
- Account Supabase
- API Keys per servizi esterni (opzionali per sviluppo)

### Installazione

1. **Clona il repository**

   ```bash
   git clone <your-repo-url>
   cd card-scanner
   ```

2. **Installa le dipendenze**

   ```bash
   npm install
   # oppure
   yarn install
   # oppure
   pnpm install
   ```

3. **Configura le variabili d'ambiente**

   Copia il file `.env.local` e configuralo:

   ```bash
   cp .env.local.example .env.local
   ```

   Aggiorna le seguenti variabili:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

   # API Keys per price tracking (opzionali per sviluppo)
   EBAY_API_KEY=your_ebay_api_key_here
   CARDMARKET_API_KEY=your_cardmarket_api_key_here
   TCGPLAYER_API_KEY=your_tcgplayer_api_key_here

   # Pokemon TCG API
   POKEMON_TCG_API_KEY=your_pokemon_tcg_api_key_here
   ```

4. **Setup Database Supabase**

   Crea le seguenti tabelle nel tuo progetto Supabase:

   ```sql
   -- Tabella per le carte Pokemon
   CREATE TABLE pokemon_cards (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     set_name TEXT NOT NULL,
     set_id TEXT NOT NULL,
     number TEXT NOT NULL,
     rarity TEXT NOT NULL,
     artist TEXT,
     image_url TEXT,
     small_image_url TEXT,
     market_price DECIMAL,
     low_price DECIMAL,
     mid_price DECIMAL,
     high_price DECIMAL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Tabella per la collezione dell'utente
   CREATE TABLE user_collection (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     card_id UUID REFERENCES pokemon_cards(id) ON DELETE CASCADE,
     condition TEXT CHECK (condition IN ('mint', 'near_mint', 'excellent', 'good', 'light_played', 'played', 'poor')),
     quantity INTEGER DEFAULT 1,
     is_wishlist BOOLEAN DEFAULT FALSE,
     is_watching BOOLEAN DEFAULT FALSE,
     purchase_price DECIMAL,
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(user_id, card_id, condition)
   );

   -- Tabella per i price alerts
   CREATE TABLE price_alerts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     card_id UUID REFERENCES pokemon_cards(id) ON DELETE CASCADE,
     target_price DECIMAL NOT NULL,
     is_active BOOLEAN DEFAULT TRUE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Tabella per il marketplace (futuro)
   CREATE TABLE marketplace_listings (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     card_id UUID REFERENCES pokemon_cards(id) ON DELETE CASCADE,
     condition TEXT NOT NULL,
     price DECIMAL NOT NULL,
     quantity INTEGER DEFAULT 1,
     description TEXT,
     is_active BOOLEAN DEFAULT TRUE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Indici per performance
   CREATE INDEX idx_pokemon_cards_name ON pokemon_cards(name);
   CREATE INDEX idx_pokemon_cards_set ON pokemon_cards(set_id);
   CREATE INDEX idx_user_collection_user ON user_collection(user_id);
   CREATE INDEX idx_user_collection_wishlist ON user_collection(user_id, is_wishlist);
   CREATE INDEX idx_user_collection_watching ON user_collection(user_id, is_watching);
   CREATE INDEX idx_price_alerts_user ON price_alerts(user_id, is_active);
   ```

5. **Avvia il server di sviluppo**

   ```bash
   npm run dev
   # oppure
   yarn dev
   # oppure
   pnpm dev
   ```

6. **Apri l'applicazione**

   Visita [http://localhost:3000](http://localhost:3000)

## 🔧 Configurazione API Keys

### Supabase

1. Vai su [https://supabase.com](https://supabase.com)
2. Crea un nuovo progetto
3. Vai in Settings > API
4. Copia l'URL e le API keys

### Pokemon TCG API

1. Registrati su [https://pokemontcg.io](https://pokemontcg.io)
2. Ottieni la tua API key gratuita

### eBay API (Opzionale)

1. Registrati su [eBay Developers](https://developer.ebay.com)
2. Crea un'applicazione
3. Ottieni le credenziali API

### Cardmarket API (Opzionale)

1. Registrati su
   [Cardmarket](https://www.cardmarket.com/en/Magic/Documentation/API)
2. Richiedi accesso API

## 📱 Funzionalità Implementate

### ✅ Completate

- [x] Setup progetto Next.js con TypeScript
- [x] Configurazione Styled Components
- [x] Sistema di temi e componenti UI
- [x] Servizio riconoscimento carte (OCR)
- [x] Integrazione Pokemon TCG API
- [x] Sistema di tracking prezzi
- [x] Componente scanner camera
- [x] Visualizzazione dettagli carta
- [x] UI responsive

### 🚧 In Sviluppo

- [ ] Autenticazione utenti (Supabase Auth)
- [ ] Gestione collezione completa
- [ ] Sistema wishlist/watchlist
- [ ] Notifiche price alerts
- [ ] Dashboard utente
- [ ] Ricerca avanzata carte
- [ ] Filtri e ordinamento

### 🔮 Funzionalità Future

- [ ] Marketplace interno
- [ ] Sistema di rating/recensioni
- [ ] Chat tra utenti
- [ ] Geolocalizzazione per scambi locali
- [ ] App mobile React Native
- [ ] Sistema di trading/scambio
- [ ] Integrazione social media

## 🏗️ Architettura del Progetto

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Stili globali
│   ├── layout.tsx         # Layout principale
│   ├── page.tsx           # Homepage
│   └── registry.tsx       # Styled Components SSR
├── components/            # Componenti React
│   ├── ui/                # Componenti UI base
│   ├── CardScanner/       # Scanner carte
│   └── CardDisplay/       # Visualizzazione carta
├── services/              # Servizi API
│   ├── pokemon-tcg.ts     # Pokemon TCG API
│   ├── price-tracking.ts  # Tracking prezzi
│   └── card-recognition.ts # Riconoscimento carte
├── lib/                   # Utilities e configurazioni
│   └── supabase.ts       # Client Supabase
└── styles/               # Temi e stili
    └── theme.ts          # Sistema di design
```

## 🛠️ Tecnologie Utilizzate

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Styled Components, CSS Custom Properties
- **Database**: Supabase (PostgreSQL)
- **APIs**: Pokemon TCG API, eBay API, Cardmarket API
- **Image Processing**: Tesseract.js (OCR)
- **Camera**: react-webcam
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📚 Guide di Sviluppo

### Aggiungere un nuovo componente UI

```tsx
// src/components/ui/NewComponent.tsx
import styled from 'styled-components'
import { theme } from '../../styles/theme'

const StyledComponent = styled.div`
  color: ${theme.colors.primary};
  padding: ${theme.spacing[4]};
`

export const NewComponent = () => {
  return <StyledComponent>Content</StyledComponent>
}
```

### Aggiungere un nuovo servizio API

```tsx
// src/services/new-service.ts
class NewService {
  async fetchData() {
    // Implementazione
  }
}

export const newService = new NewService()
```

## 🚀 Deploy

### Vercel (Raccomandato)

1. Connetti il repository a Vercel
2. Configura le variabili d'ambiente
3. Deploy automatico

### Altri Provider

- Netlify
- Railway
- AWS Amplify

## 🤝 Contribuire

1. Fork del progetto
2. Crea un branch per la feature (`git checkout -b feature/amazing-feature`)
3. Commit delle modifiche (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per maggiori
dettagli.

## 🆘 Supporto

- 📧 Email: [inserisci email]
- 💬 Discord: [inserisci server Discord]
- 🐛 Issues:
  [GitHub Issues](https://github.com/yourusername/card-scanner/issues)

## 🔄 Changelog

### v0.1.0 (Current)

- Setup iniziale del progetto
- Implementazione scanner di base
- Sistema di riconoscimento carte
- UI/UX responsive

---

Creato con ❤️ per la community Pokémon
