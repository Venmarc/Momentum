# Design Specification: Momentum Phase 3 & Core Improvements

**Project:** Momentum  
**Date:** 2026-06-10  
**Status:** Under Review  

---

## 1. Summary of Changes

This specification outlines the architecture and implementation details for Phase 3 and usability fixes, including page reorganization, biometrics integration, dashboard personalization, fitness route separation, wellness UX, mobile responsiveness, and a custom gamified 404 page.

---

## 2. Page & Route Reorganization

To align the codebase with `PAGE_SPECS.md` and `APP_FLOW.md` while optimizing for Lighthouse performance, we are restructuring routes and redirects:

### 2.1 Route Restructuring
1. **`/today` (Primary Daily Hub)**: Create `app/today/page.tsx` as the core landing screen for authenticated users. Port the main logging dashboard widgets here.
2. **`/dashboard` (Redirect)**: Update `app/dashboard/page.tsx` to redirect to `/today` to keep the user experience unified and simple.
3. **`/fitness` Split**:
   - `/fitness/page.tsx`: Main fitness progress hub.
   - `/fitness/log/page.tsx`: Fullscreen tactile workout logger.
   - `/fitness/history/page.tsx`: Completed workout list with edit capability.
   - `/fitness/exercises/page.tsx`: Global and custom exercise library manager.
4. **`/settings` (Merged)**: Retain tabbed layout containing Profile settings (biometrics), Preferences (theme, timezone, week start), and Backup/Export. Remove separate `/profile` and `/data` routes.

### 2.2 Root Redirection Update
- Modify the redirect in `app/page.tsx` for logged-in users from `/dashboard` to `/today`.

---

## 3. Database & Preferences Sync

### 3.1 Schema Adjustments
- Add a new column to `public.user_preferences`:
  ```sql
  ALTER TABLE public.user_preferences 
  ADD COLUMN dashboard_widgets JSONB DEFAULT '{"bodyComposition": true, "wellnessLog": true, "goalsTracker": true, "fitnessStatus": true, "habitsChecklist": true}'::jsonb;
  ```
- No changes to biometrics storage: `height_cm` and `weight_kg` remain in the `profiles` table and are updated via the settings profile form.

### 3.2 Server Actions
- Update `updateUserPreferences` in `app/actions/settings-actions.ts` to support writing the `dashboard_widgets` JSONB state.
- Update `getProfileAndPreferences` to fetch and return the new widget states.

---

## 4. UI/UX Details & Features

### 4.1 Dashboard Toggles
- In `/settings` (Preferences tab) and on `/today`, provide a widget visibility panel to toggle individual widgets.
- Saved visibility preferences are committed to `user_preferences.dashboard_widgets` and immediately affect the `/today` layout grid.

### 4.2 Fitness Logger & Editing
- Implement a completed session edit page at `/fitness/history` or modal to adjust sets, reps, weights, notes, and RPE post-workout.
- Recalculate total volume on update and propagate modifications to progress charts.
- **RPE Info**: Add a tooltip/info icon near the RPE 1–10 fields explaining the scale (Rate of Perceived Exertion: 10 = Max effort, 9 = 1 rep in reserve, etc.).

### 4.3 Heatmap & Progress Page Polish
- **Heatmap Tooltip**: Fix the tooltip in `app/components/progress/consistency-heatmap.tsx` to detect window boundaries and shift left when hovering over columns on the right edge.
- **Responsiveness**: Adjust Recharts and heatmaps with responsive containers (`ResponsiveContainer` width="100%") and hide trailing columns or aggregate dates dynamically on smaller screens to prevent horizontal page scrolling.

### 4.4 Wellness Logger Emoji Labels
- In `app/components/wellness/wellness-client.tsx`, append text labels to wellness emojis to define their meaning (e.g., 😞 Awful, 😐 Balanced, 😃 Energized) before they are clicked.

### 4.5 Save File Dialog ("Save As")
- In `app/components/settings/settings-client.tsx`, use the File System Access API (`window.showSaveFilePicker`) on supported browsers to trigger the native file picker and prompt the user to choose their preferred directory and filename (defaulting to `momentum_backup_YYYY-MM-DD.json`), with an anchor-tag fallback for unsupported browsers.

### 4.6 Gamified 404 Page
- Create `app/not-found.tsx` rendering a retro Dino-style Fitness Runner game written in pure client-side HTML5 canvas. The player controls a runner jumping over dumbbells, junk food, and lazy face obstacles. Keeps assets inline for zero bundle overhead and optimal load time.

---

## 5. Performance & Quality (Lighthouse Target: 90-95+)

- **Code-Splitting**: Route splitting isolates heavy components (like Recharts and the workout logger).
- **RSC**: Use React Server Components for initial fetches; hydrate only interactive elements.
- **Zero Heavy Assets**: The 404 game uses vector/canvas drawings instead of loading large PNG/GIF assets.
