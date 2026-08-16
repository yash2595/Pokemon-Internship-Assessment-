import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { PokemonDetail } from '../types/pokemon';

export function usePokemonCompare() {
  const [compareList, setCompareList] = useLocalStorage<PokemonDetail[]>(
    'pokedex-compare-list',
    []
  );
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const isInCompare = useCallback(
    (id: number) => compareList.some((p) => p.id === id),
    [compareList]
  );

  const toggleCompare = useCallback(
    (pokemon: PokemonDetail) => {
      setCompareList((prev) => {
        const exists = prev.some((p) => p.id === pokemon.id);
        if (exists) {
          return prev.filter((p) => p.id !== pokemon.id);
        }
        if (prev.length >= 2) {
          // Replace 2nd item if 2 are already selected
          return [prev[0], pokemon];
        }
        return [...prev, pokemon];
      });
    },
    [setCompareList]
  );

  const removeFromCompare = useCallback(
    (id: number) => {
      setCompareList((prev) => prev.filter((p) => p.id !== id));
    },
    [setCompareList]
  );

  const clearCompare = useCallback(() => {
    setCompareList([]);
    setIsCompareOpen(false);
  }, [setCompareList]);

  const openCompareModal = useCallback(() => {
    setIsCompareOpen(true);
  }, []);

  const closeCompareModal = useCallback(() => {
    setIsCompareOpen(false);
  }, []);

  return {
    compareList,
    isInCompare,
    toggleCompare,
    removeFromCompare,
    clearCompare,
    isCompareOpen,
    openCompareModal,
    closeCompareModal,
  };
}
