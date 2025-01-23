import "@auth/core/adapters"
import type { AdapterUser as DefaultAdapterUser } from "@auth/core/adapters"

declare module "@auth/core/adapters" {
  export interface AdapterUser extends DefaultAdapterUser {
    username: string
    role: "admin" | "user"
    isTwoFactorEnabled: boolean
    isOAuth?: boolean
    refreshToken?: string
    accessToken?: string
  }
}
