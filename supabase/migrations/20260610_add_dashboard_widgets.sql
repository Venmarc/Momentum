-- Add dashboard_widgets column to user_preferences
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS dashboard_widgets JSONB DEFAULT '{"bodyComposition": true, "wellnessLog": true, "goalsTracker": true, "fitnessStatus": true, "habitsChecklist": true}'::jsonb;
