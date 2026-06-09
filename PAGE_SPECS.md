# PAGE_SPECS.md

**Project:** Momentum  
**Purpose:** Detailed specification for every major page/route. This is the single source of truth for content, layout priority, data sources, and behavior per screen.

**Reference Documents:**
- **UIUX_BRIEF.md** — All visual style, glassmorphism, colors, typography, components.
- **APP_FLOW.md** — Routing, navigation, user journeys, redirects.
- **SCHEMA.md** — Data models and relationships.
- **PRD.md** — Overall priorities and success metrics.
- **PHASES.md** — When each page should be built.

**Rule:** Every page must be built according to this spec. Deviations must be documented here with justification.

---

## 1. Protected Pages (Main App)

### `/today` (Primary Daily Hub — Highest Priority)
**Purpose:** The default home. Make daily logging addictive and under 20 seconds.

**Layout (Top to Bottom):**
- Header with greeting + current date + Life Score (big prominent number + ring)
- Quick Wellness Logger (mood, energy, sleep — 3-tap inline cards)
- Due Habits section (cards with streak, quick complete button, note icon)
- Today's Workout card (if any) or "Quick Log Workout" prominent button
- Key Metrics row (weekly adherence %, longest streak, etc.)
- Recent Activity feed (last 3-4 logs)

**Behaviors:**
- Optimistic updates on all logs
- Confetti on habit streaks / milestones
- "Log Anything" floating action button
- Date picker to view past "Today" pages

---

### `/dashboard` (Optional Overview / Redirect target)
High-level summary. Can redirect to `/today` if you prefer one main home.

---

### `/habits`
- List of all active habits (grid or list) with current streak, completion rate, category tags.
- Filters: Active / Archived / By Category
- Search bar
- FAB → New Habit
- Click habit → `/habits/[id]` (detail + history + edit)

**Habit Detail (`/habits/[id]`):**
- Stats (best streak, adherence chart, total completions)
- History calendar/heatmap
- Quick log button
- Edit + Archive + Delete

---

### `/fitness`
**Main Fitness Hub:**
- Recent workouts list (cards with date, name, volume, duration)
- Summary stats (total volume this month, PR highlights, weekly chart)
- "Start Empty Session" + "Browse Templates" prominent buttons
- Exercise Library quick access

**`/fitness/log`** (Workout Logger):
- Workout name (auto or manual)
- Add exercises (searchable from library + custom)
- Per exercise: Sets with smart fields (weight/bodyweight/timed toggles — see previous weight discussion)
- Live volume + duration counter
- Rest timer per set
- Finish → Save + redirect to fitness with success

**`/fitness/history`** — Calendar + filters + detailed past workouts (with edit capability)

**`/fitness/exercises`** — Manage global + custom exercise library

---

### `/wellness`
- Calendar heatmap for mood/energy/sleep
- Trend charts (mood over time, sleep quality, correlations)
- Recent entries list
- Quick entry button (same as on Today page)

---

### `/insights` (Phase 3 Star Feature)
- Overall Life Score trend
- Key Correlations (top 3-5 insights with explanations)
- Weekly/Monthly Report cards
- Deep dive sections (Habits adherence, Strength progression, Sleep vs Energy, etc.)
- Export report button

**Make this page impressive** — this is what makes Momentum stand out.

---

### `/progress`
Dedicated charts hub:
- Adherence over time
- Strength progression (per exercise or muscle group)
- Body measurements timeline + charts
- Volume trends
- Filters by date range and category

---

### `/goals`
- List of active + completed goals
- Progress rings + projected completion
- Create new goal form
- Goal detail view with history

---

### `/profile`
- Basic info (name, avatar, bio, height/weight)
- Quick stats summary
- Edit profile

### `/settings`
**Tabs or Sections:**
- Account (connected to Clerk)
- Preferences (theme, timezone, week start, notifications)
- Data Management (Export all data, Delete account)
- Appearance (extra theme options if any)
- About / Legal

---

### `/data` (Export / Advanced)
- Export options (JSON, CSV, specific modules)
- Import (future)
- Data health summary

---

## 2. Auth & Public Pages

- `/login`, `/register` — Clean, branded, use Clerk components styled to match glassmorphism.
- Landing `/` (if kept) — Marketing page with strong CTA to sign up. Minimal for portfolio.

---

## 3. Error & Utility Pages

- **404** — Friendly, with "Back to Today" button + illustration.
- Error boundary fallback — Calm message + retry + report issue.

---

## 4. Cross-Cutting Rules for All Pages

- Loading skeletons everywhere
- Empty states with clear CTAs
- Mobile responsiveness (test on real device)
- Optimistic updates + proper error recovery
- Keyboard accessibility
- Consistent card padding, glass effects, and button styles (per UIUX_BRIEF)
- All data-heavy pages must handle 1+ year of data gracefully

---

**Maintenance Rule:**  
When you (or the agent) add a new route or significantly change a page, update this file immediately.

This document + **APP_FLOW.md** together define the complete frontend specification.