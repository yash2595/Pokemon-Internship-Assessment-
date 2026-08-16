import { useState, useEffect, useCallback } from 'react';
import type { PokemonDetail, ApiError } from '../types/pokemon';
import { getPokemonByName } from '../services/pokemonApi';

/**
 * Fetches a single Pokémon's full detail by name (for the detail
 * modal / deep-link route). Maintains its own loading/error state
 * completely independent of the grid.
 */
export function usePokemonDetail(name: string | null) {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchDetail = useCallback(async (target: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPokemonByName(target);
      setPokemon(data);
    } catch (err: unknown) {
      const apiErr =
        err && typeof err === 'object' && 'message' in err
          ? (err as ApiError)
          : { message: 'Failed to load Pokémon details. Please try again.' };
      setError(apiErr);
      setPokemon(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (name) {
      fetchDetail(name);
    } else {
      setPokemon(null);
      setError(null);
      setIsLoading(false);
    }
  }, [name, fetchDetail]);

  const retry = useCallback(() => {
    if (name) fetchDetail(name);
  }, [name, fetchDetail]);

  return { pokemon, isLoading, error, retry };
}
