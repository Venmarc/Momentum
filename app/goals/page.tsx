import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createSupabaseServiceClient } from '@/app/lib/supabase-server';
import { ensureProfile } from '@/app/actions/auth-actions';
import GoalsClient from '@/app/components/goals/goals-client';

export const metadata = {
  title: 'Goals | Momentum',
  description: 'Manage, track, and edit your personal growth, fitness, and wellness goals.',
};

export default async function GoalsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }

  // Ensure user profile is registered
  await ensureProfile();

  const supabase = createSupabaseServiceClient();

  // Fetch goals
  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('clerk_id', userId)
    .order('created_at', { ascending: false });

  return (
    <div className="flex-1 min-h-screen bg-black text-[#f4f4f5] pb-24 mt-16 md:mt-0">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <GoalsClient initialGoals={goals || []} />
      </div>
    </div>
  );
}
