import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type {
  PokemonDetail,
  PokemonTypeKey,
  SortKey,
  ApiError,
} from '../types/pokemon';
import {
  getPokemonList,
  getPokemonByName,
  getTypeRosterPage,
} from '../services/pokemonApi';
import { useDebounce } from './useDebounce';

const PAGE_SIZE = 20;

export type SortDirection = 'asc' | 'desc';

export interface UsePokemonExplorerProps {
  favoriteSet: Set<number>;
}

export function usePokemonExplorer({ favoriteSet }: UsePokemonExplorerProps) {
  // State
  const [loadedItems, setLoadedItems] = useState<PokemonDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PokemonTypeKey | 'all'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination & status
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Direct search state
  const [directSearchItem, setDirectSearchItem] = useState<PokemonDetail | null>(null);
  const [isSearchingDirect, setIsSearchingDirect] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const loadMoreLock = useRef(false);

  // Initial fetch on mount or type change
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setOffset(0);

    try {
      if (selectedType === 'all') {
        const data = await getPokemonList(PAGE_SIZE, 0);
        setLoadedItems(data.items);
        setTotalCount(data.totalCount);
        setHasMore(data.hasMore);
        setOffset(PAGE_SIZE);
      } else {
        const data = await getTypeRosterPage(selectedType, 0, PAGE_SIZE);
        setLoadedItems(data.items);
        setTotalCount(data.totalCount);
        setHasMore(data.hasMore);
        setOffset(PAGE_SIZE);
      }
    } catch (err: unknown) {
      const apiErr =
        err && typeof err === 'object' && 'message' in err
          ? (err as ApiError)
          : { message: 'Failed to fetch Pokémon data. Please check your connection.' };
      setError(apiErr);
      setLoadedItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedType]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Load next chunk
  const loadMore = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore || loadMoreLock.current) return;

    loadMoreLock.current = true;
    setIsLoadingMore(true);

    try {
      const fetcher =
        selectedType === 'all'
          ? getPokemonList(PAGE_SIZE, offset)
          : getTypeRosterPage(selectedType, offset, PAGE_SIZE);

      const data = await fetcher;

      setLoadedItems((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const fresh = data.items.filter((p) => !existingIds.has(p.id));
        return [...prev, ...fresh];
      });
      setHasMore(data.hasMore);
      setOffset((prev) => prev + PAGE_SIZE);
    } catch {
      setError({ message: 'Failed to load more Pokémon. Please try again.' });
    } finally {
      setIsLoadingMore(false);
      loadMoreLock.current = false;
    }
  }, [isLoading, isLoadingMore, hasMore, offset, selectedType]);

  // Direct API search for un-cached query
  useEffect(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query || query.length < 3) {
      setDirectSearchItem(null);
      setIsSearchingDirect(false);
      return;
    }

    const alreadyLoaded = loadedItems.some(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.id.toString() === query
    );
    if (alreadyLoaded) {
      setDirectSearchItem(null);
      setIsSearchingDirect(false);
      return;
    }

    let cancelled = false;
    setIsSearchingDirect(true);

    getPokemonByName(query)
      .then((detail) => {
        if (!cancelled) setDirectSearchItem(detail);
      })
      .catch(() => {
        if (!cancelled) setDirectSearchItem(null);
      })
      .finally(() => {
        if (!cancelled) setIsSearchingDirect(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, loadedItems]);

  // Filter and sort pipeline
  const displayedPokemon = useMemo(() => {
    let pool = [...loadedItems];
    if (directSearchItem && !pool.some((p) => p.id === directSearchItem.id)) {
      pool.push(directSearchItem);
    }

    const q = debouncedSearch.trim().toLowerCase();
    if (q) {
      pool = pool.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const idMatch = p.id.toString() === q;
        return nameMatch || idMatch;
      });
    }

    if (selectedType !== 'all') {
      pool = pool.filter((p) => p.types.includes(selectedType));
    }

    if (favoritesOnly) {
      pool = pool.filter((p) => favoriteSet.has(p.id));
    }

    pool.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'id':
          cmp = a.id - b.id;
          break;
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'type':
          cmp = (a.types[0] ?? '').localeCompare(b.types[0] ?? '');
          break;
        default:
          cmp = a.id - b.id;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return pool;
  }, [
    loadedItems,
    directSearchItem,
    debouncedSearch,
    selectedType,
    favoritesOnly,
    favoriteSet,
    sortBy,
    sortDirection,
  ]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedType('all');
    setFavoritesOnly(false);
    setSortBy('id');
    setSortDirection('asc');
    setError(null);
  }, []);

  const retry = useCallback(() => {
    loadInitialData();
  }, [loadInitialData]);

  return {
    // Data
    pokemonList: displayedPokemon,
    totalLoaded: loadedItems.length,
    totalApiCount: totalCount,
    hasMore,

    // Status
    isLoading,
    isLoadingMore,
    isSearchingDirect,
    error,

    // Filter/sort state + setters
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

    // Actions
    loadMore,
    resetFilters,
    retry,
  };
}
