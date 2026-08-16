import React from 'react';
import {
  POKEMON_TYPE_STYLES,
  type PokemonTypeKey,
} from '../../config/pokemonTypes';
import { getTypeMatchupSummary } from '../../config/typeEffectiveness';
import { capitalize } from '../../utils/pokemon';

interface BadgeProps {
  type: PokemonTypeKey;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
  showTooltip?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  type,
  size = 'md',
  className = '',
  showIcon = true,
  showTooltip = true,
}) => {
  const cfg = POKEMON_TYPE_STYLES[type] ?? POKEMON_TYPE_STYLES.normal;
  const matchup = getTypeMatchupSummary(type);

  const weakText =
    matchup.weakTo.length > 0
      ? matchup.weakTo.map(capitalize).join(', ')
      : 'None';
  const strongText =
    matchup.strongVs.length > 0
      ? matchup.strongVs.map(capitalize).join(', ')
      : 'None';

  const sizeClasses = {
    sm: 'text-[10px] px-2.5 py-0.5 font-bold tracking-wide uppercase',
    md: 'text-xs px-3 py-1 font-extrabold tracking-wider uppercase',
    lg: 'text-sm px-4 py-1.5 font-extrabold tracking-wider uppercase',
  };

  const badgeContent = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md shadow-2xs transition-all duration-200 ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: cfg.badgeBgLight,
        color: cfg.badgeTextLight,
        borderColor: cfg.badgeBorderLight,
      }}
    >
      {showIcon && (
        <span className="text-[11px] leading-none select-none flex-shrink-0" aria-hidden="true">
          {cfg.icon}
        </span>
      )}
      <span>{capitalize(type)}</span>
    </span>
  );

  if (!showTooltip) return badgeContent;

  return (
    <span className="relative group/badge inline-block z-20">
      {badgeContent}

      {/* Floating Smart Tooltip */}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/badge:flex group-focus/badge:flex flex-col items-center z-50 transition-all duration-150 opacity-0 group-hover/badge:opacity-100 scale-95 group-hover/badge:scale-100">
        <span className="whitespace-nowrap rounded-xl bg-slate-900 dark:bg-slate-950 px-3 py-1.5 text-[10px] font-bold text-white shadow-2xl border border-slate-700/80">
          <span className="text-rose-400 font-extrabold">Weak:</span> {weakText}
          <span className="mx-1.5 text-slate-500">|</span>
          <span className="text-emerald-400 font-extrabold">Strong:</span> {strongText}
        </span>
        <span className="w-2 h-2 -mt-1 rotate-45 bg-slate-900 dark:bg-slate-950 border-r border-b border-slate-700/80" />
      </span>
    </span>
  );
};
