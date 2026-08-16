import React from 'react';
import type { PokemonDetail, PokemonTypeKey, ApiError } from '../../types/pokemon';
import { PokemonCard } from './PokemonCard';
import { CardSkeleton } from '../common/LoadingSkeleton';
import { ErrorState } from '../common/ErrorState';
import { EmptyState } from '../common/EmptyState';
import { Loader2, Plus } from 'lucide-react';

interface PokemonGridProps {
  pokemonList: PokemonDetail[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: ApiError | null;
  searchQuery: string;
  selectedType: PokemonTypeKey | 'all';
  favoritesOnly: boolean;
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (id: number) => void;
  onSelectPokemon: (pokemon: PokemonDetail) => void;
  onLoadMore: () => void;
  onResetFilters: () => void;
  onRetry: () => void;
  isInCompare?: (id: number) => boolean;
  onToggleCompare?: (pokemon: PokemonDetail) => void;
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({
  pokemonList,
  isLoading,
  isLoadingMore,
  hasMore,
  error,
  searchQuery,
  selectedType,
  favoritesOnly,
  isFavorite,
  onToggleFavorite,
  onSelectPokemon,
  onLoadMore,
  onResetFilters,
  onRetry,
  isInCompare,
  onToggleCompare,
}) => {
  // 1. Initial Loading State (Shimmer cards)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, idx) => (
          <CardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  // 2. Initial Error State
  if (error && pokemonList.length === 0) {
    return (
      <div className="py-12">
        <ErrorState error={error} onRetry={onRetry} />
      </div>
    );
  }

  // 3. Empty State (Filter / Search / Favorites yielded 0 items)
  if (pokemonList.length === 0) {
    let variant: 'search' | 'favorites' | 'filter' | 'generic' = 'generic';
    if (searchQuery) variant = 'search';
    else if (favoritesOnly) variant = 'favorites';
    else if (selectedType !== 'all') variant = 'filter';

    return (
      <div className="py-12">
        <EmptyState
          variant={variant}
          onAction={onResetFilters}
          actionText="Reset Filters"
        />
      </div>
    );
  }

  // 4. Main Grid View
  return (
    <div className="space-y-10">
      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pokemonList.map((pokemon, idx) => (
          <PokemonCard
            key={pokemon.id}
            index={idx}
            pokemon={pokemon}
            isFavorite={isFavorite(pokemon.id)}
            onToggleFavorite={() => onToggleFavorite(pokemon.id)}
            onSelect={onSelectPokemon}
            isInCompare={isInCompare ? isInCompare(pokemon.id) : false}
            onToggleCompare={
              onToggleCompare ? () => onToggleCompare(pokemon) : undefined
            }
          />
        ))}
      </div>

      {/* Load More Section */}
      {hasMore && !searchQuery && (
        <div className="flex flex-col items-center justify-center pt-4 pb-8">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="group relative inline-flex items-center gap-2.5 rounded-2xl bg-slate-900 dark:bg-slate-100 px-8 py-3.5 text-sm font-bold text-white dark:text-slate-900 shadow-lg shadow-slate-900/10 dark:shadow-none hover:bg-slate-800 dark:hover:bg-white active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
                <span>Loading Pokémon…</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
                <span>Load Next 20 Pokémon</span>
              </>
            )}
          </button>

          <span className="mt-2.5 text-xs text-slate-400 dark:text-slate-500">
            Showing {pokemonList.length} Pokémon
          </span>
        </div>
      )}
    </div>
  );
};
