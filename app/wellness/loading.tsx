import React from 'react';

export default function WellnessLoading() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8 pb-24 md:pb-12 animate-pulse bg-black text-[#f4f4f5]">
      
      {/* Upper Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-6 mt-16 md:mt-0">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-zinc-800 rounded-lg" />
          <div className="h-4 w-96 bg-zinc-900 rounded-lg" />
        </div>
      </div>

      {/* Tabs Selector Skeleton */}
      <div className="flex bg-[#09090b] border border-[#1f1f23] p-1.5 rounded-2xl w-fit gap-2">
        <div className="w-32 h-10 bg-zinc-850 rounded-xl" />
        <div className="w-36 h-10 bg-[#121214] rounded-xl" />
      </div>

      {/* Wellness Dashboard Summary Row (3 small cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-[#09090b] border border-[#1f1f23] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-850 border border-zinc-800 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-24 bg-zinc-900 rounded" />
              <div className="h-5 w-28 bg-zinc-805 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* 2-Column Logging Form Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Metrics Input Cards (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#09090b] border border-[#1f1f23] rounded-2xl p-6 space-y-6">
            <div className="h-4 w-40 bg-zinc-800 rounded" />
            
            {/* Mood Emojis Picker skeleton */}
            <div className="space-y-2.5">
              <div className="h-3.5 w-32 bg-zinc-900 rounded" />
              <div className="grid grid-cols-5 gap-2.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-[#121214] border border-zinc-900" />
                ))}
              </div>
            </div>

            {/* Energy Slider picker skeleton */}
            <div className="space-y-2.5">
              <div className="h-3.5 w-32 bg-zinc-900 rounded" />
              <div className="h-2 bg-[#121214] rounded-full w-full" />
              <div className="grid grid-cols-5 gap-1 pt-1 text-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-3.5 w-12 bg-[#121214] rounded mx-auto" />
                ))}
              </div>
            </div>

            {/* Sleep Inputs grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#121214] border border-zinc-900 rounded-xl space-y-2">
                <div className="h-3 w-24 bg-zinc-900 rounded" />
                <div className="h-6 w-16 bg-zinc-850 rounded" />
              </div>
              <div className="p-4 bg-[#121214] border border-zinc-900 rounded-xl space-y-2">
                <div className="h-3 w-28 bg-zinc-900 rounded" />
                <div className="h-6 w-20 bg-zinc-850 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Journal Prompt and Notes (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#09090b] border border-[#1f1f23] rounded-2xl p-6 space-y-5 flex flex-col h-full justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#1f1f23]">
                <div className="h-4 w-32 bg-zinc-800 rounded" />
                <div className="w-8 h-8 rounded-lg bg-[#121214]" />
              </div>
              <div className="h-32 bg-[#121214] border border-zinc-900 rounded-xl p-3" />
            </div>
            <div className="w-full h-11 bg-zinc-850 rounded-xl" />
          </div>
        </div>

      </div>

    </div>
  );
}
