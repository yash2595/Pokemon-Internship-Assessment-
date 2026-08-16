export function formatPokemonId(id: number): string {
  if (!id || id <= 0) return '#0000';
  return `#${id.toString().padStart(4, '0')}`;
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatPokemonName(name: string): string {
  if (!name) return '';
  return name
    .split('-')
    .map(part => capitalize(part))
    .join(' ');
}

export function formatHeight(heightMeters: number): { metric: string; imperial: string } {
  const totalInches = heightMeters * 39.3701;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return {
    metric: `${heightMeters.toFixed(1)} m`,
    imperial: `${feet}' ${inches.toString().padStart(2, '0')}"`,
  };
}

export function formatWeight(weightKg: number): { metric: string; imperial: string } {
  const lbs = (weightKg * 2.20462).toFixed(1);
  return {
    metric: `${weightKg.toFixed(1)} kg`,
    imperial: `${lbs} lbs`,
  };
}

export function formatStatLabel(statKey: string): { label: string; full: string } {
  switch (statKey) {
    case 'hp':
      return { label: 'HP', full: 'Hit Points' };
    case 'attack':
      return { label: 'ATK', full: 'Attack' };
    case 'defense':
      return { label: 'DEF', full: 'Defense' };
    case 'special-attack':
    case 'specialAttack':
      return { label: 'SPA', full: 'Special Attack' };
    case 'special-defense':
    case 'specialDefense':
      return { label: 'SPD', full: 'Special Defense' };
    case 'speed':
      return { label: 'SPE', full: 'Speed' };
    case 'total':
      return { label: 'TOT', full: 'Base Stat Total' };
    default:
      return { label: statKey.toUpperCase(), full: statKey };
  }
}

export function getStatBarColor(_statKey: string, value: number): {
  barClass: string;
  badgeClass: string;
} {
  if (value >= 120) {
    return {
      barClass: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    };
  }
  if (value >= 90) {
    return {
      barClass: 'bg-gradient-to-r from-sky-500 to-blue-400',
      badgeClass: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300',
    };
  }
  if (value >= 60) {
    return {
      barClass: 'bg-gradient-to-r from-amber-500 to-yellow-400',
      badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    };
  }
  return {
    barClass: 'bg-gradient-to-r from-rose-500 to-red-400',
    badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
  };
}

/**
 * Derived Stat Insight: Converts raw stat values into contextual competitive percentiles.
 */
export function getStatInsight(statKey: string, value: number): string {
  if (value >= 130) {
    return `Top 2% Elite! Superior ${formatStatLabel(statKey).full.toLowerCase()} (higher than 98% of Pokémon).`;
  }
  if (value >= 100) {
    return `Top 15% High Tier! Great ${formatStatLabel(statKey).full.toLowerCase()} (higher than 85% of Pokémon).`;
  }
  if (value >= 75) {
    return `Above Average ${formatStatLabel(statKey).full} (higher than 55% of Pokémon).`;
  }
  if (value >= 50) {
    return `Average ${formatStatLabel(statKey).full} rating for competitive play.`;
  }
  return `Below Average ${formatStatLabel(statKey).full} (bottom 25% range).`;
}
