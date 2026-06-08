import React from 'react';
import Link from 'next/link';
import { ChevronRight, Target } from 'lucide-react';

interface GoalsTrackerProps {
  goals: any[];
}

export default function GoalsTracker({ goals }: GoalsTrackerProps) {
  const activeGoals = goals.filter(g => g.is_active).slice(0, 2);

  return (
    <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-5 space-y-4 flex flex-col justify-between min-h-[220px]">
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4.5 h-4.5 text-blue-400" />
            Active Goals
          </h2>
          <span className="text-[10px] bg-[#18181b] border border-[#27272a] text-[#a1a1aa] px-2 py-0.5 rounded-md font-semibold">
            {goals.length} total
          </span>
        </div>

        {activeGoals.length === 0 ? (
          <p className="text-xs text-[#a1a1aa] py-4 italic">No active goals. Add some to track progress!</p>
        ) : (
          <div className="space-y-3">
            {activeGoals.map(goal => {
              const percent = goal.target_value > 0 
                ? Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
                : 0;

              return (
                <div key={goal.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-white">{goal.title}</span>
                    <span className="text-[#a1a1aa]">{percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#18181b] rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Link
        href="/goals"
        className="w-full py-2 mt-2 border border-[#27272a] hover:border-zinc-700 bg-[#121214] hover:bg-[#18181b] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-white transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-[#22c55e]/50"
      >
        Manage Goals
        <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
