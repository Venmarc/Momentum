'use client';

import React, { useState } from 'react';
import { Calendar, Scale, Percent, Activity, Clipboard } from 'lucide-react';
import { saveBodyMeasurement } from '@/app/actions/progress-actions';

interface BodyMetricsLoggerProps {
  onSuccess: (newData: any) => void;
}

export default function BodyMetricsLogger({ onSuccess }: BodyMetricsLoggerProps) {
  const [measuredDate, setMeasuredDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  const [weightKg, setWeightKg] = useState<string>('');
  const [bodyFatPct, setBodyFatPct] = useState<string>('');
  const [muscleMassKg, setMuscleMassKg] = useState<string>('');
  const [waistCm, setWaistCm] = useState<string>('');
  const [chestCm, setChestCm] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightKg) {
      setErrorMsg('Weight is required to submit a log.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload = {
      measured_date: measuredDate,
      weight_kg: Number(weightKg),
      body_fat_pct: bodyFatPct ? Number(bodyFatPct) : null,
      muscle_mass_kg: muscleMassKg ? Number(muscleMassKg) : null,
      waist_cm: waistCm ? Number(waistCm) : null,
      chest_cm: chestCm ? Number(chestCm) : null,
      notes: notes || null,
    };

    const res = await saveBodyMeasurement(payload);

    setIsSubmitting(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg('Body metrics logged successfully!');
      // Clear form
      setWeightKg('');
      setBodyFatPct('');
      setMuscleMassKg('');
      setWaistCm('');
      setChestCm('');
      setNotes('');
      // Invoke callback
      onSuccess(res.data);
    }
  };

  return (
    <div className="bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Log Body Metrics</h3>
        <p className="text-xs text-[#a1a1aa] mt-0.5">Track your weight, body fat %, muscle mass, and dimensions.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3">
            {errorMsg}
          </div>
        )}
        
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl p-3">
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#a1a1aa] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Date
            </label>
            <input
              type="date"
              value={measuredDate}
              onChange={(e) => setMeasuredDate(e.target.value)}
              className="w-full bg-[#18181b]/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
              required
            />
          </div>

          {/* Weight */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#a1a1aa] flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" /> Weight (kg)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 78.5"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full bg-[#18181b]/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
              required
            />
          </div>

          {/* Body Fat % */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#a1a1aa] flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5" /> Body Fat %
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 14.5"
              value={bodyFatPct}
              onChange={(e) => setBodyFatPct(e.target.value)}
              className="w-full bg-[#18181b]/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>

          {/* Muscle Mass */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#a1a1aa] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Muscle Mass (kg)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 35.8"
              value={muscleMassKg}
              onChange={(e) => setMuscleMassKg(e.target.value)}
              className="w-full bg-[#18181b]/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>

          {/* Waist */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#a1a1aa] flex items-center gap-1.5">
              <Clipboard className="w-3.5 h-3.5" /> Waist (cm)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 82"
              value={waistCm}
              onChange={(e) => setWaistCm(e.target.value)}
              className="w-full bg-[#18181b]/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>

          {/* Chest */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#a1a1aa] flex items-center gap-1.5">
              <Clipboard className="w-3.5 h-3.5" /> Chest (cm)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 102"
              value={chestCm}
              onChange={(e) => setChestCm(e.target.value)}
              className="w-full bg-[#18181b]/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#a1a1aa]">Notes & Observations</label>
          <textarea
            placeholder="Any comments, e.g. 'Logged fasted in the morning', etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full bg-[#18181b]/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-white/20 transition-colors resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-2.5 text-sm font-semibold transition-all duration-300 shadow-lg disabled:opacity-50"
        >
          {isSubmitting ? 'Saving Log...' : 'Save Body Metrics'}
        </button>
      </form>
    </div>
  );
}
