import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const TOTAL_POKEMON_COUNT = 1302;

export function usePokedexCompletion() {
  const [discoveredIds, setDiscoveredIds] = useLocalStorage<number[]>(
    'pokedex-discovered-ids',
    []
  );

  const markAsDiscovered = useCallback(
    (id: number) => {
      if (!id || id <= 0) return;
      setDiscoveredIds((prev) => {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      });
    },
    [setDiscoveredIds]
  );

  const discoveredCount = discoveredIds.length;
  const completionPercent = Math.min(
    100,
    Math.round((discoveredCount / TOTAL_POKEMON_COUNT) * 100)
  );

  return {
    discoveredIds,
    discoveredCount,
    totalCount: TOTAL_POKEMON_COUNT,
    completionPercent,
    markAsDiscovered,
  };
}
