import React from 'react';
import { Sparkles } from 'lucide-react';
import { SearchBar } from '../filters/SearchBar';

interface HeroProps {
  totalApiCount: number;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  isSearching?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  totalApiCount,
  searchQuery,
  onSearchChange,
  isSearching,
}) => {
  return (
    <div className="relative pt-6 pb-4 sm:pt-10 sm:pb-6 overflow-hidden rounded-3xl bg-gradient-to-b from-rose-50/60 via-slate-100/40 to-transparent dark:from-slate-900/60 dark:to-transparent border border-slate-200/60 dark:border-slate-800/60 my-2">
      {/* Background soft ambient accents */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[36rem] max-w-full rounded-full bg-gradient-to-tr from-rose-500/10 via-amber-500/10 to-blue-500/10 blur-3xl opacity-70"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto text-center space-y-4 px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-rose-500" />
          <span>
            {totalApiCount > 0
              ? `${totalApiCount.toLocaleString()} Pokémon in the National Pokédex`
              : 'Complete National Pokédex Directory'}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-tight">
          Discover, Analyze &amp; Compare{' '}
          <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            Pokémon
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          Explore official statistics, elemental type matchups, abilities, and
          complete battle movepools in real-time from the official Pokémon
          database.
        </p>

        {/* Search bar mounted inside the hero */}
        <div className="max-w-xl mx-auto pt-2">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onClear={() => onSearchChange('')}
            isSearching={isSearching}
          />
        </div>
      </div>
    </div>
  );
};
