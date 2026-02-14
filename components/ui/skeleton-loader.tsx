import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number, columns?: number }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center space-x-4">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                    {Array.from({ length: columns }).map((_, j) => (
                        <Skeleton key={j} className="h-12 w-full" />
                    ))}
                </div>
            ))}
        </div>
    )
}

export function CardSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-3 w-3/4" />
                </div>
            ))}
        </div>
    )
}
