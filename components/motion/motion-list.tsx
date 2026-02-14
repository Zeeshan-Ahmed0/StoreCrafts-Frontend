"use client"

import { motion } from "framer-motion"
import { variants } from "@/lib/motion"

export function MotionList({ children, className, as = "div" }: { children: React.ReactNode, className?: string, as?: "div" | "ul" | "ol" | "tbody" }) {
    const Component = motion[as]

    return (
        <Component
            initial="initial"
            animate="animate"
            variants={variants.staggerContainer}
            className={className}
        >
            {children}
        </Component>
    )
}
