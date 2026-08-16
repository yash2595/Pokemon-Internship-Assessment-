import React, { useState } from 'react';
import { X, ShieldAlert, ShieldCheck, Trash2, Users, Plus, Zap } from 'lucide-react';
import type { PokemonDetail, PokemonTypeKey } from '../../types/pokemon';
import { getDefenseMultiplier } from '../../config/typeEffectiveness';
import { formatPokemonName, formatPokemonId } from '../../utils/pokemon';
import { Badge } from '../common/Badge';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface TeamBuilderDrawerProps {
  team: PokemonDetail[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveFromTeam: (id: number) => void;
  onClearTeam: () => void;
  onSelectPokemon: (pokemon: PokemonDetail) => void;
}

const ALL_TYPES: PokemonTypeKey[] = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

export const TeamBuilderDrawer: React.FC<TeamBuilderDrawerProps> = ({
  team,
  isOpen,
  onClose,
  onRemoveFromTeam,
  onClearTeam,
  onSelectPokemon,
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'analysis'>('roster');
  const drawerRef = useFocusTrap<HTMLDivElement>({ isOpen, onClose });

  if (!isOpen) return null;

  // Perform type coverage analysis
  const weaknessesMap = new Map<PokemonTypeKey, number>();
  const resistancesMap = new Map<PokemonTypeKey, number>();
  const immunitiesMap = new Map<PokemonTypeKey, number>();

  ALL_TYPES.forEach((atkType) => {
    let weakCount = 0;
    let resistCount = 0;
    let immuneCount = 0;

    team.forEach((p) => {
      const mult = getDefenseMultiplier(atkType, p.types);
      if (mult >= 2) weakCount++;
      if (mult <= 0.5 && mult > 0) resistCount++;
      if (mult === 0) immuneCount++;
    });

    if (weakCount > 0) weaknessesMap.set(atkType, weakCount);
    if (resistCount > 0) resistancesMap.set(atkType, resistCount);
    if (immuneCount > 0) immunitiesMap.set(atkType, immuneCount);
  });

  // Major team weaknesses (2+ members weak)
  const majorWeaknesses = Array.from(weaknessesMap.entries()).filter(
    ([, count]) => count >= 2
  );

  // Uncovered threats: Types weak against where no member has resistance/immunity
  const uncoveredThreats = Array.from(weaknessesMap.keys()).filter((atkType) => {
    const resistCount = (resistancesMap.get(atkType) || 0) + (immunitiesMap.get(atkType) || 0);
    return resistCount === 0;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-drawer-title"
      onClick={onClose}
    >
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Drawer Drag Handle */}
        <div className="sm:hidden w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 flex-shrink-0" />

        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/70 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500 text-white shadow-md shadow-rose-500/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="team-drawer-title"
                className="font-display text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2"
              >
                <span>6-Slot Team Builder</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
                  {team.length}/6 Members
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Build your ultimate battle squad & analyze live type coverage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {team.length > 0 && (
              <button
                type="button"
                onClick={onClearTeam}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close team builder"
              className="relative z-30 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 dark:text-slate-400 transition-colors cursor-pointer active:scale-95"
            >
              <X className="h-5 w-5 pointer-events-none" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200/80 dark:border-slate-800 flex gap-6 flex-shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'roster'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Squad Roster ({team.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analysis')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'analysis'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Type Coverage Analysis</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'roster' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, idx) => {
                const member = team[idx];
                return (
                  <div
                    key={idx}
                    className={`relative flex flex-col items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      member
                        ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 shadow-xs cursor-pointer hover:border-rose-400'
                        : 'bg-slate-100/40 dark:bg-slate-800/20 border-dashed border-slate-300 dark:border-slate-700/50 justify-center h-44'
                    }`}
                    onClick={() => member && onSelectPokemon(member)}
                  >
                    {member ? (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFromTeam(member.id);
                          }}
                          className="absolute top-2 right-2 p-1 rounded-full bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors shadow-xs"
                          title="Remove from team"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <span className="font-mono text-[10px] font-bold text-slate-400">
                          {formatPokemonId(member.id)}
                        </span>
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="h-20 w-20 object-contain my-1 drop-shadow-xs"
                        />
                        <span className="font-bold text-xs capitalize text-slate-800 dark:text-slate-200 text-center truncate max-w-full">
                          {formatPokemonName(member.name)}
                        </span>
                        <div className="mt-1 flex flex-wrap justify-center gap-1">
                          {member.types.map((t) => (
                            <Badge key={t} type={t} size="sm" />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-1 text-slate-400">
                        <Plus className="h-6 w-6 mx-auto opacity-50" />
                        <span className="text-[11px] font-semibold block">Slot {idx + 1}</span>
                        <span className="text-[10px] block opacity-70">Empty</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {team.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Add at least 1 Pokémon to your squad to see live type coverage & vulnerability analysis.
                </div>
              ) : (
                <>
                  {/* Major Shared Weaknesses */}
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4" />
                      <span>Shared Team Weaknesses (2+ Members Vulnerable)</span>
                    </h4>
                    {majorWeaknesses.length === 0 ? (
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Great balance! No single enemy type deals super-effective damage to 2 or more members.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {majorWeaknesses.map(([atkType, count]) => (
                          <div
                            key={atkType}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 text-xs font-bold"
                          >
                            <Badge type={atkType} size="sm" />
                            <span>{count}x Vulnerable</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Uncovered Threats */}
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                      <Zap className="h-4 w-4" />
                      <span>Uncovered Threat Types (No Team Resistance)</span>
                    </h4>
                    {uncoveredThreats.length === 0 ? (
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Flawless defensive synergy! Your team has at least one resistance against every threat type.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {uncoveredThreats.map((atkType) => (
                          <Badge key={atkType} type={atkType} size="sm" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Total Team Defenses Summary */}
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Team Type Resistances & Immunities</span>
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Array.from(resistancesMap.entries()).map(([defType, count]) => (
                        <div
                          key={defType}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs font-medium"
                        >
                          <Badge type={defType} size="sm" />
                          <span className="font-bold">({count})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
