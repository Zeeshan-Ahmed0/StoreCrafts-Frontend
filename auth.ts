import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: "StoreCrafts",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                try {
                    // Call backend API to authenticate
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    })

                    if (!response.ok) return null

                    const data = await response.json()

                    if (data.token) {
                        return {
                            id: data.user?.id || credentials.email,
                            email: data.user?.email || credentials.email,
                            role: data.user?.role || "customer",
                            accessToken: data.token,
                            storeId: data.user?.storeId,
                        }
                    }
                    return null
                } catch (error) {
                    console.error("Auth Error:", error)
                    return null
                }
            },
        }),
    ],
})
