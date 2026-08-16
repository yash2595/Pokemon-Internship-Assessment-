import React, { useState } from 'react';
import { Swords } from 'lucide-react';
import type { PokemonDetail } from '../../types/pokemon';
import { POKEMON_TYPE_STYLES } from '../../config/pokemonTypes';
import { formatPokemonName, formatPokemonId } from '../../utils/pokemon';
import { Badge } from '../common/Badge';
import { FavoriteButton } from './FavoriteButton';

interface PokemonCardProps {
  pokemon: PokemonDetail;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelect: (pokemon: PokemonDetail) => void;
  isInCompare?: boolean;
  onToggleCompare?: () => void;
  index?: number;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  isFavorite,
  onToggleFavorite,
  onSelect,
  isInCompare = false,
  onToggleCompare,
  index = 0,
}) => {
  const [imgError, setImgError] = useState(false);
  const primaryType = pokemon.types[0] ?? 'normal';
  const cfg = POKEMON_TYPE_STYLES[primaryType] ?? POKEMON_TYPE_STYLES.normal;

  // Artwork fallback chain: official-artwork → front_default sprite
  const artworkSrc = imgError
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
    : pokemon.imageUrl;

  const paddedId = formatPokemonId(pokemon.id);

  // Pull quick-preview stats from the stats array
  const getStatVal = (name: string): number =>
    pokemon.stats.find((s) => s.name === name)?.value ?? 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(pokemon);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleCompare) {
      onToggleCompare();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(pokemon)}
      onKeyDown={handleKeyDown}
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
      aria-label={`View details for ${formatPokemonName(pokemon.name)}, ID ${paddedId}`}
      className={`group relative flex flex-col justify-between rounded-3xl p-5 cursor-pointer bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-1.5 transition-all duration-300 transition-spring focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 select-none overflow-hidden motion-safe:animate-fadeIn ${
        isInCompare ? 'ring-2 ring-rose-500 border-rose-500/50' : ''
      }`}
    >
      {/* Background ambient radial glow matching primary type */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full opacity-25 dark:opacity-35 blur-2xl transition-opacity duration-300 group-hover:opacity-50"
        style={{ backgroundColor: cfg.badgeBgLight }}
        aria-hidden="true"
      />

      {/* Top Header: ID, Compare Toggle & Favorite Button */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            {paddedId}
          </span>
          {onToggleCompare && (
            <button
              type="button"
              onClick={handleCompareClick}
              title={isInCompare ? 'Remove from comparison' : 'Add to compare (max 2)'}
              aria-label={`Compare ${pokemon.name}`}
              className={`p-1.5 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition-all ${
                isInCompare
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700'
              }`}
            >
              <Swords className="h-3 w-3" />
              <span className="hidden xs:inline">VS</span>
            </button>
          )}
        </div>

        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
          pokemonName={pokemon.name}
          size="sm"
        />
      </div>

      {/* Artwork Area */}
      <div className="relative my-3 flex h-36 w-full items-center justify-center">
        {/* Soft circle platform */}
        <div
          className="absolute h-28 w-28 rounded-full opacity-15 dark:opacity-25 transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: cfg.badgeBgLight }}
          aria-hidden="true"
        />

        <img
          src={artworkSrc}
          alt={pokemon.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="relative z-10 h-32 w-32 object-contain drop-shadow-md transition-all duration-300 ease-out group-hover:scale-110 group-hover:drop-shadow-2xl"
        />
      </div>

      {/* Name and Type Badges */}
      <div className="text-center z-10">
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white capitalize tracking-tight group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
          {formatPokemonName(pokemon.name)}
        </h3>

        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
          {pokemon.types.map((type) => (
            <Badge key={type} type={type} size="sm" />
          ))}
        </div>
      </div>

      {/* Mini Stat preview footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-1.5 text-center z-10 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl py-1 border border-slate-100 dark:border-slate-800/40">
          <span className="text-[10px] text-slate-400 font-medium">HP</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
            {getStatVal('hp')}
          </span>
        </div>
        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl py-1 border border-slate-100 dark:border-slate-800/40">
          <span className="text-[10px] text-slate-400 font-medium">ATK</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
            {getStatVal('attack')}
          </span>
        </div>
        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl py-1 border border-slate-100 dark:border-slate-800/40">
          <span className="text-[10px] text-slate-400 font-medium">SPE</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
            {getStatVal('speed')}
          </span>
        </div>
      </div>
    </div>
  );
};
