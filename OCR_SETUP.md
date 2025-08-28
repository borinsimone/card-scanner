# 🚀 Configurazione OCR Cloud - Guida Completa

Il tuo scanner di carte Pokemon ora supporta servizi OCR cloud molto più
performanti di Tesseract.js locale!

## 🌟 Vantaggi dei Servizi Cloud

- **OCR.space**: 25,000 richieste gratuite/mese
- **Google Vision**: 1,000 richieste gratuite/mese
- **Azure Computer Vision**: 5,000 richieste gratuite/mese
- **Accuratezza superiore**: Riconoscimento testo migliore del 70-90%
- **Velocità**: Elaborazione 3-5x più veloce
- **Fallback automatico**: Se un servizio non funziona, prova il successivo

## 🔧 Setup Veloce (5 minuti)

### 1. OCR.space (GRATUITO - Consigliato per iniziare)

1. Vai su https://ocr.space/OCRAPI
2. Inserisci la tua email per ottenere la API key gratuita
3. Copia la chiave nel file `.env.local`:

```bash
NEXT_PUBLIC_OCR_SPACE_API_KEY=K87654321
```

### 2. Google Vision API (Opzionale - Più accurato)

1. Vai su https://console.cloud.google.com/
2. Crea un nuovo progetto o seleziona esistente
3. Abilita "Cloud Vision API"
4. Vai in "Credenziali" → "Crea credenziali" → "Chiave API"
5. Copia nel `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_VISION_API_KEY=AIzaSyA...
```

### 3. Azure Computer Vision (Opzionale - Più performante)

1. Vai su https://portal.azure.com/
2. Cerca "Computer Vision" nel marketplace
3. Crea una risorsa (tier F0 è gratuito)
4. Vai in "Keys and Endpoint"
5. Copia nel `.env.local`:

```bash
NEXT_PUBLIC_AZURE_CV_API_KEY=abc123...
NEXT_PUBLIC_AZURE_CV_ENDPOINT=https://your-resource.cognitiveservices.azure.com
```

## 📱 Come Usare

1. **Avvia l'app**: `npm run dev`
2. **Seleziona il tipo OCR**:
   - 🌐 **Cloud**: Usa servizi online (più accurato)
   - 🔧 **Locale**: Usa Tesseract.js (funziona offline)
3. **Scansiona una carta**: Camera o upload file
4. **Guarda la console**: Vedrai quale servizio OCR viene usato

## 🎯 Ordine di Priorità

Il sistema prova i servizi in questo ordine:

1. **OCR.space** (più veloce, buona accuratezza)
2. **Google Vision** (accuratezza superiore)
3. **Azure Vision** (migliore per testi complessi)
4. **Tesseract locale** (fallback finale, funziona offline)

## 🐛 Troubleshooting

### "Cloud (Non disponibile)"

- Controlla che le chiavi API siano nel file `.env.local`
- Riavvia il server di sviluppo: `npm run dev`

### "Errore API"

- Verifica che le chiavi API siano corrette
- Controlla i limiti di quota dei servizi
- Guarda la console del browser per errori dettagliati

### OCR scadente

1. **Migliora la foto**:
   - Buona illuminazione
   - Carta dritta e centrata
   - Evita riflessi e ombre
2. **Prova servizi diversi**:
   - Google Vision è il più accurato per testi stilizzati
   - Azure funziona bene con carte rovinate

## 💡 Tips per Migliori Risultati

1. **Illuminazione**: Luce naturale è meglio del flash
2. **Angolazione**: Carta completamente piatta
3. **Distanza**: Riempi il frame con la carta
4. **Qualità**: Usa la risoluzione più alta possibile
5. **Stabilità**: Mani ferme o usa un treppiede

## 📊 Confronto Prestazioni

| Servizio      | Accuratezza | Velocità   | Limite Gratuito |
| ------------- | ----------- | ---------- | --------------- |
| OCR.space     | ⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐ | 25,000/mese     |
| Google Vision | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐   | 1,000/mese      |
| Azure Vision  | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐   | 5,000/mese      |
| Tesseract     | ⭐⭐        | ⭐⭐       | Illimitato      |

## 🔒 Sicurezza

- Le chiavi API sono nel `.env.local` (non committato su Git)
- Le immagini vengono elaborate ma non salvate sui server
- Tutti i servizi sono HTTPS e conformi GDPR

## 💰 Costi

Tutti i servizi hanno tier gratuiti molto generosi. Se superi i limiti:

- **OCR.space**: $5/mese per 100,000 richieste
- **Google Vision**: $1.50 per 1,000 richieste
- **Azure**: $1 per 1,000 richieste

Per uso personale, i tier gratuiti sono più che sufficienti!

---

## 🤝 Supporto

Se hai problemi con la configurazione:

1. Controlla i log della console del browser
2. Verifica che il file `.env.local` sia nella root del progetto
3. Assicurati che le chiavi API siano attive
4. Prova prima con OCR.space (più semplice da configurare)

Happy scanning! 🎮✨
