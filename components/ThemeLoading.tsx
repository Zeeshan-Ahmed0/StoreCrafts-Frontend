'use client';

/**
 * Theme Loading Fallback Component
 * Displays while theme is loading from API
 */

import React from 'react';
import { useThemeOptional } from '../contexts/ThemeContext';

interface ThemeLoadingProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showSkeleton?: boolean;
}

/**
 * Wrapper component that shows loading state while theme is being fetched
 */
export function ThemeLoading({
  children,
  fallback,
  showSkeleton = true,
}: ThemeLoadingProps) {
  const theme = useThemeOptional();

  // Show fallback while loading
  if (theme?.isLoading) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showSkeleton) {
      return <ThemeLoadingSkeleton />;
    }

    return null;
  }

  // Show children when theme is loaded
  return <>{children}</>;
}

/**
 * Default loading skeleton
 */
function ThemeLoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-secondary">Loading theme...</p>
      </div>
    </div>
  );
}

/**
 * Component that renders only when theme is loaded
 */
export function ThemeReady({ children }: { children: React.ReactNode }) {
  const theme = useThemeOptional();

  if (!theme || theme.isLoading) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Component that renders only when theme failed to load
 */
export function ThemeError({ children }: { children: React.ReactNode }) {
  const theme = useThemeOptional();

  if (!theme?.error) {
    return null;
  }

  return <>{children}</>;
}
