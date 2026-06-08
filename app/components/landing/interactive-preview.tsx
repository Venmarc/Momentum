'use client';

import React, { useState } from 'react';
import { 
  Droplet, 
  Brain, 
  Dumbbell, 
  Check, 
  Sparkles, 
  Flame, 
  RotateCcw
} from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  completed: boolean;
  xp: number;
  streak: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  distance: number;
  size: number;
  delay: number;
}

export default function InteractivePreview() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: 'water', name: 'Drink 3L Water', icon: Droplet, iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20', completed: false, xp: 50, streak: 5 },
    { id: 'meditate', name: 'Meditate 10m', icon: Brain, iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20', completed: false, xp: 75, streak: 12 },
    { id: 'workout', name: 'Daily Workout', icon: Dumbbell, iconColor: 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20', completed: false, xp: 125, streak: 3 }
  ]);

  const [particles, setParticles] = useState<Particle[]>([]);
  const level = 4;
  const currentXp = 420;
  const maxXp = 600;

  // Calculate completion percentage
  const completedCount = habits.filter(h => h.completed).length;
  const completionRate = Math.round((completedCount / habits.length) * 100);

  // Calculate total XP gained in the preview
  const earnedXp = habits.reduce((sum, h) => sum + (h.completed ? h.xp : 0), 0);
  const displayXp = currentXp + earnedXp;

  // Trigger confetti burst
  const triggerConfetti = (originX: number, originY: number) => {
    const newParticles: Particle[] = [];
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];
    const count = 35;

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Math.random() + i,
        x: originX,
        y: originY,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * 360,
        distance: 50 + Math.random() * 100,
        size: 4 + Math.random() * 8,
        delay: Math.random() * 0.1
      });
    }

    setParticles(prev => [...prev, ...newParticles]);

    // Cleanup particles
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 1500);
  };

  const toggleHabit = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    // Get mouse coordinates relative to the widget for custom confetti origin
    const rect = e.currentTarget.getBoundingClientRect();
    const widgetElement = e.currentTarget.closest('.widget-container');
    const widgetRect = widgetElement?.getBoundingClientRect();
    
    let x = 150;
    let y = 150;
    
    if (rect && widgetRect) {
      x = rect.left - widgetRect.left + rect.width / 2;
      y = rect.top - widgetRect.top + rect.height / 2;
    }

    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const nextState = !habit.completed;
        if (nextState) {
          triggerConfetti(x, y);
        }
        return {
          ...habit,
          completed: nextState,
          streak: nextState ? habit.streak + 1 : habit.streak - 1
        };
      }
      return habit;
    }));
  };

  const resetAll = () => {
    setHabits(prev => prev.map(h => ({ ...h, completed: false, streak: Math.max(0, h.streak - 1) })));
  };

  // SVG parameters for progress ring
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="widget-container relative w-full max-w-md bg-[#0d0d0f] border border-[#27272a] rounded-3xl p-6 shadow-2xl overflow-hidden group select-none">
      {/* Glow Effects */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#10b981]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#10b981]/15 transition-all duration-700" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-all duration-700" />

      {/* Confetti Render */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none animate-confetti-particle"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            '--angle': `${p.angle}deg`,
            '--distance': `${p.distance}px`,
            '--delay': `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20 px-2.5 py-0.5 rounded-full">
            Live Demo Widget
          </span>
          <h4 className="font-bold text-white text-base mt-1.5 flex items-center gap-1.5">
            Your Life OS <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          </h4>
        </div>
        <button 
          onClick={resetAll}
          title="Reset Dashboard State"
          className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800/50 border border-transparent hover:border-zinc-800 transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Life Score Ring Widget */}
        <div className="bg-[#151518] border border-white/[0.04] p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-zinc-800 fill-transparent"
                strokeWidth={strokeWidth}
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-[#10b981] fill-transparent transition-all duration-700 ease-out"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-mono text-xl font-black text-white leading-none">
                {completionRate}%
              </span>
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                Life Score
              </span>
            </div>
          </div>
        </div>

        {/* Level & XP Stats */}
        <div className="bg-[#151518] border border-white/[0.04] p-4 rounded-2xl flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Level Progress</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white font-mono">Lvl {level}</span>
              {earnedXp > 0 && (
                <span className="text-[10px] text-[#10b981] font-bold font-mono animate-bounce">
                  +{earnedXp} XP
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-semibold">
              <span className="text-zinc-400 font-mono">{displayXp} XP</span>
              <span className="text-zinc-600 font-mono">/ {maxXp}</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#10b981] rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                style={{ width: `${(displayXp / maxXp) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Habit Items Checklist */}
      <div className="space-y-2.5">
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block px-1">Today's Habits</span>
        
        {habits.map((habit) => {
          const IconComponent = habit.icon;
          return (
            <div 
              key={habit.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                habit.completed 
                  ? 'bg-[#10b981]/5 border-[#10b981]/20 shadow-md shadow-[#10b981]/[0.02]' 
                  : 'bg-[#151518] border-white/[0.03] hover:border-white/[0.08] hover:bg-[#1a1a1f]'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Habit Icon Box */}
                <div className={`w-8.5 h-8.5 rounded-xl border flex items-center justify-center transition-colors duration-300 ${
                  habit.completed ? 'text-[#10b981] bg-[#10b981]/15 border-[#10b981]/30' : habit.iconColor
                }`}>
                  <IconComponent className="w-4 h-4 stroke-[2]" />
                </div>

                <div className="text-left">
                  <p className={`text-xs font-bold transition-all duration-300 ${
                    habit.completed ? 'text-zinc-500 line-through font-normal' : 'text-white'
                  }`}>
                    {habit.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] text-zinc-500 font-mono font-medium">+{habit.xp} XP</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span className="text-[9px] text-amber-500 font-mono font-semibold flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5 fill-amber-500/20" /> {habit.streak}d streak
                    </span>
                  </div>
                </div>
              </div>

              {/* Habit Toggle Checkbox */}
              <button
                onClick={(e) => toggleHabit(habit.id, e)}
                className={`w-7.5 h-7.5 rounded-full border flex items-center justify-center transition-all cursor-pointer active-bounce ${
                  habit.completed
                    ? 'bg-[#10b981] border-[#10b981] text-black shadow-md shadow-[#10b981]/20'
                    : 'border-zinc-700 hover:border-zinc-500 text-transparent bg-transparent'
                }`}
              >
                <Check className={`w-4 h-4 stroke-[3.5] transition-transform duration-300 ${habit.completed ? 'scale-100' : 'scale-0'}`} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Styled Confetti CSS keyframes */}
      <style jsx global>{`
        @keyframes confetti-burst {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate3d(
              calc(cos(var(--angle)) * var(--distance)),
              calc(sin(var(--angle)) * var(--distance) - 60px),
              0
            ) scale(0.2);
            opacity: 0;
          }
        }
        .animate-confetti-particle {
          animation: confetti-burst 1.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
          animation-delay: var(--delay);
        }
      `}</style>
    </div>
  );
}
