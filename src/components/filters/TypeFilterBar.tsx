import React, { useRef } from 'react';
import {
  POKEMON_TYPE_STYLES,
  type PokemonTypeKey,
  type TypeStyleConfig,
} from '../../config/pokemonTypes';
import { capitalize } from '../../utils/pokemon';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';

const ALL_TYPE_KEYS = Object.keys(POKEMON_TYPE_STYLES) as PokemonTypeKey[];

interface TypeFilterBarProps {
  selectedType: PokemonTypeKey | 'all';
  onSelectType: (type: PokemonTypeKey | 'all') => void;
  isDark?: boolean;
}

export const TypeFilterBar: React.FC<TypeFilterBarProps> = ({
  selectedType,
  onSelectType,
  isDark = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const getStyle = (cfg: TypeStyleConfig, isSelected: boolean) => {
    const bg = isDark ? cfg.badgeBgDark : cfg.badgeBgLight;
    const text = isDark ? cfg.badgeTextDark : cfg.badgeTextLight;
    const border = isDark ? cfg.badgeBorderDark : cfg.badgeBorderLight;

    return {
      backgroundColor: isSelected ? bg : 'transparent',
      color: isSelected ? text : bg,
      borderColor: isSelected ? bg : border,
    };
  };

  return (
    <div className="relative flex items-center w-full">
      {/* Scroll Left (desktop/tablet) */}
      <button
        type="button"
        onClick={() => scroll('left')}
        aria-label="Scroll types left"
        className="hidden md:flex items-center justify-center h-8 w-8 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-90 transition-all mr-2 flex-shrink-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Horizontal scrollable pill list */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto py-1.5 px-0.5 no-scrollbar scroll-smooth w-full"
      >
        {/* "All Types" pill */}
        <button
          type="button"
          onClick={() => onSelectType('all')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 transition-spring focus:outline-none focus:ring-2 focus:ring-rose-500 flex-shrink-0 border active:scale-95 ${
            selectedType === 'all'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-md scale-105'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>All Types</span>
        </button>

        {/* 18 type pills */}
        {ALL_TYPE_KEYS.map((typeKey) => {
          const cfg = POKEMON_TYPE_STYLES[typeKey];
          const isSelected = selectedType === typeKey;
          const pillStyle = getStyle(cfg, isSelected);

          return (
            <button
              key={typeKey}
              type="button"
              onClick={() => onSelectType(typeKey)}
              style={pillStyle}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 transition-spring focus:outline-none focus:ring-2 focus:ring-rose-500 flex-shrink-0 border active:scale-95 ${
                isSelected
                  ? 'shadow-md scale-105 ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-950'
                  : 'hover:scale-[1.03] opacity-85 hover:opacity-100'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                style={{ backgroundColor: isDark ? cfg.badgeBgDark : cfg.badgeBgLight }}
                aria-hidden="true"
              />
              <span>{capitalize(typeKey)}</span>
            </button>
          );
        })}
      </div>

      {/* Scroll Right (desktop/tablet) */}
      <button
        type="button"
        onClick={() => scroll('right')}
        aria-label="Scroll types right"
        className="hidden md:flex items-center justify-center h-8 w-8 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-90 transition-all ml-2 flex-shrink-0"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
