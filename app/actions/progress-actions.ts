'use server';

import { auth } from '@clerk/nextjs/server';
import { createSupabaseServiceClient } from '@/app/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { bodyMeasurementInputSchema } from '@/app/lib/validation';

export type BodyMeasurementInput = z.infer<typeof bodyMeasurementInputSchema>;

/**
 * Fetch all body measurements for the authenticated user
 */
export async function getBodyMeasurements() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Not authenticated' };
    }

    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from('body_measurements')
      .select('*')
      .eq('clerk_id', userId)
      .order('measured_date', { ascending: true });

    if (error) {
      console.error('Error fetching body measurements:', error);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error in getBodyMeasurements action:', err);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Save (insert or update) a body measurement log
 */
export async function saveBodyMeasurement(input: BodyMeasurementInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Not authenticated' };
    }

    const parsed = bodyMeasurementInputSchema.safeParse(input);
    if (!parsed.success) {
      return { error: parsed.error.issues.map(e => e.message).join(', ') };
    }

    const supabase = createSupabaseServiceClient();
    let resultError;
    let resultData;

    if (parsed.data.id) {
      // Verify ownership
      const { data: existing, error: fetchErr } = await supabase
        .from('body_measurements')
        .select('id')
        .eq('id', parsed.data.id)
        .eq('clerk_id', userId)
        .single();

      if (fetchErr || !existing) {
        return { error: 'Measurement not found or unauthorized' };
      }

      // Update
      const { data, error } = await supabase
        .from('body_measurements')
        .update({
          measured_date: parsed.data.measured_date,
          weight_kg: parsed.data.weight_kg,
          body_fat_pct: parsed.data.body_fat_pct,
          muscle_mass_kg: parsed.data.muscle_mass_kg,
          waist_cm: parsed.data.waist_cm,
          chest_cm: parsed.data.chest_cm,
          notes: parsed.data.notes,
          photo_urls: parsed.data.photo_urls || [],
        })
        .eq('id', parsed.data.id)
        .select()
        .single();

      resultError = error;
      resultData = data;
    } else {
      // Check if there is already an entry for this date
      const { data: existingOnDate } = await supabase
        .from('body_measurements')
        .select('id')
        .eq('clerk_id', userId)
        .eq('measured_date', parsed.data.measured_date)
        .maybeSingle();

      if (existingOnDate) {
        // Update existing entry on date
        const { data, error } = await supabase
          .from('body_measurements')
          .update({
            weight_kg: parsed.data.weight_kg,
            body_fat_pct: parsed.data.body_fat_pct,
            muscle_mass_kg: parsed.data.muscle_mass_kg,
            waist_cm: parsed.data.waist_cm,
            chest_cm: parsed.data.chest_cm,
            notes: parsed.data.notes,
            photo_urls: parsed.data.photo_urls || [],
          })
          .eq('id', existingOnDate.id)
          .select()
          .single();

        resultError = error;
        resultData = data;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('body_measurements')
          .insert({
            clerk_id: userId,
            measured_date: parsed.data.measured_date,
            weight_kg: parsed.data.weight_kg,
            body_fat_pct: parsed.data.body_fat_pct,
            muscle_mass_kg: parsed.data.muscle_mass_kg,
            waist_cm: parsed.data.waist_cm,
            chest_cm: parsed.data.chest_cm,
            notes: parsed.data.notes,
            photo_urls: parsed.data.photo_urls || [],
          })
          .select()
          .single();

        resultError = error;
        resultData = data;
      }
    }

    if (resultError) {
      console.error('Error saving body measurement:', resultError);
      return { error: resultError.message };
    }

    revalidatePath('/progress');
    revalidatePath('/today');
    return { success: true, data: resultData };
  } catch (err) {
    console.error('Unexpected error in saveBodyMeasurement action:', err);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Delete a body measurement entry
 */
export async function deleteBodyMeasurement(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Not authenticated' };
    }

    const supabase = createSupabaseServiceClient();

    // Verify ownership
    const { data: existing, error: fetchErr } = await supabase
      .from('body_measurements')
      .select('id')
      .eq('id', id)
      .eq('clerk_id', userId)
      .single();

    if (fetchErr || !existing) {
      return { error: 'Measurement not found or unauthorized' };
    }

    const { error } = await supabase
      .from('body_measurements')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting body measurement:', error);
      return { error: error.message };
    }

    revalidatePath('/progress');
    revalidatePath('/today');
    return { success: true };
  } catch (err) {
    console.error('Unexpected error in deleteBodyMeasurement action:', err);
    return { error: 'An unexpected error occurred' };
  }
}
