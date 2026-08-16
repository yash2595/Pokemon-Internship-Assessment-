import React from 'react';
import { X, Trophy, Swords, ArrowLeftRight, Trash2 } from 'lucide-react';
import type { PokemonDetail } from '../../types/pokemon';
import {
  formatPokemonName,
  formatPokemonId,
  formatHeight,
  formatWeight,
  formatStatLabel,
} from '../../utils/pokemon';
import { Badge } from '../common/Badge';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface PokemonCompareModalProps {
  compareList: PokemonDetail[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: number) => void;
  onClear: () => void;
  onSelectPokemon: (pokemon: PokemonDetail) => void;
}

const STAT_KEYS = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
];

export const PokemonCompareModal: React.FC<PokemonCompareModalProps> = ({
  compareList,
  isOpen,
  onClose,
  onRemove,
  onClear,
  onSelectPokemon,
}) => {
  const modalRef = useFocusTrap<HTMLDivElement>({ isOpen, onClose });

  if (!isOpen) return null;

  if (compareList.length < 2) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center shadow-2xl space-y-4"
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500">
            <Swords className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Pokémon Face-Off ({compareList.length}/2 Selected)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Select 2 Pokémon by clicking the <span className="font-bold text-rose-500">VS</span> badge on any card or detail view to compare stats side-by-side.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-md"
          >
            Got It
          </button>
        </div>
      </div>
    );
  }

  const [p1, p2] = compareList;

  const getStatVal = (pokemon: PokemonDetail, statName: string): number => {
    const s = pokemon.stats.find(
      (st) =>
        st.name.toLowerCase() === statName.toLowerCase() ||
        st.name.toLowerCase().replace('-', '') === statName.toLowerCase().replace('-', '')
    );
    return s ? s.value : 0;
  };

  const p1Total = p1.stats.reduce((acc, curr) => acc + curr.value, 0);
  const p2Total = p2.stats.reduce((acc, curr) => acc + curr.value, 0);

  const winnerOverall =
    p1Total > p2Total ? p1 : p2Total > p1Total ? p2 : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500 text-white shadow-md shadow-rose-500/20">
              <Swords className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="compare-modal-title"
                className="font-display text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2"
              >
                <span>Pokémon Face-Off</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                  VS
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Side-by-side base statistics &amp; attribute comparison
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close comparison dialog"
              className="relative z-30 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 dark:text-slate-400 transition-colors cursor-pointer active:scale-95"
            >
              <X className="h-5 w-5 pointer-events-none" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Header Card Comparison */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 relative">
            {/* VS divider badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white font-extrabold text-xs shadow-lg border-2 border-white dark:border-slate-900">
              VS
            </div>

            {[p1, p2].map((pokemon) => {
              const hInfo = formatHeight(pokemon.height);
              const wInfo = formatWeight(pokemon.weight);
              const isWinner = winnerOverall?.id === pokemon.id;

              return (
                <div
                  key={pokemon.id}
                  onClick={() => onSelectPokemon(pokemon)}
                  className={`relative flex flex-col items-center p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                    isWinner
                      ? 'bg-gradient-to-b from-rose-500/10 via-slate-50 to-white dark:from-rose-500/10 dark:via-slate-800/40 dark:to-slate-900 border-rose-500/50 shadow-lg'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(pokemon.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-1 rounded-full bg-white/80 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Remove from comparison"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {isWinner && (
                    <span className="mb-2 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
                      <Trophy className="h-3 w-3" />
                      <span>BST Winner</span>
                    </span>
                  )}

                  <span className="font-mono text-xs font-bold text-slate-400">
                    {formatPokemonId(pokemon.id)}
                  </span>

                  <img
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                    className="h-28 w-28 sm:h-36 sm:w-36 object-contain my-2 drop-shadow-md"
                  />

                  <h3 className="font-display text-base sm:text-xl font-bold text-slate-900 dark:text-white capitalize">
                    {formatPokemonName(pokemon.name)}
                  </h3>

                  <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                    {pokemon.types.map((type) => (
                      <Badge key={type} type={type} size="sm" />
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 w-full text-center text-xs border-t border-slate-200/60 dark:border-slate-700/60 pt-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Height</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {hInfo.metric}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Weight</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {wInfo.metric}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Stat Breakdown */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-rose-500" />
              <span>Base Stat Comparison</span>
            </h4>

            <div className="space-y-3">
              {STAT_KEYS.map((key) => {
                const val1 = getStatVal(p1, key);
                const val2 = getStatVal(p2, key);

                const isP1Win = val1 > val2;
                const isP2Win = val2 > val1;

                const labelKey =
                  key === 'special-attack'
                    ? 'specialAttack'
                    : key === 'special-defense'
                    ? 'specialDefense'
                    : key;
                const { label } = formatStatLabel(labelKey);

                const pct1 = Math.round((val1 / 255) * 100);
                const pct2 = Math.round((val2 / 255) * 100);

                return (
                  <div
                    key={key}
                    className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span
                        className={`font-mono inline-flex items-center gap-1 ${
                          isP1Win
                            ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isP1Win && <span className="text-[10px]">▲</span>}
                        {val1}
                      </span>

                      <span className="font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {label}
                      </span>

                      <span
                        className={`font-mono inline-flex items-center gap-1 ${
                          isP2Win
                            ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {val2}
                        {isP2Win && <span className="text-[10px]">▲</span>}
                      </span>
                    </div>

                    {/* Dual paired bars */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* P1 Bar (align right) */}
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex justify-end">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isP1Win
                              ? 'bg-emerald-500'
                              : 'bg-slate-400 dark:bg-slate-500'
                          }`}
                          style={{ width: `${pct1}%` }}
                        />
                      </div>

                      {/* P2 Bar (align left) */}
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex justify-start">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isP2Win
                              ? 'bg-emerald-500'
                              : 'bg-slate-400 dark:bg-slate-500'
                          }`}
                          style={{ width: `${pct2}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Stat Winner Evaluation Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white dark:from-slate-800 dark:to-slate-900 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500 text-slate-900">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
                    Overall Base Stat Winner
                  </span>
                  <h4 className="font-extrabold text-sm capitalize">
                    {winnerOverall
                      ? `${formatPokemonName(winnerOverall.name)} (${Math.max(p1Total, p2Total)} BST)`
                      : 'Stat Tie!'}
                  </h4>
                </div>
              </div>

              <div className="text-right font-mono text-xs text-slate-300">
                <div>{p1.name}: {p1Total}</div>
                <div>{p2.name}: {p2Total}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
