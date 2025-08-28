import { PokemonTCGCard } from '../../services/card-search'

export interface SearchFormData {
  pokemonName: string
  setId: string
}

export interface SearchFilters {
  pokemonName?: string
  setId?: string
}

export interface CardFormState {
  searchResults: PokemonTCGCard[]
  isLoading: boolean
  error: string | null
  searchPerformed: boolean
}
