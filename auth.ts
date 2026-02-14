import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"

function calculateSecretHash(username: string, clientId: string, clientSecret: string): string {
    return crypto
        .createHmac("sha256", clientSecret)
        .update(username + clientId)
        .digest("base64")
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    trustHost: true, // Explicitly set here as well for production
    providers: [
        Credentials({
            name: "Cognito",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const clientId = process.env.AUTH_COGNITO_ID!
                const clientSecret = process.env.AUTH_COGNITO_SECRET!
                const username = credentials.email as string

                const params = {
                    AuthFlow: "USER_PASSWORD_AUTH" as const,
                    ClientId: clientId,
                    AuthParameters: {
                        USERNAME: username,
                        PASSWORD: credentials.password as string,
                        SECRET_HASH: calculateSecretHash(username, clientId, clientSecret),
                    },
                }

                try {
                    const command = new InitiateAuthCommand(params)
                    const response = await cognitoClient.send(command)

                    if (response.AuthenticationResult) {
                        return {
                            id: response.AuthenticationResult.AccessToken || "user-id", // Ideally decode ID token for sub
                            email: username,
                            accessToken: response.AuthenticationResult.AccessToken,
                            idToken: response.AuthenticationResult.IdToken,
                        }
                    }
                    return null
                } catch (error) {
                    console.error("Cognito Login Error:", JSON.stringify(error, null, 2))
                    return null
                }
            },
        }),
    ],
})
