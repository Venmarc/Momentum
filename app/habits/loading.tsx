import React from 'react';

export default function HabitsLoading() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8 pb-24 min-w-0 animate-pulse text-[#f4f4f5]">
      
      {/* Upper Welcome Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-6">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-zinc-800/80 rounded-lg" />
          <div className="h-4 w-96 max-w-full bg-zinc-900/80 rounded-lg" />
        </div>
        <div className="w-32 h-11 bg-zinc-800/60 rounded-xl" />
      </div>

      {/* Analytics Brief Dashboard Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-[#0e0e11] border border-[#1f1f23] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-800/60 border border-zinc-800 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-2.5 w-24 bg-zinc-900 rounded" />
              <div className="h-4 w-32 bg-zinc-800 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Date Rolling Selector Widget Skeleton */}
      <div className="p-4 rounded-2xl bg-[#09090b] border border-[#1f1f23] space-y-3">
        <div className="h-3 w-32 bg-zinc-800/60 rounded" />
        <div className="overflow-x-auto pb-1">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 min-w-[320px]">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="py-3 rounded-xl border border-[#1c1c22] bg-[#0e0e11] flex flex-col items-center justify-center gap-2"
              >
                <div className="h-2.5 w-6 bg-zinc-900 rounded" />
                <div className="h-4 w-8 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Toolbar Row Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-16 h-8 bg-[#0e0e11] border border-[#131316] rounded-lg" />
          ))}
        </div>
        <div className="w-32 h-8 bg-[#09090b] border border-[#1f1f23] rounded-xl" />
      </div>

      {/* Main Habit Cards List Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-[#0e0e11] border border-[#1f1f23] flex flex-col justify-between h-48 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-40 bg-zinc-800 rounded-md" />
                  <div className="h-3 w-64 max-w-full bg-zinc-900 rounded" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-zinc-800 shrink-0" />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <div className="w-12 h-5 bg-[#121214] border border-zinc-900 rounded-md" />
                <div className="w-16 h-5 bg-[#121214] border border-zinc-900 rounded-md" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#121214]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-zinc-900 rounded-full" />
                <div className="h-3.5 w-16 bg-zinc-900 rounded" />
              </div>
              <div className="w-24 h-9 bg-zinc-800 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
