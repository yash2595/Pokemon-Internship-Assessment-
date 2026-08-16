import React from 'react';
import {
  POKEMON_TYPE_STYLES,
  type PokemonTypeKey,
} from '../../config/pokemonTypes';
import { capitalize } from '../../utils/pokemon';

interface BadgeProps {
  type: PokemonTypeKey;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  type,
  size = 'md',
  className = '',
}) => {
  const cfg = POKEMON_TYPE_STYLES[type] ?? POKEMON_TYPE_STYLES.normal;

  const sizeClasses = {
    sm: 'text-[10px] px-2.5 py-0.5 font-bold tracking-wide uppercase',
    md: 'text-xs px-3 py-1 font-extrabold tracking-wider uppercase',
    lg: 'text-sm px-4 py-1.5 font-extrabold tracking-wider uppercase',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md shadow-2xs transition-all duration-200 ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: cfg.badgeBgLight,
        color: cfg.badgeTextLight,
        borderColor: cfg.badgeBorderLight,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0"
        style={{ backgroundColor: cfg.badgeTextLight }}
        aria-hidden="true"
      />
      <span>{capitalize(type)}</span>
    </span>
  );
};
