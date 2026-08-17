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

// In-memory caches for browser session
const detailCache = new Map<string | number, PokemonDetail>();
const typeRosterCache = new Map<string, RawNamedResource[]>();
const speciesCache = new Map<string | number, PokemonSpecies>();

// Fetch wrapper with error classification
async function apiFetch<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
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

function resolveShinyArtwork(raw: RawPokemonDetail): string {
  return (
    raw.sprites.other?.['official-artwork']?.front_shiny ??
    raw.sprites.front_shiny ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${raw.id}.png`
  );
}

// Map raw API detail into normalized PokemonDetail
function transformDetail(raw: RawPokemonDetail): PokemonDetail {
  return {
    id: raw.id,
    name: raw.name,
    imageUrl: resolveArtwork(raw),
    shinyImageUrl: resolveShinyArtwork(raw),
    types: raw.types
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name as PokemonTypeKey),
    height: raw.height / 10,
    weight: raw.weight / 10,
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

export function toSummary(detail: PokemonDetail): PokemonSummary {
  return {
    id: detail.id,
    name: detail.name,
    imageUrl: detail.imageUrl,
    types: detail.types,
  };
}

async function fetchDetail(nameOrId: string | number): Promise<PokemonDetail> {
  const key =
    typeof nameOrId === 'string' ? nameOrId.toLowerCase().trim() : nameOrId;

  const cached = detailCache.get(key);
  if (cached) return cached;

  const raw = await apiFetch<RawPokemonDetail>(
    `${API_BASE}/pokemon/${encodeURIComponent(String(key))}`
  );
  const detail = transformDetail(raw);

  detailCache.set(detail.id, detail);
  detailCache.set(detail.name.toLowerCase(), detail);

  return detail;
}

// Fetch batch concurrently, dropping individual 404s
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

// Fetch paginated Pokemon list
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

export async function getPokemonByName(name: string): Promise<PokemonDetail> {
  return fetchDetail(name);
}

export async function getPokemonById(id: number): Promise<PokemonDetail> {
  return fetchDetail(id);
}

// Fetch roster list for a specific type
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

// Resolve visible page chunk for type roster
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

// Fetch species flavor text and category
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
    return null;
  }
}

// Get cached Pokemon sharing primary type
export async function getCachedSimilarPokemonAsync(
  primaryType: PokemonTypeKey,
  currentId: number
): Promise<PokemonDetail[]> {
  return getCachedSimilarPokemon(primaryType, currentId);
}

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
