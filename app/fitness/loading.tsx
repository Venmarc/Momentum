import React from 'react';

export default function FitnessLoading() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8 pb-24 md:pb-12 animate-pulse bg-black text-[#f4f4f5]">
      
      {/* Header Skeleton */}
      <div className="border-b border-[#1f1f23] pb-6 mt-16 md:mt-0">
        <div className="h-7 w-48 bg-zinc-800 rounded-lg" />
        <div className="h-4 w-80 bg-zinc-900 rounded-lg mt-2" />
      </div>

      {/* Manual Start Banner Skeleton */}
      <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="h-5 w-48 bg-zinc-800 rounded-md" />
          <div className="h-3 w-72 bg-zinc-900 rounded" />
        </div>
        <div className="w-40 h-11 bg-zinc-850 rounded-xl shrink-0" />
      </div>

      {/* Preset Workout Templates Header */}
      <div className="space-y-2">
        <div className="h-5 w-56 bg-zinc-850 rounded" />
        <div className="h-3 w-80 bg-zinc-900 rounded" />
      </div>

      {/* Preset Workout Cards Grid Skeleton (6 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-[#09090b] border border-[#27272a] rounded-2xl p-5 flex flex-col justify-between h-56 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="h-4 w-32 bg-zinc-800 rounded-md" />
                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-700" />
              </div>
              <div className="h-3 w-40 bg-zinc-900 rounded" />
              <div className="flex flex-wrap gap-1">
                <div className="w-10 h-5 bg-[#121214] border border-zinc-900 rounded" />
                <div className="w-14 h-5 bg-[#121214] border border-zinc-900 rounded" />
              </div>
            </div>
            <div className="w-full h-9 bg-zinc-850 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Workouts History Section Header */}
      <div className="border-t border-[#1f1f23] pt-8 space-y-2">
        <div className="h-5 w-44 bg-zinc-850 rounded" />
        <div className="h-3 w-64 bg-zinc-900 rounded" />
      </div>

      {/* History Items Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#09090b] border border-[#27272a] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="h-4 w-36 bg-zinc-800 rounded-md" />
              <div className="h-3 w-48 bg-zinc-900 rounded" />
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-20 h-5 bg-[#121214] border border-zinc-900 rounded" />
              <div className="w-8 h-8 rounded-full bg-zinc-900" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
