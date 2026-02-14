# Theme System - Visual Reference Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    App (app/layout.tsx)                 │
├─────────────────────────────────────────────────────────┤
│                   <ThemeProvider>                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Fetches theme from /api/theme                    │  │
│  │  Applies CSS variables to document                │  │
│  │  Provides useTheme() hook                         │  │
│  ├───────────────────────────────────────────────────┤  │
│  │             <AuthProvider>                        │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │      <ToastProvider>                        │  │  │
│  │  │  ┌───────────────────────────────────────┐  │  │  │
│  │  │  │       Application Content              │  │  │  │
│  │  │  │  (All components can use useTheme())  │  │  │  │
│  │  │  └───────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

### On App Load

```
1. App starts
   ↓
2. ThemeProvider mounts
   ↓
3. Check localStorage for cached theme
   ├─ YES → Use cached (skip API call)
   ├─ NO → Fetch from API
   ↓
4. GET /api/theme?store_id={storeId}
   ↓
5. Validate theme response
   ├─ VALID → Use it
   ├─ INVALID → Use default theme
   ├─ ERROR → Use default theme
   ↓
6. Apply theme as CSS variables
   ├─ document.documentElement.style.setProperty('--color-primary', '#2563eb')
   ├─ document.documentElement.style.setProperty('--color-secondary', '#9333ea')
   ├─ ... (18 total)
   ↓
7. Cache in localStorage
   ↓
8. Set isLoading = false
   ↓
9. Render components
   ↓
10. Components use Tailwind or getCSSVariable()
```

### In Components

```
Component renders
   ↓
Call useTheme() hook
   ↓
Access theme, getColor(), getCSSVariable()
   ↓
Render with theme colors:
   - Option 1: Tailwind classes (bg-primary, text-secondary)
   - Option 2: CSS variables (getCSSVariable('primary'))
   - Option 3: getColor() for JS access
```

## Color Mapping

### From API Response
```json
{
  "colors": {
    "primary": {
      "light": "#2563eb",   ← Light mode color
      "dark": "#3b82f6"     ← Dark mode color
    }
  }
}
```

### To CSS Variables
```css
--color-primary: #2563eb;  (or #3b82f6 in dark mode)
```

### To Tailwind Classes
```html
<!-- bg-primary uses var(--color-primary) -->
<div class="bg-primary">...</div>

<!-- Also works with opacity -->
<div class="bg-primary/50">...</div>
<div class="bg-primary/80">...</div>
```

### To JavaScript
```javascript
const { getColor, getCSSVariable } = useTheme();

// Direct hex value
const color = getColor('primary');  // "#2563eb"

// CSS variable
const cssVar = getCSSVariable('primary');  // "var(--color-primary)"
```

## Color Reference Grid

| Color | Usage | Light Default | Dark Default |
|-------|-------|---------------|--------------|
| `primary` | Main button, links, focus states | #2563eb | #3b82f6 |
| `primaryAlt` | Darker variant for hover | #1e40af | #1e3a8a |
| `secondary` | Secondary button, accent | #9333ea | #a855f7 |
| `secondaryAlt` | Darker secondary | #7e22ce | #6d28d9 |
| `success` | Success messages, checkmarks | #16a34a | #22c55e |
| `warning` | Warning badges, alerts | #ea580c | #f97316 |
| `error` | Error messages, delete | #dc2626 | #ef4444 |
| `info` | Info badges, tooltips | #0891b2 | #06b6d4 |
| `background` | Page/app background | #ffffff | #09090b |
| `surface` | Cards, panels, surfaces | #f8fafc | #18181b |
| `surfaceVariant` | Alternative surface | #f1f5f9 | #27272a |
| `border` | Border color | #e2e8f0 | #3f3f46 |
| `borderLight` | Light border | #f1f5f9 | #52525b |
| `text` | Primary text | #09090b | #fafafa |
| `textSecondary` | Secondary text | #52525b | #d4d4d8 |
| `textTertiary` | Tertiary text | #71717a | #a1a1aa |
| `textInverse` | Inverse text | #fafafa | #09090b |
| `accent` | Extra accent | #06b6d4 | #0891b2 |

## Usage Patterns

### Pattern 1: Semantic Colors in Tailwind
```tsx
<button className="bg-primary text-text-inverse">
  Click me
</button>
```

Maps to:
```
bg-primary → var(--color-primary) → #2563eb (light) / #3b82f6 (dark)
text-text-inverse → var(--color-textInverse) → #fafafa (light) / #09090b (dark)
```

### Pattern 2: Programmatic Color Access
```tsx
const { getColor } = useTheme();
const primaryColor = getColor('primary');  // "#2563eb"

<div style={{ backgroundColor: primaryColor }}>
```

