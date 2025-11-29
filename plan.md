# UI Improvement Plan: Modern Minimal Design + Dark/Light Theme

## Overview

Improve the Footwear Management System UI with a modern minimal design aesthetic and implement a complete dark/light theme system. The sidebar will remain dark in both themes, with system-default theme detection and user toggle capability.

## User Preferences

- **UI Style**: Modern Minimal (clean, subtle shadows, whitespace)
- **Sidebar Style**: Keep dark in both themes
- **Theme Default**: System default with toggle override
- **Priority**: Dashboard first, then propagate to all pages

---

## Phase 1: Theme Infrastructure

### 1.1 Create Theme Context Provider

**File**: `lib/contexts/theme-context.tsx` (new)
- Create React context for theme state management
- Implement `useTheme()` hook
- Handle system preference detection via `prefers-color-scheme`
- Persist user preference to localStorage
- Apply `dark` class to `<html>` element for Tailwind dark mode

### 1.2 Update CSS Variables for Dark Mode

**File**: `app/globals.css`
- Expand `:root` variables with semantic color tokens
- Add `.dark` class variants for all colors:
  - Background: `#f8fafc` (light) / `#0f172a` (dark)
  - Foreground/text: `#0f172a` (light) / `#f1f5f9` (dark)
  - Card backgrounds: white (light) / `#1e293b` (dark)
  - Borders: `gray-100` (light) / `slate-700` (dark)
  - Surface colors for elevated elements
- Update scrollbar colors for dark mode
- Update glass effects for dark mode

### 1.3 Integrate Theme Provider

**File**: `app/layout.tsx`
- Wrap app with `ThemeProvider`
- Add script to prevent flash of wrong theme (FOUC prevention)

---

## Phase 2: Header & Theme Toggle

### 2.1 Add Theme Toggle Button

**File**: `components/layout/header.tsx`
- Uncomment and implement the theme toggle button (lines 69-72 currently commented)
- Add Sun/Moon icons that animate on toggle
- Position in header actions area
- Accessible button with proper ARIA labels

### 2.2 Update Header for Dark Mode

**File**: `components/layout/header.tsx`
- Update background: `bg-white/80` → `bg-white/80 dark:bg-slate-900/80`
- Update border: `border-gray-100` → `dark:border-slate-700`
- Update search input colors for dark mode
- Update text colors and icon colors
- Update user avatar section styling

---

## Phase 3: Core UI Components Update

### 3.1 Card Component

**File**: `components/ui/card.tsx`
- Update all variants with dark mode classes:
  - `bg-white` → `bg-white dark:bg-slate-800`
  - `border-gray-100` → `dark:border-slate-700`
  - `text-gray-900` → `dark:text-gray-100`
  - `text-gray-500` → `dark:text-gray-400`
- Update CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Modern minimal: reduce shadow intensity, increase border-radius consistency

### 3.2 Button Component

**File**: `components/ui/button.tsx`
- Update outline and ghost variants for dark mode
- Ensure gradient variants look good in both themes
- Update focus ring colors for dark mode

### 3.3 Badge Component

**File**: `components/ui/badge.tsx`
- Update all color variants with dark mode equivalents
- Ensure contrast ratios meet accessibility standards

### 3.4 Input Component

**File**: `components/ui/input.tsx`
- Update background, border, and text colors for dark mode
- Update placeholder colors
- Update focus states

### 3.5 Stats Card Component

**File**: `components/features/dashboard/stats-card.tsx`
- Update card background for dark mode
- Adjust glow effects for dark backgrounds
- Ensure text contrast is maintained
- Keep colorful gradient icons (they work in both themes)

---

## Phase 4: Layout Components

### 4.1 Client Layout

**File**: `components/layout/client-layout.tsx`
- Update main content area: `bg-gray-50` → `bg-gray-50 dark:bg-slate-900`
- Update Toaster styling for dark mode

### 4.2 Sidebar (Keep Dark)

**File**: `components/layout/sidebar.tsx`
- No changes needed - sidebar stays dark in both themes
- This provides visual consistency and navigation clarity

---

## Phase 5: Dashboard Page Improvements

### 5.1 Dashboard Page

**File**: `app/page.tsx`
- Update page header text colors for dark mode
- Modern minimal improvements:
  - Consistent spacing (use `gap-6` uniformly)
  - Subtle hover effects on cards
  - Clean typography hierarchy

### 5.2 Stats Cards Enhancement

- Use the `color` prop consistently for all stats cards
- Add subtle entrance animations (already have `stats-number` class)

---

## Phase 6: Modern Minimal Design Refinements

### 6.1 Global CSS Updates

**File**: `app/globals.css`
- Reduce shadow intensities for cleaner look
- Add softer hover transitions
- Improve focus states with subtle rings
- Update selection colors for dark mode

### 6.2 Component Refinements

- Increase whitespace in cards (padding adjustments)
- Softer border-radius (consistent `rounded-xl` usage)
- Subtle background patterns/gradients removed for cleaner look
- Improve typography spacing

---

## Implementation Order

1. **Theme Infrastructure** (Phase 1)
   - Create theme context
   - Update CSS variables
   - Integrate provider

2. **Header with Toggle** (Phase 2)
   - Add working theme toggle
   - Update header dark mode styles

3. **Core Components** (Phase 3)
   - Card, Button, Badge, Input
   - Stats Card

4. **Layout** (Phase 4)
   - Client layout dark mode
   - Keep sidebar dark

5. **Dashboard** (Phase 5)
   - Update dashboard page
   - Test complete flow

6. **Polish** (Phase 6)
   - Modern minimal refinements
   - Final testing

---

## Critical Files to Modify

| File | Purpose |
|------|---------|
| `lib/contexts/theme-context.tsx` | New - Theme provider |
| `app/layout.tsx` | Integrate theme provider |
| `app/globals.css` | CSS variables for dark mode |
| `components/layout/header.tsx` | Theme toggle + dark styles |
| `components/layout/client-layout.tsx` | Main area dark mode |
| `components/ui/card.tsx` | Dark mode variants |
| `components/ui/button.tsx` | Dark mode variants |
| `components/ui/badge.tsx` | Dark mode variants |
| `components/ui/input.tsx` | Dark mode variants |
| `components/features/dashboard/stats-card.tsx` | Dark mode + modern styling |
| `app/page.tsx` | Dashboard dark mode |

---

## Technical Approach

### Theme Detection & Persistence

```tsx
// Pseudo-code for theme context
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};
```

### Tailwind Dark Mode Strategy

- Use Tailwind's `class` strategy for dark mode
- Apply `dark:` prefix to all theme-dependent styles
- Example: `bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100`

### FOUC Prevention

Add inline script in `<head>` to apply theme class before render:

```html
<script>
  (function() {
    const theme = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  })();
</script>
```

---

## Expected Outcome

After implementation:

1. Users will see theme matching their OS preference by default
2. A toggle in the header allows switching between light/dark modes
3. Preference is saved and persists across sessions
4. Sidebar remains dark for visual consistency
5. All dashboard elements adapt properly to both themes
6. Modern minimal aesthetic with clean lines and subtle shadows
