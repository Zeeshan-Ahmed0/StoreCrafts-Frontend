"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Building2,
    Activity,
    Users,
    Box,
    DollarSign,
    ShoppingCart,
    FileKey,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Session } from "next-auth"
import { motion, LayoutGroup } from "framer-motion"

interface FluidSidebarProps {
    session: Session | null
    className?: string
}

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
    },
    {
        label: "My Store",
        icon: Activity,
        href: "/admin/my-store",
    },
    {
        label: "Catalog",
        icon: Building2,
        href: "/admin/catalog",
    },
    {
        label: "Orders",
        icon: Box,
        href: "/admin/orders",
    },
    {
        label: "Coupons",
        icon: DollarSign,
        href: "/admin/coupons",
    },
    {
        label: "Reviews",
        icon: ShoppingCart,
        href: "/admin/reviews",
    },
    {
        label: "Users",
        icon: Users,
        href: "/admin/users",
    },
    {
        label: "Profile",
        icon: FileKey,
        href: "/admin/profile",
    },
]

export function FluidSidebar({ session, className }: FluidSidebarProps) {
    const pathname = usePathname()

    return (
        <div
            className={cn(
                "flex h-full w-64 flex-col bg-slate-900 text-slate-400 shadow-xl",
                className
            )}
        >
            {/* User Widget (Top) */}
            <div className="p-6 pb-2">
                <div className="flex items-center gap-4 rounded-xl bg-slate-800/50 p-3 border border-slate-700/50">
                    <div className="relative">
                        <Avatar className="h-10 w-10 border-2 border-slate-700">
                            <AvatarImage src={session?.user?.image || ""} />
                            <AvatarFallback className="bg-acplus-teal text-white">
                                {session?.user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-slate-800"></span>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="truncate text-sm font-semibold text-white">
                            {session?.user?.name || "User"}
                        </span>
                        <span className="truncate text-xs text-acplus-teal font-medium">
                            Online
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-none">
                <nav className="flex flex-col gap-1.5">
                    <LayoutGroup>
                        {routes.map((route) => {
                            // Active state logic
                            const isActive = route.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname.startsWith(route.href)

                            return (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={cn(
                                        "relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200",
                                        isActive
                                            ? "text-white"
                                            : "hover:text-white"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#139cba] to-[#3aaf4d] shadow-lg shadow-acplus-teal/20"
                                            initial={false}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 30
                                            }}
                                        />
                                    )}
                                    <route.icon
                                        className={cn(
                                            "relative z-10 h-5 w-5 shrink-0",
                                            isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                                        )}
                                    />
                                    <span className="relative z-10">{route.label}</span>
                                </Link>
                            )
                        })}
                    </LayoutGroup>
                </nav>
            </div>

            {/* Footer */}
            <div className="p-6 pt-2 text-center">
                <p className="text-[10px] font-medium text-slate-600">
                    © 2025 ACPlus Version 2.86
                </p>
            </div>
        </div>
    )
}
