import React from 'react';

export default function ProgressLoading() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 pb-20 mt-16 md:mt-0 animate-pulse bg-black text-[#f4f4f5]">
      
      {/* Title & Description Skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-56 bg-zinc-800 rounded-lg" />
        <div className="h-4 w-96 bg-zinc-900 rounded-lg" />
      </div>

      {/* Tabs Selector Navigation Skeleton */}
      <div className="flex bg-[#09090b] border border-[#1f1f23] p-1 rounded-2xl w-full overflow-x-auto gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-10 px-5 rounded-xl bg-[#121214] shrink-0 border border-transparent ${i === 1 ? 'w-40 bg-zinc-850' : 'w-36'}`} />
        ))}
      </div>

      {/* Habits Consistency Tab Loader Structure */}
      <div className="space-y-6">
        
        {/* Heatmap Card Skeleton */}
        <div className="bg-[#09090b] border border-[#1f1f23] rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1f1f23]">
            <div className="space-y-1">
              <div className="h-4.5 w-48 bg-zinc-800 rounded" />
              <div className="h-3 w-72 bg-zinc-900 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-8 bg-[#121214] border border-zinc-900 rounded" />
              <div className="w-24 h-8 bg-[#121214] border border-zinc-900 rounded" />
            </div>
          </div>
          
          {/* Heatmap grid mockup (matching the exact layout structure of the actual component for adaptive scaling) */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-[540px] justify-start py-2">
              {/* Day of week labels mockup */}
              <div className="grid grid-rows-7 gap-1.5 text-[10px] text-[#a1a1aa] pr-2 pt-5 select-none font-medium justify-items-end opacity-20">
                <span className="h-3 leading-3">Mon</span>
                <span className="h-3"></span>
                <span className="h-3 leading-3">Wed</span>
                <span className="h-3"></span>
                <span className="h-3 leading-3">Fri</span>
                <span className="h-3"></span>
                <span className="h-3 leading-3">Sun</span>
              </div>

              {/* Grid columns (weeks) */}
              <div className="flex gap-1.5 flex-1">
                {[...Array(26)].map((_, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-1.5 flex-1 relative">
                    {/* Month header placeholder space */}
                    <span className="h-3.5" />
                    {[...Array(7)].map((_, rowIndex) => (
                      <div key={rowIndex} className="w-full aspect-square rounded-[3px] bg-zinc-900/60" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Adherence Chart Card Skeleton */}
        <div className="bg-[#09090b] border border-[#1f1f23] rounded-2xl p-6 space-y-4">
          <div className="h-4.5 w-44 bg-zinc-800 rounded" />
          <div className="h-72 w-full bg-[#121214]/50 border border-zinc-900/60 rounded-xl flex items-center justify-center">
            <div className="w-full h-full p-6 flex items-end justify-between gap-2.5">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-zinc-850/40 w-full rounded-t-lg" style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }} />
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
