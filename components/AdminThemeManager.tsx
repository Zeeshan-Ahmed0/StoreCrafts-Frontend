'use client';

/**
 * Admin Theme Manager
 * Real-world implementation showing advanced theme usage
 * This component demonstrates:
 * - Reading theme data
 * - Updating theme programmatically
 * - Refreshing theme from API
 * - Color palette preview
 * - Error handling
 */

import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeConfig, ColorKey } from '../types/theme';

interface AdminThemeManagerProps {
  onThemeChange?: (theme: ThemeConfig) => void;
}

/**
 * Admin dashboard for managing themes
 */
export function AdminThemeManager({ onThemeChange }: AdminThemeManagerProps) {
  const {
    theme,
    isLoading,
    error,
    getColor,
    refreshTheme,
    updateTheme,
    resetTheme,
  } = useTheme();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setSuccessMessage(null);
    try {
      await refreshTheme({ forceRefresh: true });
      setSuccessMessage('Theme refreshed successfully');
    } catch (err) {
      console.error('Failed to refresh theme:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReset = () => {
    resetTheme();
    setSuccessMessage('Theme reset to default');
  };

  const handleDarkModeToggle = () => {
    if (theme) {
      const updated = {
        ...theme,
        isDarkMode: !theme.isDarkMode,
      };
      updateTheme(updated);
      onThemeChange?.(updated);
      setSuccessMessage(
        `Switched to ${updated.isDarkMode ? 'dark' : 'light'} mode`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-surface rounded-lg border border-border">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-text-secondary">Loading theme manager...</p>
        </div>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="p-8 bg-surface rounded-lg border border-error/30 text-error">
        <h3 className="font-bold mb-2">Failed to Load Theme</h3>
        <p className="text-error/80 mb-4">{error || 'Unknown error'}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text">Theme Manager</h2>
          <p className="text-text-secondary">Current: {theme.displayName}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-success/10 border border-success rounded-lg">
          <p className="text-success font-semibold">{successMessage}</p>
        </div>
      )}

      {/* Theme Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-text mb-4">Theme Info</h3>
          <div className="space-y-3">
            <div>
              <p className="text-text-secondary text-sm">ID</p>
              <p className="text-text font-mono">{theme.id}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">Name</p>
              <p className="text-text font-semibold">{theme.name}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">Display Name</p>
              <p className="text-text">{theme.displayName}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm mb-2">Mode</p>
              <button
                onClick={handleDarkModeToggle}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  theme.isDarkMode
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {theme.isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
            </div>
          </div>
        </div>

        {/* Color Stats */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-text mb-4">Color Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-secondary">Total Colors</span>
              <span className="text-text font-semibold">18</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-secondary">Semantic Colors</span>
              <span className="text-text font-semibold">7</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-secondary">Neutral Colors</span>
              <span className="text-text font-semibold">7</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-text-secondary">Accent Colors</span>
              <span className="text-text font-semibold">4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-text mb-4">Color Palette</h3>
        <ColorPaletteGrid colors={theme.colors} />
      </div>

      {/* Color Details */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-text mb-4">Detailed Colors</h3>
        <ColorDetailsList colors={theme.colors} isDarkMode={theme.isDarkMode} />
      </div>
    </div>
  );
}

/**
 * Color palette grid preview
 */
interface ColorPaletteGridProps {
  colors: Record<string, { light: string; dark: string }>;
}

function ColorPaletteGrid({ colors }: ColorPaletteGridProps) {
  const colorEntries = Object.entries(colors).slice(0, 12);

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      {colorEntries.map(([name, config]) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <div
            className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
            style={{ backgroundColor: config.light }}
            title={`${name}: ${config.light}`}
          />
          <p className="text-text-tertiary text-xs font-semibold text-center">
            {name}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Detailed color list with hex values
 */
interface ColorDetailsListProps {
  colors: Record<string, { light: string; dark: string }>;
  isDarkMode: boolean;
}

function ColorDetailsList({ colors, isDarkMode }: ColorDetailsListProps) {
  const colorEntries = Object.entries(colors);

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {colorEntries.map(([name, config]) => (
        <div key={name} className="flex items-center justify-between py-2 px-3 bg-background rounded-lg border border-border/50">
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-6 h-6 rounded border border-border"
              style={{
                backgroundColor: isDarkMode ? config.dark : config.light,
              }}
            />
            <div>
              <p className="text-text font-semibold capitalize">{name}</p>
              <p className="text-text-tertiary text-xs">
                {isDarkMode ? 'Dark' : 'Light'} mode
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-text font-mono text-sm">
              {isDarkMode ? config.dark : config.light}
            </p>
            <button
              onClick={() => {
                const hex = isDarkMode ? config.dark : config.light;
                navigator.clipboard.writeText(hex);
              }}
              className="text-primary text-xs hover:underline"
            >
              Copy
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Export for use in admin panel
 */
export default AdminThemeManager;
