'use client';

/**
 * Theme Context
 * Manages theme state and provides theme utilities to the app
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type {
  ThemeConfig,
  ThemeContextType,
  ColorKey,
  ThemeFetchOptions,
} from '../types/theme';
import { DEFAULT_THEME, applyThemeToDocument, getColorForMode } from '../lib/defaultTheme';
import { themeService } from '../lib/themeService';

/**
 * Create theme context
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  getStoreId?: () => string | undefined;
  fallbackTheme?: ThemeConfig;
  fetchOnMount?: boolean;
}

/**
 * Theme Provider Component
 * Must wrap the app to provide theme functionality
 */
export function ThemeProvider({
  children,
  getStoreId,
  fallbackTheme = DEFAULT_THEME,
  fetchOnMount = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeConfig | null>(fallbackTheme);
  const [isLoading, setIsLoading] = useState(fetchOnMount);
  const [error, setError] = useState<string | null>(null);

  /**
   * Apply theme to document
   */
  const applyTheme = useCallback((newTheme: ThemeConfig) => {
    try {
      applyThemeToDocument(newTheme as any);
      setThemeState(newTheme);
      setError(null);
    } catch (err) {
      console.error('Error applying theme:', err);
      setError('Failed to apply theme');
    }
  }, []);

  /**
   * Fetch theme from API
   */
  const refreshTheme = useCallback(
    async (options: ThemeFetchOptions = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        // Get from cache first
        const cached = themeService.getCachedTheme();
        if (cached && !options.forceRefresh) {
          applyTheme(cached);
          setIsLoading(false);
          return;
        }

        // Fetch from API
        const fetchedTheme = await themeService.fetchTheme({
          ...options,
          storeId: getStoreId?.(),
        });

        // Cache it
        themeService.cacheTheme(fetchedTheme);

        // Apply it
        applyTheme(fetchedTheme);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error refreshing theme:', message);
        setError(message);
        
        // Fall back to cached or default
        const cached = themeService.getCachedTheme();
        if (cached) {
          applyTheme(cached);
        } else {
          applyTheme(fallbackTheme);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [applyTheme, getStoreId, fallbackTheme]
  );

  /**
   * Set theme directly
   */
  const setTheme = useCallback((newTheme: ThemeConfig) => {
    applyTheme(newTheme);
    themeService.cacheTheme(newTheme);
  }, [applyTheme]);

  /**
   * Update theme partially
   */
  const updateTheme = useCallback((updates: Partial<ThemeConfig>) => {
    if (!theme) return;

    const updatedTheme: ThemeConfig = {
      ...theme,
      ...updates,
    };

    setTheme(updatedTheme);
  }, [theme, setTheme]);

  /**
   * Get color value
   */
  const getColor = useCallback(
    (colorName: ColorKey, mode?: 'light' | 'dark'): string => {
      if (!theme) return '';
      
      const colorConfig = theme.colors[colorName];
      if (!colorConfig) {
        console.warn(`Color '${colorName}' not found in theme`);
        return '';
      }

      const isDark = mode !== undefined ? mode === 'dark' : theme.isDarkMode || false;
      return getColorForMode(colorConfig, isDark);
    },
    [theme]
  );

  /**
   * Get CSS variable name
   */
  const getCSSVariable = useCallback((colorName: ColorKey): string => {
    return `var(--color-${colorName})`;
  }, []);

  /**
   * Reset theme to default
   */
  const resetTheme = useCallback(() => {
    applyTheme(fallbackTheme);
    themeService.clearCache();
  }, [applyTheme, fallbackTheme]);

  /**
   * Fetch theme on mount
   */
  useEffect(() => {
    if (fetchOnMount && isLoading) {
      refreshTheme();
    }
  }, []);

  // Expose context value
  const value: ThemeContextType = {
    theme,
    isLoading,
    error,
    setTheme,
    updateTheme,
    getColor,
    getCSSVariable,
    resetTheme,
    refreshTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use theme context
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}

/**
 * Hook to safely use theme (with fallback)
 */
export function useThemeOptional(): ThemeContextType | undefined {
  return useContext(ThemeContext);
}
