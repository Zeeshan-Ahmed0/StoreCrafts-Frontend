"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { variants } from "@/lib/motion"
import { cn } from "@/lib/utils"

type CardProps = React.ComponentProps<typeof Card>
type MotionCardProps = Omit<CardProps, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"> & {
    children: React.ReactNode
    className?: string
    noHover?: boolean
}

const MotionCardWrapper = motion(Card)

export function MotionCard({ children, className, noHover = false, ...props }: MotionCardProps) {
    return (
        <MotionCardWrapper
            variants={!noHover ? variants.cardHover : undefined}
            whileHover={!noHover ? "whileHover" : undefined}
            whileTap={!noHover ? "whileTap" : undefined}
            className={cn("transition-colors", className)}
            {...props}
        >
            {children}
        </MotionCardWrapper>
    )
}
