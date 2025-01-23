"use server"

import { AxiosError } from "axios"
import * as z from "zod"

import { auth } from "@/auth"
import { authApi } from "@/lib/api/auth"
import { SettingsSchema } from "@/resources/schemas"
import { UserProfile } from "@/types/api"
interface Res {
  UserProfile?: UserProfile
  error?: string
  success?: boolean
}
export async function settings(values: z.infer<typeof SettingsSchema>) {
  const session = await auth()
  const user = session?.user

  if (!user?.id) {
    return { error: "Unauthorized" }
  }

  try {
    // If password change is requested
    if (values.password && values.newPassword) {
      const passwordChangeResult = await authApi.changePassword({
        password: values.password,
        newPassword: values.newPassword,
      })

      if (!passwordChangeResult.success) {
        return {
          error: passwordChangeResult.error || "Failed to change password",
        }
      }
    }

    // Update user settings
    const settingsResult = await authApi.updateSettings({
      user_id: user.id,
      is_two_factor_enabled: values.isTwoFactorEnabled,
    })

    if (!settingsResult.success) {
      return { error: settingsResult.error || "Failed to update settings" }
    }

    return { success: "Settings updated successfully!" }
  } catch (error) {
    // Handle Axios errors
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        return { error: "Session expired. Please log in again." }
      }
      return {
        error:
          error.response?.data?.detail ||
          error.message ||
          "Failed to update settings",
      }
    }

    // Handle other errors
    console.error("Error updating settings:", error)
    return { error: "Something went wrong!" }
  }
}

export async function getUserProfile(): Promise<Res> {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }
  try {
    const profile = await authApi.getProfile(session.user.accessToken)
    return {
      success: true,
      UserProfile: {
        id: profile.id,
        username: profile.username,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        is_two_factor_enabled: profile.is_two_factor_enabled,
        is_oauth: profile.is_oauth,
      },
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    if (error instanceof AxiosError) {
      return {
        error:
          error.response?.data?.detail ||
          error.message ||
          "Failed to load profile",
      }
    }
    return { error: "Failed to load profile" }
  }
}
