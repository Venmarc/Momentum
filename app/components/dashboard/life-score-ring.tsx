'use client';

import React, { useTransition, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGamification } from '@/app/hooks/use-gamification';
import { logHabit } from '@/app/actions/habit-actions';
import { CheckCircle2, Circle, CheckSquare, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface LifeScoreRingProps {
  score: number;
  completedTodayCount: number;
  activeHabitsCount: number;
  workoutLoggedToday: boolean;
  wellnessCompleted: boolean;
  habits: any[];
  todayLogs: any[];
}

export default function LifeScoreRing({ 
  score, 
  completedTodayCount, 
  activeHabitsCount, 
  workoutLoggedToday, 
  wellnessCompleted,
  habits,
  todayLogs
}: LifeScoreRingProps) {
  const { xp, level, calculateLevel, addXp } = useGamification();
  const { remainingXp, nextLevelXp } = calculateLevel(xp);
  const xpPercent = Math.min(100, Math.round((remainingXp / nextLevelXp) * 100));
  const [mounted, setMounted] = useState(false);

  // Prevent server-client hydration mismatch for Zustand state
  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      const todayStr = new Date().toISOString().split('T')[0];
      const rawRewards = localStorage.getItem('momentum-daily-rewards');
      let rewardsObj = rawRewards ? JSON.parse(rawRewards) : {};

      if (!rewardsObj[todayStr]) {
        rewardsObj[todayStr] = {
          habits: [],
          workout: false,
          wellness: false,
        };
      }

      const todayRewards = rewardsObj[todayStr];
      let xpToAdd = 0;

      // Sync existing logs
      todayLogs.forEach(log => {
        if (log.completed && !todayRewards.habits.includes(log.habit_id)) {
          todayRewards.habits.push(log.habit_id);
          xpToAdd += 10;
        }
      });

      if (workoutLoggedToday && !todayRewards.workout) {
        todayRewards.workout = true;
        xpToAdd += 50;
      }

      if (wellnessCompleted && !todayRewards.wellness) {
        todayRewards.wellness = true;
        xpToAdd += 20;
      }

      if (xpToAdd > 0) {
        addXp(xpToAdd);
        localStorage.setItem('momentum-daily-rewards', JSON.stringify(rewardsObj));
      }
    }
  }, [todayLogs, workoutLoggedToday, wellnessCompleted, addXp]);

  if (!mounted) {
    return (
      <div className="bg-white/[0.04] backdrop-blur-[24px] border border-white/[0.08] rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6 shadow-xl animate-pulse h-[138px]" />
    );
  }

  return (
    <div className="bg-white/[0.04] backdrop-blur-[24px] border border-white/[0.08] rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
      <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
          <circle 
            cx="48" cy="48" r="40" 
            stroke="#22c55e" strokeWidth="8" fill="transparent" 
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (251.2 * score) / 100}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <span className="absolute text-2xl font-black text-white drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">{score}</span>
      </div>

      <div className="flex-1 w-full space-y-2">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] text-[#a1a1aa] font-bold uppercase tracking-wider">Today's Life Score</span>
            <h3 className="text-sm font-bold text-white mt-0.5">Lv {level} Habit Champion</h3>
          </div>
          <span className="text-[10px] font-bold text-[#22c55e] tabular-nums">{remainingXp} / {nextLevelXp} XP</span>
        </div>

        <div className="w-full h-2 bg-[#1c1c1f] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#22c55e] to-[#10b981] shadow-[0_0_10px_rgba(34,197,94,0.4)] transition-all duration-300" style={{ width: `${xpPercent}%` }} />
        </div>
        <p className="text-[10px] text-[#71717a]">Aggregated from completed habits, logged workouts, and wellness status.</p>
      </div>
    </div>
  );
}

interface DashboardHabitsChecklistProps {
  habits: any[];
  todayLogs: any[];
}

export function DashboardHabitsChecklist({ habits, todayLogs }: DashboardHabitsChecklistProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { addXp } = useGamification();

  const handleToggle = async (habitId: string, currentCompleted: boolean) => {
    if (isPending) return;
    const targetCompleted = !currentCompleted;
    const todayStr = new Date().toISOString().split('T')[0];

    startTransition(async () => {
      const res = await logHabit({
        habit_id: habitId,
        logged_date: todayStr,
        completed: targetCompleted,
        count: targetCompleted ? 1 : 0,
      });

      if (!res.error) {
        if (targetCompleted) {
          const rawRewards = localStorage.getItem('momentum-daily-rewards');
          let rewardsObj = rawRewards ? JSON.parse(rawRewards) : {};
          if (!rewardsObj[todayStr]) {
            rewardsObj[todayStr] = { habits: [], workout: false, wellness: false };
          }
          if (!rewardsObj[todayStr].habits.includes(habitId)) {
            rewardsObj[todayStr].habits.push(habitId);
            addXp(10);
            localStorage.setItem('momentum-daily-rewards', JSON.stringify(rewardsObj));
          }
        } else {
          const rawRewards = localStorage.getItem('momentum-daily-rewards');
          if (rawRewards) {
            let rewardsObj = JSON.parse(rawRewards);
            if (rewardsObj[todayStr]?.habits) {
              rewardsObj[todayStr].habits = rewardsObj[todayStr].habits.filter((id: string) => id !== habitId);
              localStorage.setItem('momentum-daily-rewards', JSON.stringify(rewardsObj));
            }
          }
        }
        router.refresh();
      }
    });
  };

  return (
    <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-5 space-y-4 flex flex-col justify-between min-h-[220px]">
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-4.5 h-4.5 text-blue-400" />
            Habits Due Today
          </h2>
          <span className="text-[10px] bg-[#18181b] border border-[#27272a] text-[#a1a1aa] px-2 py-0.5 rounded-md font-semibold">
            {habits.length} active
          </span>
        </div>

        {habits.length === 0 ? (
          <p className="text-xs text-[#a1a1aa] py-4 italic">No habits registered. Create one to begin logging!</p>
        ) : (
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {habits.map((h) => {
              const log = todayLogs.find(l => l.habit_id === h.id);
              const isDone = !!log?.completed;
              return (
                <button
                  key={h.id}
                  onClick={() => handleToggle(h.id, isDone)}
                  disabled={isPending}
                  className="w-full flex items-center justify-between p-2 bg-[#121214] hover:bg-[#18181b] border border-[#1e1e22] hover:border-zinc-700 rounded-lg text-left transition-colors cursor-pointer group outline-none focus:ring-1 focus:ring-[#22c55e]/50"
                >
                  <span className={`text-xs font-semibold ${isDone ? 'line-through text-[#71717a]' : 'text-[#f4f4f5] group-hover:text-white'}`}>
                    {h.name}
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#22c55e] transition-transform group-hover:scale-110 shrink-0" />
                  ) : (
                    <Circle className="w-4.5 h-4.5 text-[#27272a] group-hover:text-zinc-500 transition-colors shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Link
        href="/habits"
        className="w-full mt-2 py-2 border border-[#27272a] hover:border-zinc-700 bg-[#121214] hover:bg-[#18181b] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-white transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-[#22c55e]/50"
      >
        Manage Habits
        <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
