# Theme System Integration Quick Start

## 5-Minute Setup

### Step 1: Verify API Endpoint

Make sure your backend has a theme endpoint. Expected response:

```bash
GET /api/theme?store_id={storeId}
```

Should return:
```json
{
  "success": true,
  "data": {
    "id": "theme-123",
    "name": "acplus",
    "displayName": "ACPlus Theme",
    "colors": {
      "primary": { "light": "#2563eb", "dark": "#3b82f6" },
      "secondary": { "light": "#9333ea", "dark": "#a855f7" },
      // ... 16 more colors
    },
    "isDarkMode": false
  }
}
```

### Step 2: Provider Already Integrated

The `ThemeProvider` is already added to `app/layout.tsx`. You're ready to use it!

### Step 3: Start Using in Components

```tsx
'use client';

import { useTheme } from '@/contexts/ThemeContext';

export function MyComponent() {
  const { theme, isLoading, getColor } = useTheme();

  if (isLoading) return <div>Loading theme...</div>;
  if (!theme) return <div>Failed to load theme</div>;

  return (
    <div
      className="p-4 rounded-lg"
      style={{ backgroundColor: getColor('primary') }}
    >
      Welcome!
    </div>
  );
}
```

## Common Patterns

### Pattern 1: Button with Theme Color

```tsx
'use client';

import { useTheme } from '@/contexts/ThemeContext';

export function Button({ children }) {
  const { getCSSVariable } = useTheme();

  return (
    <button
      style={{
        backgroundColor: getCSSVariable('primary'),
        color: getCSSVariable('textInverse'),
      }}
      className="px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
    >
      {children}
    </button>
  );
}
```

### Pattern 2: Card with Tailwind

```tsx
export function Card({ title, children }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="text-text font-bold mb-2">{title}</h3>
      <p className="text-text-secondary">{children}</p>
    </div>
  );
}
```

### Pattern 3: Status Badge

```tsx
export function Badge({ status }) {
  const { getColor } = useTheme();

  const statusColors = {
    success: getColor('success'),
    warning: getColor('warning'),
    error: getColor('error'),
  };

  return (
    <span
      className="px-3 py-1 rounded-full text-sm font-semibold text-white"
      style={{ backgroundColor: statusColors[status] }}
    >
      {status.toUpperCase()}
    </span>
  );
}
```

## Available Color Names

Use these semantic names in your components:

```
primary, primaryAlt
secondary, secondaryAlt
success, warning, error, info
background, surface, surfaceVariant
border, borderLight
text, textSecondary, textTertiary, textInverse
accent, accentAlt
```

## Tailwind Class Names

All colors are available as Tailwind classes:

```tsx
<div className="bg-primary">          {/* primary color bg */}
<div className="text-secondary">      {/* secondary color text */}
<div className="border-border">       {/* border color */}
<div className="bg-success/20">       {/* success with opacity */}
```

## Loading State

Components should handle loading gracefully:

```tsx
export function Dashboard() {
  const { theme, isLoading } = useTheme();

  if (isLoading) {
    return <div>Loading theme...</div>;
  }

  if (!theme) {
    return <div>Failed to load theme</div>;
  }

  return <div>Theme loaded: {theme.displayName}</div>;
}
```

## No Hardcoded Colors

❌ **BAD - Hardcoded colors:**
```tsx
<div style={{ backgroundColor: '#2563eb' }} />
<div className="bg-blue-600" />
```

✅ **GOOD - Theme colors:**
```tsx
const { getColor } = useTheme();
<div style={{ backgroundColor: getColor('primary') }} />
<div className="bg-primary" />
```

## Type Safety

Everything is typed - you'll get autocomplete and errors for typos:

```tsx
const { getColor } = useTheme();

getColor('primary');    // ✅ Valid
getColor('primaryAlt'); // ✅ Valid
getColor('blue');       // ❌ TypeScript Error
getColor('primar');     // ❌ TypeScript Error
```

## Files Created

| File | Purpose |
|------|---------|
| `src/types/theme.ts` | TypeScript type definitions |
| `src/contexts/ThemeContext.tsx` | React Context & Provider |
| `src/lib/themeService.ts` | API communication & caching |
| `src/lib/defaultTheme.ts` | Default theme & utilities |
| `src/components/ThemeLoading.tsx` | Loading state components |
| `src/components/ThemeExamples.tsx` | Example implementations |
| `tailwind.config.ts` | Tailwind theme configuration |
| `THEME_DOCUMENTATION.md` | Complete documentation |

## What Happens Automatically

1. **On App Load**: `ThemeProvider` fetches theme from API
2. **Default Used**: While loading, default theme is applied
3. **CSS Variables Set**: Colors applied to `document.documentElement`
4. **Cached**: Theme saved to localStorage for next load
5. **Components Updated**: All components using `useTheme()` render with theme

## API Configuration

Update `constants/api.ts` if your endpoint is different:

```ts
export const ENDPOINTS = {
  THEME: {
    GET: '/theme',      // ← Change if needed
    UPDATE: '/theme',   // ← Change if needed
  },
};
```

## Testing Locally

To test with a mock theme:

```tsx
import { DEFAULT_THEME } from '@/lib/defaultTheme';

<ThemeProvider fallbackTheme={DEFAULT_THEME}>
  <App />
</ThemeProvider>
```

## Performance

- ⚡ CSS variables - native browser support
- 💾 Cached in localStorage - one API call per app load
- 🔄 No re-renders - theme applied directly to DOM
- 📝 Type-checked at compile time - zero runtime overhead

## Next Steps

1. Implement theme endpoint on backend
2. Review `THEME_DOCUMENTATION.md` for complete API
3. Check `ThemeExamples.tsx` for example components
4. Start using theme colors in your components!

## Need Help?

- Full docs: See `THEME_DOCUMENTATION.md`
- Examples: See `src/components/ThemeExamples.tsx`
- Types: See `src/types/theme.ts`
- Service: See `src/lib/themeService.ts`
