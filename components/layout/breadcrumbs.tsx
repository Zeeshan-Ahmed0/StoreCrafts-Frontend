"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { Fragment } from "react"

interface BreadcrumbItem {
    label: string
    href: string
}

const routeLabels: Record<string, string> = {
    dashboard: "Dashboard",
    users: "Users",
    "corporate-parents": "Corporate Parents",
    "therapy-facility": "Facilities",
    "container-management": "Container Management",
    financial: "Financial",
    orders: "Orders",
    "access-requests": "Access Requests",
    new: "Create",
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    // Build breadcrumbs from segments, skipping "dashboard"
    let currentPath = ""
    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i]

        // Always build currentPath
        currentPath += `/${segment}`

        // Skip "dashboard" segment from being added to breadcrumbs
        if (segment === "dashboard") {
            continue
        }

        // Check if it's a UUID (likely an ID)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)

        if (isUUID) {
            // For UUIDs, use "Edit" as the label
            const parentSegment = segments[i - 1]
            const parentLabel = routeLabels[parentSegment] || parentSegment
            breadcrumbs.push({
                label: `Edit ${parentLabel.replace(/s$/, "")}`, // Remove trailing 's' for singular
                href: currentPath
            })
        } else {
            // Use predefined label or capitalize segment
            const label = routeLabels[segment] || segment.split("-").map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(" ")

            breadcrumbs.push({ label, href: currentPath })
        }
    }

    return breadcrumbs
}

export function Breadcrumbs() {
    const pathname = usePathname()
    const breadcrumbs = generateBreadcrumbs(pathname)

    // Don't show breadcrumbs on dashboard home or if only one item
    if (pathname === "/dashboard" || breadcrumbs.length <= 1) return null

    return (
        <nav className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
            {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1

                return (
                    <Fragment key={crumb.href}>
                        {index > 0 && (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                        {isLast ? (
                            <span className="font-medium text-gray-900 dark:text-white">
                                {crumb.label}
                            </span>
                        ) : (
                            <Link
                                href={crumb.href}
                                className="hover:text-acplus-teal transition-colors"
                            >
                                {crumb.label}
                            </Link>
                        )}
                    </Fragment>
                )
            })}
        </nav>
    )
}
