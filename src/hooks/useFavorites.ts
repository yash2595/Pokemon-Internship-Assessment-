import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useLocalStorage<number[]>('pokedex-favorites', []);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const isFavorite = useCallback(
    (id: number): boolean => {
      return favoriteSet.has(id);
    },
    [favoriteSet]
  );

  const toggleFavorite = useCallback(
    (id: number) => {
      setFavoriteIds((prev) => {
        if (prev.includes(id)) {
          return prev.filter((favId) => favId !== id);
        } else {
          return [...prev, id];
        }
      });
    },
    [setFavoriteIds]
  );

  const clearAllFavorites = useCallback(() => {
    setFavoriteIds([]);
  }, [setFavoriteIds]);

  return {
    favoriteIds,
    favoriteSet,
    isFavorite,
    toggleFavorite,
    clearAllFavorites,
    favoritesCount: favoriteIds.length,
  };
}
