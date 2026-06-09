'use client';

import React, { useState } from 'react';
import { 
  Target, Plus, Calendar, Trash2, Edit2, CheckCircle2, 
  X, Check, AlertCircle, ChevronRight, Loader2, Play, Circle
} from 'lucide-react';
import { 
  createGoal, updateGoalProgress, toggleGoalActive, deleteGoal, GoalInput 
} from '@/app/actions/goal-actions';

interface GoalsClientProps {
  initialGoals: any[];
}

export default function GoalsClient({ initialGoals }: GoalsClientProps) {
  const [goals, setGoals] = useState<any[]>(initialGoals);
  
  // Modals / Actions state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteConfirmId, setIsDeleteConfirmId] = useState<string | null>(null);
  
  // Inline edit state
  const [editingProgressId, setEditingProgressId] = useState<string | null>(null);
  const [editProgressValue, setEditProgressValue] = useState<number>(0);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [targetValue, setTargetValue] = useState<number>(100);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [category, setCategory] = useState('General');
  const [isActive, setIsActive] = useState(true);

  // General loading & error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const filteredGoals = goals.filter(g => {
    if (activeTab === 'active') return g.is_active;
    return !g.is_active;
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTargetDate('');
    setTargetValue(100);
    setCurrentValue(0);
    setCategory('General');
    setIsActive(true);
    setError(null);
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (targetValue <= 0) {
      setError('Target value must be greater than 0');
      return;
    }

    setLoading(true);
    setError(null);

    const goalData: GoalInput = {
      title,
      description: description || null,
      target_date: targetDate || null,
      target_value: targetValue,
      current_value: currentValue,
      category,
      is_active: isActive,
    };

    const res = await createGoal(goalData);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else if (res.success && res.data) {
      setGoals([res.data, ...goals]);
      setIsAddOpen(false);
      resetForm();
    }
  };

  const handleStartEditProgress = (goal: any) => {
    setEditingProgressId(goal.id);
    setEditProgressValue(goal.current_value);
  };

  const handleSaveProgress = async (id: string) => {
    if (editProgressValue < 0) return;
    
    // Optimistic UI Update
    const prevGoals = [...goals];
    setGoals(goals.map(g => g.id === id ? { ...g, current_value: editProgressValue } : g));
    setEditingProgressId(null);

    const res = await updateGoalProgress(id, editProgressValue);
    if (res.error) {
      // Rollback on error
      setGoals(prevGoals);
      alert(res.error);
    }
  };

  const handleToggleActive = async (id: string) => {
    // Optimistic UI Update
    const prevGoals = [...goals];
    setGoals(goals.map(g => g.id === id ? { ...g, is_active: !g.is_active } : g));

    const res = await toggleGoalActive(id);
    if (res.error) {
      // Rollback
      setGoals(prevGoals);
      alert(res.error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!isDeleteConfirmId) return;
    const id = isDeleteConfirmId;
    
    // Optimistic UI Update
    const prevGoals = [...goals];
    setGoals(goals.filter(g => g.id !== id));
    setIsDeleteConfirmId(null);

    const res = await deleteGoal(id);
    if (res.error) {
      // Rollback
      setGoals(prevGoals);
      alert(res.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-brand-success" />
            Goals Tracker
          </h1>
          <p className="text-xs text-[#a1a1aa]">Set metrics, track progress, and build long-term consistency.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-brand-success hover:bg-[#16a34a] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-green-500/10 cursor-pointer active-bounce"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {/* Tabs bar */}
      <div className="flex border-b border-[#1c1c1f] gap-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-2.5 text-xs font-bold relative transition-colors cursor-pointer ${
            activeTab === 'active' ? 'text-white' : 'text-[#71717a] hover:text-[#a1a1aa]'
          }`}
        >
          Active Goals ({goals.filter(g => g.is_active).length})
          {activeTab === 'active' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-success rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-2.5 text-xs font-bold relative transition-colors cursor-pointer ${
            activeTab === 'completed' ? 'text-white' : 'text-[#71717a] hover:text-[#a1a1aa]'
          }`}
        >
          Completed / Paused ({goals.filter(g => !g.is_active).length})
          {activeTab === 'completed' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-success rounded-full" />
          )}
        </button>
      </div>

      {/* Grid List of Goals */}
      {filteredGoals.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-[#27272a] rounded-2xl bg-white/[0.01]">
          <Target className="w-10 h-10 text-[#71717a] mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold text-white">No goals found</p>
          <p className="text-xs text-[#71717a] mt-0.5">
            {activeTab === 'active' 
              ? 'Get started by defining your first goal target!' 
              : 'Goals that you pause or finish will be shown here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            const percent = goal.target_value > 0 
              ? Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
              : 0;

            const isEditingProgress = editingProgressId === goal.id;

            return (
              <div 
                key={goal.id} 
                className="bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-white/[0.12] transition-colors group shadow-xl"
              >
                <div className="space-y-3">
                  {/* Category and Actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-black tracking-widest text-[#a1a1aa] bg-[#121214] border border-[#27272a] px-2 py-0.5 rounded-md">
                      {goal.category}
                    </span>
                    <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToggleActive(goal.id)}
                        className={`p-1.5 rounded-lg border bg-[#121214] hover:bg-[#18181b] transition-colors cursor-pointer ${
                          goal.is_active 
                            ? 'border-[#27272a] hover:border-zinc-700 text-[#a1a1aa] hover:text-white' 
                            : 'border-brand-success/20 text-brand-success hover:border-brand-success/40'
                        }`}
                        title={goal.is_active ? 'Pause Goal' : 'Activate Goal'}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setIsDeleteConfirmId(goal.id)}
                        className="p-1.5 rounded-lg border border-[#27272a] hover:border-red-500/30 bg-[#121214] hover:bg-red-500/10 text-[#a1a1aa] hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-brand-success transition-colors">
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="text-xs text-[#a1a1aa] mt-1 leading-normal line-clamp-2">
                        {goal.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress bar and numeric tracking */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex justify-between items-end text-xs font-semibold">
                    <span className="text-[#a1a1aa]">Completion Progress</span>
                    <span className="text-white font-mono">{percent}%</span>
                  </div>

                  <div className="w-full h-2 bg-[#121214] border border-[#1c1c1f] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent >= 100 
                          ? 'bg-gradient-to-r from-brand-success to-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                          : 'bg-brand-success'
                      }`} 
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {/* Current value display or input field */}
                    {isEditingProgress ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={editProgressValue}
                          onChange={(e) => setEditProgressValue(Math.max(0, Number(e.target.value)))}
                          className="w-16 bg-black border border-[#27272a] rounded-lg px-2 py-0.5 text-xs text-white font-bold text-center focus:outline-none focus:ring-1 focus:ring-brand-success/50"
                        />
                        <button
                          onClick={() => handleSaveProgress(goal.id)}
                          className="p-1 bg-brand-success/20 hover:bg-brand-success/30 border border-brand-success/40 text-brand-success rounded-lg transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingProgressId(null)}
                          className="p-1 bg-[#121214] hover:bg-[#18181b] border border-[#27272a] text-[#a1a1aa] rounded-lg transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-white font-extrabold">{goal.current_value}</span>
                        <span className="text-xs text-[#71717a] font-semibold">/ {goal.target_value}</span>
                        <button
                          onClick={() => handleStartEditProgress(goal)}
                          className="p-1 ml-1 text-[#71717a] hover:text-white hover:bg-[#121214] rounded-lg transition-colors cursor-pointer"
                          title="Update Progress"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Target Date */}
                    {goal.target_date && (
                      <div className="flex items-center gap-1 text-[10px] text-[#71717a] font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(goal.target_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- ADD GOAL GLASS MODAL --- */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0e]/95 border border-[#27272a] rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in-50 zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setIsAddOpen(false);
                resetForm();
              }}
              className="absolute top-4 right-4 text-[#71717a] hover:text-white p-1 hover:bg-[#121214] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <Target className="w-5.5 h-5.5 text-brand-success" />
              Define New Goal
            </h2>
            <p className="text-xs text-[#a1a1aa] mb-5">Identify your target metrics, schedule deadlines, and categorize.</p>

            {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddGoal} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-[#a1a1aa] font-bold">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Run a half marathon"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-brand-success/50 focus:ring-1 focus:ring-brand-success/30 transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-[#a1a1aa] font-bold">Description (Optional)</label>
                <textarea
                  placeholder="Details, routines, milestones or motivation notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-brand-success/50 focus:ring-1 focus:ring-brand-success/30 transition-all resize-none"
                />
              </div>

              {/* Target & Current Values */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#a1a1aa] font-bold">Target Value</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={targetValue}
                    onChange={(e) => setTargetValue(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-success/50 focus:ring-1 focus:ring-brand-success/30 transition-all font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#a1a1aa] font-bold">Initial Progress</label>
                  <input
                    type="number"
                    min={0}
                    value={currentValue}
                    onChange={(e) => setCurrentValue(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-success/50 focus:ring-1 focus:ring-brand-success/30 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Category & Target Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#a1a1aa] font-bold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-success/50 focus:ring-1 focus:ring-brand-success/30 transition-all"
                  >
                    <option value="General" className="bg-[#0c0c0e]">General</option>
                    <option value="Fitness" className="bg-[#0c0c0e]">Fitness</option>
                    <option value="Habits" className="bg-[#0c0c0e]">Habits</option>
                    <option value="Wellness" className="bg-[#0c0c0e]">Wellness</option>
                    <option value="Finance" className="bg-[#0c0c0e]">Finance</option>
                    <option value="Growth" className="bg-[#0c0c0e]">Growth</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#a1a1aa] font-bold">Target Date (Optional)</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-success/50 focus:ring-1 focus:ring-brand-success/30 transition-all"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-[#121214] hover:bg-[#18181b] border border-[#27272a] rounded-xl text-xs font-bold text-[#a1a1aa] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-brand-success hover:bg-[#16a34a] disabled:bg-[#16a34a]/50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-green-500/10"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CUSTOM GLASS CONFIRMATION MODAL --- */}
      {isDeleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-100">
          <div className="bg-[#0c0c0e]/95 border border-[#27272a] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative scale-in-95 duration-100">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-400" />
              Delete Goal
            </h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Are you sure you want to permanently delete this goal? This action will remove all tracked values and is irreversible.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsDeleteConfirmId(null)}
                className="px-4 py-2 bg-[#121214] border border-[#27272a] hover:bg-[#18181b] rounded-xl text-xs font-bold text-[#a1a1aa] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
