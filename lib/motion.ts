import { Variants } from "framer-motion"

export const duration = {
    fast: 0.2,
    medium: 0.4,
    slow: 0.6,
}

export const easing = {
    easeOutQuart: [0.25, 1, 0.5, 1] as const,
    easeInOutQuart: [0.76, 0, 0.24, 1] as const,
}

export const variants: Record<string, Variants> = {
    fadeInUp: {
        initial: { opacity: 0, y: 10 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: duration.medium,
                ease: easing.easeOutQuart
            }
        },
        exit: {
            opacity: 0,
            y: 10,
            transition: {
                duration: duration.fast,
                ease: easing.easeOutQuart
            }
        }
    },
    fadeIn: {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                duration: duration.medium,
                ease: easing.easeOutQuart
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: duration.fast
            }
        }
    },
    staggerContainer: {
        animate: {
            transition: {
                staggerChildren: 0.05
            }
        }
    },
    cardHover: {
        whileHover: {
            scale: 1.02,
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
            transition: {
                duration: duration.fast,
                ease: easing.easeOutQuart
            }
        },
        whileTap: { scale: 0.98 }
    },
    buttonTap: {
        whileTap: { scale: 0.95 }
    },
    scaleIn: {
        initial: { opacity: 0, scale: 0.95 },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: duration.fast,
                ease: easing.easeOutQuart
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: duration.fast
            }
        }
    }
}
