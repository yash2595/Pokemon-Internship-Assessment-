import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Heart, Database, Swords, Command, Users, Compass } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface HeaderProps {
  totalLoaded: number;
  totalApiCount: number;
  favoritesCount: number;
  onFavoritesClick: () => void;
  favoritesOnly: boolean;
  onOpenCompare?: () => void;
  compareCount?: number;
  onOpenCommandPalette?: () => void;
  onOpenTeamBuilder?: () => void;
  teamCount?: number;
  discoveredCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  totalLoaded,
  totalApiCount,
  favoritesCount,
  onFavoritesClick,
  favoritesOnly,
  onOpenCompare,
  compareCount = 0,
  onOpenCommandPalette,
  onOpenTeamBuilder,
  teamCount = 0,
  discoveredCount = 0,
}) => {
  const { toggleTheme, isDarkMode } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-rose-500 rounded-xl p-1"
        >
          {/* Custom SVG Pokeball */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform duration-200">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                Pokédex
              </span>
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
                Explorer
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 hidden sm:block">
              Powered by Live PokéAPI
            </p>
          </div>
        </Link>

        {/* Right side navigation & tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Option F: Pokédex Discovery Tracker Ring */}
          <div
            title={`Discovered ${discoveredCount} unique Pokémon entries`}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-700 dark:text-amber-300"
          >
            <Compass className="h-4 w-4 text-amber-500 animate-spin-slow" />
            <span>Discovered:</span>
            <span className="font-mono text-amber-600 dark:text-amber-400">
              {discoveredCount}
            </span>
          </div>

          {/* Command Palette Trigger */}
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Open quick command palette"
              title="Quick Search (Ctrl+K)"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-rose-300 transition-colors"
            >
              <Command className="h-3.5 w-3.5 text-rose-500" />
              <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold">
                ⌘K
              </span>
            </button>
          )}

          {/* Team Builder Trigger */}
          {onOpenTeamBuilder && (
            <button
              type="button"
              onClick={onOpenTeamBuilder}
              aria-label={`Open 6-slot team squad (${teamCount} members)`}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                teamCount > 0
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <Users className="h-4 w-4 text-emerald-500" />
              <span className="hidden sm:inline">Squad</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  teamCount > 0
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {teamCount}/6
              </span>
            </button>
          )}

          {/* Compare Mode Trigger */}
          {onOpenCompare && (
            <button
              type="button"
              onClick={onOpenCompare}
              aria-label={`Open compare view (${compareCount} selected)`}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                compareCount >= 2
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-rose-300'
              }`}
            >
              <Swords className="h-4 w-4 text-rose-500" />
              <span className="hidden sm:inline">Compare</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  compareCount >= 2
                    ? 'bg-white text-rose-600'
                    : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                }`}
              >
                {compareCount}/2
              </span>
            </button>
          )}

          {/* Live counts badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Database className="h-3 w-3" />
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {totalLoaded}
            </span>
            <span>/</span>
            <span className="font-mono">{totalApiCount || '—'}</span>
          </div>

          {/* Favorites Shortcut */}
          <button
            type="button"
            onClick={onFavoritesClick}
            aria-label={`View favorites (${favoritesCount} saved)`}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 ${
              favoritesOnly
                ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-rose-300'
            }`}
          >
            <Heart
              className={`h-4 w-4 ${
                favoritesOnly ? 'fill-white stroke-white' : 'text-rose-500'
              }`}
            />
            <span className="hidden sm:inline">Favorites</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                favoritesOnly
                  ? 'bg-white text-rose-600'
                  : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
              }`}
            >
              {favoritesCount}
            </span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
