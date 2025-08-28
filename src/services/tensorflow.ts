import * as tf from '@tensorflow/tfjs'

export interface PokemonCardPrediction {
  name: string
  confidence: number
  hp: number
  type: string
  rarity: string
  set: string
}

export interface CardDetection {
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  }
  confidence: number
  regions: {
    name: { x: number; y: number; width: number; height: number }
    hp: { x: number; y: number; width: number; height: number }
    moves: { x: number; y: number; width: number; height: number }
    artwork: { x: number; y: number; width: number; height: number }
  }
}

class TensorFlowService {
  private model: tf.LayersModel | null = null
  private detectionModel: tf.GraphModel | null = null
  private isLoaded = false

  async initialize() {
    try {
      console.log('Initializing TensorFlow...')

      // Imposta il backend WebGL per performance migliori
      await tf.setBackend('webgl')

      // Per ora usiamo modelli mock - in futuro sostituisci con i tuoi URL
      // this.model = await tf.loadLayersModel('/models/pokemon-classifier/model.json')
      // this.detectionModel = await tf.loadGraphModel('/models/card-detection/model.json')

      // Creiamo modelli mock per demonstration
      this.model = await this.createMockClassificationModel()
      this.detectionModel = await this.createMockDetectionModel()

      this.isLoaded = true
      console.log('TensorFlow models loaded successfully')
    } catch (error) {
      console.error('Error loading TensorFlow models:', error)
      throw error
    }
  }

