import { type DefaultSession } from "next-auth"
import "next-auth/jwt"

type UserRole = "admin" | "user"

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  interface User {
    id: string
    username: string
    email: string
    role: UserRole
    isTwoFactorEnabled: boolean
    isOAuth: boolean
    accessToken: string
    refreshToken: string
  }
  /**
   * By default, TypeScript merges new interface properties and overwrites existing ones.
   * In this case, the default session user properties will be overwritten,
   * with the new ones defined above. To keep the default session user properties,
   * you need to add them back into the newly declared interface.
   */

  interface Session {
    user: {
      id: string
      username: string
      email: string
      role: UserRole
      isTwoFactorEnabled: boolean
      isOAuth: boolean
      accessToken: string
      refreshToken: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    role: UserRole
    accessToken: string
    refreshToken: string
    isTwoFactorEnabled: boolean
    isOAuth: boolean
    // error?: "RefreshAccessTokenError"
  }
}
