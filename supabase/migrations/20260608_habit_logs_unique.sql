ALTER TABLE public.habit_logs 
ADD CONSTRAINT habit_logs_habit_id_logged_date_key 
UNIQUE (habit_id, logged_date);
