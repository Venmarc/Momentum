# Phase 3 Features & Usability Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement new pages, route restructuring, database toggles, wellness UX, file dialogs, and a custom gamified 404 page for Momentum.

**Architecture:** Split fitness routes into code-split folders, add a JSONB column to user preferences for widget toggles, move logging hub to `/today`, compute insights server-side, and implement HTML5 canvas runner game for 404.

**Tech Stack:** Next.js 16 App Router, TypeScript, Supabase PostgreSQL, Tailwind CSS 4, Lucide React.

---

### Task 1: Database Migration for Dashboard Widgets Toggle
**Files:**
- Create: `supabase/migrations/20260610_add_dashboard_widgets.sql`

- [ ] **Step 1: Create the SQL migration file**
  Create the migration file containing the SQL statement to add `dashboard_widgets` to the `user_preferences` table.
  ```sql
  -- Add dashboard_widgets column to user_preferences
  ALTER TABLE public.user_preferences 
  ADD COLUMN IF NOT EXISTS dashboard_widgets JSONB DEFAULT '{"bodyComposition": true, "wellnessLog": true, "goalsTracker": true, "fitnessStatus": true, "habitsChecklist": true}'::jsonb;
  ```
- [ ] **Step 2: Commit database schema update**
  ```bash
  git add supabase/migrations/20260610_add_dashboard_widgets.sql
  git commit -m "db: add dashboard_widgets jsonb column to user_preferences"
  ```

---

### Task 2: Create `/today` Route & Dashboard Redirect
**Files:**
- Create: `app/today/page.tsx`
- Modify: `app/dashboard/page.tsx`
- Modify: `app/page.tsx`
- Modify: `app/components/navigation.tsx`

- [ ] **Step 1: Create the `/today` Page**
  Write `/home/redmane/Documents/Port Sites/Category 5/Momentum/app/today/page.tsx` by copying the primary logic from `/dashboard/page.tsx`. Implement first name display greeting:
  ```tsx
  const firstName = profile?.full_name ? profile.full_name.trim().split(/\s+/)[0] : (profile?.username || 'User');
  ```
- [ ] **Step 2: Update `/dashboard` to Redirect**
  Replace contents of `/home/redmane/Documents/Port Sites/Category 5/Momentum/app/dashboard/page.tsx` to redirect to `/today` for logged in users:
  ```tsx
  import { redirect } from 'next/navigation';
  export default function DashboardPage() {
    redirect('/today');
  }
  ```
- [ ] **Step 3: Update Landing Page Root `/` Redirect**
  Change redirect in `/home/redmane/Documents/Port Sites/Category 5/Momentum/app/page.tsx` to point to `/today` instead of `/dashboard` on line 29:
  ```tsx
  if (userId) {
    redirect('/today');
  }
  ```
- [ ] **Step 4: Update Navigation Layout Links**
  In `/home/redmane/Documents/Port Sites/Category 5/Momentum/app/components/navigation.tsx` and layout shells, change link targets from `/dashboard` to `/today`.
- [ ] **Step 5: Commit changes**
  ```bash
  git add app/today/page.tsx app/dashboard/page.tsx app/page.tsx app/components/navigation.tsx
  git commit -m "feat: migrate landing to /today and redirect /dashboard"
  ```

---

### Task 3: Implement Preferences Actions & Settings Toggles
**Files:**
- Modify: `app/actions/settings-actions.ts`
- Modify: `app/components/settings/settings-client.tsx`
- Modify: `app/today/page.tsx`

- [ ] **Step 1: Update settings Server Actions**
  Modify `updateUserPreferences` in `app/actions/settings-actions.ts` to accept `dashboard_widgets` and store it:
  ```typescript
  export async function updateUserPreferences(input: {
    theme: string;
    timezone: string;
    week_starts_on: string;
    notifications_enabled: boolean;
    dashboard_widgets?: Record<string, boolean>;
  }) {
    // ... insert/upsert dashboard_widgets
  }
  ```
- [ ] **Step 2: Add Toggles UI to Settings page**
  Add a toggles panel in `/home/redmane/Documents/Port Sites/Category 5/Momentum/app/components/settings/settings-client.tsx` to let users toggle widget visibility and save them to the DB.
- [ ] **Step 3: Filter Today Dashboard Widgets**
  Modify `app/today/page.tsx` to read the `dashboard_widgets` preferences from the query and hide/show widgets accordingly.
