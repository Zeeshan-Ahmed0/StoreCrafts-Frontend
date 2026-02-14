'use client';

/**
 * Theme System Examples
 * Shows best practices for using the dynamic theming system
 */

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Example 1: Basic theme usage with semantic color names
 */
export function ButtonWithTheme() {
  const { getCSSVariable } = useTheme();

  return (
    <button
      className="px-4 py-2 rounded-lg font-semibold transition-colors"
      style={{
        backgroundColor: getCSSVariable('primary'),
        color: getCSSVariable('textInverse'),
      }}
    >
      Themed Button
    </button>
  );
}

/**
 * Example 2: Using Tailwind classes with theme colors
 * No hardcoded colors - all mapped to CSS variables
 */
export function CardWithTheme() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-lg">
      <h3 className="text-text font-bold mb-2">Dynamic Card</h3>
      <p className="text-text-secondary">
        This card uses Tailwind classes that map to theme CSS variables
      </p>
    </div>
  );
}

/**
 * Example 3: Component that reads theme colors programmatically
 */
export function ThemeStatusDisplay() {
  const { theme, getColor } = useTheme();

  if (!theme) return null;

  const primaryColor = getColor('primary');
  const successColor = getColor('success');

  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-surface rounded-lg border border-border">
      <div>
        <p className="text-text-secondary text-sm mb-1">Primary Color</p>
        <div
          className="w-16 h-16 rounded-lg border border-border"
          style={{ backgroundColor: primaryColor }}
        />
        <code className="text-xs text-text-tertiary">{primaryColor}</code>
      </div>
      <div>
        <p className="text-text-secondary text-sm mb-1">Success Color</p>
        <div
          className="w-16 h-16 rounded-lg border border-border"
          style={{ backgroundColor: successColor }}
        />
        <code className="text-xs text-text-tertiary">{successColor}</code>
      </div>
    </div>
  );
}

/**
 * Example 4: Form with theme-aware styling
 */
export function ThemeAwareForm() {
  const { getCSSVariable } = useTheme();

  return (
    <form className="space-y-4 p-6 bg-surface rounded-lg border border-border max-w-md">
      <div>
        <label className="block text-text font-semibold mb-2">Email</label>
        <input
          type="email"
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none transition-all"
          style={{
            '--tw-ring-color': getCSSVariable('primary'),
          } as React.CSSProperties}
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-text font-semibold mb-2">Message</label>
        <textarea
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none transition-all"
          style={{
            '--tw-ring-color': getCSSVariable('primary'),
          } as React.CSSProperties}
          placeholder="Your message..."
          rows={4}
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: getCSSVariable('primary') }}
      >
        Send Message
      </button>
    </form>
  );
}

/**
 * Example 5: Semantic status indicators
 */
export function StatusIndicators() {
  const { getColor } = useTheme();

  const statuses = [
    { label: 'Success', color: getColor('success') },
    { label: 'Warning', color: getColor('warning') },
    { label: 'Error', color: getColor('error') },
    { label: 'Info', color: getColor('info') },
  ];

  return (
    <div className="flex flex-wrap gap-4 p-6 bg-surface rounded-lg border border-border">
      {statuses.map(({ label, color }) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-text-secondary text-sm">{label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Example 6: Gradient backgrounds using theme colors
 */
export function GradientSection() {
  const { getColor } = useTheme();

  const primaryColor = getColor('primary');
  const secondaryColor = getColor('secondary');

  return (
    <div
      className="p-8 rounded-lg text-white"
      style={{
        backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
      }}
    >
      <h2 className="text-2xl font-bold mb-2">Dynamic Gradient</h2>
      <p>This background gradient uses theme colors</p>
    </div>
  );
}

/**
 * Example 7: Complete dashboard widget
 */
export function DashboardWidget() {
  const { theme } = useTheme();

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-text font-bold text-lg">Theme Status</h3>
        <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-semibold">
          Active
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-text-secondary">Theme ID</span>
          <span className="text-text font-mono text-sm">{theme?.id}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-text-secondary">Name</span>
          <span className="text-text font-semibold">{theme?.displayName}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-text-secondary">Mode</span>
          <span className="text-text">
            {theme?.isDarkMode ? '🌙 Dark' : '☀️ Light'}
          </span>
        </div>
      </div>
    </div>
  );
}
