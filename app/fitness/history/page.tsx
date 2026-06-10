import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createSupabaseServiceClient } from '@/app/lib/supabase-server';
import { ensureProfile } from '@/app/actions/auth-actions';
import WorkoutHistoryClient from '@/app/components/fitness/workout-history-client';

export const metadata = {
  title: 'Workouts History | Momentum',
  description: 'Review your complete training history, volumes, and progressive overload.',
};

export default async function WorkoutHistoryPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }

  await ensureProfile();

  const supabase = createSupabaseServiceClient();

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
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  // Format history
  const formattedWorkouts = (workouts || []).map((w) => ({
    ...w,
    workout_exercises: (w.workout_exercises || [])
      .map((we: any) => ({
        id: we.id,
        order_index: we.order_index,
        sets: we.sets || [],
        exercise: we.exercise || null,
      }))
      .sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index),
  }));

  return (
    <WorkoutHistoryClient initialWorkouts={formattedWorkouts} />
  );
}
