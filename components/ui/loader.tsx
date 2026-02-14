import { cn } from "@/lib/utils"

interface LoaderProps {
    className?: string
    size?: number
}

export function Loader({ className, size = 40 }: LoaderProps) {
    return (
        <div className={cn("flex items-center justify-center", className)}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-spin text-blue-500"
            >
                <path
                    d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
                    fill="currentColor"
                    className="opacity-25"
                />
                <path
                    d="M12 2C6.47715 2 2 6.47715 2 12C2 13.6569 2.40293 15.205 3.11633 16.5625L4.85432 15.5443C4.30786 14.4819 4 13.2746 4 12C4 7.58172 7.58172 4 12 4V2Z"
                    fill="currentColor"
                    className="opacity-75"
                />
            </svg>
        </div>
    )
}
