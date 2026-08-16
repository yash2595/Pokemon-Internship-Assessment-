import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff, SearchX } from 'lucide-react';
import type { ApiError } from '../../types/pokemon';

interface ErrorStateProps {
  error?: ApiError | null;
  message?: string;
  onRetry?: () => void;
  className?: string;
  isRetrying?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  message,
  onRetry,
  className = '',
  isRetrying = false,
}) => {
  const isNotFound = error?.status === 404;
  const hasNoStatus = error && !error.status;

  const defaultMessage = isNotFound
    ? 'The requested Pokémon could not be found.'
    : hasNoStatus
    ? 'Unable to connect to PokéAPI. Please check your internet connection and try again.'
    : 'An unexpected error occurred while fetching Pokémon data.';

  const displayMessage = message || error?.message || defaultMessage;

  const IconComponent = hasNoStatus ? WifiOff : isNotFound ? SearchX : AlertTriangle;
  const heading = isNotFound
    ? 'Pokémon Not Found'
    : hasNoStatus
    ? 'Connection Error'
    : 'Something went wrong';

  return (
    <div
      role="alert"
      className={`rounded-3xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/70 dark:bg-rose-950/30 p-8 text-center max-w-md mx-auto backdrop-blur-md shadow-sm animate-fadeIn ${className}`}
    >
      <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl animate-pulse" />
        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 shadow-inner">
          <IconComponent className="h-8 w-8" aria-hidden="true" />
        </div>
      </div>

      <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
        {heading}
      </h3>

      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
        {displayMessage}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          <span>{isRetrying ? 'Retrying…' : 'Try Again'}</span>
        </button>
      )}
    </div>
  );
};