- [ ] **Step 4: Commit settings preferences update**
  ```bash
  git add app/actions/settings-actions.ts app/components/settings/settings-client.tsx app/today/page.tsx
  git commit -m "feat: implement dashboard widget preferences toggles and sync"
  ```

---

### Task 4: Split `/fitness` into Sub-routes
**Files:**
- Modify: `app/fitness/page.tsx`
- Create: `app/fitness/log/page.tsx`
- Create: `app/fitness/history/page.tsx`
- Create: `app/fitness/exercises/page.tsx`
- Modify: `app/components/fitness/fitness-client.tsx`

- [ ] **Step 1: Create separate files for sub-routes**
  Move the sub-routes logic out of the unified `/fitness` page component. Create `/fitness/log/page.tsx`, `/fitness/history/page.tsx`, and `/fitness/exercises/page.tsx` pointing to `/app/components/fitness` sub-components.
- [ ] **Step 2: Clean up main `/fitness` page**
  Make `/fitness/page.tsx` a clean dashboard overview pointing to the new sub-routes.
- [ ] **Step 3: Commit sub-routes code-split**
  ```bash
  git add app/fitness/ git commit -m "refactor: split fitness sub-routes to log, history, and exercises"
  ```

---

### Task 5: Implement Workout Editing & RPE explanation
**Files:**
- Modify: `app/actions/fitness-actions.ts`
- Modify: `app/components/fitness/workout-logger.tsx`

- [ ] **Step 1: Create updateWorkout Server Action**
  Create `updateWorkout` Server Action to handle updates to sets, reps, weights, or notes post-session.
- [ ] **Step 2: Implement edit interface**
  Add edit mode/workflow inside the completed workouts history page so elements can be edited.
- [ ] **Step 3: Add RPE Scale explanation tooltip**
  Add information icon with a hover tooltip explaining the RPE 1–10 scale.
- [ ] **Step 4: Commit workout editing flow**
  ```bash
  git add app/actions/fitness-actions.ts app/components/fitness/workout-logger.tsx
  git commit -m "feat: implement completed workouts edit flow and RPE tooltip"
  ```

---

### Task 6: Custom Gamified 404 Page
**Files:**
- Create: `app/not-found.tsx`

- [ ] **Step 1: Write `app/not-found.tsx`**
  Build a Next.js `not-found.tsx` rendering a canvas element with keyboard inputs. The canvas draws a pixel runner jumping over dumbbells and junk food using canvas `2d` drawings (rectangles/emojis) for maximum Lighthouse performance.
- [ ] **Step 2: Commit custom 404**
  ```bash
  git add app/not-found.tsx
  git commit -m "feat: build gamified 404 page with canvas fitness runner"
  ```

---

### Task 7: Heatmap & Progress Page Polish
**Files:**
- Modify: `app/components/progress/consistency-heatmap.tsx`
- Modify: `app/components/progress/adherence-trend.tsx` (or graph files)

- [ ] **Step 1: Make consistency heatmap tooltip adaptive**
  Modify coordinates of tooltip hover container to detect bounding box and shift left when mouse is on the right-most columns.
- [ ] **Step 2: Ensure responsive resizing**
  Wrap charts in Recharts `ResponsiveContainer` and adjust columns count based on viewport widths using simple tailwind class displays or screen hooks.
- [ ] **Step 3: Commit progress polish**
  ```bash
  git add app/components/progress/
  git commit -m "fix: make consistency heatmap tooltip adaptive and graphs responsive"
  ```

---

### Task 8: Wellness Logger Emojis & "Save As" Dialog
**Files:**
- Modify: `app/components/wellness/wellness-client.tsx`
- Modify: `app/components/settings/settings-client.tsx`

- [ ] **Step 1: Append text labels to wellness emojis**
  Update logging buttons in wellness view to display clear text descriptions of emojis (e.g., Balanced, Energized).
- [ ] **Step 2: Implement File System Access Save dialog**
  Use `window.showSaveFilePicker` in settings data exports to trigger a native folder/name selector, with an anchor-tag download fallback.
- [ ] **Step 3: Commit wellness labels and save dialog**
  ```bash
  git add app/components/wellness/ app/components/settings/
  git commit -m "feat: add wellness labels and native file save dialog"
  ```