### Pattern 3: Dynamic Styling
```tsx
const { getColor } = useTheme();
const statusColors = {
  success: getColor('success'),
  warning: getColor('warning'),
  error: getColor('error'),
};

<Badge style={{ backgroundColor: statusColors[status] }}>
```

### Pattern 4: CSS Variables in Inline Styles
```tsx
const { getCSSVariable } = useTheme();

<button
  style={{
    backgroundColor: getCSSVariable('primary'),  // var(--color-primary)
    color: getCSSVariable('textInverse'),
  }}
>
```

## Loading & Error States

### While Loading (isLoading = true)
```
Show fallback/skeleton
Use DEFAULT_THEME for colors
API timeout is 5 seconds
```

### On Error (error !== null)
```
Use DEFAULT_THEME automatically
Show error message to user (optional)
User can manually refresh with refreshTheme()
```

### Ready (isLoading = false && theme)
```
All colors from API theme
Safe to render
Can use useTheme() in components
```

## File Organization

```
app/
├── layout.tsx                    ← <ThemeProvider> wrapped here
└── globals.css

src/
├── types/
│   └── theme.ts                 ← All types defined here
├── contexts/
│   └── ThemeContext.tsx         ← useTheme() hook defined here
├── lib/
│   ├── themeService.ts          ← API calls & caching
│   └── defaultTheme.ts          ← Fallback theme & utilities
└── components/
    ├── ThemeLoading.tsx         ← Loading state components
    ├── ThemeExamples.tsx        ← 7 example patterns
    └── AdminThemeManager.tsx   ← Admin UI for theme management

constants/
└── api.ts                        ← API endpoints

tailwind.config.ts                ← Color CSS variable mappings
```

## Component Usage Timeline

```
User opens app
    ↓
ThemeProvider fetches theme (0-5 seconds)
    ↓
Components receive theme via useTheme()
    ↓
Component renders with theme colors:
    - Tailwind classes (bg-primary)
    - CSS variables (getCSSVariable('primary'))
    - getColor() calls
    ↓
User sees styled UI with store's brand colors
    ↓
Theme cached for next visit
```

## Key Concepts

### CSS Variables
Native browser feature for dynamic theming
```css
--color-primary: #2563eb;
```
Accessed in CSS/Tailwind:
```css
background-color: var(--color-primary);
```

### Semantic Colors
Named by purpose, not value:
- `primary` (not `blue`)
- `success` (not `green`)
- `error` (not `red`)

Allows different themes with same code

### Fallback Theme
Default colors used while API loads:
```javascript
DEFAULT_THEME = {
  colors: {
    primary: { light: '#2563eb', dark: '#3b82f6' },
    // ... 17 more colors
  }
}
```

### Caching Strategy
1. Check localStorage
2. If not cached: fetch from API
3. Save to localStorage
4. Next load: use cache (no API call)
5. Allow manual refresh with `refreshTheme()`

## Type Safety

### Valid Usage
```typescript
const { getColor } = useTheme();

getColor('primary');    // ✅ Valid
getColor('secondary');  // ✅ Valid
getColor('success');    // ✅ Valid
getColor('error');      // ✅ Valid
```

### Invalid Usage (Type Errors)
```typescript
getColor('blue');       // ❌ Type error - use 'primary'
getColor('green');      // ❌ Type error - use 'success'
getColor('red');        // ❌ Type error - use 'error'
```

## Performance Profile

| Operation | Time | Notes |
|-----------|------|-------|
| Apply CSS variables | <1ms | Native browser |
| Load from cache | <1ms | localStorage |
| API fetch | 1-5s | 5s timeout default |
| Theme change | <10ms | No re-renders |
| Type checking | 0ms | Compile-time only |

## Integration Checklist

- [x] ThemeProvider in app/layout.tsx
- [x] useTheme() hook available
- [x] Tailwind config updated
- [x] CSS variables mapped
- [x] Type definitions complete
- [x] API service created
- [x] Default theme provided
- [x] Loading states handled
- [x] Error handling in place
- [x] localStorage caching enabled
- [x] Examples provided
- [x] Documentation complete
- [x] Admin manager component created

## To Use In Your Components

1. Mark component as client: `'use client';`
2. Import hook: `import { useTheme } from '@/contexts/ThemeContext';`
3. Call hook: `const { theme, getColor } = useTheme();`
4. Use colors:
   - Tailwind: `className="bg-primary"`
   - JS: `getColor('primary')`

Example:
```tsx
'use client';
import { useTheme } from '@/contexts/ThemeContext';

export function Button({ children }) {
  const { getColor } = useTheme();
  return (
    <button style={{ backgroundColor: getColor('primary') }}>
      {children}
    </button>
  );
}
```

Done! Your app now has a complete dynamic theming system. 🎨
