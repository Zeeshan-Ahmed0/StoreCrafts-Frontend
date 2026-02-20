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
    LogOut,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, LayoutGroup } from "framer-motion"

interface SidebarProps {
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

export function Sidebar({ session, className }: SidebarProps) {
    const pathname = usePathname()
    const [isExpanded, setIsExpanded] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
        setIsExpanded(true)
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsExpanded(false)
        }, 200) // 2 seconds delay as requested
    }

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    return (
        <div
            className={cn(
                "fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-white dark:bg-gray-900 border-r shadow-lg transition-all duration-300 ease-in-out",
                isExpanded ? "w-64" : "w-17.5",
                className
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex h-17.5 items-center px-4 overflow-hidden shrink-0 transition-all duration-300">
                <div className={cn(
                    "flex items-center justify-center transition-all duration-300",
                    isExpanded ? "w-full" : "w-10"
                )}>
                    {isExpanded ? (
                        <div className="relative h-12 w-48">
                            <Image
                                src="/acplus-logo.jpg"
                                alt="ACPlus Logo"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                    ) : (
                        <div className="relative h-10 w-10">
                            <Image
                                src="/acplus-icon.png"
                                alt="ACPlus Icon"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto overflow-x-hidden">
                <LayoutGroup>
                    {routes.map((route) => {
                        // Special handling for dashboard - only active on exact match
                        const isActive = route.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(route.href)

                        return (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 whitespace-nowrap",
                                    isActive
                                        ? "text-white"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeSidebarItem"
                                        className="absolute inset-0 rounded-lg bg-acplus-gradient shadow-md"
                                        initial={false}
                                        transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 30,
                                            mass: 1
                                        }}
                                    />
                                )}
                                <route.icon
                                    className={cn(
                                        "relative z-10 h-5 w-5 shrink-0 transition-colors duration-200",
                                        isActive ? "text-white" : "text-gray-500 group-hover:text-acplus-teal"
                                    )}
                                />
                                <span
                                    className={cn(
                                        "relative z-10 transition-opacity duration-300",
                                        isExpanded ? "opacity-100" : "opacity-0 hidden"
                                    )}
                                >
                                    {route.label}
                                </span>
                            </Link>
                        )
                    })}
                </LayoutGroup>
            </div>

            <div className="p-4 border-t overflow-hidden shrink-0">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-800 p-2 whitespace-nowrap hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full cursor-pointer">
                            <Avatar className="h-9 w-9 shrink-0">
                                <AvatarImage src={session?.user?.image || ""} />
                                <AvatarFallback className="bg-acplus-teal text-white">
                                    {session?.user?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div
                                className={cn(
                                    "flex flex-col overflow-hidden transition-opacity duration-300 text-left",
                                    isExpanded ? "opacity-100" : "opacity-0 hidden"
                                )}
                            >
                                <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                    {session?.user?.name || "User"}
                                </span>
                                <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                                    {session?.user?.email || "user@example.com"}
                                </span>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-56 ml-4 mb-2"
                        align="start"
                        side="top"
                    >
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{session?.user?.name || "User"}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {session?.user?.email || "user@example.com"}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
