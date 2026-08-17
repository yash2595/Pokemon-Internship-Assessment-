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

  useEffect(() => {
    let isSubscribed = true;

    if (name) {
      setIsLoading(true);
      setError(null);
      getPokemonByName(name)
        .then((data) => {
          if (isSubscribed) {
            setPokemon(data);
            setIsLoading(false);
          }
        })
        .catch((err: unknown) => {
          if (isSubscribed) {
            const apiErr =
              err && typeof err === 'object' && 'message' in err
                ? (err as ApiError)
                : { message: 'Failed to load Pokémon details. Please try again.' };
            setError(apiErr);
            setPokemon(null);
            setIsLoading(false);
          }
        });
    } else {
      setPokemon(null);
      setError(null);
      setIsLoading(false);
    }

    return () => {
      isSubscribed = false;
    };
  }, [name]);

  const retry = useCallback(() => {
    if (name) {
      setIsLoading(true);
      setError(null);
      getPokemonByName(name)
        .then((data) => {
          setPokemon(data);
          setIsLoading(false);
        })
        .catch((err: unknown) => {
          const apiErr =
            err && typeof err === 'object' && 'message' in err
              ? (err as ApiError)
              : { message: 'Failed to load Pokémon details. Please try again.' };
          setError(apiErr);
          setPokemon(null);
          setIsLoading(false);
        });
    }
  }, [name]);

  return { pokemon, isLoading, error, retry };
}
