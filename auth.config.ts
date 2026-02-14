import type { NextAuthOptions } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
        error: '/login', // Redirect auth errors to login page instead of /api/auth/error
    },
    // Required for production deployments behind proxy/load balancer
    // trustHost: true,
    // Enable debug mode to see detailed logs in production
    debug: process.env.NODE_ENV === 'development',
    callbacks: {
        // authorized({ auth, request: { nextUrl } }) {
        //     const isLoggedIn = !!auth?.user
        //     const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
        //     const isAuthPage = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/forgot-password')

        //     // Protect dashboard routes - require authentication
        //     if (isOnDashboard) {
        //         return isLoggedIn
        //     }

        //     // Allow access to auth pages and other public routes
        //     return true
        // },
        async jwt({ token, account, user }) {
            // For Credentials provider, tokens are in the user object from authorize()
            // For OAuth providers, tokens would be in account
            if (user) {
                token.email = user.email
                // @ts-expect-error -- custom user properties from authorize
                token.accessToken = user.accessToken
                // @ts-expect-error -- custom user properties from authorize
                token.idToken = user.idToken
            }
            // Fallback for OAuth providers
            if (account?.access_token) {
                token.accessToken = account.access_token
            }
            if (account?.id_token) {
                token.idToken = account.id_token
            }
            return token
        },
        async session({ session, token }) {
            // Always extend session with tokens from JWT
            // @ts-expect-error -- extending session type
            session.accessToken = token.accessToken
            // @ts-expect-error -- extending session type
            session.idToken = token.idToken

            if (token.email && session.user) {
                session.user.email = token.email as string
            }

            return session
        },
    },
    providers: [], // Configured in auth.ts
    secret: process.env.AUTH_SECRET,
} satisfies NextAuthOptions
