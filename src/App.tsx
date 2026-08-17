import React, { useState, useMemo, useEffect } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { usePokemonExplorer } from './hooks/usePokemonExplorer';
import { useFavorites } from './hooks/useFavorites';
import { usePokemonDetail } from './hooks/usePokemonDetail';
import { usePokemonCompare } from './hooks/usePokemonCompare';
import { useTeamBuilder } from './hooks/useTeamBuilder';
import { usePokedexCompletion } from './hooks/usePokedexCompletion';
import { useTheme } from './hooks/useTheme';
import type { PokemonDetail } from './types/pokemon';
import { getCachedSimilarPokemon } from './services/pokemonApi';
import { Header } from './components/layout/Header';
import { Hero } from './components/layout/Hero';
import { Footer } from './components/layout/Footer';
import { TypeFilterBar } from './components/filters/TypeFilterBar';
import { SortSelector } from './components/filters/SortSelector';
import { PokemonGrid } from './components/pokemon/PokemonGrid';
import { PokemonDetailModal } from './components/pokemon/PokemonDetailModal';
import { PokemonCompareModal } from './components/pokemon/PokemonCompareModal';
import { TeamBuilderDrawer } from './components/pokemon/TeamBuilderDrawer';
import { CommandPalette } from './components/common/CommandPalette';
import { ScrollToTop } from './components/common/ScrollToTop';
import { DetailSkeleton } from './components/common/LoadingSkeleton';
import { ErrorState } from './components/common/ErrorState';

