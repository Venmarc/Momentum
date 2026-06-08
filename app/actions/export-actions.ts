'use server';

import { auth } from '@clerk/nextjs/server';
import { createSupabaseServiceClient } from '@/app/lib/supabase-server';

export async function exportUserData() {
  try {
    const { userId } = await auth();
    if (!userId) return { error: 'Not authenticated' };

    const supabase = createSupabaseServiceClient();

    const [habitsRes, logsRes, workoutsRes, wellnessRes] = await Promise.all([
      supabase.from('habits').select('*').eq('clerk_id', userId),
      supabase.from('habit_logs').select('*').eq('clerk_id', userId),
      supabase.from('workouts').select('*').eq('clerk_id', userId),
      supabase.from('wellness_entries').select('*').eq('clerk_id', userId),
    ]);

    return {
      success: true,
      data: {
        habits: habitsRes.data || [],
        logs: logsRes.data || [],
        workouts: workoutsRes.data || [],
        wellness: wellnessRes.data || [],
      }
    };
  } catch (err) {
    console.error('Error exporting data:', err);
    return { error: 'Failed to compile export data' };
  }
}
