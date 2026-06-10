'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkoutStore } from '@/app/hooks/use-workout-store';
import { deleteWorkout } from '@/app/actions/fitness-actions';
import { toast } from '@/app/hooks/use-toast';
import { 
  Calendar, Clock, Flame, Edit3, Trash2, ChevronDown, ChevronUp, Loader2, Dumbbell
} from 'lucide-react';

interface WorkoutExercise {
  id: string;
  order_index: number;
  sets: Array<{
    reps: number;
    weight_kg: number;
    duration_seconds?: number | null;
    bodyweight_multiplier?: number | null;
    rpe: number | null;
    notes: string | null;
  }>;
  exercise: {
    id: string;
    name: string;
    category: string;
    muscle_group: string[] | null;
  } | null;
}

interface Workout {
  id: string;
  name: string;
  date: string;
  notes: string | null;
  total_duration_minutes: number | null;
  total_volume_kg: number | null;
  created_at: string | null;
  workout_exercises: WorkoutExercise[];
}

interface WorkoutHistoryClientProps {
  initialWorkouts: Workout[];
}

export default function WorkoutHistoryClient({ initialWorkouts }: WorkoutHistoryClientProps) {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [expandedWorkouts, setExpandedWorkouts] = useState<Record<string, boolean>>({});
  const [isDeleting, startDeleting] = useTransition();
  const [deleteWorkoutId, setDeleteWorkoutId] = useState<string | null>(null);

  const { editWorkout } = useWorkoutStore();

  const handleEdit = (w: Workout) => {
    editWorkout(w);
    toast.success(`Loaded "${w.name}" into logger`);
    router.push('/fitness/log');
  };

  const handleDelete = (workoutId: string) => {
    startDeleting(async () => {
      const res = await deleteWorkout(workoutId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Workout session removed.');
        setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
      }
      setDeleteWorkoutId(null);
    });
  };

  const toggleExpand = (workoutId: string) => {
    setExpandedWorkouts((prev) => ({
      ...prev,
      [workoutId]: !prev[workoutId],
    }));
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 space-y-8 bg-black text-[#f4f4f5] pb-24 min-w-0">
      
      {/* Page Title */}
      <div className="space-y-1 mt-16 md:mt-0">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Dumbbell className="w-6.5 h-6.5 text-brand-success" />
          Workouts History
        </h1>
        <p className="text-xs text-[#a1a1aa]">Review and edit your logged workouts, volumes, and progressive overload metrics</p>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-16 bg-[#09090b] border border-dashed border-[#27272a] rounded-2xl p-6">
          <p className="text-sm text-[#a1a1aa]">No workouts logged yet</p>
          <p className="text-xs text-[#71717a] mt-1 mb-6">Your logged training sessions will show up here.</p>
          <button
            onClick={() => router.push('/fitness/log')}
            className="py-2.5 px-5 bg-brand-success hover:bg-brand-success-hover text-black font-bold rounded-xl text-xs transition-colors cursor-pointer active-bounce"
          >
            Log Your First Workout
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((w) => {
            const isExpanded = !!expandedWorkouts[w.id];
            return (
              <div 
                key={w.id} 
                className="bg-[#09090b] border border-[#27272a] rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                {/* Workout Brief Row */}
                <div 
                  onClick={() => toggleExpand(w.id)}
                  className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-[#18181b]/50 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-bold text-white text-sm md:text-base">{w.name}</h3>
                      <span className="flex items-center gap-1 text-[10px] text-[#71717a] font-semibold">
                        <Calendar className="w-3 h-3" />
                        {formatDate(w.date)}
                      </span>
                    </div>

                    <p className="text-xs text-[#a1a1aa] truncate max-w-xl">
                      {w.workout_exercises.map(we => we.exercise?.name).filter(Boolean).join(', ') || 'No exercises'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-[#1e1e22] pt-3 md:pt-0">
                    <div className="flex items-center gap-3 text-xs font-semibold text-[#f4f4f5] flex-wrap">
                      {typeof w.total_duration_minutes === 'number' && w.total_duration_minutes > 0 && (
                        <span className="flex items-center gap-1.5 bg-[#18181b] border border-[#27272a] px-2.5 py-1.5 rounded-lg whitespace-nowrap shrink-0">
                          <Clock className="w-3.5 h-3.5 text-brand-success shrink-0" />
                          {w.total_duration_minutes} min
                        </span>
                      )}
                      {w.total_volume_kg && w.total_volume_kg > 0 ? (
                        <span className="flex items-center gap-1.5 bg-[#18181b] border border-[#27272a] px-2.5 py-1.5 rounded-lg whitespace-nowrap shrink-0">
                          <Flame className="w-3.5 h-3.5 text-brand-success shrink-0" />
                          {w.total_volume_kg.toLocaleString()} kg
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(w);
                        }}
                        className="p-1.5 rounded-lg hover:bg-zinc-800 text-[#71717a] hover:text-brand-success transition-colors cursor-pointer"
                        title="Edit Workout"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteWorkoutId(w.id);
                        }}
                        disabled={isDeleting}
                        className="p-1.5 rounded-lg hover:bg-red-950/20 text-[#71717a] hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete Workout"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="p-1.5 rounded-lg hover:bg-[#18181b] text-[#a1a1aa]">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workout Expanded Exercises List */}
                {isExpanded && (
                  <div className="bg-[#050506] border-t border-[#1e1e22] p-4 md:p-5 space-y-4">
                    {w.notes && (
                      <div className="text-xs text-[#a1a1aa] bg-[#121214] border border-[#27272a] rounded-lg p-3 italic">
                        <strong>Notes: </strong>{w.notes}
                      </div>
                    )}

                    <div className="space-y-3.5">
                      {w.workout_exercises.map((we, index) => (
                        <div key={we.id} className="space-y-1.5">
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span className="text-zinc-600">{index + 1}.</span>
                            {we.exercise?.name || 'Unknown Exercise'}
                            <span className="text-[9px] font-bold tracking-wider uppercase bg-brand-success/10 text-brand-success px-1 py-0.2 rounded">
                              {we.exercise?.category}
                            </span>
                          </h4>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pl-4">
                            {we.sets.map((set, setIndex) => {
                              const isCardio = 
                                we.exercise?.category?.toLowerCase() === 'endurance' || 
                                we.exercise?.category?.toLowerCase() === 'cardio' || 
                                we.exercise?.name?.toLowerCase().includes('plank') || 
                                we.exercise?.name?.toLowerCase().includes('hold') || 
                                we.exercise?.name?.toLowerCase().includes('l-sit');

                              return (
                                <div 
                                  key={setIndex}
                                  className="bg-[#121214] border border-[#27272a] rounded-lg p-2.5 flex flex-col justify-center space-y-0.5"
                                >
                                  <span className="text-[9px] text-[#71717a] uppercase font-bold">Set {setIndex + 1}</span>
                                  {isCardio && set.duration_seconds ? (() => {
                                    const mins = Math.floor(set.duration_seconds / 60);
                                    const secs = set.duration_seconds % 60;
                                    return (
                                      <span className="text-xs text-white font-semibold font-mono">
                                        {mins}:${String(secs).padStart(2, '0')}
                                      </span>
                                    );
                                  })() : (
                                    <span className="text-xs text-white font-semibold font-mono">
                                      {set.bodyweight_multiplier === 1 ? (
                                        Number(set.weight_kg) > 0 ? `BW + ${set.weight_kg}kg × ` : 'BW × '
                                      ) : (
                                        Number(set.weight_kg) > 0 ? `${set.weight_kg}kg × ` : ''
                                      )}
                                      {set.reps} reps
                                    </span>
                                  )}
                                  {set.rpe && (
                                    <span className="text-[9px] text-[#a1a1aa] font-medium">RPE {set.rpe}</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Edit Session Trigger at the bottom of details */}
                    <div className="flex justify-end pt-3 border-t border-[#1e1e22]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(w);
                        }}
                        className="py-1.5 px-3.5 bg-[#18181b] hover:bg-[#202024] border border-[#27272a] hover:border-brand-success/50 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all text-[#a1a1aa] hover:text-white cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-brand-success" />
                        Edit Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {deleteWorkoutId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteWorkoutId(null)} />
          <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-2xl space-y-4 text-left animate-in zoom-in-95 duration-200">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-500" />
              Delete Workout Session
            </h4>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Are you sure you want to delete this workout session? This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteWorkoutId(null)}
                className="flex-1 py-2 border border-[#27272a] hover:bg-[#18181b] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer active-bounce"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteWorkoutId) {
                    handleDelete(deleteWorkoutId);
                  }
                }}
                disabled={isDeleting}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer active-bounce"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