  private async createMockClassificationModel(): Promise<tf.LayersModel> {
    // Crea un modello semplice per demonstration
    const model = tf.sequential({
      layers: [
        tf.layers.conv2d({
          inputShape: [224, 224, 3],
          kernelSize: 3,
          filters: 16,
          activation: 'relu',
        }),
        tf.layers.globalAveragePooling2d({}),
        tf.layers.dense({ units: 151, activation: 'softmax' }), // 151 Pokemon originali
      ],
    })

    // Compila il modello
    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    })

    return model
  }

  private async createMockDetectionModel(): Promise<tf.GraphModel> {
    // Per ora restituiamo un modello mock
    // In futuro questo sarà sostituito con un vero modello di detection
    return this.model as unknown as tf.GraphModel
  }

  async preprocessImage(imageElement: HTMLImageElement): Promise<tf.Tensor> {
    // Ridimensiona l'immagine a dimensioni standard
    const tensor = tf.browser
      .fromPixels(imageElement)
      .resizeNearestNeighbor([224, 224]) // Dimensione standard per molti modelli
      .toFloat()
      .div(tf.scalar(255.0)) // Normalizza a [0,1]
      .expandDims(0) // Aggiungi batch dimension

    return tensor
  }

  async detectCardRegions(imageElement: HTMLImageElement): Promise<CardDetection | null> {
    if (!this.isLoaded) {
      throw new Error('TensorFlow models not loaded')
    }

    try {
      console.log('Detecting card regions with TensorFlow...')

      // Per ora usiamo regioni predefinite migliorate
      // In futuro questo userà un vero modello di detection
      const width = imageElement.width
      const height = imageElement.height

      const detection: CardDetection = {
        boundingBox: {
          x: width * 0.05,
          y: height * 0.02,
          width: width * 0.9,
          height: height * 0.96,
        },
        confidence: 0.95, // Mock confidence
        regions: {
          name: {
            x: width * 0.1,
            y: height * 0.02,
            width: width * 0.6,
            height: height * 0.12,
          },
          hp: {
            x: width * 0.75,
            y: height * 0.02,
            width: width * 0.2,
            height: height * 0.1,
          },
          moves: {
            x: width * 0.05,
            y: height * 0.45,
            width: width * 0.9,
            height: height * 0.45,
          },
          artwork: {
            x: width * 0.15,
            y: height * 0.15,
            width: width * 0.7,
            height: width * 0.35,
          },
        },
      }

      console.log('TensorFlow Detection result:', detection)
      return detection
    } catch (error) {
      console.error('Error in card detection:', error)
      return null
    }
  }

  async classifyCard(imageElement: HTMLImageElement): Promise<PokemonCardPrediction | null> {
    if (!this.model) {
      throw new Error('Classification model not loaded')
    }

    try {
      console.log('Classifying card with TensorFlow...')

      const inputTensor = await this.preprocessImage(imageElement)

      // Esegui classificazione
      const predictions = this.model.predict(inputTensor) as tf.Tensor
      const predictionData = await predictions.data()

      // Trova la classe con la confidenza più alta
      const maxIndex = Array.from(predictionData).indexOf(Math.max(...Array.from(predictionData)))
      const confidence = predictionData[maxIndex]

      // Mappa index a nome Pokemon
      const pokemonNames = await this.loadPokemonNames()
      const predictedName = pokemonNames[maxIndex] || 'Unknown'

      // Cleanup
      inputTensor.dispose()
      predictions.dispose()

      const prediction: PokemonCardPrediction = {
        name: predictedName,
        confidence: confidence,
        hp: this.generateDeterministicHP(predictedName), // Deterministic HP
        type: this.getRandomType(predictedName),
        rarity: this.getRandomRarity(predictedName),
        set: 'Base Set', // Mock set
      }

      console.log('TensorFlow Classification result:', prediction)
      return prediction
    } catch (error) {
      console.error('Error in card classification:', error)
      return null
    }
  }

  async enhanceImageForOCR(imageElement: HTMLImageElement): Promise<string> {
    try {
      console.log('Enhancing image with TensorFlow...')

      // Applica enhancement con TensorFlow
      const tensor = tf.browser.fromPixels(imageElement)

      // Applica filtri di enhancement
      const enhanced = tensor
        .cast('float32')
        .div(tf.scalar(255.0))
        .mul(tf.scalar(1.3)) // Aumenta contrasto
        .clipByValue(0, 1) // Clamp values
        .mul(tf.scalar(255.0))
        .cast('int32')

      // Converte back to image
      const canvas = document.createElement('canvas')
      canvas.width = imageElement.width
      canvas.height = imageElement.height

      await tf.browser.toPixels(enhanced as tf.Tensor3D, canvas)

      // Cleanup
      tensor.dispose()
      enhanced.dispose()

      console.log('Image enhancement completed')
      return canvas.toDataURL('image/png')
    } catch (error) {
      console.error('Error enhancing image:', error)
      throw error
    }
  }

  private async loadPokemonNames(): Promise<string[]> {
    // Lista dei Pokemon più comuni nelle carte
    return [
      'Pikachu',
      'Charizard',
      'Blastoise',
      'Venusaur',
      'Mewtwo',
      'Mew',
      'Lugia',
      'Ho-Oh',
      'Rayquaza',
      'Dialga',
      'Palkia',
      'Giratina',
      'Arceus',
      'Reshiram',
      'Zekrom',
      'Kyurem',
      'Xerneas',
      'Yveltal',
      'Zygarde',
      'Solgaleo',
      'Lunala',
      'Necrozma',
      'Magearna',
      'Marshadow',
      'Zeraora',
      'Meltan',
      'Melmetal',
      'Rillaboom',
      'Cinderace',
      'Inteleon',
      'Corviknight',
      'Toxapex',
      'Mimikyu',
      'Dragapult',
      'Grimmsnarl',
      'Alcremie',
      'Eevee',
      'Vaporeon',
      'Jolteon',
      'Flareon',
      'Espeon',
      'Umbreon',
      'Leafeon',
      'Glaceon',
      'Sylveon',
      'Lucario',
      'Garchomp',
      'Metagross',
      'Salamence',
      'Tyranitar',
      'Dragonite',
      // Aggiungi altri Pokemon popolari...
    ]
  }

  private generateDeterministicHP(pokemonName: string): number {
    // Genera HP basato sul nome del Pokemon per consistenza
    const nameHash = this.hashString(pokemonName)
    return Math.floor((nameHash % 170) + 30) // HP tra 30 e 200
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Converte a 32-bit integer
    }
    return Math.abs(hash)
  }

  private pseudoRandom(seed: number): number {
    // Linear congruential generator per numeri pseudo-random deterministici
    const a = 1664525
    const c = 1013904223
    const m = Math.pow(2, 32)
    return ((a * seed + c) % m) / m
  }

  private getRandomType(pokemonName?: string): string {
    const types = [
      'Fire',
      'Water',
      'Grass',
      'Electric',
      'Psychic',
      'Ice',
      'Dragon',
      'Dark',
      'Steel',
      'Fairy',
      'Fighting',
      'Poison',
      'Ground',
      'Flying',
      'Bug',
      'Rock',
      'Ghost',
      'Normal',
    ]

    if (pokemonName) {
      const nameHash = this.hashString(pokemonName)
      return types[nameHash % types.length]
    }

    return types[0] // Fallback
  }

  private getRandomRarity(pokemonName?: string): string {
    const rarities = ['Common', 'Uncommon', 'Rare', 'Rare Holo', 'Ultra Rare', 'Secret Rare']

    if (pokemonName) {
      const nameHash = this.hashString(pokemonName)
      return rarities[nameHash % rarities.length]
    }

    return rarities[0] // Fallback
  }

  dispose() {
    if (this.model) {
      this.model.dispose()
    }
    if (this.detectionModel) {
      this.detectionModel.dispose()
    }
  }

  get initialized(): boolean {
    return this.isLoaded
  }
}

export const tensorflowService = new TensorFlowService()
