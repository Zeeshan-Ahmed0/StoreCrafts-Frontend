"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"
import { Breadcrumbs } from "./breadcrumbs"
import { Session } from "next-auth"
import { usePathname } from "next/navigation"

interface HeaderProps {
    session: Session | null
}

// Map routes to page titles
const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",

  "/admin/my-store": "My Store",

  "/admin/catalog": "Catalog",
  "/admin/catalog/new": "Add Product",

  "/admin/orders": "Orders",

  "/admin/coupons": "Coupons",
  "/admin/coupons/new": "Add Coupon",

  "/admin/reviews": "Reviews",

  "/admin/users": "Users",

  "/admin/profile": "Profile",
};


function getPageTitle(pathname: string): string {
    // Check for exact match first
    if (pageTitles[pathname]) {
        return pageTitles[pathname]
    }

    // Check if it's an edit page (contains UUID)
    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
    if (uuidPattern.test(pathname)) {
        if (pathname.includes("/users/")) return "Edit User"
        if (pathname.includes("/corporate-parents/")) return "Edit Corporate Parent"
        if (pathname.includes("/therapy-facility/")) return "Edit Facility"
    }

    // Default fallback
    return "Dashboard"
}

export function Header({ session }: HeaderProps) {
    const pathname = usePathname()
    const pageTitle = getPageTitle(pathname)

    return (
        <header className="sticky top-0 z-30 flex flex-col border-b bg-white px-6 dark:bg-gray-900 shadow-sm">
            <div className="flex h-16 items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64 border-r-0">
                        <Sidebar session={session} className="border-none" />
                    </SheetContent>
                </Sheet>

                <div className="flex flex-1 items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {pageTitle}
                        </h1>
                        <Breadcrumbs />
                    </div>
                </div>
            </div>
        </header>
    )
}
