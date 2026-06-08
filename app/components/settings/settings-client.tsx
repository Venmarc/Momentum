'use client';

import React, { useState, useTransition } from 'react';
import { 
  User, Sliders, Database, Download, CheckCircle2, 
  Loader2, Globe, Calendar, Moon, Sun, Bell, AlertTriangle
} from 'lucide-react';
import { toast } from '@/app/hooks/use-toast';
import { exportUserData } from '@/app/actions/export-actions';
import { updateUserProfile, updateUserPreferences } from '@/app/actions/settings-actions';

interface Profile {
  clerk_id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  height_cm: number | null;
  weight_kg: number | null;
}

interface UserPreferences {
  theme: string;
  timezone: string;
  week_starts_on: string;
  notifications_enabled: boolean;
}

interface SettingsClientProps {
  initialProfile: Profile;
  initialPreferences: UserPreferences;
}

const COMMON_TIMEZONES = [
  { value: 'UTC', label: 'UTC (GMT+0)' },
  { value: 'America/New_York', label: 'Eastern Time (New York)' },
  { value: 'America/Chicago', label: 'Central Time (Chicago)' },
  { value: 'America/Denver', label: 'Mountain Time (Denver)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Central European Time (Paris)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (Tokyo)' },
  { value: 'Asia/Singapore', label: 'Singapore Standard Time (Singapore)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (Beijing)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (Sydney)' },
];

