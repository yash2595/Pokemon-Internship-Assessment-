// src/types/pokemon.ts
// Raw PokéAPI response interfaces (partial, focused on needed fields)
export interface RawNamedResource {
  name: string;
  url: string;
}

export interface RawPokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawNamedResource[];
}

export interface RawPokemonStat {
  base_stat: number;
  effort: number;
  stat: RawNamedResource;
}

export interface RawPokemonAbility {
  ability: RawNamedResource;
  is_hidden: boolean;
  slot: number;
}

export interface RawPokemonMove {
  move: RawNamedResource;
}

export interface RawPokemonSprites {
  front_default: string | null;
  front_shiny?: string | null;
  other?: {
    "official-artwork"?: {
      front_default: string | null;
      front_shiny?: string | null;
    };
  };
}

export interface RawPokemonCries {
  latest?: string | null;
  legacy?: string | null;
}

export interface RawPokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { slot: number; type: RawNamedResource }[];
  abilities: RawPokemonAbility[];
  stats: RawPokemonStat[];
  moves: RawPokemonMove[];
  sprites: RawPokemonSprites;
  cries?: RawPokemonCries;
}

export interface RawDamageRelations {
  double_damage_from: RawNamedResource[];
  double_damage_to: RawNamedResource[];
  half_damage_from: RawNamedResource[];
  half_damage_to: RawNamedResource[];
  no_damage_from: RawNamedResource[];
  no_damage_to: RawNamedResource[];
}

export interface RawTypeResponse {
  damage_relations: RawDamageRelations;
  pokemon: { pokemon: RawNamedResource }[];
  name: string;
}

export interface RawFlavorTextEntry {
  flavor_text: string;
  language: RawNamedResource;
}

export interface RawGeneraEntry {
  genus: string;
  language: RawNamedResource;
}

export interface RawPokemonSpecies {
  flavor_text_entries: RawFlavorTextEntry[];
  genera: RawGeneraEntry[];
}

// Normalized UI models used throughout the app
export interface PokemonSummary {
  id: number;
  name: string;
  imageUrl: string; // official artwork URL
  types: PokemonTypeKey[];
}

export interface PokemonDetail extends PokemonSummary {
  height: number;
  weight: number;
  abilities: { name: string; isHidden: boolean }[];
  stats: { name: string; value: number }[];
  moves: string[]; // limited list of move names
  cryUrl?: string; // audio cry URL
  shinyImageUrl?: string; // shiny sprite URL
}

export interface PokemonSpecies {
  flavorText: string;
  genus: string;
}

export type PokemonTypeKey =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export type SortKey = 'id' | 'name' | 'type';

export interface ApiError {
  message: string;
  status?: number;
}