// Main Explorer Page Content
const ExplorerHome: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const { isFavorite, toggleFavorite, favoritesCount, favoriteSet } = useFavorites();
  const { discoveredCount } = usePokedexCompletion();
  const {
    compareList,
    isInCompare,
    toggleCompare,
    removeFromCompare,
    clearCompare,
    isCompareOpen,
    openCompareModal,
    closeCompareModal,
  } = usePokemonCompare();
  const {
    team,
    removeFromTeam,
    clearTeam,
    isTeamDrawerOpen,
    openTeamDrawer,
    closeTeamDrawer,
  } = useTeamBuilder();

  const {
    pokemonList,
    totalLoaded,
    totalApiCount,
    hasMore,
    isLoading,
    isLoadingMore,
    isSearchingDirect,
    error,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    favoritesOnly,
    setFavoritesOnly,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    loadMore,
    resetFilters,
    retry,
  } = usePokemonExplorer({ favoriteSet });

  const handleSelectPokemon = (pokemon: PokemonDetail) => {
    navigate(`/pokemon/${pokemon.name}`);
  };

  const handleToggleDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] text-slate-900 dark:bg-[#0f172a] dark:text-slate-100 transition-colors duration-200">
      <div>
        <Header
          totalLoaded={totalLoaded}
          totalApiCount={totalApiCount}
          favoritesCount={favoritesCount}
          onFavoritesClick={() => setFavoritesOnly((prev) => !prev)}
          favoritesOnly={favoritesOnly}
          onOpenCompare={openCompareModal}
          compareCount={compareList.length}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenTeamBuilder={openTeamDrawer}
          teamCount={team.length}
          discoveredCount={discoveredCount}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
          {/* Hero section */}
          <Hero
            totalApiCount={totalApiCount}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isSearching={isSearchingDirect}
          />

          {/* Filter & sort control panel */}
          <section
            aria-label="Pokémon Filters and Sorting"
            className="space-y-4 rounded-3xl bg-white/70 dark:bg-slate-900/60 p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xs"
          >
            {/* Type filter pills */}
            <div className="w-full">
              <TypeFilterBar
                selectedType={selectedType}
                onSelectType={setSelectedType}
                isDark={isDarkMode}
              />
            </div>

            {/* Sort options */}
            <div className="w-full border-t border-slate-100 dark:border-slate-800/80 pt-3">
              <SortSelector
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortByChange={setSortBy}
                onToggleDirection={handleToggleDirection}
                favoritesOnly={favoritesOnly}
                onToggleFavoritesOnly={() => setFavoritesOnly((prev) => !prev)}
                favoritesCount={favoritesCount}
              />
            </div>
          </section>

          {/* Grid display */}
          <section aria-label="Pokémon Directory Grid">
            <PokemonGrid
              pokemonList={pokemonList}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              error={error}
              searchQuery={searchQuery}
              selectedType={selectedType}
              favoritesOnly={favoritesOnly}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onSelectPokemon={handleSelectPokemon}
              onLoadMore={loadMore}
              onResetFilters={resetFilters}
              onRetry={retry}
              isInCompare={isInCompare}
              onToggleCompare={toggleCompare}
            />
          </section>
        </main>
      </div>

      <Footer />

      <ScrollToTop />

      {/* Team builder drawer */}
      <TeamBuilderDrawer
        team={team}
        isOpen={isTeamDrawerOpen}
        onClose={closeTeamDrawer}
        onRemoveFromTeam={removeFromTeam}
        onClearTeam={clearTeam}
        onSelectPokemon={handleSelectPokemon}
      />

      {/* Comparison modal */}
      <PokemonCompareModal
        compareList={compareList}
        isOpen={isCompareOpen}
        onClose={closeCompareModal}
        onRemove={removeFromCompare}
        onClear={clearCompare}
        onSelectPokemon={handleSelectPokemon}
      />

      {/* Command palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onToggle={() => setIsCommandPaletteOpen((prev) => !prev)}
        pokemonList={pokemonList}
        onSelectPokemon={handleSelectPokemon}
      />
    </div>
  );
};

// Route wrapper for /pokemon/:name
const PokemonDetailRouteModal: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { pokemon, isLoading, error, retry } = usePokemonDetail(name || null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, toggleCompare } = usePokemonCompare();
  const { team, isInTeam, toggleTeamMember } = useTeamBuilder();
  const { markAsDiscovered } = usePokedexCompletion();

  useEffect(() => {
    if (pokemon?.id) {
      markAsDiscovered(pokemon.id);
    }
  }, [pokemon?.id, markAsDiscovered]);

  const similarPokemon = useMemo(() => {
    if (!pokemon) return [];
    return getCachedSimilarPokemon(pokemon.types[0], pokemon.id);
  }, [pokemon]);

  const handleClose = () => {
    navigate('/');
  };

  const handleSelectSimilar = (selected: PokemonDetail) => {
    navigate(`/pokemon/${selected.name}`);
  };

  if (!name) return null;

  if (isLoading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        onClick={handleClose}
      >
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        onClick={handleClose}
      >
        <div onClick={(e) => e.stopPropagation()} className="max-w-md w-full">
          <ErrorState
            error={error}
            message={`Failed to load Pokémon "${name}".`}
            onRetry={retry}
          />
          <div className="mt-4 text-center">
            <button
              onClick={handleClose}
              className="text-xs font-bold text-slate-300 hover:text-white underline"
            >
              Back to Explorer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PokemonDetailModal
      pokemon={pokemon}
      isOpen={true}
      onClose={handleClose}
      isFavorite={isFavorite(pokemon.id)}
      onToggleFavorite={() => toggleFavorite(pokemon.id)}
      isInCompare={isInCompare(pokemon.id)}
      onToggleCompare={() => toggleCompare(pokemon)}
      isInTeam={isInTeam(pokemon.id)}
      isTeamFull={team.length >= 6}
      onToggleTeam={() => toggleTeamMember(pokemon)}
      similarPokemon={similarPokemon}
      onSelectPokemon={handleSelectSimilar}
    />
  );
};

export const App: React.FC = () => {
  return (
    <>
      <ExplorerHome />
      <Routes>
        <Route path="/" element={null} />
        <Route path="/pokemon/:name" element={<PokemonDetailRouteModal />} />
        <Route path="*" element={null} />
      </Routes>
    </>
  );
};

export default App;
