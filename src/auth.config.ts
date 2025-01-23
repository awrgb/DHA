import { jwtDecode } from "jwt-decode"
import { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { authenticateUser } from "./actions/login"
import { authApi } from "./lib/api/auth"
import { DecodedToken } from "./types/api"

export default {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required.")
        }

        try {
          const result = await authenticateUser(
            credentials.username as string,
            credentials.password as string
          )
          // console.log("🚀 ~ file: auth.config.ts:50 ~ result:", result)
          if (result.error || !result.user) {
            throw new Error(result.error || "Invalid credentials.")
          }
          // console.log("Authorized user:", result.user)
          // Return complete user object matching our User type
          return result.user
        } catch (error) {
          // console.error("Authentication error:", error)
          throw new Error(
            error instanceof Error ? error.message : "Invalid credentials."
          )
        }
      },
    }),
    // GoogleProvider({
    //   clientId: env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    //   authorization: {
    //     params: {
    //       prompt: "consent",
    //       access_type: "offline",
    //       response_type: "code",
    //     },
    //   },
    // }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Initial sign in - ensure all required properties are present
        token.id = user.id as string
        token.username = user.username
        token.role = user.role
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.isTwoFactorEnabled = user.isTwoFactorEnabled
        token.isOAuth = user.isOAuth
      }
      // console.log("🚀 ~ file: auth.config.ts:58 ~ JWT Callback:", {
      //   tokenExists: !!token,
      //   userExists: !!user,
      //   tokenContent: token,
      // })
      try {
        const decodedToken = jwtDecode<DecodedToken>(token.accessToken)
        const currentTime = Math.floor(Date.now() / 1000)

        // Check if token is expired or about to expire (within 1 minute)
        if (decodedToken.exp <= currentTime + 30) {
          try {
            const response = await authApi.refreshToken(token.refreshToken)
            // console.log("🚀 ~ file: auth.config.ts:69 ~ response:", response)

            if (response.access_token && response.refresh_token) {
              token = {
                ...token,
                accessToken: response.access_token,
                refreshToken: response.refresh_token,
              }
              return token
            } else {
              // If refresh fails, force sign out by returning null
              return null
            }
          } catch (error) {
            // console.error("Token refresh failed:", error)
            return null
          }
        }
      } catch (error) {
        // console.error("Error decoding token:", error)
        // If token is invalid, force sign out
        return null
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        // console.log("🚀 ~ file: auth.config.ts:99 ~ Session Callback:", {
        //   sessionExists: !!session,
        //   tokenExists: !!token,
        //   sessionContent: session,
        //   tokenContent: token,
        // })
        session.user.id = token.id
        session.user.email = token.email as string
        session.user.username = token.username
        session.user.role = token.role
        session.user.accessToken = token.accessToken
        session.user.refreshToken = token.refreshToken
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled
        session.user.isOAuth = token.isOAuth
      }

      // console.log("🚀 ~ file: auth.config.ts:79 ~ session:", session.user)
      return session
    },
  },
  trustHost:
    process.env.NODE_ENV === "development" || !!process.env.NEXTAUTH_URL,
  cookies: {
    sessionToken: { 
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    },
  },
} satisfies NextAuthConfig
