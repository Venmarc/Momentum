'use server';

import { auth } from '@clerk/nextjs/server';
import { createSupabaseServiceClient } from '@/app/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { goalInputSchema } from '@/app/lib/validation';

export type GoalInput = z.infer<typeof goalInputSchema>;

/**
 * Fetch all goals for the logged-in user.
 */
export async function getGoals() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Not authenticated' };
    }

    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('clerk_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals:', error);
      return { error: `Database error: ${error.message}` };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error in getGoals:', err);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Create a new goal.
 */
export async function createGoal(input: GoalInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Not authenticated' };
    }

    const parsed = goalInputSchema.safeParse(input);
    if (!parsed.success) {
      return { error: parsed.error.issues.map(e => e.message).join(', ') };
    }

    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from('goals')
      .insert({
        clerk_id: userId,
        title: parsed.data.title,
        description: parsed.data.description,
        target_date: parsed.data.target_date,
        target_value: parsed.data.target_value,
        current_value: parsed.data.current_value,
        category: parsed.data.category || 'General',
        is_active: parsed.data.is_active,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating goal:', error);
      return { error: `Database error: ${error.message}` };
    }

    revalidatePath('/goals');
    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error in createGoal:', err);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Update current value progress of a goal.
 */
export async function updateGoalProgress(id: string, currentValue: number) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Not authenticated' };
    }

    if (currentValue < 0) {
      return { error: 'Progress value cannot be negative' };
    }

    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from('goals')
      .update({ current_value: currentValue })
      .eq('id', id)
      .eq('clerk_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating goal progress:', error);
      return { error: `Database error: ${error.message}` };
    }

    revalidatePath('/goals');
    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error in updateGoalProgress:', err);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Toggle goal active/inactive status.
 */
export async function toggleGoalActive(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Not authenticated' };
    }

    const supabase = createSupabaseServiceClient();

    // Get current status
    const { data: goal, error: fetchErr } = await supabase
      .from('goals')
      .select('is_active')
      .eq('id', id)
      .eq('clerk_id', userId)
      .single();

    if (fetchErr || !goal) {
      return { error: 'Goal not found' };
    }

    const { data, error } = await supabase
      .from('goals')
      .update({ is_active: !goal.is_active })
      .eq('id', id)
      .eq('clerk_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error toggling goal status:', error);
      return { error: `Database error: ${error.message}` };
    }

    revalidatePath('/goals');
    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error in toggleGoalActive:', err);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Delete a goal.
 */
export async function deleteGoal(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Not authenticated' };
    }

    const supabase = createSupabaseServiceClient();
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)
      .eq('clerk_id', userId);

    if (error) {
      console.error('Error deleting goal:', error);
      return { error: `Database error: ${error.message}` };
    }

    revalidatePath('/goals');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Unexpected error in deleteGoal:', err);
    return { error: 'An unexpected error occurred' };
  }
}
