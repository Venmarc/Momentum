# Momentum UI Polish & Gamification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish Momentum UI across all pages and implement a tactile glassmorphic gamification system (daily checklist score rings converting to levels/XP).

**Architecture:** Enforce database constraints to fix log duplication. Refactor backend actions to upsert. Redesign the dashboard page using a 2x2 responsive grid, a dynamic Life Score calculation, and a cumulative XP leveling mechanism.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4, Supabase (PostgreSQL), Zustand, Lucide React.

---

### Task 1: Database unique constraint & logHabit upsert

**Files:**
- Create: `supabase/migrations/20260608_habit_logs_unique.sql`
- Modify: `app/actions/habit-actions.ts`

- [ ] **Step 1: Write DB migration SQL**
  Create file `supabase/migrations/20260608_habit_logs_unique.sql`:
  ```sql
  ALTER TABLE public.habit_logs 
  ADD CONSTRAINT habit_logs_habit_id_logged_date_key 
  UNIQUE (habit_id, logged_date);
  ```

- [ ] **Step 2: Apply migration to Supabase**
  Run constraint in Supabase SQL editor or local CLI migration.

- [ ] **Step 3: Refactor logHabit to use upsert**
  Modify [app/actions/habit-actions.ts](file:///home/redmane/Documents/Port%20Sites/Category%205/Momentum/app/actions/habit-actions.ts#L169-L257):
  ```typescript
  export async function logHabit(input: HabitLogInput) {
    try {
      const { userId } = await auth();
      if (!userId) return { error: 'Not authenticated' };

      const parsed = habitLogInputSchema.safeParse(input);
      if (!parsed.success) {
        return { error: parsed.error.issues.map(e => e.message).join(', ') };
      }

      const supabase = createSupabaseServiceClient();

      // Verify habit ownership
      const { data: habit, error: habitErr } = await supabase
        .from('habits')
        .select('id')
        .eq('id', parsed.data.habit_id)
        .eq('clerk_id', userId)
        .single();

      if (habitErr || !habit) return { error: 'Unauthorized habit access' };

      const { data, error } = await supabase
        .from('habit_logs')
        .upsert({
          habit_id: parsed.data.habit_id,
          clerk_id: userId,
          logged_date: parsed.data.logged_date,
          completed: parsed.data.completed,
          count: parsed.data.count,
          notes: parsed.data.notes,
          difficulty: parsed.data.difficulty,
          context_tags: parsed.data.context_tags,
        }, {
          onConflict: 'habit_id, logged_date'
        })
        .select()
        .single();

      if (error) {
        console.error('Error logging habit entry:', error);
        return { error: `Database error: ${error.message}` };
      }

      revalidatePath('/habits');
      revalidatePath('/');
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error in logHabit:', err);
      return { error: 'An unexpected error occurred' };
    }
  }
  ```

- [ ] **Step 4: Commit changes**
  ```bash
  git add supabase/migrations/20260608_habit_logs_unique.sql app/actions/habit-actions.ts
  git commit -m "fix(habits): enforce unique constraint and upsert in logHabit"
  ```

---

### Task 2: Gamification XP & Level State Management

**Files:**
- Create: `app/hooks/use-gamification.ts`

- [ ] **Step 1: Create Zustand store for XP and leveling**
  Create file `app/hooks/use-gamification.ts`:
  ```typescript
  import { create } from 'zustand';
  import { persist } from 'zustand/middleware';

  interface GamificationState {
    xp: number;
    level: number;
    addXp: (amount: number) => void;
    calculateLevel: (totalXp: number) => { level: number; remainingXp: number; nextLevelXp: number };
  }

  export const useGamification = create<GamificationState>()(
    persist(
      (set, get) => ({
        xp: 0,
        level: 1,
        addXp: (amount) => {
          const newXp = get().xp + amount;
          const { level } = get().calculateLevel(newXp);
          set({ xp: newXp, level });
        },
        calculateLevel: (totalXp) => {
          let level = 1;
          let xpNeeded = 100;
          let remaining = totalXp;

          while (remaining >= xpNeeded) {
            remaining -= xpNeeded;
            level++;
            xpNeeded = Math.round(100 * Math.pow(1.2, level - 1));
          }

          return { level, remainingXp: remaining, nextLevelXp: xpNeeded };
        }
      }),
      {
        name: 'momentum-gamification'
      }
    )
  );
  ```

- [ ] **Step 2: Commit store**
  ```bash
  git add app/hooks/use-gamification.ts
  git commit -m "feat(gamification): add Zustand store for XP and leveling"
  ```

---

### Task 3: Redesign Today Dashboard Grid

**Files:**
- Modify: `app/page.tsx`
- Create: `app/components/dashboard/life-score-ring.tsx`
- Create: `app/components/dashboard/goals-tracker.tsx`

- [ ] **Step 1: Create Life Score Ring Component**
  Create file `app/components/dashboard/life-score-ring.tsx` using Tailwind v4 styles:
  ```typescript
  'use client';

  import React from 'react';
  import { useGamification } from '@/app/hooks/use-gamification';

  interface LifeScoreRingProps {
    score: number;
  }

  export default function LifeScoreRing({ score }: LifeScoreRingProps) {
    const { xp, level, calculateLevel } = useGamification();
    const { remainingXp, nextLevelXp } = calculateLevel(xp);
    const xpPercent = Math.min(100, Math.round((remainingXp / nextLevelXp) * 100));

    return (
      <div className="bg-white/[0.04] backdrop-blur-[24px] border border-white/[0.08] rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
        <div className="relative w-24 h-24 flex items-center justify-center">
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
            <span className="text-[10px] font-bold text-[#22c55e]">{remainingXp} / {nextLevelXp} XP</span>
          </div>

          <div className="w-full h-2 bg-[#1c1c1f] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#22c55e] to-[#10b981] shadow-[0_0_10px_rgba(34,197,94,0.4)] transition-all duration-300" style={{ width: `${xpPercent}%` }} />
          </div>
          <p className="text-[10px] text-[#71717a]">Aggregated from completed habits, logged workouts, and wellness status.</p>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Create Active Goals Tracker Component**
  Create file `app/components/dashboard/goals-tracker.tsx`:
  ```typescript
  import React from 'react';
  import Link from 'next/link';
  import { ChevronRight, Target } from 'lucide-react';

  interface GoalsTrackerProps {
    goals: any[];
  }

  export default function GoalsTracker({ goals }: GoalsTrackerProps) {
    const activeGoals = goals.filter(g => g.is_active).slice(0, 2);

    return (
      <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-5 space-y-4 flex flex-col justify-between min-h-[200px]">
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
          className="w-full py-2 mt-2 border border-[#27272a] hover:border-zinc-700 bg-[#121214] hover:bg-[#18181b] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-white transition-colors"
        >
          Manage Goals
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }
  ```

- [ ] **Step 3: Modify app/page.tsx for 2x2 Grid and dynamic Life Score**
  Update [app/page.tsx](file:///home/redmane/Documents/Port%20Sites/Category%205/Momentum/app/page.tsx) to:
  1. Fetch active goals from database.
  2. Calculate dynamic Life Score:
     - Habits completeness = `completedTodayCount / activeHabitsCount` (weight 50% or 65%).
     - Wellness completed = `todayWellness ? 100 : 0` (weight 25% or 35%).
     - Workout logged today = `workouts.some(w => w.date === todayStr)` (weight 25% or 0%).
  3. Render `LifeScoreRing` and layout components in a 2x2 grid containing Habits, Fitness, Wellness, and Goals.
  4. Inject dynamic XP to store on complete triggers in client container.

- [ ] **Step 4: Commit dashboard UI changes**
  ```bash
  git add app/components/dashboard/life-score-ring.tsx app/components/dashboard/goals-tracker.tsx app/page.tsx
  git commit -m "feat(dashboard): redesign layout to 2x2 grid with goals tracker and life score progress"
  ```

---

### Task 4: Fix Heatmap Tooltip Overflow

**Files:**
- Modify: `app/components/progress/habits-heatmap.tsx`

- [ ] **Step 1: Re-structure Tooltip Position Logic**
  Update [app/components/progress/habits-heatmap.tsx](file:///home/redmane/Documents/Port%20Sites/Category%205/Momentum/app/components/progress/habits-heatmap.tsx#L59-L146) to use local hover state.
  Add `useState` hook for `hoveredDay` and positioning coordinates.
  Remove nested absolute tooltips from week divs.
  Render a single dynamic tooltip container in the parent card wrapper absolute layout.

- [ ] **Step 2: Commit progress page changes**
  ```bash
  git add app/components/progress/habits-heatmap.tsx
  git commit -m "fix(progress): resolve tooltip overflow in consistency heatmap using parent coordinates"
  ```

---

### Task 5: Polish Wellness Emojis & Modals

**Files:**
- Modify: `app/components/wellness/wellness-client.tsx` (or modal inputs)
- Modify: `app/components/wellness/history-logs.tsx` (replace confirm dialog)

- [ ] **Step 1: Add labels under mood selector emojis**
  Locate the mood selector element and add short texts underneath: Bad, Poor, Neutral, Good, Excellent.

- [ ] **Step 2: Swap browser confirm for custom glass modal**
  Create a modal component inside `wellness` or reuse existing layout custom modal wrapper to delete log entry securely.

- [ ] **Step 3: Commit wellness UI refinements**
  ```bash
  git add app/components/wellness/
  git commit -m "style(wellness): add labels to mood selector and replace confirm alerts with custom modal"
  ```

---

### Task 6: Add Bodyweight & Endurance Timer to Workout Logger

**Files:**
- Modify: `app/components/fitness/workout-logger.tsx` (or logging input form)

- [ ] **Step 1: Add Bodyweight toggles and timers**
  Add "Bodyweight" checkbox to each exercise set in form. If checked, disable weight input and automatically hide/ignore weight field in calculation.
  Add "Duration" timer field (minutes/seconds) for planks or endurance sets.

- [ ] **Step 2: Add edit workout button**
  Allow modifying reps/weight/RPE in completed workout sessions via modal update triggers.

- [ ] **Step 3: Commit workout logger edits**
  ```bash
  git add app/components/fitness/
  git commit -m "feat(fitness): support bodyweight toggle, endurance timer, and workout edit trigger"
  ```
