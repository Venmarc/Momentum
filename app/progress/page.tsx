import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createSupabaseServiceClient } from '@/app/lib/supabase-server';
import { ensureProfile } from '@/app/actions/auth-actions';
import { getBodyMeasurements } from '@/app/actions/progress-actions';
import ProgressClient from '@/app/components/progress/progress-client';

export const metadata = {
  title: 'Progress & Insights | Momentum',
  description: 'Visualize your habit consistency, fitness progression, body measurements, and wellness trends.',
};

export default async function ProgressPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }

  // Ensure user profile is registered
  await ensureProfile();

  const supabase = createSupabaseServiceClient();

  // 1. Fetch habits and habit logs for the last 180 days (approx. 6 months)
  const startOffsetDate = new Date();
  startOffsetDate.setDate(startOffsetDate.getDate() - 180);
  const startOffsetStr = startOffsetDate.toISOString().split('T')[0];

  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('clerk_id', userId)
    .order('created_at', { ascending: false });

  const { data: habitLogs } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('clerk_id', userId)
    .gte('logged_date', startOffsetStr)
    .order('logged_date', { ascending: true });

  // 2. Fetch all user workouts
  const { data: workouts } = await supabase
    .from('workouts')
    .select(`
      *,
      workout_exercises (
        id,
        order_index,
        sets,
        exercise:exercises (
          id,
          name,
          category,
          muscle_group
        )
      )
    `)
    .eq('clerk_id', userId)
    .order('date', { ascending: true }); // Ascending order is better for chronological charts

  // Flatten workouts structure to match client component expectations
  const formattedWorkouts = (workouts || []).map((w) => ({
    ...w,
    workout_exercises: (w.workout_exercises || [])
      .map((we: any) => ({
        id: we.id,
        order_index: we.order_index,
        sets: we.sets || [],
        exercise: we.exercise || null,
      }))
      .sort((a: any, b: any) => a.order_index - b.order_index),
  }));

  // 3. Fetch exercises library (for custom selectors/PR trackers)
  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .or(`clerk_id.is.null,clerk_id.eq.${userId}`)
    .order('name', { ascending: true });

  // 4. Fetch wellness entries (last 90 days for correlation trend)
  const wellnessStartOffsetDate = new Date();
  wellnessStartOffsetDate.setDate(wellnessStartOffsetDate.getDate() - 90);
  const wellnessStartOffsetStr = wellnessStartOffsetDate.toISOString().split('T')[0];

  const { data: wellnessEntries } = await supabase
    .from('wellness_entries')
    .select('*')
    .eq('clerk_id', userId)
    .gte('entry_date', wellnessStartOffsetStr)
    .order('entry_date', { ascending: true });

  // 5. Fetch body measurements
  const measurementsRes = await getBodyMeasurements();
  const bodyMeasurements = 'data' in measurementsRes ? measurementsRes.data || [] : [];

  return (
    <ProgressClient
      initialHabits={habits || []}
      initialHabitLogs={habitLogs || []}
      initialWorkouts={formattedWorkouts}
      initialExercises={exercises || []}
      initialWellness={wellnessEntries || []}
      initialMeasurements={bodyMeasurements}
    />
  );
}
