# Design Specification: Momentum UI Polishing & Gamification

**Date:** 2026-06-08  
**Topic:** UI Polish & Gamification OS  
**Status:** Approved (Option B styling, Option C hybrid progression, 2x2 Grid Layout with Goals)

---

## 1. Vision & Objectives

This specification outlines the UI polishing and gamification of the Momentum productivity suite. The goal is to elevate the user experience from a standard utility to a premium, satisfying, and motivating "life operating system."

### Key Themes:
- **Tactile Glass-Gamification:** Retain the premium watch OS glass card base, but integrate satisfying physical/tactile click states (spring active transforms, soft inner shadows) and vibrant glowing status accents.
- **Hybrid Progression Model:** Apple-style daily checklist completeness rings (0-100%) that convert daily completion percentage into cumulative Experience Points (XP) and Levels (e.g., Level 5 Habit Warrior).
- **2x2 Grid Layout:** A visually complete, symmetrical dashboard grid featuring Habits, Fitness, Wellness, and Goals.

---

## 2. Technical & Database Architecture

To resolve the duplicate habit log details bugs (causing notes/difficulty/tags to transfer or disappear), we must lock down database constraints and refactor server actions.

### 2.1 Database Constraints
Enforce a unique index on the combination of habit and date to prevent duplicate records:
```sql
ALTER TABLE public.habit_logs 
ADD CONSTRAINT habit_logs_habit_id_logged_date_key 
UNIQUE (habit_id, logged_date);
```

### 2.2 Server Action Upsert
Refactor `logHabit` in `app/actions/habit-actions.ts` from a read-then-write logic into a single atomic upsert operation:
```typescript
const { data, error } = await supabase
  .from('habit_logs')
  .upsert({
    habit_id: parsed.data.habit_id,
    clerk_id: userId,
    logged_date: parsed.data.logged_date,
    completed: parsed.data.completed,
    count: parsed.data.count,
    notes: parsed.data.notes,
    difficulty: parsed.data.difficulty,
    context_tags: parsed.data.context_tags,
  }, {
    onConflict: 'habit_id, logged_date'
  })
  .select()
  .single();
```

---

## 3. Visual & Interaction Design System (Option B)

We will apply tactile glassmorphism aesthetics to all interactive elements across the application.

### 3.1 Frosty Cards
- **Background:** `rgba(255, 255, 255, 0.06)` (Dark Mode) / `rgba(255, 255, 255, 0.8)` (Light Mode).
- **Backdrop-Filter:** `blur(24px)`.
- **Border:** `1px solid rgba(255, 255, 255, 0.08)`.
- **Shadow:** `inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 20px rgba(0, 0, 0, 0.4)`.

### 3.2 Tactile Buttons & Checkboxes
- **Hover State:** Increase border visibility (`rgba(255, 255, 255, 0.15)`) and add a soft neon gradient glow depending on the category.
- **Active State (Click):**
  - Transform: `scale(0.96)`.
  - Inset Shadow: `inset 0 2px 4px rgba(0, 0, 0, 0.4)`.
  - Transition: `all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)` for satisfying tactile "spring".

---

## 4. Today Dashboard Redesign (`app/page.tsx`)

The dashboard serves as the central focal point.

### 4.1 Welcome Header
- Greeting ("Welcome back, User 👋").
- **Gamified Level Tracker:** Displays your current Level badge (e.g., `Lv 4 Habit Champion`) and a glowing XP bar (`420 / 600 XP`).

### 4.2 Dynamic Daily Life Score (0-100%)
A circular progress ring representing today's completeness, dynamically adjusted depending on workout days:
- **Workout Days:** `Score = (Habits * 0.5) + (Wellness * 0.25) + (Workout * 0.25)`
- **Rest Days:** `Score = (Habits * 0.65) + (Wellness * 0.35)`

*XP Reward:* Every 1% of the final daily Life Score achieved yields +1 XP. Streak milestones (5-day, 10-day) grant +50 XP and +100 XP respectively.

### 4.3 2x2 Grid Layout
- **Top-Left (Habits Due Today):** Interactive checklist with quick-complete selectors and visible streak flame counts.
- **Top-Right (Fitness Tracker):** Logging summary card showing workout volume, durations, and a quick-log redirect.
- **Bottom-Left (Wellness snapshot):** Clean mood rating summary.
- **Bottom-Right (Active Goals Tracker):** List of current active goals with target bars, completion percentages, and projected dates.

---

## 5. UI/UX Refinement Details

### 5.1 Heatmap Tooltip Overflow Fix
- **File:** `app/components/progress/habits-heatmap.tsx`
- **Fix:** Remove CSS nested tooltips. Track hover status at the parent wrapper component using state:
  ```typescript
  const [hoveredDay, setHoveredDay] = useState<any>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  ```
  Render a single tooltip element placed outside the `overflow-x-auto` grid. Align it relative to the parent card using coordinate offsets, preventing it from clipping the bounds and creating scrollbars.

### 5.2 Wellness Selector Labels
- **File:** Wellness logging modals.
- **Fix:** Place small, muted labels ("Bad", "Poor", "Neutral", "Good", "Excellent") directly below the selector emojis, clarifying the scale instantly.

### 5.3 Custom Confirmation Modals
- **Fix:** Replace all native browser `confirm()` alerts with a styled glassmorphic overlay component matching the existing layout shell structure.

### 5.4 Workout Logger Additions
- **Bodyweight Toggle:** Add a "Bodyweight" checkbox. When checked, hide the weight field and pre-fill bodyweight dynamically from the profile, leaving only Reps and RPE.
- **Endurance Timer:** Add duration logging support (seconds/minutes) for time-based sets.
- **Edit Completed Workouts:** Add an Edit trigger in `/fitness/history` to retroactively correct details.
