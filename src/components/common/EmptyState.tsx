import React from 'react';
import { Search, Heart, Sparkles, FilterX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  variant?: 'search' | 'favorites' | 'filter' | 'generic';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText = 'Reset All Filters',
  onAction,
  variant = 'generic',
  className = '',
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'search':
        return <Search className="h-8 w-8 text-rose-500" aria-hidden="true" />;
      case 'favorites':
        return <Heart className="h-8 w-8 text-rose-500 fill-rose-500/20" aria-hidden="true" />;
      case 'filter':
        return <FilterX className="h-8 w-8 text-rose-500" aria-hidden="true" />;
      default:
        return <Sparkles className="h-8 w-8 text-rose-500" aria-hidden="true" />;
    }
  };

  const defaultTitle =
    variant === 'search'
      ? 'No Pokémon Found'
      : variant === 'favorites'
      ? 'No Favorites Saved Yet'
      : 'No Matching Results';

  const defaultDescription =
    variant === 'search'
      ? 'We could not find any Pokémon matching your search query. Try checking for typos or searching by Pokédex ID.'
      : variant === 'favorites'
      ? 'You have not favorited any Pokémon yet. Click the heart icon on any card to save your favorite Pokémon here.'
      : 'Try adjusting your type filter, search query, or sorting criteria.';

  return (
    <div
      className={`rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 p-10 text-center max-w-lg mx-auto backdrop-blur-md shadow-sm animate-fadeIn ${className}`}
    >
      {/* Decorative ambient Pokeball outline background */}
      <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-rose-500/10 blur-xl animate-pulse" />
        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200/60 dark:border-rose-900/40 shadow-inner">
          {getIcon()}
        </div>
      </div>

      <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
        {title || defaultTitle}
      </h3>

      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed max-w-sm mx-auto">
        {description || defaultDescription}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white px-5 py-2.5 text-xs font-extrabold shadow-md active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          <FilterX className="h-4 w-4" aria-hidden="true" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
