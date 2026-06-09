# PHASES.md

**Project:** Momentum  
**Detailed Development Phases**

This document defines the order and priorities for building every major page and feature. It works together with **PAGE_SPECS.md**, **APP_FLOW.md**, **UIUX_BRIEF.md**, and **PRD.md**.

---

## Phase 0: Foundation (1-3 days)

**Goal:** Rock-solid base.

**Deliverables:**
- Next.js 16 + TypeScript + Tailwind + shadcn/ui setup
- Clerk authentication + Custom Session Tokens
- Supabase integration + updated SCHEMA.md with RLS
- Global layout, theme provider (dark default), glassmorphism foundation
- Protected route middleware
- Basic sidebar + mobile bottom navigation skeleton
- Toast system, error boundary, loading skeletons
- Initial seeding script

**Success Criteria:**
- Login/register flow works perfectly
- Protected routes redirect correctly (`/` → `/today` for auth users)
- Clean, consistent foundation matching UIUX_BRIEF

---

## Phase 1: Core Logging (5-8 days)

**Goal:** Make daily usage frictionless and addictive.

**Pages & Features to Build:**
- `/today` — Daily Hub (highest priority)
- `/habits`, `/habits/new`, `/habits/[id]`
- Basic fitness logging (`/fitness/log`)
- Wellness quick logger (integrated in Today + dedicated page)
- Basic `/dashboard` (can be minimal)

**Key Focus:**
- Habit CRUD + flexible recurrence + quick logging
- Workout logger with smart weight/bodyweight/timed sets
- Optimistic updates everywhere
- Daily logging loop under 20 seconds

---

## Phase 2: Progress & Visualization (7-10 days)

**Goal:** Turn data into motivation.

**Pages & Features to Build:**
- `/fitness` (hub with recent workouts)
- `/fitness/history`
- `/fitness/exercises`
- Full workout detail + **edit capability**
- `/progress` — Charts hub
- Body measurements tracker
- Heatmaps, adherence charts, strength progression, volume trends
- PR detection and 1RM estimates

**Key Focus:**
- Smart volume calculation (bodyweight vs loaded)
- Excellent data visualizations (Tremor + Recharts)
- Performance with large datasets

---

## Phase 3: Insights, Polish & PWA (7-10 days) ← You are here

**Goal:** Make the app feel intelligent and production-grade.

**Pages & Features to Build:**
- `/insights` — Correlation engine + weekly/monthly reports (make this exceptional)
- `/wellness` — Full calendar + trend views
- `/goals` — Goal setting with projections
- Advanced sidebar (collapsible, hover behavior, tooltips, logo handling)
- Full PWA setup (manifest, service worker, offline support for logging)
- Polish pass: micro-interactions, empty states, loading states, error states
- Accessibility audit
- `/settings` and `/profile`
- `/data` (export)

**Key Focus:**
- Meaningful insights and correlations
- Premium feel across all pages
- Mobile excellence + PWA install prompt

---

## Phase 4: Advanced Features & Demo Readiness (5-8 days)

**Pages & Features to Build:**
- Landing page (`/`) — Full marketing version with screenshots
- Workout templates and routines
- Advanced data management (import hints, bulk actions)
- Demo mode with rich seeded data
- Final SEO, meta tags, and Open Graph images
- Comprehensive README with screenshots and demo video

**Key Focus:**
- Make the public landing page impressive
- Ensure every page in APP_FLOW.md and PAGE_SPECS.md is complete

---

## Phase 5: Battle Testing & Launch (Minimum 14 days)

**Goal:** Ship something exceptional that you actually use.

**Deliverables:**
- Dogfood the entire app daily for 2+ weeks
- Ruthlessly fix every friction point discovered
- Add tests for critical paths (auth, logging, volume calculations)
- Performance audit and optimizations
- Final deployment + custom domain
- High-quality portfolio assets (screenshots, Loom video)
- Update all documentation files

**Success Criteria:**
- Zero major bugs
- You continue using Momentum daily after the project "ends"
- A senior developer would say “This feels like a real product”

---

## Overall Timeline
**Realistic total:** 5–8 weeks (part-time) if scope is controlled. Do **not** extend phases because you’re adding new features. Cut scope instead.


**Page Building Order Summary:**
- Phase 1: `/today`, Habits, basic Fitness logging, Wellness quick
- Phase 2: Full Fitness suite, Progress/Charts
- Phase 3: Insights, Goals, Wellness full, Settings, Sidebar polish, PWA
- Phase 4: Landing page + remaining routes

**Golden Rule:** Never build a page in isolation. Always reference:
1. PAGE_SPECS.md
2. UIUX_BRIEF.md  
3. APP_FLOW.md

Before starting any page, read its spec first.

---

**Maintenance:** Revisit this file at the start of every phase. Update actual completion dates and lessons learned in NOTES.md.
