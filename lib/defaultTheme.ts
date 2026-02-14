/**
 * Default Theme Configuration
 * Used as fallback while theme is loading
 */

import type { FallbackTheme } from '@/types/theme';

export const DEFAULT_THEME: FallbackTheme = {
  id: 'default',
  name: 'default',
  displayName: 'Default Theme',
  description: 'Default fallback theme',
  isDefault: true,
  colors: {
    // Primary colors - Blue
    primary: {
      light: '#2563eb', // blue-600
      dark: '#3b82f6',  // blue-500
    },
    primaryAlt: {
      light: '#1e40af', // blue-800
      dark: '#1e3a8a',  // blue-900
    },

    // Secondary colors - Purple
    secondary: {
      light: '#9333ea', // purple-600
      dark: '#a855f7',  // purple-500
    },
    secondaryAlt: {
      light: '#7e22ce', // purple-800
      dark: '#6d28d9',  // purple-700
    },

    // Semantic colors
    success: {
      light: '#16a34a', // green-600
      dark: '#22c55e',  // green-500
    },
    warning: {
      light: '#ea580c', // orange-600
      dark: '#f97316',  // orange-500
    },
    error: {
      light: '#dc2626', // red-600
      dark: '#ef4444',  // red-500
    },
    info: {
      light: '#0891b2', // cyan-600
      dark: '#06b6d4',  // cyan-500
    },

    // Neutral colors
    background: {
      light: '#ffffff',
      dark: '#09090b',
    },
    surface: {
      light: '#f8fafc', // slate-50
      dark: '#18181b',  // zinc-900
    },
    surfaceVariant: {
      light: '#f1f5f9', // slate-100
      dark: '#27272a',  // zinc-800
    },
    border: {
      light: '#e2e8f0', // slate-200
      dark: '#3f3f46',  // zinc-700
    },
    borderLight: {
      light: '#f1f5f9', // slate-100
      dark: '#52525b',  // zinc-600
    },
    text: {
      light: '#09090b', // zinc-950
      dark: '#fafafa',  // zinc-50
    },
    textSecondary: {
      light: '#52525b', // zinc-600
      dark: '#d4d4d8',  // zinc-300
    },
    textTertiary: {
      light: '#71717a', // zinc-500
      dark: '#a1a1aa',  // zinc-400
    },
    textInverse: {
      light: '#fafafa',
      dark: '#09090b',
    },

    // Additional colors
    accent: {
      light: '#06b6d4', // cyan-500
      dark: '#0891b2',  // cyan-600
    },
    accentAlt: {
      light: '#14b8a6', // teal-500
      dark: '#0d9488',  // teal-600
    },
  },
  isDarkMode: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Get the appropriate color based on mode
 */
export function getColorForMode(
  colorConfig: { light: string; dark: string },
  isDarkMode: boolean
): string {
  return isDarkMode ? colorConfig.dark : colorConfig.light;
}

/**
 * Create CSS variables from theme
 */
export function createCSSVariables(theme: FallbackTheme): Record<string, string> {
  const isDark = theme.isDarkMode ?? false;
  const vars: Record<string, string> = {};

  // Create CSS variable for each color
  Object.entries(theme.colors).forEach(([key, colorConfig]) => {
    const value = getColorForMode(colorConfig, isDark);
    vars[`--color-${key}`] = value;
  });

  return vars;
}

/**
 * Apply theme as CSS variables to document element
 */
export function applyThemeToDocument(theme: FallbackTheme): void {
  const variables = createCSSVariables(theme);
  const root = document.documentElement;

  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  // Set data attribute for dark mode
  if (theme.isDarkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

/**
 * Validate theme configuration
 */
export function isValidTheme(theme: any): theme is FallbackTheme {
  return (
    typeof theme === 'object' &&
    typeof theme.id === 'string' &&
    typeof theme.name === 'string' &&
    typeof theme.colors === 'object' &&
    theme.colors !== null
  );
}
