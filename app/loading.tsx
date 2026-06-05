import React from 'react';

export default function Loading() {
  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 space-y-8 bg-black text-[#f4f4f5] pb-20 mt-16 md:mt-0 animate-pulse">
      
      {/* Title Header Skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 bg-zinc-800 rounded-lg" />
        <div className="h-4 w-72 bg-zinc-900 rounded-lg" />
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1 Skeleton */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-5 space-y-5 h-72 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#27272a]">
              <div className="h-5 w-32 bg-zinc-800 rounded-md" />
              <div className="h-4 w-12 bg-zinc-900 rounded-md" />
            </div>
            <div className="space-y-3">
              <div className="h-10 bg-zinc-900/55 rounded-xl border border-zinc-800/40" />
              <div className="h-10 bg-zinc-900/55 rounded-xl border border-zinc-800/40" />
              <div className="h-10 bg-zinc-900/55 rounded-xl border border-zinc-800/40" />
            </div>
          </div>
          <div className="h-9 bg-zinc-900 rounded-xl border border-[#27272a]" />
        </div>

        {/* Card 2 Skeleton */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-5 space-y-5 h-72 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#27272a]">
              <div className="h-5 w-28 bg-zinc-800 rounded-md" />
              <div className="h-4 w-16 bg-zinc-900 rounded-md" />
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-4 space-y-3">
              <div className="h-3.5 w-24 bg-zinc-900 rounded" />
              <div className="h-5 w-40 bg-zinc-850 rounded-md" />
              <div className="h-3.5 w-32 bg-zinc-900 rounded" />
            </div>
          </div>
          <div className="h-9 bg-zinc-900 rounded-xl border border-[#27272a]" />
        </div>

        {/* Card 3 Skeleton */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-5 space-y-4 h-52 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#27272a]">
              <div className="h-5 w-24 bg-zinc-800 rounded-md" />
              <div className="h-4 w-14 bg-zinc-900 rounded-md" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-12 bg-zinc-900/50 rounded-xl border border-zinc-800/30" />
              <div className="h-12 bg-zinc-900/50 rounded-xl border border-zinc-800/30" />
            </div>
          </div>
          <div className="h-9 bg-zinc-900 rounded-xl border border-[#27272a]" />
        </div>

        {/* Card 4 Skeleton */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-5 space-y-4 h-52 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#27272a]">
              <div className="h-5 w-36 bg-zinc-800 rounded-md" />
              <div className="h-4 w-12 bg-zinc-900 rounded-md" />
            </div>
            <div className="h-12 bg-zinc-900/50 rounded-xl border border-zinc-800/30" />
          </div>
          <div className="h-9 bg-zinc-900 rounded-xl border border-[#27272a]" />
        </div>

      </div>

    </div>
  );
}
