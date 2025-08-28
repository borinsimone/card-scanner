#!/bin/bash

# Script per impostare le API reali per il price tracking
# Esegui questo script quando hai ottenuto le API keys

echo "🔧 Configurazione API Price Tracking"
echo "======================================"

# Controlla se .env.local esiste
if [ ! -f .env.local ]; then
    echo "❌ File .env.local non trovato!"
    echo "Copia .env.example a .env.local e compila le tue API keys"
    exit 1
fi

echo "📋 Guida per ottenere le API keys:"
echo ""

echo "1️⃣  EBAY API:"
echo "   • Vai su: https://developer.ebay.com/"
echo "   • Registrati come developer"
echo "   • Crea una nuova app per ottenere:"
echo "     - Client ID (EBAY_CLIENT_ID)"
echo "     - Client Secret (EBAY_CLIENT_SECRET)"
echo "     - Usa eBay Finding API per cercare prodotti"
echo ""

echo "2️⃣  CARDMARKET API:"
echo "   • Vai su: https://www.cardmarket.com/en/Magic/API"
echo "   • Richiedi accesso developer (può richiedere approvazione)"
echo "   • Usa OAuth 1.0 per l'autenticazione"
echo "   • API endpoint: https://api.cardmarket.com/ws/v2.0/"
echo ""

echo "3️⃣  TCGPLAYER API:"
echo "   • Vai su: https://docs.tcgplayer.com/"
echo "   • Registrati per developer account"
echo "   • Ottieni Public API Key (gratuita ma limitata)"
echo "   • Per accesso completo serve partner agreement"
echo ""

echo "4️⃣  POKEMON TCG API:"
echo "   • API gratuita: https://pokemontcg.io/"
echo "   • Non serve registrazione per uso base"
echo "   • Rate limit: 20000 richieste/ora senza key"
echo "   • Con API key: 100000 richieste/ora"
echo ""

echo "🚀 Implementazione consigliata:"
echo "   1. Inizia con Pokemon TCG API (gratuita)"
echo "   2. Aggiungi eBay Finding API per prezzi reali"
echo "   3. Integra Cardmarket per mercato europeo"
echo "   4. TCGPlayer per mercato USA"
echo ""

echo "💡 Nota: Il codice è già preparato per tutte queste API!"
echo "   Basta uncommentare il codice nei service files e"
echo "   aggiungere le tue API keys nel file .env.local"
