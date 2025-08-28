## 🚀 Setup Servizi OCR Cloud

Per migliorare drasticamente l'accuratezza del riconoscimento delle carte
Pokemon, configura almeno uno di questi servizi cloud:

### 1. OCR.space (GRATUITO - Raccomandato per iniziare)

**25,000 richieste gratuite al mese**

1. Vai su: https://ocr.space/OCRAPI
2. Registrati gratuitamente
3. Ottieni la tua API key
4. Aggiungi al file `.env.local`:

```bash
NEXT_PUBLIC_OCR_SPACE_API_KEY=your_api_key_here
```

### 2. Google Vision API (GRATUITO fino a 1,000 richieste/mese)

**Molto accurato per testo in immagini**

1. Vai su: https://cloud.google.com/vision/docs/setup
2. Crea un progetto Google Cloud
3. Abilita Vision API
4. Crea una API key
5. Aggiungi al file `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_VISION_API_KEY=your_api_key_here
```

### 3. Azure Computer Vision (GRATUITO fino a 5,000 richieste/mese)

**Ottimo per documenti e carte**

1. Vai su: https://portal.azure.com
2. Crea una risorsa "Computer Vision"
3. Ottieni key ed endpoint
4. Aggiungi al file `.env.local`:

```bash
NEXT_PUBLIC_AZURE_CV_API_KEY=your_api_key_here
NEXT_PUBLIC_AZURE_CV_ENDPOINT=https://your-resource-name.cognitiveservices.azure.com
```

## 🔧 Come testare

1. Configura almeno una API key
2. Riavvia il server di sviluppo: `npm run dev`
3. Nell'interfaccia scanner vedrai un toggle "Cloud" con il numero di servizi
   disponibili
4. Carica una foto di una carta Pokemon e nota la differenza di accuratezza!

## 🔍 Debug

Per verificare che i servizi siano configurati correttamente, apri la console
del browser e cerca messaggi come:

- `🌐 Usando servizi cloud OCR: ["ocr-space"]`
- `🔍 Tentativo con OCR.space...`
- `📝 Testo estratto da OCR.space: ...`

## ⚡ Vantaggi dei servizi cloud

- **Accuratezza**: 80-95% vs 60-70% di Tesseract locale
- **Velocità**: Risultati in 1-3 secondi vs 5-10 secondi
- **Affidabilità**: Gestiscono meglio font stylizzati delle carte Pokemon
- **Fallback**: Se un servizio non funziona, prova automaticamente il successivo

## 💡 Consiglio

Inizia con OCR.space (gratuito e semplice da configurare), poi aggiungi Google
Vision per risultati ancora migliori!
