import type {
  PokemonSummary,
  PokemonDetail,
  PokemonSpecies,
  PokemonTypeKey,
  RawPokemonDetail,
  RawPokemonListResponse,
  RawTypeResponse,
  RawPokemonSpecies,
  RawNamedResource,
  ApiError,
} from '../types/pokemon';

const API_BASE = 'https://pokeapi.co/api/v2';

// ---------------------------------------------------------------------------
// In-memory caches — survive for the full browser session
// ---------------------------------------------------------------------------

/** Full-detail cache keyed by both `id` (number) and `name` (string). */
const detailCache = new Map<string | number, PokemonDetail>();

/** Type roster cache: type name → array of { name, url }. */
const typeRosterCache = new Map<string, RawNamedResource[]>();

/** Species flavor text cache. */
const speciesCache = new Map<string | number, PokemonSpecies>();

// ---------------------------------------------------------------------------
// Fetch client with typed error handling
// ---------------------------------------------------------------------------

/**
 * Thin wrapper around `fetch` that classifies errors:
 *  - **network**: offline / DNS / CORS
 *  - **404**:     Pokémon or type not found
 *  - **other**:   unexpected status codes
 */
async function apiFetch<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    // fetch itself threw — network failure
    const err: ApiError = {
      message: 'Network error — please check your connection and try again.',
    };
    throw err;
  }

  if (!res.ok) {
    const err: ApiError = {
      message:
        res.status === 404
          ? 'Pokémon not found.'
          : `Unexpected response (${res.status}).`,
      status: res.status,
    };
    throw err;
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Raw → Normalized transformers
// ---------------------------------------------------------------------------

function resolveArtwork(raw: RawPokemonDetail): string {
  return (
    raw.sprites.other?.['official-artwork']?.front_default ??
    raw.sprites.front_default ??
    ''
  );
}

/**
 * Map raw API detail into the app-level `PokemonDetail` view-model.
 * Moves are capped at 20 to keep payloads small in the UI.
 */
function transformDetail(raw: RawPokemonDetail): PokemonDetail {
  return {
    id: raw.id,
    name: raw.name,
    imageUrl: resolveArtwork(raw),
    types: raw.types
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name as PokemonTypeKey),
    height: raw.height / 10,   // decimetres → metres
    weight: raw.weight / 10,   // hectograms → kg
    abilities: raw.abilities
      .sort((a, b) => a.slot - b.slot)
      .map((a) => ({
        name: a.ability.name,
        isHidden: a.is_hidden,
      })),
    stats: raw.stats.map((s) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
    moves: raw.moves.slice(0, 20).map((m) => m.move.name),
    cryUrl:
      raw.cries?.latest ||
      raw.cries?.legacy ||
      `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${raw.id}.ogg`,
  };
}

/**
 * Reduce a full `PokemonDetail` to the lightweight `PokemonSummary`
 * used on grid/list cards.
 */
export function toSummary(detail: PokemonDetail): PokemonSummary {
  return {
    id: detail.id,
    name: detail.name,
    imageUrl: detail.imageUrl,
    types: detail.types,
  };
}

// ---------------------------------------------------------------------------
// Core detail fetcher (private, cache-aware)
// ---------------------------------------------------------------------------

async function fetchDetail(nameOrId: string | number): Promise<PokemonDetail> {
  const key =
    typeof nameOrId === 'string' ? nameOrId.toLowerCase().trim() : nameOrId;

  const cached = detailCache.get(key);
  if (cached) return cached;

  const raw = await apiFetch<RawPokemonDetail>(
    `${API_BASE}/pokemon/${encodeURIComponent(String(key))}`
  );
  const detail = transformDetail(raw);

  // Store under both id and name so either lookup hits cache
  detailCache.set(detail.id, detail);
  detailCache.set(detail.name.toLowerCase(), detail);

  return detail;
}

/**
 * Fetch multiple Pokémon concurrently.
 * Failures for individual items are silently dropped (the item simply
 * won't appear in results) — prevents one 404 from tanking a whole page.
 */
async function fetchBatch(
  namesOrIds: (string | number)[]
): Promise<PokemonDetail[]> {
  const settled = await Promise.allSettled(
    namesOrIds.map((item) => fetchDetail(item))
  );
  return settled
    .filter(
      (r): r is PromiseFulfilledResult<PokemonDetail> =>
        r.status === 'fulfilled'
    )
    .map((r) => r.value);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Paginated browse list.
 * Returns fully-resolved details for the current page and metadata for
 * "Load More" control.
 */
export async function getPokemonList(
  limit: number = 20,
  offset: number = 0
): Promise<{ items: PokemonDetail[]; totalCount: number; hasMore: boolean }> {
  const data = await apiFetch<RawPokemonListResponse>(
    `${API_BASE}/pokemon?limit=${limit}&offset=${offset}`
  );

  const items = await fetchBatch(data.results.map((r) => r.name));

  return {
    items,
    totalCount: data.count,
    hasMore: offset + limit < data.count,
  };
}

/**
 * Single Pokémon lookup by name (cache-aware).
 */
export async function getPokemonByName(name: string): Promise<PokemonDetail> {
  return fetchDetail(name);
}

/**
 * Single Pokémon lookup by numeric id (cache-aware).
 */
export async function getPokemonById(id: number): Promise<PokemonDetail> {
  return fetchDetail(id);
}

/**
 * Returns the **roster only** for a given type — an array of
 * `{ name, url }` pairs. Does NOT eagerly fetch each Pokémon's
 * full details; the consumer should page through the roster and
 * call `getPokemonByName` for each visible chunk.
 */
export async function getPokemonByType(
  type: string
): Promise<{ roster: RawNamedResource[]; totalCount: number }> {
  const key = type.toLowerCase().trim();

  const cached = typeRosterCache.get(key);
  if (cached) return { roster: cached, totalCount: cached.length };

  const data = await apiFetch<RawTypeResponse>(
    `${API_BASE}/type/${encodeURIComponent(key)}`
  );

  const roster = data.pokemon.map((p) => p.pokemon);
  typeRosterCache.set(key, roster);

  return { roster, totalCount: roster.length };
}

/**
 * Convenience: resolve a page of the type roster into full details.
 * Used by the explorer hook to lazily fetch only the visible chunk.
 */
export async function getTypeRosterPage(
  type: string,
  offset: number = 0,
  limit: number = 20
): Promise<{ items: PokemonDetail[]; totalCount: number; hasMore: boolean }> {
  const { roster } = await getPokemonByType(type);
  const chunk = roster.slice(offset, offset + limit);
  const items = await fetchBatch(chunk.map((r) => r.name));

  return {
    items,
    totalCount: roster.length,
    hasMore: offset + limit < roster.length,
  };
}

/**
  Fetch species details (flavor text & category) for a Pokémon.
  Fails gracefully returning null if unavailable.
 */
export async function getPokemonSpecies(
  nameOrId: string | number
): Promise<PokemonSpecies | null> {
  const key =
    typeof nameOrId === 'string' ? nameOrId.toLowerCase().trim() : nameOrId;

  const cached = speciesCache.get(key);
  if (cached) return cached;

  try {
    const raw = await apiFetch<RawPokemonSpecies>(
      `${API_BASE}/pokemon-species/${encodeURIComponent(String(key))}`
    );

    const enEntry =
      raw.flavor_text_entries.find((e) => e.language.name === 'en') ||
      raw.flavor_text_entries[0];
    const enGenus =
      raw.genera.find((g) => g.language.name === 'en') || raw.genera[0];

    const cleanFlavorText = enEntry
      ? enEntry.flavor_text.replace(/[\n\f\r]/g, ' ')
      : 'No flavor text available.';
    const genus = enGenus ? enGenus.genus : 'Pokémon';

    const speciesObj: PokemonSpecies = {
      flavorText: cleanFlavorText,
      genus,
    };

    speciesCache.set(key, speciesObj);
    return speciesObj;
  } catch {
    // Fail gracefully: species description is non-critical
    return null;
  }
}

/**
 * Synchronously retrieves cached Pokémon sharing a primary type.
 */
export function getCachedSimilarPokemon(
  primaryType: PokemonTypeKey,
  currentId: number
): PokemonDetail[] {
  const results: PokemonDetail[] = [];
  detailCache.forEach((detail) => {
    if (detail.id !== currentId && detail.types.includes(primaryType)) {
      if (!results.some((r) => r.id === detail.id)) {
        results.push(detail);
      }
    }
  });
  return results;
}
