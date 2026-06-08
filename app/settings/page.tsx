import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ensureProfile } from '@/app/actions/auth-actions';
import { getProfileAndPreferences } from '@/app/actions/settings-actions';
import SettingsClient from '@/app/components/settings/settings-client';

export const metadata = {
  title: 'Settings | Momentum',
  description: 'Manage your personal profile, local preferences, and database backups.',
};

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  // Synchronize Clerk user profile to Supabase database profile if needed
  await ensureProfile();

  const res = await getProfileAndPreferences();

  if (res.error || !res.profile || !res.preferences) {
    // Fallback default states if initial lookup fails
    const defaultProfile = {
      clerk_id: userId,
      full_name: '',
      username: '',
      avatar_url: null,
      height_cm: null,
      weight_kg: null,
    };
    
    const defaultPreferences = {
      theme: 'dark',
      timezone: 'UTC',
      week_starts_on: 'monday',
      notifications_enabled: true,
    };
    
    return (
      <SettingsClient 
        initialProfile={defaultProfile}
        initialPreferences={defaultPreferences}
      />
    );
  }

  // Cast Supabase query results to proper types matching SettingsClient expectations
  const typedProfile = {
    clerk_id: res.profile.clerk_id,
    full_name: res.profile.full_name || '',
    username: res.profile.username || '',
    avatar_url: res.profile.avatar_url || null,
    height_cm: res.profile.height_cm ? Number(res.profile.height_cm) : null,
    weight_kg: res.profile.weight_kg ? Number(res.profile.weight_kg) : null,
  };

  const typedPreferences = {
    theme: res.preferences.theme || 'dark',
    timezone: res.preferences.timezone || 'UTC',
    week_starts_on: res.preferences.week_starts_on || 'monday',
    notifications_enabled: res.preferences.notifications_enabled ?? true,
  };

  return (
    <SettingsClient 
      initialProfile={typedProfile}
      initialPreferences={typedPreferences}
    />
  );
}
