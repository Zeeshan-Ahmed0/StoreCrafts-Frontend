/**
 * ACPlus Design System
 * Centralized design tokens and configurations
 */

export const acplusColors = {
    // Primary Brand Colors
    teal: '#139cba',
    green: '#3aaf4d',
    lime: '#a8cb38',

    // Gradient Definitions
    gradient: {
        primary: 'linear-gradient(149deg, #007a8b 0%, #3aaf4d 37%, #a8cb38 86%)',
        button: 'linear-gradient(135deg, #3aaf4d 0%, #139cba 100%)',
        hover: 'linear-gradient(149deg, #007a8b 0%, #3aaf4d 37%, #a8cb38 86%)',
    },

    // Semantic Colors
    success: '#3aaf4d',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#139cba',
} as const

export const acplusStyles = {
    // Button Styles
    button: {
        primary: {
            base: 'bg-gradient-to-br from-acplus-green to-acplus-teal text-white shadow-md',
            hover: 'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
            focus: 'focus-visible:ring-2 focus-visible:ring-acplus-teal/50',
            disabled: 'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        },
        secondary: {
            base: 'bg-gray-100 text-gray-700 border border-gray-300',
            hover: 'hover:bg-gray-200 hover:border-gray-400',
            focus: 'focus-visible:ring-2 focus-visible:ring-gray-300',
        },
        destructive: {
            base: 'bg-red-500 text-white',
            hover: 'hover:bg-red-600',
            focus: 'focus-visible:ring-2 focus-visible:ring-red-300',
        },
    },

    // Dropdown/Select Styles
    dropdown: {
        item: {
            base: 'px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200',
            hover: 'hover:bg-gradient-to-r hover:from-acplus-green/10 hover:to-acplus-teal/10 hover:text-acplus-teal',
            active: 'bg-gradient-to-r from-acplus-green/20 to-acplus-teal/20 text-acplus-teal',
        },
    },

    // Input Styles
    input: {
        base: 'border-gray-200 bg-gray-50/50',
        focus: 'focus:border-acplus-teal focus:ring-2 focus:ring-acplus-teal/20',
        error: 'border-red-300 focus:border-red-500 focus:ring-red-100',
    },
} as const

// Helper function to combine design system classes
export function getButtonClasses(variant: 'primary' | 'secondary' | 'destructive' = 'primary') {
    const styles = acplusStyles.button[variant]
    const disabled = 'disabled' in styles ? styles.disabled : ''
    return `${styles.base} ${styles.hover} ${styles.focus} ${disabled}`.trim()
}

export function getDropdownItemClasses(isActive = false) {
    const styles = acplusStyles.dropdown.item
    return `${styles.base} ${isActive ? styles.active : styles.hover}`
}

export function getInputClasses(hasError = false) {
    const styles = acplusStyles.input
    return `${styles.base} ${hasError ? styles.error : styles.focus}`
}