export default function SettingsClient({ initialProfile, initialPreferences }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'data'>('profile');
  
  // Profile Form States
  const [fullName, setFullName] = useState(initialProfile.full_name || '');
  const [username, setUsername] = useState(initialProfile.username || '');
  const [height, setHeight] = useState(initialProfile.height_cm ? String(initialProfile.height_cm) : '');
  const [weight, setWeight] = useState(initialProfile.weight_kg ? String(initialProfile.weight_kg) : '');
  const [isSavingProfile, startSavingProfile] = useTransition();

  // Preferences Form States
  const [theme, setTheme] = useState(initialPreferences.theme);
  const [timezone, setTimezone] = useState(initialPreferences.timezone);
  const [weekStartsOn, setWeekStartsOn] = useState(initialPreferences.week_starts_on);
  const [notificationsEnabled, setNotificationsEnabled] = useState(initialPreferences.notifications_enabled);
  const [isSavingPrefs, startSavingPrefs] = useTransition();

  // Data Export States
  const [isExportingJson, setIsExportingJson] = useState(false);
  const [exportLoadingState, setExportLoadingState] = useState<{
    habits: boolean;
    logs: boolean;
    workouts: boolean;
    wellness: boolean;
  }>({
    habits: false,
    logs: false,
    workouts: false,
    wellness: false,
  });

  // Handle Profile Update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Full name is required.');
      return;
    }

    if (!username.trim()) {
      toast.error('Username is required.');
      return;
    }

    const heightVal = height === '' ? null : parseFloat(height);
    const weightVal = weight === '' ? null : parseFloat(weight);

    if (heightVal !== null && (isNaN(heightVal) || heightVal <= 0)) {
      toast.error('Please enter a valid height.');
      return;
    }

    if (weightVal !== null && (isNaN(weightVal) || weightVal <= 0)) {
      toast.error('Please enter a valid weight.');
      return;
    }

    startSavingProfile(async () => {
      const result = await updateUserProfile({
        full_name: fullName,
        username,
        height_cm: heightVal,
        weight_kg: weightVal,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Profile updated successfully!');
      }
    });
  };

  // Handle Preferences Update
  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();

    startSavingPrefs(async () => {
      const result = await updateUserPreferences({
        theme,
        timezone,
        week_starts_on: weekStartsOn,
        notifications_enabled: notificationsEnabled,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Preferences updated successfully!');
      }
    });
  };

  // CSV Conversion Helper
  const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const headerRow = headers.join(',');
    const rows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        // If the value is an object or array, serialize it to avoid issues
        const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
        // Escape quotes
        const escaped = valStr.replace(/"/g, '""');
        return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')
          ? `"${escaped}"`
          : escaped;
      }).join(',')
    );
    return [headerRow, ...rows].join('\r\n');
  };

  // Trigger File Download
  const triggerDownload = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle JSON Backup Export
  const handleExportJSON = async () => {
    setIsExportingJson(true);
    try {
      const res = await exportUserData();
      if (res.error || !res.data) {
        toast.error(res.error || 'Failed to export data');
        return;
      }

      const jsonString = JSON.stringify(res.data, null, 2);
      const today = new Date().toISOString().split('T')[0];
      triggerDownload(jsonString, `momentum_backup_${today}.json`, 'application/json');
      toast.success('JSON backup downloaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during JSON export.');
    } finally {
      setIsExportingJson(false);
    }
  };

  // Handle CSV Export for specific collections
  const handleExportCSV = async (type: 'habits' | 'logs' | 'workouts' | 'wellness') => {
    setExportLoadingState(prev => ({ ...prev, [type]: true }));
    try {
      const res = await exportUserData();
      if (res.error || !res.data) {
        toast.error(res.error || 'Failed to export data');
        return;
      }

      const rawArray = res.data[type];
      if (!rawArray || rawArray.length === 0) {
        toast.info(`You don't have any records in ${type} to export.`);
        return;
      }

      const csvContent = convertToCSV(rawArray);
      const today = new Date().toISOString().split('T')[0];
      triggerDownload(csvContent, `momentum_${type}_export_${today}.csv`, 'text/csv;charset=utf-8;');
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} CSV downloaded successfully!`);
    } catch (err) {
      console.error(err);
      toast.error(`An error occurred exporting ${type} to CSV.`);
    } finally {
      setExportLoadingState(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8 pb-24 min-w-0">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-16 md:mt-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-emerald-400" />
            System Settings
          </h1>
          <p className="text-xs text-[#a1a1aa] font-medium">
            Manage your user profile, operating preferences, and local backups.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-[#121214] border border-[#27272a] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#1e1e22] text-white shadow-sm'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preferences'
                ? 'bg-[#1e1e22] text-white shadow-sm'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'data'
                ? 'bg-[#1e1e22] text-white shadow-sm'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Backup & Export
          </button>
        </div>
      </div>

      {/* Main glassmorphic container */}
      <div className="bg-white/[0.05] backdrop-blur-[24px] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
        
        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-100 mb-1 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                Personal Profile
              </h2>
              <p className="text-xs text-[#a1a1aa]">
                Update your naming and biometrics. Height and weight parameters tune your fitness statistics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-xs font-bold tracking-wider text-zinc-300 uppercase">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-zinc-950/40 border border-white/10 text-white rounded-xl px-4 py-3 placeholder:text-zinc-500 shadow-inner focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 w-full"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-xs font-bold tracking-wider text-zinc-300 uppercase">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-zinc-950/40 border border-white/10 text-white rounded-xl px-4 py-3 placeholder:text-zinc-500 shadow-inner focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 w-full"
                  placeholder="e.g. johndoe"
                  required
                />
              </div>

              {/* Height */}
              <div className="space-y-2">
                <label htmlFor="height" className="text-xs font-bold tracking-wider text-zinc-300 uppercase">
                  Height (cm)
                </label>
                <div className="relative">
                  <input
                    id="height"
                    type="number"
                    step="0.1"
                    min="0"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="bg-zinc-950/40 border border-white/10 text-white rounded-xl px-4 py-3 placeholder:text-zinc-500 shadow-inner focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 w-full pr-12 font-mono"
                    placeholder="e.g. 178.5"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500 font-mono select-none">
                    cm
                  </span>
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <label htmlFor="weight" className="text-xs font-bold tracking-wider text-zinc-300 uppercase">
                  Weight (kg)
                </label>
                <div className="relative">
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="bg-zinc-950/40 border border-white/10 text-white rounded-xl px-4 py-3 placeholder:text-zinc-500 shadow-inner focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 w-full pr-12 font-mono"
                    placeholder="e.g. 74.2"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500 font-mono select-none">
                    kg
                  </span>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold px-6 py-3 rounded-xl transition-all duration-200 active-bounce cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: PREFERENCES */}
        {activeTab === 'preferences' && (
          <form onSubmit={handleSavePreferences} className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-100 mb-1 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                App Preferences
              </h2>
              <p className="text-xs text-[#a1a1aa]">
                Customize visual theme preferences, localization timezones, and display configurations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

              {/* Theme Settings */}
              <div className="space-y-2">
                <span className="text-xs font-bold tracking-wider text-zinc-300 uppercase">
                  Interface Theme
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-md shadow-emerald-500/5'
                        : 'border-white/10 bg-zinc-950/20 text-[#a1a1aa] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-purple-400" />
                    Dark Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-md shadow-emerald-500/5'
                        : 'border-white/10 bg-zinc-950/20 text-[#a1a1aa] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-400" />
                    Light Mode
                  </button>
                </div>
              </div>

              {/* Week Starts On */}
              <div className="space-y-2">
                <span className="text-xs font-bold tracking-wider text-zinc-300 uppercase flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  Week Starts On
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setWeekStartsOn('monday')}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                      weekStartsOn === 'monday'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-md shadow-emerald-500/5'
                        : 'border-white/10 bg-zinc-950/20 text-[#a1a1aa] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    Monday
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeekStartsOn('sunday')}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                      weekStartsOn === 'sunday'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-md shadow-emerald-500/5'
                        : 'border-white/10 bg-zinc-950/20 text-[#a1a1aa] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    Sunday
                  </button>
                </div>
              </div>

              {/* Timezone Selection */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="timezone" className="text-xs font-bold tracking-wider text-zinc-300 uppercase flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-zinc-400" />
                  System Timezone
                </label>
                <select
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="bg-zinc-950/60 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 w-full cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23a1a1aa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 1rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.25rem',
                  }}
                >
                  {COMMON_TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value} className="bg-zinc-900 text-white">
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notifications Toggle */}
              <div className="space-y-2 md:col-span-2 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                  <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors flex items-center gap-1.5 select-none">
                    <Bell className="w-4 h-4 text-zinc-400" />
                    Enable daily system updates and reminders
                  </span>
                </label>
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <button
                type="submit"
                disabled={isSavingPrefs}
                className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold px-6 py-3 rounded-xl transition-all duration-200 active-bounce cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingPrefs ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Save Preferences
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: DATA EXPORT */}
        {activeTab === 'data' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-bold text-zinc-100 mb-1 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                Data & Backups
              </h2>
              <p className="text-xs text-[#a1a1aa]">
                Download a copy of your records in structured formats. Keep backups safe for offline recovery or custom analysis.
              </p>
            </div>

            {/* Warning card */}
            <div className="flex gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold block mb-0.5">Sensitive Data Warning</span>
                Backup files contain all your recorded logs, workout records, habits details, and wellness check-ins. Keep these files secure and avoid sharing them publicly.
              </div>
            </div>

            <div className="space-y-6 pt-2">
              
              {/* Full JSON export */}
              <div className="p-5 rounded-xl border border-white/5 bg-zinc-950/20 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">Complete JSON Backup</h3>
                    <p className="text-xs text-[#a1a1aa]">
                      Export all databases (habits, logs, workouts, wellness entries) into a single JSON file structure.
                    </p>
                  </div>
                  <button
                    onClick={handleExportJSON}
                    disabled={isExportingJson}
                    className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 active-bounce cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                  >
                    {isExportingJson ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-zinc-400" />
                        Export Backup (JSON)
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Indivudal CSV exports */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
                  Individual CSV Exports
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Habits CSV */}
                  <div className="p-4 rounded-xl border border-white/5 bg-zinc-950/20 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white mb-0.5">Habits Configuration</h4>
                      <p className="text-[10px] text-[#a1a1aa]">Names, categories, targets.</p>
                    </div>
                    <button
                      onClick={() => handleExportCSV('habits')}
                      disabled={exportLoadingState.habits}
                      className="bg-white/5 hover:bg-white/10 text-white font-medium p-2 rounded-lg border border-white/10 transition-all active-bounce cursor-pointer"
                      title="Download Habits CSV"
                    >
                      {exportLoadingState.habits ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                  </div>

                  {/* Habit Logs CSV */}
                  <div className="p-4 rounded-xl border border-white/5 bg-zinc-950/20 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white mb-0.5">Habit Completion Logs</h4>
                      <p className="text-[10px] text-[#a1a1aa]">Daily tracking ticks, values, notes.</p>
                    </div>
                    <button
                      onClick={() => handleExportCSV('logs')}
                      disabled={exportLoadingState.logs}
                      className="bg-white/5 hover:bg-white/10 text-white font-medium p-2 rounded-lg border border-white/10 transition-all active-bounce cursor-pointer"
                      title="Download Logs CSV"
                    >
                      {exportLoadingState.logs ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                  </div>

                  {/* Workouts CSV */}
                  <div className="p-4 rounded-xl border border-white/5 bg-zinc-950/20 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white mb-0.5">Workouts History</h4>
                      <p className="text-[10px] text-[#a1a1aa]">Log entries, weights, durations.</p>
                    </div>
                    <button
                      onClick={() => handleExportCSV('workouts')}
                      disabled={exportLoadingState.workouts}
                      className="bg-white/5 hover:bg-white/10 text-white font-medium p-2 rounded-lg border border-white/10 transition-all active-bounce cursor-pointer"
                      title="Download Workouts CSV"
                    >
                      {exportLoadingState.workouts ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                  </div>

                  {/* Wellness CSV */}
                  <div className="p-4 rounded-xl border border-white/5 bg-zinc-950/20 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white mb-0.5">Wellness & Reflections</h4>
                      <p className="text-[10px] text-[#a1a1aa]">Mood rating, energy scale, sleep sleep metrics.</p>
                    </div>
                    <button
                      onClick={() => handleExportCSV('wellness')}
                      disabled={exportLoadingState.wellness}
                      className="bg-white/5 hover:bg-white/10 text-white font-medium p-2 rounded-lg border border-white/10 transition-all active-bounce cursor-pointer"
                      title="Download Wellness CSV"
                    >
                      {exportLoadingState.wellness ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
