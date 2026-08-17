import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Check,
  Ruler,
  Weight,
  Zap,
  Swords,
  BookOpen,
  Sparkles,
  Volume2,
  Users,
} from 'lucide-react';
import type { PokemonDetail, PokemonSpecies } from '../../types/pokemon';
import { POKEMON_TYPE_STYLES } from '../../config/pokemonTypes';
import { getPokemonSpecies } from '../../services/pokemonApi';
import {
  formatPokemonName,
  formatPokemonId,
  formatHeight,
  formatWeight,
  capitalize,
} from '../../utils/pokemon';
import { Badge } from '../common/Badge';
import { FavoriteButton } from './FavoriteButton';
import { PokemonStats } from './PokemonStats';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface PokemonDetailModalProps {
  pokemon: PokemonDetail | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isInCompare?: boolean;
  onToggleCompare?: (pokemon: PokemonDetail) => void;
  isInTeam?: boolean;
  isTeamFull?: boolean;
  onToggleTeam?: (pokemon: PokemonDetail) => void;
  similarPokemon?: PokemonDetail[];
  onSelectPokemon?: (pokemon: PokemonDetail) => void;
}

export const PokemonDetailModal: React.FC<PokemonDetailModalProps> = ({
  pokemon,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  isInCompare = false,
  onToggleCompare,
  isInTeam = false,
  isTeamFull = false,
  onToggleTeam,
  similarPokemon = [],
  onSelectPokemon,
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'about' | 'moves'>('stats');
  const [copiedLink, setCopiedLink] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [isPlayingCry, setIsPlayingCry] = useState(false);
  const [isShiny, setIsShiny] = useState(false);

  const modalRef = useFocusTrap<HTMLDivElement>({ isOpen, onClose });

  // Fetch flavor text / species data on mount or when pokemon changes
  useEffect(() => {
    if (!pokemon) return;
    setSpecies(null);
    let isSubscribed = true;
    getPokemonSpecies(pokemon.name).then((data) => {
      if (isSubscribed) {
        setSpecies(data);
      }
    });
    return () => {
      isSubscribed = false;
    };
  }, [pokemon]);

  if (!isOpen || !pokemon) return null;

  const primaryType = pokemon.types[0] || 'normal';
  const typeCfg = POKEMON_TYPE_STYLES[primaryType] ?? POKEMON_TYPE_STYLES.normal;
  const heightInfo = formatHeight(pokemon.height);
  const weightInfo = formatWeight(pokemon.weight);
  const paddedId = formatPokemonId(pokemon.id);

  const normalSrc = imgError
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
    : pokemon.imageUrl;

  const shinySrc =
    pokemon.shinyImageUrl ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.id}.png`;

  const artworkSrc = isShiny ? shinySrc : normalSrc;

  const playCry = () => {
    if (!pokemon.cryUrl) return;
    try {
      setIsPlayingCry(true);
      const audio = new Audio(pokemon.cryUrl);
      audio.volume = 0.5;
      audio.play().catch(() => {});
      audio.onended = () => setIsPlayingCry(false);
      audio.onerror = () => setIsPlayingCry(false);
    } catch {
      setIsPlayingCry(false);
    }
  };

  const copyShareLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/pokemon/${pokemon.name}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Ignore clipboard write failures
    }
  };

  const isSquadButtonDisabled = isTeamFull && !isInTeam;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-md transition-opacity duration-200 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pokemon-modal-title"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-h-[90vh] sm:max-w-2xl rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 border-t sm:border border-slate-200/80 dark:border-slate-800 shadow-2xl transition-all duration-200 animate-modalPop flex flex-col overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, ${typeCfg.badgeBgLight}0F 0%, transparent 60%)`,
        }}
      >
        {/* Mobile drawer handle */}
        <div className="sm:hidden w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 flex-shrink-0" />

        {/* Modal Header & Top Hero with Type Accent Banner */}
        <div
          className="relative px-6 pt-4 sm:pt-6 pb-5 overflow-hidden border-b border-slate-100 dark:border-slate-800/80 flex-shrink-0"
          style={{
            background: `radial-gradient(circle at 85% 15%, ${typeCfg.badgeBgLight} 0%, transparent 70%)`,
          }}
        >
          {/* Top Actions */}
          <div className="relative z-30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                {paddedId}
              </span>
              {species?.genus && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {species.genus}
                </span>
              )}
            </div>

            <div className="relative z-30 flex items-center gap-2">
              {/* Play Audio Cry Button */}
              {pokemon.cryUrl && (
                <button
                  type="button"
                  onClick={playCry}
                  aria-label={`Play audio cry for ${pokemon.name}`}
                  title="Play Pokémon Audio Cry"
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border inline-flex items-center gap-1 transition-all ${
                    isPlayingCry
                      ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:text-rose-500'
                  }`}
                >
                  <Volume2 className={`h-3.5 w-3.5 ${isPlayingCry ? 'animate-bounce' : ''}`} />
                  <span className="hidden sm:inline">Cry</span>
                </button>
              )}

              {/* Add to Team Button */}
              {onToggleTeam && (
                <button
                  type="button"
                  onClick={() => onToggleTeam(pokemon)}
                  disabled={isSquadButtonDisabled}
                  title={
                    isInTeam
                      ? 'Remove from squad'
                      : isTeamFull
                      ? 'Squad is full (max 6 Pokémon). Remove a member to add this one.'
                      : 'Add to 6-slot squad'
                  }
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border inline-flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isInTeam
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : isTeamFull
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700'
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:text-emerald-600'
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">
                    {isInTeam
                      ? 'In Squad'
                      : isTeamFull
                      ? 'Squad Full (6/6)'
                      : '+ Squad'}
                  </span>
                </button>
              )}

              {/* Compare Button */}
              {onToggleCompare && (
                <button
                  type="button"
                  onClick={() => onToggleCompare(pokemon)}
                  title={isInCompare ? 'Remove from compare' : 'Add to compare face-off'}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border inline-flex items-center gap-1 transition-colors ${
                    isInCompare
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:text-rose-500'
                  }`}
                >
                  <Swords className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">
                    {isInCompare ? 'In Compare' : 'VS'}
                  </span>
                </button>
              )}

              {/* Share Button */}
              <button
                type="button"
                onClick={copyShareLink}
                aria-label="Copy shareable link"
                className="p-2 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors relative"
                title="Share Pokémon"
              >
                {copiedLink ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                {copiedLink && (
                  <span className="absolute -bottom-8 right-0 text-[10px] font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-2 py-0.5 rounded shadow-md whitespace-nowrap z-30">
                    Link Copied!
                  </span>
                )}
              </button>

              <FavoriteButton
                isFavorite={isFavorite}
                onToggle={onToggleFavorite}
                pokemonName={pokemon.name}
                size="md"
              />

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Close dialog"
                className="relative z-30 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-600 hover:text-rose-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer active:scale-95"
              >
                <X className="h-5 w-5 pointer-events-none" />
              </button>
            </div>
          </div>

          {/* Hero details: Name, Types, Artwork */}
          <div className="mt-4 flex flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h2
                id="pokemon-modal-title"
                className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white capitalize tracking-tight"
              >
                {formatPokemonName(pokemon.name)}
              </h2>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                {pokemon.types.map((type) => (
                  <Badge key={type} type={type} size="md" />
                ))}
              </div>
            </div>

            {/* Artwork Container */}
            <div className="relative flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center flex-shrink-0">
              <div
                className="absolute inset-0 rounded-full opacity-30 blur-xl"
                style={{ backgroundColor: typeCfg.accentLight }}
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => setIsShiny((prev) => !prev)}
                title={isShiny ? 'Switch to Normal Sprite' : 'Switch to Shiny ✨ Sprite'}
                aria-label={isShiny ? 'Switch to normal sprite' : 'Switch to shiny sprite'}
                className={`absolute -top-1 -right-1 z-30 p-2 rounded-full border shadow-md transition-all duration-200 cursor-pointer active:scale-90 ${
                  isShiny
                    ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-amber-400/50 scale-110'
                    : 'bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-amber-500 border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                <Sparkles className="h-4 w-4" />
              </button>

              <img
                key={artworkSrc}
                src={artworkSrc}
                alt={pokemon.name}
                onError={() => setImgError(true)}
                className={`relative z-10 h-28 w-28 sm:h-36 sm:w-36 object-contain drop-shadow-2xl transition-all duration-200 ease-in-out ${
                  isPlayingCry ? 'animate-cryShake scale-110' : 'animate-idleFloat'
                }`}
              />
            </div>
          </div>

          {/* Quick Metrics Bar: Height, Weight, Moves Count */}
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-white/90 dark:bg-slate-800/80 p-3 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <Ruler className="h-3 w-3" />
                <span>Height</span>
              </div>
              <span className="mt-0.5 font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                {heightInfo.metric}
              </span>
              <span className="text-[10px] text-slate-400">{heightInfo.imperial}</span>
            </div>

            <div className="flex flex-col items-center justify-center border-x border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <Weight className="h-3 w-3" />
                <span>Weight</span>
              </div>
              <span className="mt-0.5 font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                {weightInfo.metric}
              </span>
              <span className="text-[10px] text-slate-400">{weightInfo.imperial}</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <Zap className="h-3 w-3" />
                <span>Moves</span>
              </div>
              <span className="mt-0.5 font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                {pokemon.moves.length}
              </span>
              <span className="text-[10px] text-slate-400">Total</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="px-6 border-b border-slate-200/80 dark:border-slate-800 flex gap-6 flex-shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'stats'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Base Stats
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Abilities & Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('moves')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'moves'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Moves ({pokemon.moves.length})
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Flavor Text "Did you know?" Banner */}
          {species?.flavorText && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-700 dark:text-slate-200 text-xs leading-relaxed flex items-start gap-2.5">
              <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-700 dark:text-amber-300 block mb-0.5">
                  Pokédex Entry:
                </span>
                <span>{species.flavorText}</span>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <PokemonStats stats={pokemon.stats} />
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* Abilities section */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  Abilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pokemon.abilities.map((ability) => (
                    <div
                      key={ability.name}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between shadow-xs"
                    >
                      <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 capitalize">
                        {formatPokemonName(ability.name)}
                      </span>
                      {ability.isHidden ? (
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          Hidden
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          Standard
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Biological profile overview */}
              <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-rose-500" />
                  <span>Classification & Biology</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {formatPokemonName(pokemon.name)} is a {pokemon.types.map((t) => capitalize(t)).join('/')} type {species?.genus || 'Pokémon'} standing at {heightInfo.metric} ({heightInfo.imperial}) and weighing {weightInfo.metric} ({weightInfo.imperial}).
                </p>
              </div>

              {/* Similar Pokémon Recommendations */}
              {similarPokemon.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    You Might Also Like ({primaryType.toUpperCase()} Types)
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {similarPokemon.slice(0, 3).map((sim) => (
                      <div
                        key={sim.id}
                        onClick={() => onSelectPokemon && onSelectPokemon(sim)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-center cursor-pointer transition-all hover:scale-105"
                      >
                        <img
                          src={sim.imageUrl}
                          alt={sim.name}
                          className="h-12 w-12 object-contain mx-auto"
                        />
                        <span className="text-[11px] font-bold capitalize text-slate-800 dark:text-slate-200 block truncate mt-1">
                          {formatPokemonName(sim.name)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'moves' && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Learned Move Arsenal ({pokemon.moves.length} total)
              </h4>
              <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1">
                {pokemon.moves.map((move) => (
                  <span
                    key={move}
                    className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 capitalize transition-colors"
                  >
                    {formatPokemonName(move)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
