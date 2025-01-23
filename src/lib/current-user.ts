import { AxiosError } from "axios"

import { auth } from "@/auth"
import { authApi } from "@/lib/api/auth"
import { UserProfile } from "@/types/api"

export type SafeUser = Omit<
  UserProfile,
  "is_two_factor_enabled" | "is_oauth"
> & {
  isTwoFactorEnabled: boolean
}

export const currentUser = async (
  token: string
): Promise<SafeUser | undefined> => {
  // console.log("currentUser: I have been called")
  try {
    const profile = await authApi.getProfile(token)
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      username: profile.username,
      role: profile.role,
      isTwoFactorEnabled: profile.is_two_factor_enabled,
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Failed to fetch user profile:", error.message)
      return undefined
    }
    console.error("Failed to fetch user profile:", error)
    return undefined
  }
}

export const currentRole = async () => {
  const session = await auth()

  if (!session?.user) return undefined
  try {
    const profile = await authApi.getProfile(session?.user?.accessToken)
    return profile.role
  } catch (error) {
    console.error("Failed to fetch user role:", error)
    return undefined
  }
}
