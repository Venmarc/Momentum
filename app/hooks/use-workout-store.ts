import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WorkoutSet {
  id: string;
  reps: string | number;
  weight_kg: string | number;
  duration_seconds: number | null;
  bodyweight_multiplier: number | null;
  rpe: number | null;
  notes: string;
  completed: boolean;
  previous?: string;
}

export interface ActiveExercise {
  id: string; // exercise_id in db
  name: string;
  category: string;
  sets: WorkoutSet[];
}

interface WorkoutState {
  isActive: boolean;
  workoutId: string | null;
  workoutDuration: number | null;
  name: string;
  date: string;
  startTime: number | null;
  notes: string;
  exercises: ActiveExercise[];
  
  // Actions
  startWorkout: (name: string, templateExercises?: Array<{ id: string; name: string; category: string }>) => void;
  editWorkout: (workout: any) => void;
  cancelWorkout: () => void;
  finishWorkout: () => void;
  updateWorkoutName: (name: string) => void;
  updateWorkoutNotes: (notes: string) => void;
  updateWorkoutDate: (date: string) => void;
  addExercise: (exercise: { id: string; name: string; category: string }) => void;
  removeExercise: (exerciseId: string) => void;
  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  updateSet: (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => void;
  setPreviousSets: (exerciseId: string, previousSets: Array<{ reps: number; weight_kg: number; duration_seconds?: number | null; bodyweight_multiplier?: number | null; rpe?: number | null }>) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      isActive: false,
      workoutId: null,
      workoutDuration: null,
      name: 'Empty Workout',
      date: new Date().toISOString().split('T')[0],
      startTime: null,
      notes: '',
      exercises: [],

      startWorkout: (name, templateExercises = []) => {
        const initialExercises = templateExercises.map((te) => ({
          id: te.id,
          name: te.name,
          category: te.category,
          sets: [
            {
              id: generateId(),
              reps: '',
              weight_kg: '',
              duration_seconds: null,
              bodyweight_multiplier: te.category?.toLowerCase() === 'bodyweight' ? 1 : null,
              rpe: null,
              notes: '',
              completed: false,
            },
          ],
        }));

        set({
          isActive: true,
          workoutId: null,
          workoutDuration: null,
          name: name || 'Empty Workout',
          date: new Date().toISOString().split('T')[0],
          startTime: Date.now(),
          notes: '',
          exercises: initialExercises,
        });
      },

      editWorkout: (workout) => {
        const mappedExercises = (workout.workout_exercises || workout.exercises || []).map((we: any) => {
          const sets = Array.isArray(we.sets) ? we.sets : [];
          return {
            id: we.exercise_id || we.exercise?.id || we.id,
            name: we.exercise?.name || we.name,
            category: we.exercise?.category || we.category,
            sets: sets.map((s: any) => ({
              id: s.id || generateId(),
              reps: s.reps !== undefined && s.reps !== null ? String(s.reps) : '',
              weight_kg: s.weight_kg !== undefined && s.weight_kg !== null ? String(s.weight_kg) : '',
              duration_seconds: s.duration_seconds !== undefined && s.duration_seconds !== null ? Number(s.duration_seconds) : null,
              bodyweight_multiplier: s.bodyweight_multiplier !== undefined && s.bodyweight_multiplier !== null ? Number(s.bodyweight_multiplier) : null,
              rpe: s.rpe || null,
              notes: s.notes || '',
              completed: s.completed !== undefined ? s.completed : true,
            })),
          };
        });

        // Format date properly (force YYYY-MM-DD format)
        const workoutDate = workout.date 
          ? new Date(workout.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];

        set({
          isActive: true,
          workoutId: workout.id || null,
          workoutDuration: workout.total_duration_minutes !== undefined ? workout.total_duration_minutes : null,
          name: workout.name || 'Edit Workout',
          date: workoutDate,
          startTime: Date.now(),
          notes: workout.notes || '',
          exercises: mappedExercises,
        });
      },

      cancelWorkout: () => {
        set({
          isActive: false,
          workoutId: null,
          workoutDuration: null,
          name: 'Empty Workout',
          date: new Date().toISOString().split('T')[0],
          startTime: null,
          notes: '',
          exercises: [],
        });
      },

      finishWorkout: () => {
        set({
          isActive: false,
          workoutId: null,
          workoutDuration: null,
          name: 'Empty Workout',
          date: new Date().toISOString().split('T')[0],
          startTime: null,
          notes: '',
          exercises: [],
        });
      },

      updateWorkoutName: (name) => set({ name }),
      updateWorkoutNotes: (notes) => set({ notes }),
      updateWorkoutDate: (date) => set({ date }),

      addExercise: (exercise) => {
        set((state) => {
          const exists = state.exercises.some((e) => e.id === exercise.id);
          if (exists) return state;

          const newExercise: ActiveExercise = {
            id: exercise.id,
            name: exercise.name,
            category: exercise.category,
            sets: [
              {
                id: generateId(),
                reps: '',
                weight_kg: '',
                duration_seconds: null,
                bodyweight_multiplier: exercise.category?.toLowerCase() === 'bodyweight' ? 1 : null,
                rpe: null,
                notes: '',
                completed: false,
              },
            ],
          };

          return {
            exercises: [...state.exercises, newExercise],
          };
        });
      },

      removeExercise: (exerciseId) => {
        set((state) => ({
          exercises: state.exercises.filter((e) => e.id !== exerciseId),
        }));
      },

      addSet: (exerciseId) => {
        set((state) => ({
          exercises: state.exercises.map((e) => {
            if (e.id !== exerciseId) return e;

            const lastSet = e.sets[e.sets.length - 1];
            const newSet: WorkoutSet = {
              id: generateId(),
              reps: lastSet ? lastSet.reps : '',
              weight_kg: lastSet ? lastSet.weight_kg : '',
              duration_seconds: lastSet ? lastSet.duration_seconds : null,
              bodyweight_multiplier: lastSet ? lastSet.bodyweight_multiplier : (e.category?.toLowerCase() === 'bodyweight' ? 1 : null),
              rpe: lastSet ? lastSet.rpe : null,
              notes: '',
              completed: false,
            };

            return {
              ...e,
              sets: [...e.sets, newSet],
            };
          }),
        }));
      },

      removeSet: (exerciseId, setId) => {
        set((state) => ({
          exercises: state.exercises.map((e) => {
            if (e.id !== exerciseId) return e;

            const filteredSets = e.sets.filter((s) => s.id !== setId);
            
            const finalSets = filteredSets.length > 0 
              ? filteredSets 
              : [{
                  id: generateId(),
                  reps: '',
                  weight_kg: '',
                  duration_seconds: null,
                  bodyweight_multiplier: null,
                  rpe: null,
                  notes: '',
                  completed: false,
                }];

            return {
              ...e,
              sets: finalSets,
            };
          }),
        }));
      },

      updateSet: (exerciseId, setId, updates) => {
        set((state) => ({
          exercises: state.exercises.map((e) => {
            if (e.id !== exerciseId) return e;

            return {
              ...e,
              sets: e.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s)),
            };
          }),
        }));
      },

      setPreviousSets: (exerciseId, previousSets) => {
        set((state) => ({
          exercises: state.exercises.map((e) => {
            if (e.id !== exerciseId) return e;

            const setsWithPrev = e.sets.map((s, index) => {
              const prev = previousSets && previousSets[index];
              let prevStr = '—';
              if (prev) {
                if (prev.duration_seconds) {
                  const mins = Math.floor(prev.duration_seconds / 60);
                  const secs = prev.duration_seconds % 60;
                  prevStr = `${mins}:${String(secs).padStart(2, '0')}${prev.rpe ? ` (RPE ${prev.rpe})` : ''}`;
                } else {
                  const bwOffsetStr = prev.bodyweight_multiplier ? ` (BW)` : '';
                  prevStr = `${prev.reps} × ${prev.weight_kg}kg${bwOffsetStr}${prev.rpe ? ` (RPE ${prev.rpe})` : ''}`;
                }
              }
              return {
                ...s,
                previous: prevStr,
              };
            });

            return {
              ...e,
              sets: setsWithPrev,
            };
          }),
        }));
      },
    }),
    {
      name: 'momentum-active-workout',
      partialize: (state) => ({
        isActive: state.isActive,
        workoutId: state.workoutId,
        workoutDuration: state.workoutDuration,
        name: state.name,
        date: state.date,
        startTime: state.startTime,
        notes: state.notes,
        exercises: state.exercises,
      }),
    }
  )
);
