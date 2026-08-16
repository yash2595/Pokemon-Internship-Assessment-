import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { formatStatLabel, getStatBarColor, getStatInsight } from '../../utils/pokemon';

interface StatItem {
  name: string;
  value: number;
}

interface PokemonStatsProps {
  stats: StatItem[];
  className?: string;
}

const STAT_DISPLAY_ORDER = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
];

const MAX_STAT_VAL = 255;

export const PokemonStats: React.FC<PokemonStatsProps> = ({
  stats,
  className = '',
}) => {
  const [animated, setAnimated] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(timer);
  }, [stats]);

  // Calculate base stat total
  const statTotal = stats.reduce((acc, curr) => acc + curr.value, 0);

  // Map stats array to lookup map for ordered rendering
  const statMap = new Map<string, number>();
  stats.forEach((s) => {
    const normalizedName = s.name.toLowerCase();
    statMap.set(normalizedName, s.value);
  });

  const activeInsightKey = hoveredStat || 'speed';
  const activeStatVal = statMap.get(activeInsightKey) ?? statMap.get(activeInsightKey.replace('-', '')) ?? 0;
  const activeInsightText = getStatInsight(activeInsightKey, activeStatVal);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Base Stat Total */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Base Statistics
        </h4>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          <span>Total:</span>
          <span className="font-mono text-sm text-rose-600 dark:text-rose-400">{statTotal}</span>
        </div>
      </div>

      {/* Stat Bars List */}
      <div className="space-y-3">
        {STAT_DISPLAY_ORDER.map((statKey) => {
          // Normalize key for lookup (special-attack or specialAttack)
          const value = statMap.get(statKey) ?? statMap.get(statKey.replace('-', '')) ?? 0;
          const percent = Math.min(100, Math.round((value / MAX_STAT_VAL) * 100));

          // Map to format label key
          const labelKey = statKey === 'special-attack' ? 'specialAttack' : statKey === 'special-defense' ? 'specialDefense' : statKey;
          const { label, full } = formatStatLabel(labelKey);
          const { barClass, badgeClass } = getStatBarColor(labelKey, value);

          return (
            <div
              key={statKey}
              onMouseEnter={() => setHoveredStat(statKey)}
              onMouseLeave={() => setHoveredStat(null)}
              className="group/stat cursor-pointer p-1 -mx-1 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center text-xs justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold w-9 text-slate-700 dark:text-slate-200">
                    {label}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 hidden sm:inline text-[11px]">
                    {full}
                  </span>
                </div>
                <span
                  className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] border ${badgeClass}`}
                >
                  {value}
                </span>
              </div>

              {/* Progress track */}
              <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden p-0.5 border border-slate-200/40 dark:border-slate-800/40">
                <div
                  className={`h-full rounded-full transition-all duration-600 ease-spring shadow-xs ${barClass}`}
                  style={{
                    width: animated ? `${percent}%` : '0%',
                    transitionDuration: '600ms',
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.25, 0.64, 1)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Option H: Derived Stat Intelligence Banner */}
      <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-slate-700 dark:text-slate-300 text-xs flex items-center gap-2.5">
        <Info className="h-4 w-4 text-sky-500 flex-shrink-0" />
        <div>
          <span className="font-bold text-sky-600 dark:text-sky-400 mr-1">
            Stat Intelligence ({formatStatLabel(activeInsightKey).full}):
          </span>
          <span>{activeInsightText}</span>
        </div>
      </div>
    </div>
  );
};
