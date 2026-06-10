'use client';

import React, { useState, useTransition } from 'react';
import { Search, Plus, Check, Loader2, Dumbbell, BookOpen } from 'lucide-react';
import { createCustomExercise } from '@/app/actions/fitness-actions';
import { toast } from '@/app/hooks/use-toast';

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscle_group: string[] | null;
  is_custom: boolean;
}

interface ExercisesLibraryClientProps {
  initialExercises: Exercise[];
}

const CATEGORIES = ['All', 'Push', 'Pull', 'Legs', 'Core', 'Cardio'];

export default function ExercisesLibraryClient({ initialExercises }: ExercisesLibraryClientProps) {
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Custom exercise form state
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('Push');
  const [customMuscleGroup, setCustomMuscleGroup] = useState('');
  
  const [isPending, startTransition] = useTransition();

  // Filter exercises
  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || ex.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      toast.error('Exercise name is required');
      return;
    }

    startTransition(async () => {
      const muscles = customMuscleGroup
        ? customMuscleGroup.split(',').map((m) => m.trim()).filter(Boolean)
        : [];
        
      const res = await createCustomExercise(customName.trim(), customCategory, muscles);
      
      if (res.error) {
        toast.error(res.error);
      } else if (res.data) {
        toast.success(`Custom exercise "${res.data.name}" created!`);
        
        const newEx: Exercise = {
          id: res.data.id,
          name: res.data.name,
          category: res.data.category,
          muscle_group: res.data.muscle_group,
          is_custom: res.data.is_custom,
        };
        
        // Add to local state
        setExercises((prev) => [newEx, ...prev]);
        
        // Reset form
        setCustomName('');
        setCustomMuscleGroup('');
        setShowCustomForm(false);
      }
    });
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 space-y-8 bg-black text-[#f4f4f5] pb-24 min-w-0">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-16 md:mt-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6.5 h-6.5 text-brand-success" />
            Exercises Library
          </h1>
          <p className="text-xs text-[#a1a1aa]">Browse, search, and manage global or custom exercises</p>
        </div>
        <button
          onClick={() => setShowCustomForm(true)}
          className="py-2.5 px-4 bg-[#121214] hover:bg-[#18181b] border border-[#27272a] hover:border-brand-success/50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-brand-success" />
          Create Custom Exercise
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#09090b] border border-[#27272a] text-white rounded-xl pl-11 pr-4 py-3 placeholder:text-zinc-500 text-xs focus:outline-none focus:border-brand-success transition-colors"
          />
        </div>

        {/* Categories tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-success/10 border-brand-success text-brand-success'
                  : 'bg-[#09090b] border-[#27272a] hover:border-zinc-800 text-[#a1a1aa] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredExercises.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-[#09090b] border border-dashed border-[#27272a] rounded-2xl p-4">
            <p className="text-xs text-[#a1a1aa]">No exercises match your search criteria.</p>
          </div>
        ) : (
          filteredExercises.map((ex) => (
            <div
              key={ex.id}
              className="bg-[#09090b] border border-[#27272a] hover:border-zinc-800 rounded-xl p-4 flex items-start justify-between gap-3 transition-colors"
            >
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-white leading-snug">{ex.name}</p>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-[#18181b] border border-[#27272a] text-[#a1a1aa] px-1.5 py-0.5 rounded">
                    {ex.category}
                  </span>
                  {ex.is_custom && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-brand-success/10 text-brand-success px-1.5 py-0.5 rounded">
                      Custom
                    </span>
                  )}
                </div>
                {ex.muscle_group && ex.muscle_group.length > 0 && (
                  <p className="text-[10px] text-[#a1a1aa] font-medium leading-relaxed">
                    Muscles: {ex.muscle_group.join(', ')}
                  </p>
                )}
              </div>
              <div className="p-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-[#a1a1aa] shrink-0">
                <Dumbbell className="w-3.5 h-3.5 text-zinc-500" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Custom exercise modal */}
      {showCustomForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCustomForm(false)} />
          <form 
            onSubmit={handleCreateCustom}
            className="bg-[#09090b] border border-[#27272a] rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-2xl space-y-4 text-left animate-in zoom-in-95 duration-200"
          >
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-success" />
              Create Custom Exercise
            </h4>
            
            <div className="space-y-3">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">Exercise Name</label>
                <input
                  type="text"
                  placeholder="e.g. Incline Bench Press"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-[#121214] border border-[#27272a] text-white rounded-lg px-3 py-2 placeholder:text-zinc-500 text-xs focus:outline-none focus:border-brand-success"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">Category</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full bg-[#121214] border border-[#27272a] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-success cursor-pointer"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c} className="bg-zinc-900">{c}</option>
                  ))}
                </select>
              </div>

              {/* Muscle group */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">Muscle Groups (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Chest, Triceps"
                  value={customMuscleGroup}
                  onChange={(e) => setCustomMuscleGroup(e.target.value)}
                  className="w-full bg-[#121214] border border-[#27272a] text-white rounded-lg px-3 py-2 placeholder:text-zinc-500 text-xs focus:outline-none focus:border-brand-success"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="flex-1 py-2 border border-[#27272a] hover:bg-[#18181b] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer active-bounce"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 py-2 bg-brand-success hover:bg-brand-success-hover text-black rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer active-bounce"
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    Create
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
