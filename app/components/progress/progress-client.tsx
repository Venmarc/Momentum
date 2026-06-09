'use client';

import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  TrendingUp, Award, Calendar, Heart, ShieldAlert, Dumbbell, Compass, RefreshCcw, Scale
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import HabitsHeatmap from './habits-heatmap';
import BodyMetricsLogger from './body-metrics-logger';

interface ProgressClientProps {
  initialHabits: any[];
  initialHabitLogs: any[];
  initialWorkouts: any[];
  initialExercises: any[];
  initialWellness: any[];
  initialMeasurements: any[];
}

export default function ProgressClient({
  initialHabits,
  initialHabitLogs,
  initialWorkouts,
  initialExercises,
  initialWellness,
  initialMeasurements
}: ProgressClientProps) {
  const [activeTab, setActiveTab] = useState<'habits' | 'fitness' | 'wellness' | 'body'>('habits');
  const [habitLogs, setHabitLogs] = useState(initialHabitLogs);
  const [bodyMeasurements, setBodyMeasurements] = useState(initialMeasurements);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(
    initialExercises[0]?.id || ''
  );

  // --- HABITS TAB CALCULATIONS ---
  const habitsAdherenceData = useMemo(() => {
    // Group logs by week for the last 12 weeks
    const data: any[] = [];
    const today = new Date();

    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - i * 7);
      const weekLabel = `Wk -${i}`;

      // Get logs in this 7-day range
      const rangeLogs = habitLogs.filter(l => {
        const d = parseISO(l.logged_date);
        const diff = differenceInDays(today, d);
        return diff >= i * 7 && diff < (i + 1) * 7;
      });

      const completed = rangeLogs.filter(l => l.completed).length;
      const total = rangeLogs.length;
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

      data.push({
        name: weekLabel,
        'Adherence %': rate,
      });
    }
    return data;
  }, [habitLogs]);

  // --- FITNESS TAB CALCULATIONS ---
  // Workout Volume Data
  const workoutVolumeData = useMemo(() => {
    return initialWorkouts.map(w => ({
      date: format(parseISO(w.date), 'MMM d'),
      Volume: Number(w.total_volume_kg || 0),
      Duration: w.total_duration_minutes || 0,
    }));
  }, [initialWorkouts]);

  // Exercise Specific Progress Data
  const exerciseProgressData = useMemo(() => {
    if (!selectedExerciseId) return [];
    
    const progress: any[] = [];

    initialWorkouts.forEach(w => {
      const we = w.workout_exercises?.find((e: any) => e.exercise?.id === selectedExerciseId);
      if (we && we.sets && we.sets.length > 0) {
        // Calculate max weight and max estimated 1RM for this workout
        let maxWeight = 0;
        let max1RM = 0;

        we.sets.forEach((s: any) => {
          if (s.completed !== false) {
            const weight = Number(s.weight_kg || 0);
            const reps = Number(s.reps || 0);
            if (weight > maxWeight) maxWeight = weight;
            
            // Epley 1RM formula
            const oneRepMax = weight * (1 + reps / 30);
            if (oneRepMax > max1RM) max1RM = oneRepMax;
          }
        });

        if (maxWeight > 0) {
          progress.push({
            date: format(parseISO(w.date), 'MMM d'),
            'Max Weight (kg)': maxWeight,
            'Estimated 1RM (kg)': Math.round(max1RM * 10) / 10,
          });
        }
      }
    });

    return progress;
  }, [selectedExerciseId, initialWorkouts]);

  // Personal Records (PRs) Detection
  const personalRecords = useMemo(() => {
    const prs: { [key: string]: { maxWeight: number; max1RM: number; date: string } } = {};

    initialWorkouts.forEach(w => {
      w.workout_exercises?.forEach((we: any) => {
        const exName = we.exercise?.name;
        if (!exName) return;

        we.sets?.forEach((s: any) => {
          if (s.completed !== false) {
            const weight = Number(s.weight_kg || 0);
            const reps = Number(s.reps || 0);
            const oneRepMax = Math.round((weight * (1 + reps / 30)) * 10) / 10;

            if (!prs[exName]) {
              prs[exName] = { maxWeight: weight, max1RM: oneRepMax, date: w.date };
            } else {
              if (weight > prs[exName].maxWeight) {
                prs[exName].maxWeight = weight;
                prs[exName].date = w.date;
              }
              if (oneRepMax > prs[exName].max1RM) {
                prs[exName].max1RM = oneRepMax;
              }
            }
          }
        });
      });
    });

    return Object.entries(prs).map(([name, val]) => ({
      name,
      ...val,
    }));
  }, [initialWorkouts]);

  // --- WELLNESS TAB CALCULATIONS ---
  const wellnessData = useMemo(() => {
    return initialWellness.map(entry => ({
      date: format(parseISO(entry.entry_date), 'MMM d'),
      Mood: entry.mood,
      Energy: entry.energy,
      'Sleep Hours': Number(entry.sleep_hours || 0),
      'Sleep Quality': entry.sleep_quality,
    }));
  }, [initialWellness]);

  // --- BODY METRICS TAB CALCULATIONS ---
  const weightData = useMemo(() => {
    return bodyMeasurements.map(m => ({
      date: format(parseISO(m.measured_date), 'MMM d'),
      Weight: Number(m.weight_kg || 0),
      'Body Fat %': m.body_fat_pct ? Number(m.body_fat_pct) : null,
      'Muscle Mass (kg)': m.muscle_mass_kg ? Number(m.muscle_mass_kg) : null,
    }));
  }, [bodyMeasurements]);

  const handleBodyMetricsLogged = (newLog: any) => {
    setBodyMeasurements(prev => {
      // Check if entry exists on this date
      const idx = prev.findIndex(item => item.measured_date === newLog.measured_date);
      const updated = [...prev];
      if (idx > -1) {
        updated[idx] = newLog;
      } else {
        updated.push(newLog);
      }
      return updated.sort((a, b) => new Date(a.measured_date).getTime() - new Date(b.measured_date).getTime());
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 pb-24 min-w-0">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Progress & Analytics</h1>
        <p className="text-sm text-[#a1a1aa] mt-1">Analyze consistency, track strength gains, and observe wellness correlations.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('habits')}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap shrink-0 ${
            activeTab === 'habits' 
              ? 'bg-white/10 text-white shadow-md' 
              : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
          }`}
        >
          Habits consistency
        </button>
        <button
          onClick={() => setActiveTab('fitness')}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap shrink-0 ${
            activeTab === 'fitness' 
              ? 'bg-white/10 text-white shadow-md' 
              : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
          }`}
        >
          Fitness & PRs
        </button>
        <button
          onClick={() => setActiveTab('wellness')}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap shrink-0 ${
            activeTab === 'wellness' 
              ? 'bg-white/10 text-white shadow-md' 
              : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
          }`}
        >
          Wellness Insights
        </button>
        <button
          onClick={() => setActiveTab('body')}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap shrink-0 ${
            activeTab === 'body' 
              ? 'bg-white/10 text-white shadow-md' 
              : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
          }`}
        >
          Body Composition
        </button>
      </div>

      {/* Habits Consistency Tab */}
      {activeTab === 'habits' && (
        <div className="space-y-6">
          <HabitsHeatmap logs={habitLogs} habits={initialHabits} />

          <div className="bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Weekly Adherence Trend</h3>
            <div className="h-72 w-full">
              {habitsAdherenceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={habitsAdherenceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
                    <YAxis stroke="#a1a1aa" fontSize={12} domain={[0, 100]} unit="%" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                      labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="Adherence %" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-[#a1a1aa]">
                  No logged history to generate graphs.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fitness & PRs Tab */}
      {activeTab === 'fitness' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Workout Volume */}
            <div className="bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-1">Workout Training Volume</h3>
              <p className="text-xs text-[#a1a1aa] mb-4">Total load lifted per session over time (weight × reps).</p>
              <div className="h-64 w-full">
                {workoutVolumeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={workoutVolumeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} />
                      <YAxis stroke="#a1a1aa" fontSize={12} unit="kg" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="Volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-[#a1a1aa]">
                    No workouts logged yet.
                  </div>
                )}
              </div>
            </div>

            {/* Exercise progression */}
            <div className="bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Exercise Progress Graph</h3>
                  <p className="text-xs text-[#a1a1aa] mt-0.5">Track peak load and estimated 1 Rep Max progression.</p>
                </div>
                <select
                  value={selectedExerciseId}
                  onChange={(e) => setSelectedExerciseId(e.target.value)}
                  className="bg-[#18181b] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all"
                >
                  {initialExercises.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>
              </div>

              <div className="h-64 w-full">
                {exerciseProgressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={exerciseProgressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} />
                      <YAxis stroke="#a1a1aa" fontSize={12} unit="kg" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                      />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                      <Line type="monotone" dataKey="Max Weight (kg)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="Estimated 1RM (kg)" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-[#a1a1aa]">
                    No workouts logged featuring this exercise.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PRs Panel */}
          <div className="bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-2xl p-6 shadow-xl h-fit">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-yellow-500" /> Personal Records (PRs)
            </h3>
            {personalRecords.length > 0 ? (
              <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
                {personalRecords.map(pr => (
                  <div key={pr.name} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <p className="text-sm font-semibold text-white">{pr.name}</p>
                    <div className="flex justify-between items-center mt-1 text-xs">
                      <div>
                        <span className="text-[#a1a1aa]">Max Weight:</span>{' '}
                        <span className="text-blue-400 font-semibold">{pr.maxWeight} kg</span>
                      </div>
                      <div>
                        <span className="text-[#a1a1aa]">Est. 1RM:</span>{' '}
                        <span className="text-purple-400 font-semibold">{pr.max1RM} kg</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-[#a1a1aa] mt-0.5">Logged on {format(parseISO(pr.date), 'MMM d, yyyy')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#a1a1aa] text-center py-6">Log workouts to set personal records.</p>
            )}
          </div>
        </div>
      )}

      {/* Wellness Insight Tab */}
      {activeTab === 'wellness' && (
        <div className="space-y-6">
          <div className="bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-1">Wellness Correlations</h3>
            <p className="text-xs text-[#a1a1aa] mb-6">Compare sleep hours, sleep quality, and daily energy levels.</p>
            <div className="h-80 w-full">
              {wellnessData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={wellnessData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} />
                    <YAxis yAxisId="left" stroke="#a1a1aa" fontSize={12} label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#a1a1aa' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#a1a1aa" fontSize={12} domain={[1, 5]} label={{ value: 'Index (1-5)', angle: 90, position: 'insideRight', fill: '#a1a1aa' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                      labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="Sleep Hours" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3 }} />
                    <Line yAxisId="right" type="monotone" dataKey="Sleep Quality" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3 }} />
                    <Line yAxisId="right" type="monotone" dataKey="Energy" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-[#a1a1aa]">
                  No wellness logs found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Body Composition Tab */}
      {activeTab === 'body' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Weight Progression Chart */}
            <div className="bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-1">Body Weight & Muscle Mass Trend</h3>
              <p className="text-xs text-[#a1a1aa] mb-4">Track progress over time.</p>
              <div className="h-72 w-full">
                {weightData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} />
                      <YAxis stroke="#a1a1aa" fontSize={12} unit="kg" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                      />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                      <Line type="monotone" dataKey="Weight" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="Muscle Mass (kg)" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-[#a1a1aa]">
                    No body weights logged yet.
                  </div>
                )}
              </div>
            </div>

            {/* History Table */}
            <div className="bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Measurements History</h3>
              {bodyMeasurements.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#a1a1aa]">
                    <thead>
                      <tr className="border-b border-white/5 text-white font-semibold">
                        <th className="py-2.5">Date</th>
                        <th>Weight</th>
                        <th>Body Fat %</th>
                        <th>Muscle Mass</th>
                        <th>Waist</th>
                        <th>Chest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bodyMeasurements.slice().reverse().map(m => (
                        <tr key={m.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                          <td className="py-2.5 font-medium text-white">{format(parseISO(m.measured_date), 'yyyy-MM-dd')}</td>
                          <td>{m.weight_kg} kg</td>
                          <td>{m.body_fat_pct ? `${m.body_fat_pct}%` : '-'}</td>
                          <td>{m.muscle_mass_kg ? `${m.muscle_mass_kg} kg` : '-'}</td>
                          <td>{m.waist_cm ? `${m.waist_cm} cm` : '-'}</td>
                          <td>{m.chest_cm ? `${m.chest_cm} cm` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-[#a1a1aa] text-center py-6">No historical measurements logged.</p>
              )}
            </div>
          </div>

          {/* Form Side panel */}
          <div className="space-y-6">
            <BodyMetricsLogger onSuccess={handleBodyMetricsLogged} />
          </div>
        </div>
      )}
    </div>
  );
}
