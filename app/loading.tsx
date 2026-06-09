import React from 'react';

export default function Loading() {
  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 space-y-8 bg-black text-[#f4f4f5] pb-20 mt-16 md:mt-0 animate-pulse">
      
      {/* Welcome Banner Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-zinc-800 rounded-lg" />
          <div className="h-4 w-40 bg-zinc-900 rounded-lg" />
        </div>
        
        {/* Today's Progress Badge Placeholder */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-3 flex items-center gap-3 w-full md:w-56">
          <div className="w-8 h-8 rounded-lg bg-zinc-850 shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 w-24 bg-zinc-900 rounded" />
            <div className="h-3 w-32 bg-zinc-900 rounded" />
          </div>
        </div>
      </div>

      {/* Main Grid: Habits and Fitness summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Habits Checklist Widget Skeleton */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-5 space-y-5 h-72 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#27272a]">
              <div className="h-5 w-32 bg-zinc-800 rounded-md" />
              <div className="h-4 w-12 bg-zinc-900 rounded-md" />
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2 bg-[#121214] border border-[#1e1e22] rounded-lg">
                <div className="h-3.5 w-24 bg-zinc-900 rounded" />
                <div className="w-4 h-4 rounded-full bg-zinc-850" />
              </div>
              <div className="flex items-center justify-between p-2 bg-[#121214] border border-[#1e1e22] rounded-lg">
                <div className="h-3.5 w-32 bg-zinc-900 rounded" />
                <div className="w-4 h-4 rounded-full bg-zinc-850" />
              </div>
              <div className="flex items-center justify-between p-2 bg-[#121214] border border-[#1e1e22] rounded-lg">
                <div className="h-3.5 w-20 bg-zinc-900 rounded" />
                <div className="w-4 h-4 rounded-full bg-zinc-850" />
              </div>
            </div>
          </div>
          <div className="h-9 bg-[#121214] rounded-xl border border-[#27272a]" />
        </div>

        {/* Fitness / Workout Logger Widget Skeleton */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-5 space-y-5 h-72 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#27272a]">
              <div className="h-5 w-28 bg-zinc-800 rounded-md" />
              <div className="h-4 w-16 bg-zinc-900 rounded-md" />
            </div>
            <div className="bg-[#121214] border border-[#1e1e22] rounded-xl p-4 space-y-3.5">
              <div className="space-y-1">
                <div className="h-2.5 w-24 bg-zinc-900 rounded" />
                <div className="h-4 w-40 bg-zinc-850 rounded-md" />
                <div className="h-3 w-32 bg-zinc-900 rounded" />
              </div>
              <div className="border-t border-[#1e1e22] pt-2.5 flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-zinc-850" />
                <div className="h-3.5 w-36 bg-zinc-900 rounded" />
              </div>
            </div>
          </div>
          <div className="h-9 bg-[#121214] rounded-xl border border-[#27272a]" />
        </div>

      </div>

      {/* Wellness and Body composition Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Wellness snapshot widget Skeleton */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-5 space-y-4 flex flex-col justify-between h-72">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#27272a]">
              <div className="h-5 w-36 bg-zinc-800 rounded-md" />
              <div className="h-4 w-12 bg-zinc-900 rounded-md" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#121214] border border-[#1e1e22] rounded-xl p-3 text-center space-y-2">
                <div className="w-5 h-5 bg-zinc-850 rounded-full mx-auto" />
                <div className="h-3 w-10 bg-zinc-900 rounded mx-auto" />
                <div className="h-4 w-8 bg-zinc-850 rounded mx-auto" />
              </div>
              <div className="bg-[#121214] border border-[#1e1e22] rounded-xl p-3 text-center space-y-2">
                <div className="w-5 h-5 bg-zinc-850 rounded-full mx-auto" />
                <div className="h-3 w-10 bg-zinc-900 rounded mx-auto" />
                <div className="h-4 w-8 bg-zinc-850 rounded mx-auto" />
              </div>
              <div className="bg-[#121214] border border-[#1e1e22] rounded-xl p-3 text-center space-y-2">
                <div className="w-5 h-5 bg-zinc-850 rounded-full mx-auto" />
                <div className="h-3 w-10 bg-zinc-900 rounded mx-auto" />
                <div className="h-4 w-8 bg-zinc-850 rounded mx-auto" />
              </div>
            </div>
          </div>
          <div className="h-9 bg-[#121214] rounded-xl border border-[#27272a]" />
        </div>

        {/* Body composition widget Skeleton */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-5 space-y-4 flex flex-col justify-between h-72">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#27272a]">
              <div className="h-5 w-40 bg-zinc-800 rounded-md" />
              <div className="h-4 w-12 bg-zinc-900 rounded-md" />
            </div>
            <div className="bg-[#121214] border border-[#1e1e22] rounded-xl p-4 flex justify-between items-center">
              <div className="space-y-1.5">
                <div className="h-3 w-28 bg-zinc-900 rounded" />
                <div className="h-6 w-16 bg-zinc-850 rounded" />
              </div>
              <div className="w-24 h-10 bg-zinc-900/60 rounded-lg border border-zinc-850" />
            </div>
          </div>
          <div className="h-9 bg-[#121214] rounded-xl border border-[#27272a]" />
        </div>

      </div>

    </div>
  );
}

