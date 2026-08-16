import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  pokemonName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggle,
  pokemonName = 'Pokémon',
  size = 'md',
  className = '',
}) => {
  const [animating, setAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setAnimating(true);
    onToggle();
    // Remove animation class after the pop completes
    setTimeout(() => setAnimating(false), 400);
  };

  const sizeClasses = {
    sm: 'p-1.5 h-7 w-7',
    md: 'p-2 h-9 w-9',
    lg: 'p-2.5 h-11 w-11',
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        isFavorite
          ? `Remove ${pokemonName} from favorites`
          : `Add ${pokemonName} to favorites`
      }
      aria-pressed={isFavorite}
      className={`relative inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
        isFavorite
          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-500 shadow-sm border border-rose-200/60 dark:border-rose-800/60'
          : 'bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm'
      } ${sizeClasses[size]} ${className}`}
    >
      <Heart
        className={`${iconSizes[size]} transition-all duration-200 ${
          isFavorite ? 'fill-rose-500 text-rose-500' : 'stroke-current'
        } ${animating ? 'animate-favorite-pop' : ''}`}
      />
    </button>
  );
};
