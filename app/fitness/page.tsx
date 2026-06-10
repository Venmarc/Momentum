import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createSupabaseServiceClient } from '@/app/lib/supabase-server';
import { ensureProfile } from '@/app/actions/auth-actions';
import Link from 'next/link';
import { 
  Dumbbell, Calendar, Clock, Flame, BookOpen, ChevronRight, Activity
} from 'lucide-react';

export const metadata = {
  title: 'Fitness Dashboard | Momentum',
  description: 'Log workouts, track progressive overload volume, and manage exercises.',
};

export default async function FitnessDashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }

  await ensureProfile();

  const supabase = createSupabaseServiceClient();

  // Fetch user workouts for stats
  const { data: workouts } = await supabase
    .from('workouts')
    .select('*')
    .eq('clerk_id', userId)
    .order('date', { ascending: false });

  const totalWorkouts = workouts?.length || 0;
  const latestWorkout = workouts?.[0] || null;

  // Calculate total volume and duration
  const totalVolume = workouts?.reduce((sum, w) => sum + (Number(w.total_volume_kg) || 0), 0) || 0;
  const totalMinutes = workouts?.reduce((sum, w) => sum + (Number(w.total_duration_minutes) || 0), 0) || 0;

  // Format date nicely
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 space-y-8 bg-black text-[#f4f4f5] pb-24 min-w-0">
      
      {/* Page Title */}
      <div className="space-y-1 mt-16 md:mt-0">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Dumbbell className="w-6.5 h-6.5 text-brand-success" />
          Fitness Hub
        </h1>
        <p className="text-xs text-[#a1a1aa]">Log sessions, view progressive overload, and browse exercise configurations</p>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Sessions */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-4 flex flex-col justify-center">
          <span className="text-[9px] text-[#a1a1aa] font-bold uppercase tracking-wider">Logged Sessions</span>
          <span className="text-xl font-extrabold text-white mt-1">{totalWorkouts}</span>
        </div>

        {/* Total Volume */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-4 flex flex-col justify-center">
          <span className="text-[9px] text-[#a1a1aa] font-bold uppercase tracking-wider">Total Volume</span>
          <span className="text-xl font-extrabold text-brand-success mt-1">{totalVolume.toLocaleString()} kg</span>
        </div>

        {/* Total Time */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-4 flex flex-col justify-center">
          <span className="text-[9px] text-[#a1a1aa] font-bold uppercase tracking-wider">Total Duration</span>
          <span className="text-xl font-extrabold text-white mt-1">{totalMinutes} min</span>
        </div>

        {/* Latest Activity */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-4 flex flex-col justify-center">
          <span className="text-[9px] text-[#a1a1aa] font-bold uppercase tracking-wider">Last Trained</span>
          <span className="text-xs font-bold text-white mt-1 truncate">
            {latestWorkout ? latestWorkout.name : 'No sessions yet'}
          </span>
          {latestWorkout && (
            <span className="text-[9px] text-[#a1a1aa] mt-0.5">{formatDate(latestWorkout.date)}</span>
          )}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Start Workout */}
        <Link 
          href="/fitness/log"
          className="bg-[#09090b] border border-[#27272a] hover:border-brand-success/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:translate-y-[-1px] group cursor-pointer"
        >
          <div className="space-y-2">
            <div className="p-2 w-fit rounded-xl bg-brand-success/10 border border-brand-success/20 text-brand-success group-hover:bg-brand-success/20 transition-colors">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white group-hover:text-brand-success transition-colors">Log Active Session</h2>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Start an empty session or load a preset routine to track your sets, reps, weights, and rest timer.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-success flex items-center gap-1">
            Open Logger
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        {/* Card 2: Workouts History */}
        <Link 
          href="/fitness/history"
          className="bg-[#09090b] border border-[#27272a] hover:border-brand-success/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:translate-y-[-1px] group cursor-pointer"
        >
          <div className="space-y-2">
            <div className="p-2 w-fit rounded-xl bg-brand-success/10 border border-brand-success/20 text-brand-success group-hover:bg-brand-success/20 transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white group-hover:text-brand-success transition-colors">Workouts History</h2>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Review history logs, browse notes, volume statistics, progressive overload, and edit previous logs.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-success flex items-center gap-1">
            View History
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        {/* Card 3: Exercises Library */}
        <Link 
          href="/fitness/exercises"
          className="bg-[#09090b] border border-[#27272a] hover:border-brand-success/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:translate-y-[-1px] group cursor-pointer"
        >
          <div className="space-y-2">
            <div className="p-2 w-fit rounded-xl bg-brand-success/10 border border-brand-success/20 text-brand-success group-hover:bg-brand-success/20 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white group-hover:text-brand-success transition-colors">Exercises Library</h2>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Search the complete database of compound and isolation movements, or register your own custom exercises.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-success flex items-center gap-1">
            Browse Directory
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

      </div>

      {/* Latest Workout Summary Card if available */}
      {latestWorkout && (
        <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-6 space-y-4">
          <div className="border-b border-[#27272a] pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-success" />
              Latest Training Session
            </h3>
            <Link 
              href="/fitness/history"
              className="text-xs text-[#a1a1aa] hover:text-white font-semibold transition-colors"
            >
              View All History
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">{latestWorkout.name}</h4>
              <p className="text-xs text-[#a1a1aa]">
                {formatDate(latestWorkout.date)}
                {latestWorkout.total_duration_minutes ? ` • ${latestWorkout.total_duration_minutes} minutes duration` : ''}
              </p>
              {latestWorkout.notes && (
                <p className="text-xs text-[#a1a1aa] italic mt-2">"{latestWorkout.notes}"</p>
              )}
            </div>

            <div className="flex gap-3 text-xs font-bold text-white">
              {latestWorkout.total_volume_kg && latestWorkout.total_volume_kg > 0 ? (
                <div className="bg-[#121214] border border-[#27272a] px-4 py-2.5 rounded-xl flex flex-col justify-center min-w-[100px]">
                  <span className="text-[8px] text-[#a1a1aa] uppercase font-bold tracking-wider">Volume</span>
                  <span className="text-brand-success mt-0.5">{latestWorkout.total_volume_kg.toLocaleString()} kg</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
