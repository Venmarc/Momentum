# Momentum: Product Architecture, Features & User Flows (Phase 0–3 Summary)

This document provides a comprehensive blueprint of what has been built in Momentum so far (from Phase 0 through Phase 3). It details the tech stack, database structure, design systems, and the complete user journey.

---

## 1. Technical Stack & Architecture

Momentum is designed as a premium, self-contained fitness and habit operating system.

* **Core Framework**: Next.js 16 (App Router) with React Server Components (RSC) for optimized server-side rendering and Server Actions for secure database mutations.
* **Programming Language**: TypeScript (Strict mode enabled, zero `any` variables).
* **Styling**: Tailwind CSS 4 with a bespoke premium dark theme, glassmorphic surfaces, and responsive layouts.
* **Authentication**: Clerk (Auth & JWT claims syncing Clerk ID as the primary key source of truth).
* **Database**: Supabase PostgreSQL + Realtime subscription channels. Row-Level Security (RLS) is active across all tables.
* **Client State Management**: Zustand (for active workout store and sidebar collapse settings) + local React state hooks.
* **Data Visualization**: Recharts (for responsive strength progress curves, habit weekly adherence, and wellness trend analysis).
* **Icons**: Lucide React.

---

## 2. Database Schema (Supabase PostgreSQL)

All user entities trace back to a unique `clerk_id` (synchronized from Clerk authentication profiles):

1. **`profiles`**: Stores user attributes (`full_name`, `username`, `avatar_url`, and biometrics: `height_cm`, `weight_kg`).
2. **`habits`**: Configurations for tracking routine behaviors (`name`, `recurrence` JSONB, `target_count`, `category`).
3. **`habit_logs`**: Check-in events tracking completion dates (`logged_date`, `completed` boolean, `notes`).
4. **`workouts`**: Completed routines tracking `date`, `total_duration_minutes`, `total_volume_kg`, and summary `notes`.
5. **`workout_exercises`**: Join table mapping `workouts` to exercises, storing sets, reps, weight, duration, RPE, and bodyweight multipliers in a JSONB array.
6. **`exercises`**: Catalog of movements (`name`, `category`, `muscle_group`, `is_custom`, `clerk_id`).
7. **`wellness_entries`**: Daily mood scales (1–5), energy levels (1–5), sleep metrics (hours, quality 1–5), and journal reflections.
8. **`goals`**: Target setting tracker (`name`, `target_value`, `current_value`, `category`, `due_date`).
9. **`user_preferences`**: Local preferences including `theme` (dark default), `timezone`, `week_starts_on`, `notifications_enabled`, and `dashboard_widgets` JSONB layout visibility toggles.

---

## 3. The Design System & Aesthetics

Momentum implements a cohesive, high-end visual language matching clean watch-style layouts:

* **Dark-First Contrast**: Background color `#000000` with container surfaces mapped to `#09090b` (zinc-900) or glass overlays (`rgba(255, 255, 255, 0.06)`).
* **Borders & Rules**: Low-contrast border color lines (`rgba(255, 255, 255, 0.08)` or `#27272a`).
* **Accents**: Success Green (`#22C55E` / `text-brand-success`), Warning Amber (`#F59E0B`), and Pink (`#F43F5E` for heart/wellness indicators).
* **Typography**: Title headings are set in heavy, tracking-tight labels. Sub-headers use high-contrast muted text (`text-[#a1a1aa]`) to comply with WCAG AA accessibility standards.
* **Micro-interactions**: Hover effects scale borders cleanly and transitions fade layouts smoothly without shifting boundaries.

---

## 4. The Complete User Journey

### A. The Visitor Experience
1. **Landing Page (`/`)**: Serves as the initial entry gate.
2. **Authentication Guard**: Middleware checks credentials. Authenticated users landing on `/` are immediately redirected to the `/today` hub.
3. **Registration Flow**: A new user signs up via Clerk. Clerk creates the user profile, and Momentum synchronizes user credentials to the Supabase `profiles` table using the Server Action `ensureProfile()`.

