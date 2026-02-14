"use client"

import { motion } from "framer-motion"
import { variants } from "@/lib/motion"

export function MotionPage({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants.fadeInUp}
            className={className}
        >
            {children}
        </motion.div>
    )
}
