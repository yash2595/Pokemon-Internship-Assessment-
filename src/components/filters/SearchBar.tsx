import React, { useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  isSearching?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  isSearching = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey: '/' or 'Ctrl+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't steal focus from other inputs / textareas
      const tag = (document.activeElement?.tagName ?? '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (
        e.key === '/' ||
        ((e.metaKey || e.ctrlKey) && e.key === 'k')
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (value) {
        onClear();
      } else {
        inputRef.current?.blur();
      }
    }
    // Enter — no-op submit (debounce handles it), but blur on mobile
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        {/* Search Icon or Loading spinner */}
        <div className="pointer-events-none absolute left-4 flex items-center justify-center text-slate-400 dark:text-slate-500">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          id="pokemon-search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Search by name (e.g. Pikachu) or Pokédex #…"
          aria-label="Search Pokémon by name or ID"
          className="w-full rounded-2xl bg-white/90 dark:bg-slate-900/90 pl-11 pr-24 py-3.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200/80 dark:border-slate-800 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 backdrop-blur-md transition-all duration-200"
        />

        {/* Right side: Clear button & Keyboard hint */}
        <div className="absolute right-3 flex items-center gap-1.5">
          {value && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search query"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {!value && (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              /
            </kbd>
          )}
        </div>
      </div>
    </div>
  );
};