### B. Daily Operating Hub (`/today`)
1. **Personal Greeting**: Grabs the user's first name dynamically from their profile.
2. **Daily Life Score**: Computes a dynamic daily score based on habit checks, wellness completions, and whether a workout was completed.
3. **Habits Checklist**: Displays checkable habits due today.
4. **Wellness Log**: Shows a summary of daily sleep, mood, and energy, with labels mapping index values (e.g. `🙂 Good`, `⚡ Balanced`).
5. **Fitness Status**: Prompts with the latest completed session or a call-to-action button to start a workout.
6. **Goals Tracker**: Proximity indicator displaying goals completion progress.
7. **Dashboard Visibility Customization**: Users can toggle which of these cards are rendered directly from their preferences settings.

### C. Habits Suite (`/habits`)
* Users view active/archived habits, streaks, and check off check-ins.
* Users add custom habits via `/habits/new` defining category, target counts, and recurrence rules.

### D. Fitness Suite (`/fitness`)
* **/fitness**: Main dashboard showing logged sessions, total volume, total duration, and latest activity.
* **/fitness/log**: Starts an active workout. Users can load predefined templates (e.g., Chest Focus, Shoulder Focus) or start an empty routine.
  * **Workout Logger**: Logs sets, reps, duration, and RPE scales.
  * **RPE Tooltip**: Column headers render an interactive `Info` icon explaining the Rate of Perceived Exertion (RPE 1-10) scale.
* **/fitness/history**: Expandable listing of completed sessions. Supports session deletion and a post-session edit flow (which pulls the workout back into the active logger for adjustments).
* **/fitness/exercises**: Catalog listing. Users filter by category, search by name, and register custom exercises.

### E. Wellness Calendar (`/wellness`)
* Dedicated view featuring a daily calendar representation showing checked dates.
* Allows detailed daily logging including sleep duration, sleep quality ratings (via stars), mood indices, energy levels, and journal reflection prompts (e.g., Gratitude, Highlights).

### F. Progress & Analysis (`/progress`)
* Visualizes charts tracking weekly habit adherence averages, strength 1RM progression for specific exercises, weight logs, and mood correlations.
* **Responsive Heatmap Grid**: Renders consistency over the last 26 weeks. To prevent horizontal scroll overflow on mobile screens, the first 12 weeks of historical columns are hidden on viewports smaller than `768px`, resizing dynamically.

### G. Goals Console (`/goals`)
* Users manage and add goals with completion bars and deadline dates.

### H. System Settings (`/settings`)
* **Profile**: Update naming and biometrics (weight/height).
* **Preferences**: Customizes week starts (Sunday/Monday), system timezones, and dashboard layout widgets.
* **Data Management**: Full data export utility. Users download structured CSV logs or JSON backups via browser-native save picker dialogs (`window.showSaveFilePicker`) with anchor-tag download fallbacks.

### I. Catch-All (`/not-found`)
* Custom 404 handler containing a fully playable pixel art fitness runner game implemented inside an HTML5 canvas. Users press SPACEBAR or TAP to jump over obstacles (pizza, burgers, dumbbells) to increase their score.

---

## 5. Directory & Route Map

```
app/
├── actions/                  # Server Actions (Auth, Goals, Fitness, Settings)
├── api/                      # API Endpoints (Clerk sync webhooks)
├── components/               # Client Components divided by features
│   ├── dashboard/            # Widgets for /today page
│   ├── fitness/              # Logger, selector, history and exercise views
│   ├── progress/             # Heatmaps, body metrics logger
│   ├── settings/             # User forms, widget toggles, export dialogs
│   ├── wellness/             # Calendar logs, journal writing UI
│   └── navigation.tsx        # Left sidebar layout & bottom mobile navigation
├── dashboard/                # Server redirect route pointing to /today
├── fitness/                  # Fitness Hub landing page
│   ├── exercises/            # Exercise Library route
│   ├── history/              # Workouts History route
│   └── log/                  # Active Workout Logger route
├── goals/                    # Goals route
├── habits/                   # Habits route
├── progress/                 # Progress & Heatmaps route
├── settings/                 # Settings route
├── today/                    # Today Dashboard Hub route
├── wellness/                 # Wellness Calendar route
├── layout.tsx                # Sidebar context layout shell wrapper
└── not-found.tsx             # Interactive 404 Canvas Game page
```
