#!/bin/bash

echo "🗄️  POKEMON CARD SCANNER - DATABASE SETUP"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ File .env.local non trovato!"
    echo "Assicurati di aver configurato Supabase."
    exit 1
fi

# Load environment variables
source .env.local

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_URL non configurato in .env.local"
    exit 1
fi

echo "🔗 Supabase URL: $NEXT_PUBLIC_SUPABASE_URL"
echo ""

echo "📋 ISTRUZIONI PER SETUP DATABASE:"
echo ""
echo "1️⃣  Apri Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/${NEXT_PUBLIC_SUPABASE_URL##*/}"
echo ""
echo "2️⃣  Vai su 'SQL Editor' nel menu laterale"
echo ""
echo "3️⃣  Copia tutto il contenuto del file:"
echo "   📁 database/schema.sql"
echo ""
echo "4️⃣  Incolla nel SQL Editor e clicca 'Run'"
echo ""
echo "5️⃣  Verifica che tutte le tabelle siano state create:"
echo "   • user_profiles"
echo "   • pokemon_sets"  
echo "   • pokemon_cards"
echo "   • user_collections"
echo "   • user_wishlists"
echo "   • user_watchlists"
echo "   • price_history"
echo "   • scan_history"
echo "   • notifications"
echo ""

echo "🚀 DOPO IL SETUP:"
echo "   • Torna al terminale"
echo "   • Esegui: npm run dev"
echo "   • Testa la registrazione utente"
echo "   • Testa l'aggiunta di carte alla collezione"
echo ""

echo "🎯 Il database includerà:"
echo "   ✅ Tabelle complete per collezioni Pokemon"
echo "   ✅ Sicurezza Row Level Security (RLS)"
echo "   ✅ Indici per performance ottimale"
echo "   ✅ Dati di esempio per testing"
echo "   ✅ Funzioni helper per logica app"
echo ""

# Check if schema.sql exists
if [ -f "database/schema.sql" ]; then
    echo "✅ File schema.sql trovato!"
    echo ""
    echo "🔧 Per aprire rapidamente il file:"
    echo "   code database/schema.sql"
else
    echo "❌ File database/schema.sql non trovato!"
    echo "Assicurati di essere nella directory root del progetto."
    exit 1
fi
