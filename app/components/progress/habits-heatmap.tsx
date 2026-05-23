'use client';

import React, { useMemo } from 'react';
import { format, startOfWeek, subWeeks, addDays, isSameDay, parseISO } from 'date-fns';

interface HabitsHeatmapProps {
  logs: any[];
  habits: any[];
}

export default function HabitsHeatmap({ logs, habits }: HabitsHeatmapProps) {
  // Generate the list of dates for the last 26 weeks (columns) x 7 days (rows)
  const gridData = useMemo(() => {
    const today = new Date();
    const startDate = startOfWeek(subWeeks(today, 25), { weekStartsOn: 1 }); // Start 26 weeks ago (Monday)
    
    const weeks = [];
    let currentDay = startDate;

    for (let w = 0; w < 26; w++) {
      const weekDays = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = format(currentDay, 'yyyy-MM-dd');
        
        // Find logs for this specific date
        const dayLogs = logs.filter(l => l.logged_date === dateStr);
        const completedCount = dayLogs.filter(l => l.completed).length;
        const totalLogged = dayLogs.length;

        // Calculate adherence percentage
        // If there are no logs for this day, completion is 0.
        const completionRate = totalLogged > 0 ? completedCount / totalLogged : 0;

        weekDays.push({
          date: new Date(currentDay),
          dateStr,
          completedCount,
          totalLogged,
          completionRate,
        });
        currentDay = addDays(currentDay, 1);
      }
      weeks.push(weekDays);
    }
    return weeks;
  }, [logs]);

  // Determine cell color based on completion rate
  const getCellClass = (rate: number, total: number) => {
    if (total === 0) return 'bg-white/[0.03] hover:bg-white/[0.1] border border-white/[0.02]';
    if (rate === 0) return 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/20';
    if (rate < 0.5) return 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30';
    if (rate < 1) return 'bg-emerald-500/50 hover:bg-emerald-500/60 border border-emerald-500/50';
    return 'bg-emerald-500 hover:bg-emerald-400 border border-emerald-400/50';
  };

  const dayLabels = ['Mon', 'Wed', 'Fri', 'Sun'];

  return (
    <div className="bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Habit Consistency Heatmap</h3>
          <p className="text-xs text-[#a1a1aa] mt-0.5">Visualize your check-in adherence over the last 26 weeks.</p>
        </div>
        <div className="flex gap-2 items-center text-[10px] text-[#a1a1aa]">
          <span>Less</span>
          <div className="w-3 h-3 rounded bg-white/[0.03] border border-white/[0.02]"></div>
          <div className="w-3 h-3 rounded bg-red-500/10 border border-red-500/20"></div>
          <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30"></div>
          <div className="w-3 h-3 rounded bg-emerald-500/50 border border-emerald-500/50"></div>
          <div className="w-3 h-3 rounded bg-emerald-500 border border-emerald-400/50"></div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="flex gap-2 min-w-[650px] justify-center py-2">
          {/* Day of week labels */}
          <div className="grid grid-rows-7 gap-1.5 text-[10px] text-[#a1a1aa] pr-2 pt-5 select-none font-medium justify-items-end">
            <span className="h-3 leading-3">Mon</span>
            <span className="h-3"></span>
            <span className="h-3 leading-3">Wed</span>
            <span className="h-3"></span>
            <span className="h-3 leading-3">Fri</span>
            <span className="h-3"></span>
            <span className="h-3 leading-3">Sun</span>
          </div>

          {/* Grid columns (weeks) */}
          <div className="flex gap-1.5 flex-1">
            {gridData.map((week, wIndex) => {
              // Show month label above the first week of the month
              const firstDayOfWeek = week[0].date;
              const isFirstWeekOfMonth = firstDayOfWeek.getDate() <= 7;
              
              return (
                <div key={wIndex} className="flex flex-col gap-1.5 flex-1 relative">
                  {/* Month header */}
                  <span className="absolute -top-5 left-0 text-[9px] text-[#a1a1aa] font-medium whitespace-nowrap select-none">
                    {isFirstWeekOfMonth ? format(firstDayOfWeek, 'MMM') : ''}
                  </span>

                  {week.map((day) => (
                    <div
                      key={day.dateStr}
                      className={`w-full aspect-square rounded-[3px] transition-all duration-150 cursor-pointer relative group ${getCellClass(
                        day.completionRate,
                        day.totalLogged
                      )}`}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg p-2 shadow-2xl text-[10px] text-white whitespace-nowrap pointer-events-none transition-opacity duration-200">
                        <p className="font-semibold">{format(day.date, 'MMMM d, yyyy')}</p>
                        {day.totalLogged > 0 ? (
                          <p className="text-emerald-400 mt-0.5">
                            {day.completedCount}/{day.totalLogged} habits completed ({Math.round(day.completionRate * 100)}%)
                          </p>
                        ) : (
                          <p className="text-[#a1a1aa] mt-0.5">No entries logged</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
