import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-500/50",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-red-300 shadow-sm",
        outline:
          "border-2 border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-300",
        secondary:
          "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-300",
        ghost:
          "hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-gray-300",
        link:
          "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 rounded-md gap-1.5 px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "size-10",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
