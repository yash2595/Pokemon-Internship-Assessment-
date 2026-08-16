import React, { useState, useRef, useCallback } from 'react';
import { Swords } from 'lucide-react';
import type { PokemonDetail } from '../../types/pokemon';
import { POKEMON_TYPE_STYLES } from '../../config/pokemonTypes';
import { formatPokemonName, formatPokemonId } from '../../utils/pokemon';
import { Badge } from '../common/Badge';
import { FavoriteButton } from './FavoriteButton';

interface PokemonCardProps {
  pokemon: PokemonDetail;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelect: (pokemon: PokemonDetail) => void;
  isInCompare?: boolean;
  onToggleCompare?: () => void;
  index?: number;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  isFavorite,
  onToggleFavorite,
  onSelect,
  isInCompare = false,
  onToggleCompare,
  index = 0,
}) => {
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  // 3D Tilt State
  const [tilt, setTilt] = useState<{
    rotateX: number;
    rotateY: number;
    glareX: number;
    glareY: number;
    isHovered: boolean;
  }>({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    isHovered: false,
  });

  const primaryType = pokemon.types[0] ?? 'normal';
  const cfg = POKEMON_TYPE_STYLES[primaryType] ?? POKEMON_TYPE_STYLES.normal;

  // Check if device supports true hover/mouse events (disables 3D tilt on touch devices)
  const isHoverSupported =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isHoverSupported || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max tilt capped at ±8 degrees for a premium, non-gimmicky feel
      const rotateX = -((y - centerY) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        setTilt({
          rotateX,
          rotateY,
          glareX,
          glareY,
          isHovered: true,
        });
      });
    },
    [isHoverSupported]
  );

  const handleMouseLeave = useCallback(() => {
    if (!isHoverSupported) return;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setTilt((prev) => ({
      ...prev,
      rotateX: 0,
      rotateY: 0,
      isHovered: false,
    }));
  }, [isHoverSupported]);

  // Artwork fallback chain
  const artworkSrc = imgError
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
    : pokemon.imageUrl;

  const paddedId = formatPokemonId(pokemon.id);

  const getStatVal = (name: string): number =>
    pokemon.stats.find((s) => s.name === name)?.value ?? 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(pokemon);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleCompare) {
      onToggleCompare();
    }
  };

  const cardTransform = tilt.isHovered
    ? `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(pokemon)}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: cardTransform,
        transition: tilt.isHovered
          ? 'transform 100ms ease-out, box-shadow 300ms ease-out'
          : 'transform 400ms ease-out, box-shadow 400ms ease-out',
        animationDelay: `${Math.min(index * 40, 400)}ms`,
        transformStyle: 'preserve-3d',
      }}
      aria-label={`View details for ${formatPokemonName(pokemon.name)}, ID ${paddedId}`}
      className={`group relative flex flex-col justify-between rounded-3xl p-5 cursor-pointer bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-2xl hover:shadow-rose-500/10 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 select-none overflow-hidden motion-safe:animate-fadeIn ${
        isInCompare ? 'ring-2 ring-rose-500 border-rose-500/50' : ''
      }`}
    >
      {/* Dynamic Mouse Glare Overlay */}
      {isHoverSupported && (
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-3xl transition-opacity duration-300"
          style={{
            opacity: tilt.isHovered ? 0.18 : 0,
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.7) 0%, transparent 60%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Background ambient radial glow matching primary type */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full opacity-25 dark:opacity-35 blur-2xl transition-opacity duration-300 group-hover:opacity-50"
        style={{ backgroundColor: cfg.badgeBgLight }}
        aria-hidden="true"
      />

      {/* Top Header: ID, Compare Toggle & Favorite Button */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            {paddedId}
          </span>
          {onToggleCompare && (
            <button
              type="button"
              onClick={handleCompareClick}
              title={isInCompare ? 'Remove from comparison' : 'Add to compare (max 2)'}
              aria-label={`Compare ${pokemon.name}`}
              className={`p-1.5 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition-all ${
                isInCompare
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700'
              }`}
            >
              <Swords className="h-3 w-3" />
              <span className="hidden xs:inline">VS</span>
            </button>
          )}
        </div>

        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
          pokemonName={pokemon.name}
          size="sm"
        />
      </div>

      {/* Artwork Area with 3D Parallax Floating Depth */}
      <div className="relative my-3 flex h-36 w-full items-center justify-center">
        <div
          className="absolute h-28 w-28 rounded-full opacity-15 dark:opacity-25 transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: cfg.badgeBgLight }}
          aria-hidden="true"
        />

        <img
          src={artworkSrc}
          alt={pokemon.name}
          loading="lazy"
          onError={() => setImgError(true)}
          style={{
            transform: tilt.isHovered ? 'translateZ(25px) scale(1.1)' : undefined,
            animationDelay: `${(index % 5) * 0.4}s`,
            animationPlayState: tilt.isHovered ? 'paused' : 'running',
            transition: tilt.isHovered ? 'transform 150ms ease-out' : 'transform 400ms ease-out',
          }}
          className="relative z-10 h-32 w-32 object-contain drop-shadow-md group-hover:drop-shadow-2xl animate-idleFloat"
        />
      </div>

      {/* Name and Type Badges */}
      <div className="text-center z-10">
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white capitalize tracking-tight group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
          {formatPokemonName(pokemon.name)}
        </h3>

        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
          {pokemon.types.map((type) => (
            <Badge key={type} type={type} size="sm" />
          ))}
        </div>
      </div>

      {/* Mini Stat preview footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-1.5 text-center z-10 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl py-1 border border-slate-100 dark:border-slate-800/40">
          <span className="text-[10px] text-slate-400 font-medium">HP</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
            {getStatVal('hp')}
          </span>
        </div>
        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl py-1 border border-slate-100 dark:border-slate-800/40">
          <span className="text-[10px] text-slate-400 font-medium">ATK</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
            {getStatVal('attack')}
          </span>
        </div>
        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl py-1 border border-slate-100 dark:border-slate-800/40">
          <span className="text-[10px] text-slate-400 font-medium">SPE</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
            {getStatVal('speed')}
          </span>
        </div>
      </div>
    </div>
  );
};
