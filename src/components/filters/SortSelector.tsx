import React from 'react';
import type { SortKey } from '../../types/pokemon';
import type { SortDirection } from '../../hooks/usePokemonExplorer';
import {
  ArrowUp,
  ArrowDown,
  Heart,
  SlidersHorizontal,
} from 'lucide-react';

interface SortSelectorProps {
  sortBy: SortKey;
  sortDirection: SortDirection;
  onSortByChange: (key: SortKey) => void;
  onToggleDirection: () => void;
  favoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  favoritesCount: number;
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'id', label: 'Pokédex ID' },
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Primary Type' },
];

export const SortSelector: React.FC<SortSelectorProps> = ({
  sortBy,
  sortDirection,
  onSortByChange,
  onToggleDirection,
  favoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full pt-1 pb-2">
      {/* Left side: Favorites filter toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleFavoritesOnly}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-rose-500 ${
            favoritesOnly
              ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800'
          }`}
        >
          <Heart
            className={`h-3.5 w-3.5 ${
              favoritesOnly ? 'fill-white stroke-white' : 'text-rose-500'
            }`}
          />
          <span>Favorites Only</span>
          {favoritesCount > 0 && (
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                favoritesOnly
                  ? 'bg-white text-rose-600'
                  : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
              }`}
            >
              {favoritesCount}
            </span>
          )}
        </button>
      </div>

      {/* Right side: Sort dropdown & direction toggle */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-1 backdrop-blur-sm shadow-xs">
          <div className="flex items-center gap-1.5 pl-2.5 pr-1 text-slate-400 dark:text-slate-500">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:inline">
              Sort:
            </span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortKey)}
            aria-label="Sort Pokémon list by property"
            className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 py-1.5 pr-6 pl-1 focus:outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key} className="dark:bg-slate-900">
                {opt.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onToggleDirection}
            aria-label={`Toggle sort direction (currently ${
              sortDirection === 'asc' ? 'Ascending' : 'Descending'
            })`}
            title={`Sort ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            {sortDirection === 'asc' ? (
              <ArrowUp className="h-4 w-4 text-rose-500" />
            ) : (
              <ArrowDown className="h-4 w-4 text-rose-500" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
