# Dynamic Theming System Documentation

## Overview

The dynamic theming system allows your StoreCrafts multi-tenant platform to have different color themes per store without modifying components. All colors are:

- **Fetched from API** at app startup
- **Stored as CSS variables** on `document.documentElement`
- **Mapped through Tailwind** for seamless class-based usage
- **Type-safe** with strict TypeScript interfaces
- **Cached** in localStorage for fast subsequent loads
- **Fallback-enabled** with sensible defaults

## Architecture

### Components

1. **ThemeContext** (`src/contexts/ThemeContext.tsx`)
   - Global React Context for theme management
   - Provides `useTheme()` hook
   - Handles fetching, caching, and applying themes

2. **Theme Types** (`src/types/theme.ts`)
   - Strict TypeScript interfaces for all theme-related types
   - `ThemeConfig`: Complete theme configuration
   - `ColorPalette`: 18 semantic color definitions
   - `ThemeContextType`: Full API surface

3. **Theme Service** (`src/lib/themeService.ts`)
   - Handles API communication with theme endpoint
   - Manages localStorage caching
   - Provides theme validation

4. **Default Theme** (`src/lib/defaultTheme.ts`)
   - Fallback theme used while loading
   - Color utilities for applying themes
   - CSS variable generation

5. **Tailwind Config** (`tailwind.config.ts`)
   - Maps all theme colors to CSS variables
   - Enables `bg-primary`, `text-secondary`, etc.
   - Extends default Tailwind theme

## Quick Start

### 1. Provider Setup (Already Done)

The app is wrapped with `ThemeProvider` in `app/layout.tsx`:

```tsx
<ThemeProvider>
  <AuthProvider>
    <ToastProvider>
      {children}
    </ToastProvider>
  </AuthProvider>
</ThemeProvider>
```

### 2. Use in Components

Use the `useTheme()` hook in any client component:

```tsx
'use client';

import { useTheme } from '@/contexts/ThemeContext';

export function MyComponent() {
  const { theme, getColor, getCSSVariable } = useTheme();

  return (
    <div 
      className="px-4 py-2 rounded-lg"
      style={{
        backgroundColor: getColor('primary'),
        color: getColor('textInverse'),
      }}
    >
      Click me!
    </div>
  );
}
```

### 3. Use with Tailwind Classes

No inline styles needed - use Tailwind classes:

```tsx
export function Card() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 text-text">
      <h3 className="text-text font-bold mb-2">Title</h3>
      <p className="text-text-secondary">Description</p>
    </div>
  );
}
```

## Color Reference

### Semantic Colors

All colors are semantic, not literal (e.g., `primary`, not `blue`):

| Color | Purpose | Class Name | CSS Variable |
|-------|---------|-----------|--------------|
| `primary` | Main brand color | `bg-primary` | `var(--color-primary)` |
| `primaryAlt` | Darker variant | `bg-primary-alt` | `var(--color-primaryAlt)` |
| `secondary` | Secondary accent | `bg-secondary` | `var(--color-secondary)` |
| `success` | Success/positive state | `bg-success` | `var(--color-success)` |
| `warning` | Warning/caution state | `bg-warning` | `var(--color-warning)` |
| `error` | Error/danger state | `bg-error` | `var(--color-error)` |
| `info` | Information state | `bg-info` | `var(--color-info)` |
| `background` | Page/app background | `bg-background` | `var(--color-background)` |
| `surface` | Card/surface background | `bg-surface` | `var(--color-surface)` |
| `text` | Primary text | `text-text` | `var(--color-text)` |
| `textSecondary` | Secondary text | `text-text-secondary` | `var(--color-textSecondary)` |
| `accent` | Additional accent | `bg-accent` | `var(--color-accent)` |

## API Specification

### Theme Endpoint

```
GET /api/theme?store_id={storeId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "theme-001",
    "name": "acplus",
    "displayName": "ACPlus Theme",
    "colors": {
      "primary": { "light": "#2563eb", "dark": "#3b82f6" },
      "secondary": { "light": "#9333ea", "dark": "#a855f7" },
      // ... all 18 colors
    },
    "isDarkMode": false,
    "createdAt": "2026-01-15T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  }
}
```

### Update Endpoint

```
PUT /api/theme?store_id={storeId}
```

**Body:**
```json
{
  "id": "theme-001",
  "name": "acplus",
  "displayName": "ACPlus Theme",
  "colors": { /* ... */ },
  "isDarkMode": false
}
```

## useTheme() Hook

Complete API reference:

```tsx
const {
  // State
  theme,          // ThemeConfig | null
  isLoading,      // boolean - true while fetching
  error,          // string | null - error message if fetch fails

  // Methods
  setTheme,       // (theme: ThemeConfig) => void
  updateTheme,    // (updates: Partial<ThemeConfig>) => void
  getColor,       // (name: ColorKey, mode?: 'light'|'dark') => string
  getCSSVariable, // (name: ColorKey) => string (returns 'var(...)')
  resetTheme,     // () => void - reset to default
  refreshTheme,   // (options?: ThemeFetchOptions) => Promise<void>
} = useTheme();
```

## Code Examples

### Example 1: Inline Styling

```tsx
export function Button({ children }) {
  const { getColor } = useTheme();

  return (
    <button
      style={{
        backgroundColor: getColor('primary'),
        color: getColor('textInverse'),
      }}
      className="px-4 py-2 rounded-lg font-semibold"
    >
      {children}
    </button>
  );
}
```

### Example 2: Tailwind Classes

```tsx
export function Card({ children, title }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-lg">
      <h2 className="text-text font-bold mb-4">{title}</h2>
      <p className="text-text-secondary">{children}</p>
    </div>
  );
}
```

