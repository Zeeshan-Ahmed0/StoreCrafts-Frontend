/**
 * Theme System Types
 * Strict TypeScript types for the dynamic theming system
 */

/**
 * Color configuration for a single color
 */
export interface ColorConfig {
  light: string;  // Light mode hex color
  dark: string;   // Dark mode hex color (optional, defaults to light)
}

/**
 * Semantic color palette
 * Maps semantic names to color values for easy reference
 */
export interface ColorPalette {
  // Primary colors
  primary: ColorConfig;
  primaryAlt: ColorConfig;
  
  // Secondary colors
  secondary: ColorConfig;
  secondaryAlt: ColorConfig;
  
  // Semantic colors
  success: ColorConfig;
  warning: ColorConfig;
  error: ColorConfig;
  info: ColorConfig;
  
  // Neutral colors
  background: ColorConfig;
  surface: ColorConfig;
  surfaceVariant: ColorConfig;
  border: ColorConfig;
  borderLight: ColorConfig;
  text: ColorConfig;
  textSecondary: ColorConfig;
  textTertiary: ColorConfig;
  textInverse: ColorConfig;
  
  // Additional colors
  accent: ColorConfig;
  accentAlt: ColorConfig;
}

/**
 * Complete theme configuration
 */
export interface ThemeConfig {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  colors: ColorPalette;
  isDarkMode?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Theme context state
 */
export interface ThemeState {
  theme: ThemeConfig | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Theme context API
 */
export interface ThemeContextType extends ThemeState {
  setTheme: (theme: ThemeConfig) => void;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  getColor: (colorName: keyof ColorPalette, mode?: 'light' | 'dark') => string;
  getCSSVariable: (colorName: keyof ColorPalette) => string;
  resetTheme: () => void;
  refreshTheme: () => Promise<void>;
}

/**
 * API Response for theme fetch
 */
export interface ThemeApiResponse {
  success: boolean;
  data: ThemeConfig;
  message?: string;
}

/**
 * Fallback/Default theme for loading states
 */
export interface FallbackTheme extends ThemeConfig {
  isDefault: true;
}

/**
 * Color mode type
 */
export type ColorMode = 'light' | 'dark' | 'auto';

/**
 * Theme storage key type
 */
export const THEME_STORAGE_KEY = 'storecrafts:theme' as const;
export const THEME_LOADING_KEY = 'storecrafts:theme:loading' as const;

/**
 * Type for color palette keys
 */
export type ColorKey = keyof ColorPalette;

/**
 * Type for theme update payload
 */
export type ThemeUpdatePayload = Partial<Omit<ThemeConfig, 'id' | 'createdAt'>>;

/**
 * Theme fetch options
 */
export interface ThemeFetchOptions {
  storeId?: string;
  forceRefresh?: boolean;
  timeout?: number;
}
