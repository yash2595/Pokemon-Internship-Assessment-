import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { PokemonDetail } from '../types/pokemon';

export function useTeamBuilder() {
  const [team, setTeam] = useLocalStorage<PokemonDetail[]>('pokedex-team', []);
  const [isTeamDrawerOpen, setIsTeamDrawerOpen] = useState(false);

  const isInTeam = useCallback(
    (id: number) => team.some((p) => p.id === id),
    [team]
  );

  const addToTeam = useCallback(
    (pokemon: PokemonDetail) => {
      setTeam((prev) => {
        if (prev.some((p) => p.id === pokemon.id)) return prev;
        if (prev.length >= 6) return prev; // max 6 members
        return [...prev, pokemon];
      });
    },
    [setTeam]
  );

  const removeFromTeam = useCallback(
    (id: number) => {
      setTeam((prev) => prev.filter((p) => p.id !== id));
    },
    [setTeam]
  );

  const toggleTeamMember = useCallback(
    (pokemon: PokemonDetail) => {
      setTeam((prev) => {
        const exists = prev.some((p) => p.id === pokemon.id);
        if (exists) {
          return prev.filter((p) => p.id !== pokemon.id);
        }
        if (prev.length >= 6) return prev;
        return [...prev, pokemon];
      });
    },
    [setTeam]
  );

  const clearTeam = useCallback(() => {
    setTeam([]);
  }, [setTeam]);

  return {
    team,
    isInTeam,
    addToTeam,
    removeFromTeam,
    toggleTeamMember,
    clearTeam,
    isTeamDrawerOpen,
    openTeamDrawer: () => setIsTeamDrawerOpen(true),
    closeTeamDrawer: () => setIsTeamDrawerOpen(false),
  };
}
