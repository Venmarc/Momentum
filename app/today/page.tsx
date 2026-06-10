import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createSupabaseServiceClient } from '@/app/lib/supabase-server';
import { ensureProfile } from '@/app/actions/auth-actions';
import Link from 'next/link';
import { Dumbbell, Heart, Activity, ChevronRight } from 'lucide-react';
import BodyCompWidget from '@/app/components/dashboard/body-comp-widget';
import LifeScoreRing, { DashboardHabitsChecklist } from '@/app/components/dashboard/life-score-ring';
import GoalsTracker from '@/app/components/dashboard/goals-tracker';
import { getProfileAndPreferences } from '@/app/actions/settings-actions';

export const metadata = {
  title: 'Today | Momentum',
  description: 'Your personal operating system for habits, fitness, and wellness.',
};

export default async function TodayPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  // --- SIGNED IN TODAY PAGE ---
  await ensureProfile();
  const supabase = createSupabaseServiceClient();
  const todayStr = new Date().toISOString().split('T')[0];

  // Fetch preferences to toggle dashboard widgets layout
  const prefRes = await getProfileAndPreferences();
  const dbWidgets = prefRes?.preferences?.dashboard_widgets as Record<string, boolean> | null;
  const widgets = {
    habitsChecklist: dbWidgets?.habitsChecklist ?? true,
    fitnessStatus: dbWidgets?.fitnessStatus ?? true,
    wellnessLog: dbWidgets?.wellnessLog ?? true,
    goalsTracker: dbWidgets?.goalsTracker ?? true,
    bodyComposition: dbWidgets?.bodyComposition ?? true,
  };

  // 1. Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_id', userId)
    .single();

  const firstName = profile?.full_name ? profile.full_name.trim().split(/\s+/)[0] : (profile?.username || 'User');

  // 2. Fetch habits stats
  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('clerk_id', userId)
    .eq('is_active', true);

  const activeHabitsCount = habits?.length || 0;

  const { data: todayLogs } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('clerk_id', userId)
    .eq('logged_date', todayStr);

  const completedTodayCount = todayLogs?.filter(l => l.completed).length || 0;

  // 3. Fetch workouts stats
  const { data: workouts } = await supabase
    .from('workouts')
    .select('*')
    .eq('clerk_id', userId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  const totalWorkoutsLogged = workouts?.length || 0;
  const latestWorkout = workouts?.[0] || null;

  // 4. Fetch wellness entry for today
  const { data: todayWellness } = await supabase
    .from('wellness_entries')
    .select('*')
    .eq('clerk_id', userId)
    .eq('entry_date', todayStr)
    .single();

  // 5. Fetch latest body measurement
  const { data: latestMeasurement } = await supabase
    .from('body_measurements')
    .select('*')
    .eq('clerk_id', userId)
    .order('measured_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  // 6. Fetch all goals
  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('clerk_id', userId);

  // 7. Calculate dynamic Life Score
  const todayDayOfWeek = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.
  const hasWorkoutScheduled = habits?.some(h => {
    const isFitness = 
      h.category?.toLowerCase() === 'fitness' || 
      h.category?.toLowerCase() === 'workout' ||
      h.name?.toLowerCase().includes('workout') ||
      h.name?.toLowerCase().includes('gym') ||
      h.name?.toLowerCase().includes('exercise');
    if (!isFitness) return false;
    
    if (!h.recurrence) return true;
    if (h.recurrence.type === 'daily') return true;
    if (h.recurrence.type === 'weekly') {
      return h.recurrence.days?.includes(todayDayOfWeek);
    }
    return true;
  }) || false;

  const workoutLoggedToday = workouts?.some(w => w.date === todayStr) || false;
  const isWorkoutDay = workoutLoggedToday || hasWorkoutScheduled;

  const habitsScore = activeHabitsCount > 0 
    ? (completedTodayCount / activeHabitsCount) * 100 
    : 100;
  
  const wellnessCompleted = !!todayWellness;
  const wellnessScore = wellnessCompleted ? 100 : 0;
  const workoutScore = workoutLoggedToday ? 100 : 0;

  let score = 0;
  if (isWorkoutDay) {
    score = Math.round((habitsScore * 0.50) + (wellnessScore * 0.25) + (workoutScore * 0.25));
  } else {
    score = Math.round((habitsScore * 0.65) + (wellnessScore * 0.35));
  }

  // Format today's human-readable date
  const displayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 space-y-8 bg-black text-[#f4f4f5] pb-20">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-16 md:mt-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-xs text-[#a1a1aa] font-medium">{displayDate}</p>
        </div>
      </div>

      {/* Today's Life Score Banner */}
      <LifeScoreRing 
        score={score} 
        completedTodayCount={completedTodayCount}
        activeHabitsCount={activeHabitsCount}
        workoutLoggedToday={workoutLoggedToday}
        wellnessCompleted={wellnessCompleted}
        habits={habits || []}
        todayLogs={todayLogs || []}
      />

      {/* Main Grid: 2x2 Habits, Fitness, Wellness, and Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Habits Checklist Widget */}
        {widgets.habitsChecklist && (
          <DashboardHabitsChecklist habits={habits || []} todayLogs={todayLogs || []} />
        )}
 
        {/* Fitness / Workout Logger Widget */}
        {widgets.fitnessStatus && (
          <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-5 space-y-4 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Dumbbell className="w-4.5 h-4.5 text-brand-success" />
                  Fitness Status
                </h2>
                <span className="text-[10px] bg-[#18181b] border border-[#27272a] text-[#a1a1aa] px-2 py-0.5 rounded-md font-semibold">
                  {totalWorkoutsLogged} workouts
                </span>
              </div>
 
              {latestWorkout ? (
                <div className="bg-[#121214] border border-[#1e1e22] rounded-xl p-4 space-y-3.5">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#a1a1aa] font-bold">Last Training Session</p>
                    <p className="text-sm font-bold text-white mt-0.5">{latestWorkout.name}</p>
                    <p className="text-xs text-[#a1a1aa] mt-0.5">
                      {new Date(latestWorkout.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {latestWorkout.total_duration_minutes ? ` • ${latestWorkout.total_duration_minutes} min` : ''}
                    </p>
                  </div>
                  {latestWorkout.total_volume_kg && latestWorkout.total_volume_kg > 0 ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-white border-t border-[#1e1e22] pt-2.5">
                      <Activity className="w-3.5 h-3.5 text-brand-success" />
                      <span>Total Volume: </span>
                      <span className="text-brand-success">{latestWorkout.total_volume_kg.toLocaleString()} kg</span>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="py-6 text-center border border-dashed border-[#27272a] rounded-xl p-4">
                  <p className="text-xs text-[#a1a1aa]">No sessions logged yet.</p>
                  <p className="text-[10px] text-[#a1a1aa] mt-0.5">Preset routines are ready to load inside the logger.</p>
                </div>
              )}
            </div>
 
            <Link
              href="/fitness"
              className="w-full mt-2 py-2 bg-[#121214] hover:bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-white transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-[#22c55e]/50"
            >
              Start Workout
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
 
        {/* Wellness snapshot widget */}
        {widgets.wellnessLog && (
          <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-5 space-y-4 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Heart className="w-4.5 h-4.5 text-pink-400" />
                  Wellness Log
                </h2>
                <span className="text-[10px] bg-pink-500/10 border border-pink-500/20 text-pink-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {todayWellness ? 'Logged' : 'Pending'}
                </span>
              </div>
 
              {todayWellness ? (
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#121214] border border-[#1e1e22] rounded-xl p-2.5 flex flex-col justify-center">
                    <span className="text-[8px] text-[#a1a1aa] font-bold uppercase tracking-wider">Mood Index</span>
                    <span className="text-xs font-extrabold text-white mt-0.5">{todayWellness.mood} / 5</span>
                  </div>
                  <div className="bg-[#121214] border border-[#1e1e22] rounded-xl p-2.5 flex flex-col justify-center">
                    <span className="text-[8px] text-[#a1a1aa] font-bold uppercase tracking-wider">Energy Level</span>
                    <span className="text-xs font-extrabold text-white mt-0.5">{todayWellness.energy} / 5</span>
                  </div>
                  <div className="bg-[#121214] border border-[#1e1e22] rounded-xl p-2.5 flex flex-col justify-center">
                    <span className="text-[8px] text-[#a1a1aa] font-bold uppercase tracking-wider">Sleep Hours</span>
                    <span className="text-xs font-extrabold text-white mt-0.5">{todayWellness.sleep_hours} hrs</span>
                  </div>
                  <div className="bg-[#121214] border border-[#1e1e22] rounded-xl p-2.5 flex flex-col justify-center">
                    <span className="text-[8px] text-[#a1a1aa] font-bold uppercase tracking-wider">Sleep Quality</span>
                    <span className="text-xs font-extrabold text-white mt-0.5">{todayWellness.sleep_quality} / 5</span>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <p className="text-xs font-semibold text-white">How are you feeling today?</p>
                  <p className="text-[10px] text-[#a1a1aa] mt-0.5">Quickly track your daily sleep duration, energy level, and mood scores.</p>
                </div>
              )}
            </div>
 
            <Link
              href="/wellness"
              className="w-full mt-2 py-2 bg-[#121214] hover:bg-[#18181b] border border-[#27272a] hover:border-pink-500/25 text-pink-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer outline-none focus:ring-1 focus:ring-[#22c55e]/50"
            >
              Log Wellness
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
 
        {/* Goals Tracker Widget */}
        {widgets.goalsTracker && (
          <GoalsTracker goals={goals || []} />
        )}
      </div>
 
      {/* Body Composition section below the 2x2 grid */}
      {widgets.bodyComposition && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BodyCompWidget initialMeasurement={latestMeasurement} />
        </div>
      )}

    </div>
  );
}
