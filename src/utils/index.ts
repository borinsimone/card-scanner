/**
 * Utility functions for the Pokemon Card Scanner app
 */

// Format currency
export const formatCurrency = (
  amount: number,
  currency: string = 'EUR',
  locale: string = 'it-IT'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

// Format date
export const formatDate = (
  date: Date | string,
  locale: string = 'it-IT',
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(dateObj)
}

// Format relative time
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) return 'ora'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minuti fa`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ore fa`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} giorni fa`

  return formatDate(dateObj)
}

// Generate ID
let idCounter = 0

export const generateId = (): string => {
  // Usa crypto.randomUUID se disponibile (più sicuro)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback per ambienti che non supportano crypto.randomUUID
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(4)
    crypto.getRandomValues(array)
    return Array.from(array, dec => dec.toString(16)).join('')
  }

  // Ultimo fallback con timestamp + counter
  return `${Date.now().toString(36)}-${(++idCounter).toString(36)}`
}

// Capitalize first letter
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Truncate text
export const truncate = (text: string, length: number = 100): string => {
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
  return total === 0 ? 0 : Math.round((value / total) * 100)
}

// Get rarity color
export const getRarityColor = (rarity: string): string => {
  const rarityLower = rarity.toLowerCase()

  if (rarityLower.includes('secret') || rarityLower.includes('ultra rare')) {
    return '#E74C3C' // Secret Rare Red
  }
  if (rarityLower.includes('rare holo') || rarityLower.includes('holographic')) {
    return '#9B59B6' // Holographic Purple
  }
  if (rarityLower.includes('rare')) {
    return '#FFD700' // Rare Gold
  }
  if (rarityLower.includes('uncommon')) {
    return '#4A4A4A' // Uncommon Dark Gray
  }

  return '#808080' // Common Gray
}

// Calculate card condition multiplier
export const getConditionMultiplier = (condition: string): number => {
  const conditionMultipliers: Record<string, number> = {
    mint: 1.0,
    near_mint: 0.9,
    excellent: 0.8,
    good: 0.7,
    light_played: 0.6,
    played: 0.5,
    poor: 0.3,
  }

  return conditionMultipliers[condition.toLowerCase()] || 1.0
}

// Parse OCR text for card information
export const parseCardText = (
  text: string
): {
  cardName?: string
  setName?: string
  cardNumber?: string
  rarity?: string
} => {
  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)

  const result: any = {}

  // Try to extract card name (usually the first meaningful line)
  for (const line of lines) {
    if (line.length > 3 && !line.match(/^\d+$/) && !line.toLowerCase().includes('pokemon')) {
      result.cardName = line
      break
    }
  }

  // Look for card number patterns
  const cardNumberPattern = /(\d+)\/(\d+)/
  for (const line of lines) {
    const match = line.match(cardNumberPattern)
    if (match) {
      result.cardNumber = match[0]
      break
    }
  }

  // Look for set information
  const commonSets = [
    'Base Set',
    'Jungle',
    'Fossil',
    'Team Rocket',
    'Gym Heroes',
    'Gym Challenge',
    'Neo Genesis',
    'Neo Discovery',
    'Neo Destiny',
    'Neo Revelation',
    'Legendary Collection',
    'Expedition',
    'Aquapolis',
    'Skyridge',
    'Ruby & Sapphire',
    'Sandstorm',
    'Dragon',
    'Team Magma vs Team Aqua',
    'Hidden Legends',
    'FireRed & LeafGreen',
    'Team Rocket Returns',
    'Deoxys',
    'Emerald',
    'Unseen Forces',
    'Delta Species',
    'Legend Maker',
    'Holon Phantoms',
    'Crystal Guardians',
    'Dragon Frontiers',
    'Power Keepers',
    'Diamond & Pearl',
    'Mysterious Treasures',
    'Secret Wonders',
    'Great Encounters',
    'Majestic Dawn',
    'Legends Awakened',
    'Stormfront',
    'Platinum',
    'Rising Rivals',
    'Supreme Victors',
    'Arceus',
    'HeartGold & SoulSilver',
    'Unleashed',
    'Undaunted',
    'Triumphant',
    'Call of Legends',
    'Black & White',
    'Emerging Powers',
    'Noble Victories',
    'Next Destinies',
    'Dark Explorers',
    'Dragons Exalted',
    'Boundaries Crossed',
    'Plasma Storm',
    'Plasma Freeze',
    'Plasma Blast',
    'Legendary Treasures',
    'XY',
    'Flashfire',
    'Furious Fists',
    'Phantom Forces',
    'Primal Clash',
    'Roaring Skies',
    'Ancient Origins',
    'BREAKthrough',
    'BREAKpoint',
    'Generations',
    'Fates Collide',
    'Steam Siege',
    'Evolutions',
    'Sun & Moon',
    'Guardians Rising',
    'Burning Shadows',
    'Shining Legends',
    'Crimson Invasion',
    'Ultra Prism',
    'Forbidden Light',
    'Celestial Storm',
    'Dragon Majesty',
    'Lost Thunder',
    'Team Up',
    'Detective Pikachu',
    'Unbroken Bonds',
    'Unified Minds',
    'Hidden Fates',
    'Cosmic Eclipse',
    'Sword & Shield',
    'Rebel Clash',
    'Darkness Ablaze',
    "Champion's Path",
    'Vivid Voltage',
    'Battle Styles',
    'Chilling Reign',
    'Evolving Skies',
    'Celebrations',
    'Fusion Strike',
    'Brilliant Stars',
    'Astral Radiance',
    'Pokémon GO',
    'Lost Origin',
    'Silver Tempest',
    'Paldea Evolved',
    'Obsidian Flames',
    'Paradox Rift',
    'Paldean Fates',
  ]

  for (const line of lines) {
    for (const setName of commonSets) {
      if (line.toLowerCase().includes(setName.toLowerCase())) {
        result.setName = setName
        break
      }
    }
    if (result.setName) break
  }

  return result
}

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert file to base64'))
      }
    }
    reader.onerror = error => reject(error)
  })
}
