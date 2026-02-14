/**
 * Theme API Service
 * Handles fetching and managing theme from the backend
 */

import type { ThemeConfig, ThemeApiResponse, ThemeFetchOptions } from '../types/theme';
import { DEFAULT_THEME } from './defaultTheme';
import { API_BASE_URL, API_ENDPOINTS } from './api-endpoints';

export class ThemeService {
  private static instance: ThemeService;
  private baseURL: string;
  private getStoreId: () => string | null;

  constructor(baseURL: string = API_BASE_URL, getStoreId?: () => string | null) {
    this.baseURL = baseURL;
    this.getStoreId = getStoreId || (() => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('store_id');
      }
      return null;
    });
  }

  /**
   * Get singleton instance
   */
  static getInstance(baseURL?: string, getStoreId?: () => string | null): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService(baseURL, getStoreId);
    }
    return ThemeService.instance;
  }

  /**
   * Fetch theme from API
   */
  async fetchTheme(options: ThemeFetchOptions = {}): Promise<ThemeConfig> {
    const { storeId, timeout = 5000 } = options;

    try {
      const finalStoreId = storeId || this.getStoreId();
      
      // Build API endpoint
      let endpoint = `${this.baseURL}${API_ENDPOINTS.THEME.GET}`;
      
      // Add store_id query param if available
      if (finalStoreId) {
        endpoint += `?store_id=${encodeURIComponent(finalStoreId)}`;
      }

      // Fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.warn(`Failed to fetch theme: ${response.status}`, response.statusText);
          return DEFAULT_THEME;
        }

        const data: ThemeApiResponse = await response.json();

        if (data.success && this.isValidTheme(data.data)) {
          return data.data;
        }

        console.warn('Invalid theme response:', data);
        return DEFAULT_THEME;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn('Theme fetch timeout, using default theme');
        } else {
          console.warn('Error fetching theme:', error);
        }
        return DEFAULT_THEME;
      }
    } catch (error) {
      console.error('Unexpected error in fetchTheme:', error);
      return DEFAULT_THEME;
    }
  }

  /**
   * Cache theme in localStorage
   */
  cacheTheme(theme: ThemeConfig): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('theme:config', JSON.stringify(theme));
      }
    } catch (error) {
      console.warn('Failed to cache theme:', error);
    }
  }

  /**
   * Get cached theme from localStorage
   */
  getCachedTheme(): ThemeConfig | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const cached = localStorage.getItem('theme:config');
        if (cached) {
          const theme = JSON.parse(cached);
          if (this.isValidTheme(theme)) {
            return theme;
          }
        }
      }
    } catch (error) {
      console.warn('Failed to get cached theme:', error);
    }
    return null;
  }

  /**
   * Clear cached theme
   */
  clearCache(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('theme:config');
      }
    } catch (error) {
      console.warn('Failed to clear theme cache:', error);
    }
  }

  /**
   * Update theme on the server
   */
  async updateTheme(theme: ThemeConfig): Promise<boolean> {
    try {
      const storeId = this.getStoreId();
      
      let endpoint = `${this.baseURL}${API_ENDPOINTS.THEME.UPDATE}`;
      if (storeId) {
        endpoint += `?store_id=${encodeURIComponent(storeId)}`;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(theme),
      });

      if (!response.ok) {
        console.warn(`Failed to update theme: ${response.status}`);
        return false;
      }

      const data: ThemeApiResponse = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error updating theme:', error);
      return false;
    }
  }

  /**
   * Validate theme configuration
   */
  private isValidTheme(theme: any): theme is ThemeConfig {
    return (
      typeof theme === 'object' &&
      theme !== null &&
      typeof theme.id === 'string' &&
      typeof theme.name === 'string' &&
      typeof theme.colors === 'object' &&
      theme.colors !== null &&
      // Check that all required color keys exist
      [
        'primary', 'primaryAlt', 'secondary', 'secondaryAlt',
        'success', 'warning', 'error', 'info',
        'background', 'surface', 'surfaceVariant', 'border', 'borderLight',
        'text', 'textSecondary', 'textTertiary', 'textInverse',
        'accent', 'accentAlt',
      ].every(key => key in theme.colors)
    );
  }
}

/**
 * Create theme service instance
 */
export function createThemeService(
  baseURL?: string,
  getStoreId?: () => string | null
): ThemeService {
  return ThemeService.getInstance(baseURL, getStoreId);
}

/**
 * Export singleton instance
 */
export const themeService = ThemeService.getInstance();
