# Momentum Settings & Public Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement route reorganization, public landing page with SEO Schema and live interactive widget simulation, tabbed settings page with JSON/CSV export, and app-wide logo replacement.

**Architecture:** Move existing dashboard to `/dashboard`. Create a new `/` landing route that auto-redirects authenticated users. Build `app/settings/page.tsx` using a tabbed structure. Integrate `/logo.svg` as the favicon and sidebar brand asset.

**Tech Stack:** Next.js 16 (App Router), Clerk, Supabase, Tailwind CSS v4, Lucide React, canvas-confetti.

---

### Task 1: Route Reorganization & Navigation Update

**Files:**
- Create: `app/dashboard/page.tsx`
- Modify: `app/components/navigation.tsx`
- Modify: `app/components/layout-shell.tsx` (ensure navigation routes match)

- [ ] **Step 1: Move current dashboard page**
  Create `app/dashboard/page.tsx` and copy the entire contents of the current `app/page.tsx` into it. Delete `app/page.tsx`.

- [ ] **Step 2: Update navigation links**
  Modify [app/components/navigation.tsx](file:///home/redmane/Documents/Port%20Sites/Category%205/Momentum/app/components/navigation.tsx#L14-L20) to point "Dashboard" to `/dashboard`:
  ```typescript
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Habits', href: '/habits', icon: CheckSquare },
    { name: 'Fitness', href: '/fitness', icon: Dumbbell },
    { name: 'Wellness', href: '/wellness', icon: Heart },
    { name: 'Progress', href: '/progress', icon: TrendingUp },
  ];
  ```

- [ ] **Step 3: Update navigation logo link**
  Modify the sidebar logo brand click handler in `app/components/navigation.tsx` to redirect to `/dashboard` instead of `/` if logged in.

- [ ] **Step 4: Commit route changes**
  ```bash
  git add app/dashboard/page.tsx app/components/navigation.tsx
  git commit -m "refactor(routes): relocate dashboard to /dashboard and update navigation mapping"
  ```

---

### Task 2: App-Wide Brand Logo & Favicon Replacement

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/components/navigation.tsx`

- [ ] **Step 1: Add logo metadata to layout**
  Update [app/layout.tsx](file:///home/redmane/Documents/Port%20Sites/Category%205/Momentum/app/layout.tsx#L20-L23) to define `/logo.svg` as the shortcut icon:
  ```typescript
  export const metadata: Metadata = {
    title: "Momentum",
    description: "Personal operating system for habits, fitness, and wellness tracker",
    icons: {
      icon: "/logo.svg",
    },
  };
  ```

- [ ] **Step 2: Update sidebar logo markup**
  Replace the letter "M" box in [app/components/navigation.tsx](file:///home/redmane/Documents/Port%20Sites/Category%205/Momentum/app/components/navigation.tsx#L88-L90) with the new SVG logo:
  ```typescript
  <img 
    src="/logo.svg" 
    alt="Momentum Logo" 
    className="w-8 h-8 rounded-xl bg-brand-success/5 border border-brand-success/20 p-1 object-contain transition-all" 
  />
  ```

- [ ] **Step 3: Commit logo replacements**
  ```bash
  git add app/layout.tsx app/components/navigation.tsx
  git commit -m "style(brand): replace default icons and sidebar branding with new Momentum logo"
  ```

---

### Task 3: Tabbed Settings Page & Data Export Actions

**Files:**
- Create: `app/actions/export-actions.ts`
- Create: `app/settings/page.tsx`
- Create: `app/components/settings/settings-client.tsx`

- [ ] **Step 1: Implement data export server action**
  Create file `app/actions/export-actions.ts`:
  ```typescript
  'use server';

  import { auth } from '@clerk/nextjs/server';
  import { createSupabaseServiceClient } from '@/app/lib/supabase-server';

  export async function exportUserData() {
    try {
      const { userId } = await auth();
      if (!userId) return { error: 'Not authenticated' };

      const supabase = createSupabaseServiceClient();

      const [habitsRes, logsRes, workoutsRes, wellnessRes] = await Promise.all([
        supabase.from('habits').select('*').eq('clerk_id', userId),
        supabase.from('habit_logs').select('*').eq('clerk_id', userId),
        supabase.from('workouts').select('*').eq('clerk_id', userId),
        supabase.from('wellness_entries').select('*').eq('clerk_id', userId),
      ]);

      return {
        success: true,
        data: {
          habits: habitsRes.data || [],
          logs: logsRes.data || [],
          workouts: workoutsRes.data || [],
          wellness: wellnessRes.data || [],
        }
      };
    } catch (err) {
      console.error('Error exporting data:', err);
      return { error: 'Failed to compile export data' };
    }
  }
  ```

- [ ] **Step 2: Create Settings Client component**
  Create file `app/components/settings/settings-client.tsx` with tabs: Profile, Preferences, Data & Export. Provide data generation hooks converting JSON arrays to CSV downloads.

- [ ] **Step 3: Create Settings Server page**
  Create file `app/settings/page.tsx` to handle authentication guards and render `SettingsClient`.

- [ ] **Step 4: Commit settings and export changes**
  ```bash
  git add app/actions/export-actions.ts app/settings/page.tsx app/components/settings/settings-client.tsx
  git commit -m "feat(settings): implement tabbed settings page with CSV and JSON data export"
  ```

---

### Task 4: Public Landing Page & SEO JSON-LD

**Files:**
- Create: `app/page.tsx`
- Create: `app/components/landing/interactive-preview.tsx`

- [ ] **Step 1: Create interactive simulator widget**
  Create file `app/components/landing/interactive-preview.tsx`.
  This is a mock dashboard:
  - Tracks local state for completed habits, wellness log status, and a simulated Life Score ring.
  - Clicking a habit checks it, plays confetti (using `canvas-confetti` if installed, or custom SVGs), and dynamically boosts the score ring.

- [ ] **Step 2: Create public landing page route**
  Create file `app/page.tsx`:
  - Check auth using Clerk. If authenticated, auto-redirect immediately:
    ```typescript
    const { userId } = await auth();
    if (userId) {
      redirect('/dashboard');
    }
    ```
  - Implement a premium watch-OS styling single-page landing.
  - Embed `WebApplication` JSON-LD schema in a `<script>` block:
    ```html
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Momentum",
          "applicationCategory": "HealthApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires HTML5",
          "description": "Your personal operating system for habits, fitness, and wellness tracking.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })
      }}
    />
    ```
  - Embed the `InteractivePreview` widget in the mock dashboard features section.

- [ ] **Step 3: Commit landing page**
  ```bash
  git add app/page.tsx app/components/landing/interactive-preview.tsx
  git commit -m "feat(landing): build SEO optimized public landing page with live simulated demo widget"
  ```
