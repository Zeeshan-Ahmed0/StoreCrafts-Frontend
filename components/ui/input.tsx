import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        // Base styles with modern design
        "flex h-11 w-full rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm",
        "transition-all duration-200 ease-in-out",
        // Placeholder
        "placeholder:text-gray-400",
        // Focus state
        "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white",
        // Hover state
        "hover:border-gray-300 hover:bg-gray-50",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
        // File input
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // Error state
        "aria-invalid:border-red-300 aria-invalid:ring-red-100 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-100",
        className
      )}
      {...props}
    />
  )
}

export { Input }
