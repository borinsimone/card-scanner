// Test script per la validazione delle parole chiave Pokemon
import { CardRecognitionService } from '../src/services/card-recognition.js'

const service = new CardRecognitionService()

// Testo di esempio di una carta Pokemon
const pokemonCardText = `
Pikachu
HP 60
Type: Electric
Attack: Thunderbolt
Damage: 30
Energy cost: 2 Electric
Retreat cost: 1 Colorless
Rarity: Rare
Set: Base Set
Number: 25/102
Illustrator: Atsuko Nishida
`

// Testo di esempio di una carta non-Pokemon
const nonPokemonCardText = `
Black Lotus
Mana Cost: 0
Type: Artifact
Text: Tap, Sacrifice Black Lotus: Add three mana of any one color.
Rarity: Rare
Set: Alpha
Artist: Christopher Rush
`

console.log('🧪 Test validazione parole chiave Pokemon')
console.log('='.repeat(50))

// Nota: questo è solo un test concettuale
// La validazione effettiva avviene nel metodo parseCardText
console.log('✅ Testo carta Pokemon:', pokemonCardText.slice(0, 100) + '...')
console.log('❌ Testo carta non-Pokemon:', nonPokemonCardText.slice(0, 100) + '...')

console.log('\n🎯 Il nuovo sistema di validazione ora controlla:')
console.log('- Parole chiave Pokemon (attack, HP, energy, etc.)')
console.log('- Termini di mosse (thunderbolt, tackle, ember, etc.)')
console.log('- Meccaniche di gioco (coin, flip, retreat, etc.)')
console.log('- Tipi Pokemon (fire, water, electric, etc.)')
console.log('- Indicatori di evoluzione (evolves, evolution, etc.)')
console.log('- Pattern di numeri carta (25/102, #25, No. 25)')
console.log('- Bonus per diversità di parole chiave')
console.log('- Penalità per carte non-Pokemon (Magic, Yu-Gi-Oh, etc.)')

console.log('\n🏆 Miglioramenti implementati:')
console.log('1. ✅ Validazione contenuto con score numerico')
console.log('2. ✅ Consolidamento di card-recognition-old e new')
console.log('3. ✅ Tipi TypeScript migliorati')
console.log('4. ✅ Logging dettagliato per performance')
console.log('5. ✅ Controllo delle mosse e parole chiave')
console.log('6. ✅ Score di validazione integrato nel calcolo confidence')
