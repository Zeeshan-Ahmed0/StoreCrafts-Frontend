import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string to mm/dd/yyyy hh:mm format
 * @param dateString - Date string or Date object to format
 * @returns Formatted date string in mm/dd/yyyy hh:mm format, or "N/A" for invalid dates
 */
export function formatDate(dateString?: string | Date | null): string {
  if (!dateString || dateString === "0000-00-00 00:00:00") return "N/A"

  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString

    // Check if date is valid
    if (isNaN(date.getTime())) return "N/A"

    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${month}/${day}/${year} ${hours}:${minutes}`
  } catch (error) {
    return "N/A"
  }
}
