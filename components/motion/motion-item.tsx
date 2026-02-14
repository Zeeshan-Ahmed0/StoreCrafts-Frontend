"use client"

import { motion } from "framer-motion"
import { variants } from "@/lib/motion"
import { TableRow } from "@/components/ui/table"

const MotionTableRow = motion(TableRow)

export function MotionItem({ children, className, as = "div" }: { children: React.ReactNode, className?: string, as?: "div" | "li" | "tr" }) {
    // Special handling for TableRow to preserve table semantics if needed, 
    // but motion.tr is supported.

    if (as === "tr") {
        return (
            <MotionTableRow
                variants={variants.fadeIn}
                className={className}
            >
                {children}
            </MotionTableRow>
        )
    }

    const Component = motion[as]

    return (
        <Component
            variants={variants.fadeIn}
            className={className}
        >
            {children}
        </Component>
    )
}
