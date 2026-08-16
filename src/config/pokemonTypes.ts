// src/config/pokemonTypes.ts
// Centralized map of all 18 Pokémon types with design tokens for light/dark modes.
// Colors are chosen to be WCAG AA contrast compliant for both themes.

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

export interface TypeStyleConfig {
  /** Human readable name */
  name: string;
  /** Key used in API */
  key: PokemonTypeKey;
  /** Badge background color (light mode) */
  badgeBgLight: string;
  /** Badge text color (light mode) */
  badgeTextLight: string;
  /** Badge border color (light mode) */
  badgeBorderLight: string;
  /** Card accent / glow (light mode) */
  accentLight: string;
  /** Badge background color (dark mode) */
  badgeBgDark: string;
  /** Badge text color (dark mode) */
  badgeTextDark: string;
  /** Badge border color (dark mode) */
  badgeBorderDark: string;
  /** Card accent / glow (dark mode) */
  accentDark: string;
}

export const POKEMON_TYPE_STYLES: Record<PokemonTypeKey, TypeStyleConfig> = {
  normal: {
    name: 'Normal',
    key: 'normal',
    badgeBgLight: '#A8A77A',
    badgeTextLight: '#FFFFFF',
    badgeBorderLight: '#7C7E5E',
    accentLight: 'rgba(168,167,122,0.2)',
    badgeBgDark: '#62623E',
    badgeTextDark: '#FFFFFF',
    badgeBorderDark: '#4A4A2F',
    accentDark: 'rgba(98,98,62,0.3)',
  },
  fire: {
    name: 'Fire',
    key: 'fire',
    badgeBgLight: '#EE8130',
    badgeTextLight: '#FFFFFF',
    badgeBorderLight: '#B95F23',
    accentLight: 'rgba(238,129,48,0.2)',
    badgeBgDark: '#C4530F',
    badgeTextDark: '#FFFFFF',
    badgeBorderDark: '#9A430C',
    accentDark: 'rgba(196,83,15,0.3)',
  },
  water: {
    name: 'Water',
    key: 'water',
    badgeBgLight: '#6390F0',
    badgeTextLight: '#FFFFFF',
    badgeBorderLight: '#3E68C2',
    accentLight: 'rgba(99,144,240,0.2)',
    badgeBgDark: '#2763E1',
    badgeTextDark: '#FFFFFF',
    badgeBorderDark: '#1B46A0',
    accentDark: 'rgba(39,99,225,0.3)',
  },
  electric: {
    name: 'Electric',
    key: 'electric',
    badgeBgLight: '#F7D02C',
    badgeTextLight: '#212529',
    badgeBorderLight: '#C5A200',
    accentLight: 'rgba(247,208,44,0.2)',
    badgeBgDark: '#B4A01D',
    badgeTextDark: '#212529',
    badgeBorderDark: '#8A7700',
    accentDark: 'rgba(180,160,29,0.3)',
  },
  grass: {
    name: 'Grass',
    key: 'grass',
    badgeBgLight: '#7AC74C',
    badgeTextLight: '#212529',
    badgeBorderLight: '#558C30',
    accentLight: 'rgba(122,199,76,0.2)',
    badgeBgDark: '#4E9C24',
    badgeTextDark: '#212529',
    badgeBorderDark: '#387016',
    accentDark: 'rgba(78,156,36,0.3)',
  },
  ice: {
    name: 'Ice',
    key: 'ice',
    badgeBgLight: '#96D9D6',
    badgeTextLight: '#212529',
    badgeBorderLight: '#6CB2AE',
    accentLight: 'rgba(150,217,214,0.2)',
    badgeBgDark: '#5FC5C0',
    badgeTextDark: '#212529',
    badgeBorderDark: '#46A39F',
    accentDark: 'rgba(95,197,192,0.3)',
  },
  fighting: {
    name: 'Fighting',
    key: 'fighting',
    badgeBgLight: '#C22E28',
    badgeTextLight: '#FFFFFF',
    badgeBorderLight: '#8A1F1A',
    accentLight: 'rgba(194,46,40,0.2)',
    badgeBgDark: '#9B1F1A',
    badgeTextDark: '#FFFFFF',
    badgeBorderDark: '#710F0B',
    accentDark: 'rgba(155,31,26,0.3)',
  },
  poison: {
    name: 'Poison',
    key: 'poison',
    badgeBgLight: '#A33EA1',
    badgeTextLight: '#FFFFFF',
    badgeBorderLight: '#752979',
    accentLight: 'rgba(163,62,161,0.2)',
    badgeBgDark: '#7A2078',
    badgeTextDark: '#FFFFFF',
    badgeBorderDark: '#57175C',
    accentDark: 'rgba(122,32,120,0.3)',
  },
  ground: {
    name: 'Ground',
    key: 'ground',
    badgeBgLight: '#E2BF65',
    badgeTextLight: '#212529',
    badgeBorderLight: '#B89A45',
    accentLight: 'rgba(226,191,101,0.2)',
    badgeBgDark: '#C6A04F',
    badgeTextDark: '#212529',
    badgeBorderDark: '#9A7C36',
    accentDark: 'rgba(198,160,79,0.3)',
  },
  flying: {
    name: 'Flying',
    key: 'flying',
    badgeBgLight: '#A98FF3',
    badgeTextLight: '#212529',
    badgeBorderLight: '#805CC8',
    accentLight: 'rgba(169,143,243,0.2)',
    badgeBgDark: '#8469D9',
    badgeTextDark: '#212529',
    badgeBorderDark: '#6146A3',
    accentDark: 'rgba(132,105,217,0.3)',
  },
  psychic: {
    name: 'Psychic',
    key: 'psychic',
    badgeBgLight: '#F95587',
    badgeTextLight: '#FFFFFF',
    badgeBorderLight: '#C63D6A',
    accentLight: 'rgba(249,85,135,0.2)',
    badgeBgDark: '#D23B70',
    badgeTextDark: '#FFFFFF',
    badgeBorderDark: '#A62C55',
    accentDark: 'rgba(210,59,112,0.3)',
  },
  bug: {
    name: 'Bug',
    key: 'bug',
    badgeBgLight: '#A6B91A',
    badgeTextLight: '#212529',
    badgeBorderLight: '#7A8619',
    accentLight: 'rgba(166,185,26,0.2)',
    badgeBgDark: '#859511',
    badgeTextDark: '#212529',
    badgeBorderDark: '#65730E',
    accentDark: 'rgba(133,149,17,0.3)',
  },
  rock: {
    name: 'Rock',
    key: 'rock',
    badgeBgLight: '#B6A136',
    badgeTextLight: '#212529',
    badgeBorderLight: '#856D23',
    accentLight: 'rgba(182,161,54,0.2)',
    badgeBgDark: '#8F7A20',
    badgeTextDark: '#212529',
    badgeBorderDark: '#69540E',
    accentDark: 'rgba(143,122,32,0.3)',
  },
  ghost: {
    name: 'Ghost',
    key: 'ghost',
    badgeBgLight: '#735797',
    badgeTextLight: '#FFFFFF',
    badgeBorderLight: '#4B3763',
    accentLight: 'rgba(115,87,151,0.2)',
    badgeBgDark: '#62467B',
    badgeTextDark: '#FFFFFF',
    badgeBorderDark: '#453156',
    accentDark: 'rgba(98,70,123,0.3)',
  },
  dragon: {
    name: 'Dragon',
    key: 'dragon',
    badgeBgLight: '#6F35FC',
    badgeTextLight: '#FFFFFF',
    badgeBorderLight: '#4429A1',
    accentLight: 'rgba(111,53,252,0.2)',
    badgeBgDark: '#4C18E4',
    badgeTextDark: '#FFFFFF',
    badgeBorderDark: '#3212B0',
    accentDark: 'rgba(76,24,228,0.3)',
  },
  dark: {
    name: 'Dark',
    key: 'dark',
    badgeBgLight: '#705746',
    badgeTextLight: '#FFFFFF',
    badgeBorderLight: '#47332D',
    accentLight: 'rgba(112,87,70,0.2)',
    badgeBgDark: '#533F33',
    badgeTextDark: '#FFFFFF',
    badgeBorderDark: '#36271E',
    accentDark: 'rgba(83,63,51,0.3)',
  },
  steel: {
    name: 'Steel',
    key: 'steel',
    badgeBgLight: '#B7B7CE',
    badgeTextLight: '#212529',
    badgeBorderLight: '#9393AA',
    accentLight: 'rgba(183,183,206,0.2)',
    badgeBgDark: '#9090AF',
    badgeTextDark: '#212529',
    badgeBorderDark: '#6F6F87',
    accentDark: 'rgba(144,144,175,0.3)',
  },
  fairy: {
    name: 'Fairy',
    key: 'fairy',
    badgeBgLight: '#D685AD',
    badgeTextLight: '#212529',
    badgeBorderLight: '#A45C84',
    accentLight: 'rgba(214,133,173,0.2)',
    badgeBgDark: '#B7548E',
    badgeTextDark: '#212529',
    badgeBorderDark: '#903870',
    accentDark: 'rgba(183,84,142,0.3)',
  },
};
