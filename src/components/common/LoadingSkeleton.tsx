import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs">
      {/* Header ID & Favorite */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-16 rounded-lg bg-slate-200 dark:bg-slate-800 animate-shimmer" />
        <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 animate-shimmer" />
      </div>

      {/* Image container skeleton */}
      <div className="relative mx-auto my-2 flex h-36 w-36 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800/40">
        <div className="h-28 w-28 rounded-full bg-slate-200/70 dark:bg-slate-800 animate-shimmer" />
      </div>

      {/* Name skeleton */}
      <div className="mt-4 space-y-2 text-center">
        <div className="mx-auto h-6 w-3/4 rounded-xl bg-slate-200 dark:bg-slate-800 animate-shimmer" />
      </div>

      {/* Badges skeleton */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800 animate-shimmer" />
        <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800 animate-shimmer" />
      </div>

      {/* Stat preview skeleton */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-center">
        <div className="h-8 rounded-xl bg-slate-100 dark:bg-slate-800/40 animate-shimmer" />
        <div className="h-8 rounded-xl bg-slate-100 dark:bg-slate-800/40 animate-shimmer" />
        <div className="h-8 rounded-xl bg-slate-100 dark:bg-slate-800/40 animate-shimmer" />
      </div>
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-6 md:p-8 max-w-2xl w-full mx-auto border border-slate-200 dark:border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-16 rounded-lg bg-slate-200 dark:bg-slate-800 animate-shimmer" />
          <div className="h-8 w-48 rounded-xl bg-slate-200 dark:bg-slate-800 animate-shimmer" />
        </div>
        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 animate-shimmer" />
      </div>

      {/* Artwork Area */}
      <div className="my-8 flex justify-center">
        <div className="h-48 w-48 md:h-60 md:w-60 rounded-full bg-slate-100 dark:bg-slate-800/60 animate-shimmer" />
      </div>

      {/* Type Badges */}
      <div className="flex justify-center gap-3 my-4">
        <div className="h-7 w-20 rounded-full bg-slate-200 dark:bg-slate-800 animate-shimmer" />
        <div className="h-7 w-20 rounded-full bg-slate-200 dark:bg-slate-800 animate-shimmer" />
      </div>

      {/* Stats and Info Bars */}
      <div className="space-y-4 mt-6">
        <div className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-shimmer" />
        <div className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-shimmer" />
      </div>
    </div>
  );
};