### Example 3: Conditional Styling

```tsx
export function Alert({ type, message }) {
  const { getColor } = useTheme();
  
  const colors = {
    success: getColor('success'),
    warning: getColor('warning'),
    error: getColor('error'),
  };

  return (
    <div
      className="p-4 rounded-lg"
      style={{
        backgroundColor: colors[type],
      }}
    >
      {message}
    </div>
  );
}
```

### Example 4: Complex Components

```tsx
export function Dashboard() {
  const { theme, getColor } = useTheme();

  if (!theme) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Widgets using theme colors */}
      <div className="bg-surface p-6 rounded-lg border border-border">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: getColor('success') }}
          />
          <span className="text-text font-semibold">Active</span>
        </div>
      </div>
    </div>
  );
}
```

## Provider Configuration

The `ThemeProvider` accepts several props:

```tsx
<ThemeProvider
  fetchOnMount={true}           // Auto-fetch theme on mount
  fallbackTheme={DEFAULT_THEME} // Fallback while loading
  getStoreId={() => storeId}    // Get store ID for API call
>
  {children}
</ThemeProvider>
```

## Loading States

### Show content only when theme is loaded:

```tsx
import { ThemeReady } from '@/components/ThemeLoading';

export function App() {
  return (
    <ThemeReady>
      <Dashboard />
    </ThemeReady>
  );
}
```

### Show loading while theme loads:

```tsx
import { ThemeLoading } from '@/components/ThemeLoading';

export function App() {
  return (
    <ThemeLoading>
      <Dashboard />
    </ThemeLoading>
  );
}
```

### Handle errors:

```tsx
import { ThemeError } from '@/components/ThemeLoading';

export function App() {
  return (
    <>
      <ThemeError>
        <div className="text-error">Failed to load theme</div>
      </ThemeError>
      <Dashboard />
    </>
  );
}
```

## Best Practices

### ✅ DO

- Use semantic color names (`primary`, `success`, not `blue`, `green`)
- Use Tailwind classes where possible (`bg-primary`, `text-secondary`)
- Store theme in context, not prop-drilling
- Use `getCSSVariable()` for dynamic inline styles
- Let components be theme-agnostic
- Cache theme in localStorage
- Validate theme from API

### ❌ DON'T

- Hardcode colors in components (`#2563eb`, `#16a34a`)
- Use dynamic Tailwind classes (`className={isDark ? 'bg-black' : 'bg-white'}`)
- Import colors from files - they're in CSS variables
- Assume light mode - respect theme configuration
- Skip validation of theme data from API
- Store colors in React state (use CSS variables)

## Type Safety

The system is fully typed:

```tsx
// This is type-safe
const color: string = theme.colors.primary.light; // ✅

// This will error - typo
const color = theme.colors.primry.light; // ❌ Property 'primry' does not exist

// Type-safe color keys
type ColorName = keyof ColorPalette; // 'primary' | 'secondary' | ...
```

## Performance Considerations

1. **CSS Variables**: Applied once to document.documentElement
2. **Caching**: Theme cached in localStorage, only fetched once per app
3. **No Re-renders**: Changing theme doesn't re-render entire tree
4. **Timeout**: API calls have 5-second timeout, falls back to default
5. **Type Checking**: Zero runtime overhead - types are compile-time only

## Integration with Other Systems

### With Authentication

```tsx
// In AuthContext, you can get store ID from JWT
const getStoreId = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  const payload = jwtDecode(token);
  return payload.store_id;
};

<ThemeProvider getStoreId={getStoreId}>
  {children}
</ThemeProvider>
```

### With Notifications

```tsx
// Use theme colors in toast notifications
const { getColor } = useTheme();

toast.success('Success!', {
  style: {
    backgroundColor: getColor('success'),
    color: getColor('textInverse'),
  },
});
```

## Troubleshooting

### Theme not loading

1. Check API endpoint is configured in `constants/api.ts`
2. Verify store_id is being passed to API
3. Check browser Network tab for API response
4. Verify theme JSON structure matches `ThemeConfig` type

### Colors not applying

1. Ensure component uses `useTheme()` hook
2. Check CSS variables are set: `document.documentElement.style`
3. Verify Tailwind build includes component files
4. Make sure component is marked with `'use client'` directive

### Performance issues

1. Theme is cached - only fetch once per app load
2. CSS variables are native browser feature - very fast
3. useTheme hook is memoized - no unnecessary re-renders
4. Consider lazy loading heavy components

## File Structure

```
src/
├── contexts/
│   └── ThemeContext.tsx      # Main context & provider
├── lib/
│   ├── themeService.ts       # API communication
│   └── defaultTheme.ts       # Default theme & utilities
├── types/
│   └── theme.ts              # TypeScript definitions
└── components/
    ├── ThemeLoading.tsx      # Loading state components
    └── ThemeExamples.tsx     # Example implementations

tailwind.config.ts            # Tailwind theme config
```

## Migration Guide

If migrating from hardcoded colors:

```tsx
// Before
<div className="bg-blue-600 text-white">

// After
<div className="bg-primary text-text-inverse">
```

```tsx
// Before
style={{ color: '#2563eb' }}

// After
const { getCSSVariable } = useTheme();
style={{ color: getCSSVariable('primary') }}
```

## Future Enhancements

Possible additions:

- Theme preview component
- Admin UI for theme customization
- Multi-theme support (light/dark toggle)
- Theme scheduling (auto-switch at times)
- Theme animations/transitions
- Per-component theme overrides
- Export theme as CSS/JSON
