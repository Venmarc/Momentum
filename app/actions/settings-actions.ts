'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { createSupabaseServiceClient } from '@/app/lib/supabase-server';

export async function getProfileAndPreferences() {
  try {
    const { userId } = await auth();
    if (!userId) return { error: 'Not authenticated' };

    const supabase = createSupabaseServiceClient();

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return { error: 'Failed to fetch user profile' };
    }

    // Fetch preferences
    let { data: preferences, error: prefError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('clerk_id', userId)
      .maybeSingle();

    if (prefError) {
      console.error('Error fetching preferences:', prefError);
      return { error: 'Failed to fetch user preferences' };
    }

    // If preferences record doesn't exist, initialize it
    if (!preferences) {
      const defaultPrefs = {
        clerk_id: userId,
        theme: 'dark',
        week_starts_on: 'monday',
        notifications_enabled: true,
        timezone: 'UTC',
      };
      const { data: newPrefs, error: insertError } = await supabase
        .from('user_preferences')
        .insert(defaultPrefs)
        .select()
        .single();

      if (insertError) {
        console.error('Error initializing preferences:', insertError);
        // Fallback to local default object if insert fails
        preferences = defaultPrefs;
      } else {
        preferences = newPrefs;
      }
    }

    return {
      success: true,
      profile,
      preferences,
    };
  } catch (err) {
    console.error('Error in getProfileAndPreferences:', err);
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateUserProfile(input: {
  full_name: string;
  username: string;
  height_cm: number | null;
  weight_kg: number | null;
}) {
  try {
    const { userId } = await auth();
    if (!userId) return { error: 'Not authenticated' };

    const supabase = createSupabaseServiceClient();

    // Split full name into first and last name for Clerk sync
    const nameParts = input.full_name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    try {
      const client = await clerkClient();
      await client.users.updateUser(userId, {
        firstName,
        lastName,
        username: input.username || undefined,
      });
    } catch (clerkErr: any) {
      console.warn('Failed to update Clerk profile:', clerkErr);
      return { error: clerkErr?.message || 'Failed to update Clerk profile settings.' };
    }

    // Update Supabase profile
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: input.full_name,
        username: input.username,
        height_cm: input.height_cm,
        weight_kg: input.weight_kg,
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_id', userId);

    if (error) {
      console.error('Error updating profiles table:', error);
      return { error: `Database error: ${error.message}` };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error in updateUserProfile:', err);
    return { error: err?.message || 'An unexpected error occurred' };
  }
}

export async function updateUserPreferences(input: {
  theme: string;
  timezone: string;
  week_starts_on: string;
  notifications_enabled: boolean;
}) {
  try {
    const { userId } = await auth();
    if (!userId) return { error: 'Not authenticated' };

    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        clerk_id: userId,
        theme: input.theme,
        timezone: input.timezone,
        week_starts_on: input.week_starts_on,
        notifications_enabled: input.notifications_enabled,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'clerk_id' });

    if (error) {
      console.error('Error updating user preferences:', error);
      return { error: `Database error: ${error.message}` };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error in updateUserPreferences:', err);
    return { error: err?.message || 'An unexpected error occurred' };
  }
}
