import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors (mapped to CSS variables)
        primary: 'var(--color-primary)',
        'primary-alt': 'var(--color-primaryAlt)',
        
        // Secondary colors
        secondary: 'var(--color-secondary)',
        'secondary-alt': 'var(--color-secondaryAlt)',
        
        // Semantic colors
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
        
        // Neutral colors
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-variant': 'var(--color-surfaceVariant)',
        border: 'var(--color-border)',
        'border-light': 'var(--color-borderLight)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-textSecondary)',
        'text-tertiary': 'var(--color-textTertiary)',
        'text-inverse': 'var(--color-textInverse)',
        
        // Additional colors
        accent: 'var(--color-accent)',
        'accent-alt': 'var(--color-accentAlt)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...defaultTheme.fontFamily.mono],
      },
      backgroundColor: {
        base: 'var(--color-background)',
        card: 'var(--color-surface)',
      },
      textColor: {
        base: 'var(--color-text)',
        secondary: 'var(--color-textSecondary)',
        tertiary: 'var(--color-textTertiary)',
      },
      borderColor: {
        base: 'var(--color-border)',
        light: 'var(--color-borderLight)',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
