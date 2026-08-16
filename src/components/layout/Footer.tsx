import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Keyboard Shortcuts Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-[11px]">
              /
            </kbd>
            <span>Search</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-[11px]">
              ESC
            </kbd>
            <span>Close Modal</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-[11px]">
              Tab
            </kbd>
            <span>Navigate</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-[11px]">
              Enter
            </kbd>
            <span>Open Card</span>
          </div>
        </div>

        {/* Attribution & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-850 pt-6">
          <p>
            Pokémon and Pokémon character names are trademarks of Nintendo, Creatures Inc., and Game Freak.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://pokeapi.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-rose-500 transition-colors"
            >
              <span>PokéAPI Documentation</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
