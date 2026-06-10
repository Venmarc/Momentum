import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createSupabaseServiceClient } from '@/app/lib/supabase-server';
import { ensureProfile } from '@/app/actions/auth-actions';
import ExercisesLibraryClient from '@/app/components/fitness/exercises-library-client';

export const metadata = {
  title: 'Exercises Library | Momentum',
  description: 'Explore exercises and add custom movements.',
};

export default async function ExercisesPage() {
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
    <ExercisesLibraryClient initialExercises={exercises || []} />
  );
}
