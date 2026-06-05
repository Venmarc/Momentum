'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Scale, Calendar, TrendingUp, Check, Plus, AlertCircle } from 'lucide-react';
import { toast } from '@/app/hooks/use-toast';
import { saveBodyMeasurement } from '@/app/actions/progress-actions';

interface BodyMeasurement {
  id: string;
  measured_date: string;
  weight_kg: number;
  body_fat_pct: number | null;
  muscle_mass_kg: number | null;
  waist_cm: number | null;
  chest_cm: number | null;
  notes: string | null;
}

interface BodyCompWidgetProps {
  initialMeasurement: BodyMeasurement | null;
}

export default function BodyCompWidget({ initialMeasurement }: BodyCompWidgetProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showLogForm, setShowLogForm] = useState(false);
  
  // Form states
  const [weight, setWeight] = useState<string>(
    initialMeasurement ? String(initialMeasurement.weight_kg) : ''
  );
  const [bodyFat, setBodyFat] = useState<string>(
    initialMeasurement && initialMeasurement.body_fat_pct ? String(initialMeasurement.body_fat_pct) : ''
  );

  const handleQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      toast.error('Please enter a valid weight.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    startTransition(async () => {
      const res = await saveBodyMeasurement({
        measured_date: todayStr,
        weight_kg: weightNum,
        body_fat_pct: bodyFat ? parseFloat(bodyFat) : null,
        muscle_mass_kg: initialMeasurement?.muscle_mass_kg || null,
        waist_cm: initialMeasurement?.waist_cm || null,
        chest_cm: initialMeasurement?.chest_cm || null,
        notes: 'Logged via dashboard widget',
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Body weight logged successfully!');
        setShowLogForm(false);
        router.refresh();
      }
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Scale className="w-4.5 h-4.5 text-brand-success" />
            Body Composition
          </h2>
          {initialMeasurement && (
            <span className="text-[10px] text-[#71717a] font-semibold flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(initialMeasurement.measured_date)}
            </span>
          )}
        </div>

        {!showLogForm ? (
          <div className="flex items-center justify-between py-1">
            {initialMeasurement ? (
              <div className="space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-white tracking-tight">
                    {initialMeasurement.weight_kg.toFixed(1)}
                  </span>
                  <span className="text-xs font-semibold text-[#71717a]">kg</span>
                </div>
                
                <div className="flex gap-3 text-[10px] text-[#a1a1aa] font-medium">
                  {initialMeasurement.body_fat_pct && (
                    <span>Body Fat: <strong className="text-white">{initialMeasurement.body_fat_pct}%</strong></span>
                  )}
                  {initialMeasurement.muscle_mass_kg && (
                    <span>Muscle: <strong className="text-white">{initialMeasurement.muscle_mass_kg}kg</strong></span>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-2">
                <p className="text-xs font-semibold text-white">No weight recorded yet</p>
                <p className="text-[10px] text-[#a1a1aa] mt-0.5">Log your current weight to calculate workout volume accurately.</p>
              </div>
            )}

            <button
              onClick={() => setShowLogForm(true)}
              className="py-1.5 px-3 bg-[#121214] hover:bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] text-[#f4f4f5] text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Log Weight
            </button>
          </div>
        ) : (
          <form onSubmit={handleQuickLog} className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#a1a1aa] uppercase">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 72.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-[#121214] border border-[#27272a] hover:border-[#3f3f46] text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-brand-success"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#a1a1aa] uppercase">Body Fat % (Optional)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 15.2"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  className="w-full bg-[#121214] border border-[#27272a] hover:border-[#3f3f46] text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-brand-success"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowLogForm(false)}
                className="py-1.5 px-3 border border-[#27272a] hover:border-zinc-700 bg-transparent text-[#a1a1aa] hover:text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="py-1.5 px-4 bg-brand-success hover:bg-brand-success-hover disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                {isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </div>

      {!showLogForm && (
        <div className="flex gap-1.5 items-center text-[10px] text-[#71717a] mt-2 border-t border-[#1a1a1c] pt-2">
          <TrendingUp className="w-3.5 h-3.5 text-brand-success shrink-0" />
          <span>Used as bodyweight offset weight in your fitness calculations.</span>
        </div>
      )}
    </div>
  );
}
