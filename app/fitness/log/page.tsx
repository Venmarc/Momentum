import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createSupabaseServiceClient } from '@/app/lib/supabase-server';
import { ensureProfile } from '@/app/actions/auth-actions';
import WorkoutLogClient from '@/app/components/fitness/workout-log-client';

export const metadata = {
  title: 'Log Workout | Momentum',
  description: 'Track and log your active fitness session, sets, reps, and weights.',
};

export default async function LogWorkoutPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }

  await ensureProfile();

  const supabase = createSupabaseServiceClient();

  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .or(`clerk_id.is.null,clerk_id.eq.${userId}`)
    .order('name', { ascending: true });

  return (
    <WorkoutLogClient initialExercises={exercises || []} />
  );
}
