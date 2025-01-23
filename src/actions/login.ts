"use server"

import * as z from "zod"

import { authApi } from "@/lib/api/auth"
import { LoginSchema } from "@/resources/schemas"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { ApiResponse, AuthTokenResponse } from "@/types/api"

export interface LoginResult {
  error?: string
  success?: string
  redirect?: string
  user?: {
    id: string
    username: string
    email: string
    name: string
    role: "admin" | "user"
    isTwoFactorEnabled: boolean
    isOAuth: boolean
    accessToken: string
    refreshToken: string
  }
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<LoginResult> {
  try {
    // Get access token
    const tokenResponse: AuthTokenResponse = await authApi.login(
      username,
      password
    )
    if (tokenResponse.success === false) {
      return { error: tokenResponse.message }
    }
    if (!tokenResponse.access_token) {
      return { error: "Invalid credentials" }
    }
    // // Set the token for immediate use
    // apiClientInstance.setAccessToken(tokenResponse.access_token)

    // Get user profile
    const userProfile = await authApi.getProfile(tokenResponse.access_token)

    // // Clear the immediate token after use
    // apiClientInstance.setAccessToken(null)

    if (!userProfile.email || !userProfile.username) {
      return { error: "Invalid user profile" }
    }

    return {
      success: "Authentication successful",
      user: {
        id: String(userProfile.id),
        username: userProfile.username,
        email: userProfile.email,
        name: userProfile.name || "",
        role: userProfile.role,
        isTwoFactorEnabled: userProfile.is_two_factor_enabled,
        isOAuth: userProfile.is_oauth,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
      },
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return { error: "Invalid credentials" }
  }
}

export async function login(
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
): Promise<LoginResult> {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  try {
    const { username, password } = validatedFields.data
    const tokenResponse: AuthTokenResponse = await authApi.login(
      username,
      password
    )
    if (tokenResponse.success === false) {
      return { error: tokenResponse.message }
    }

    if (tokenResponse.message === "2FA code sent to your email") {
      return { error: "2FA is enabled for this account" }
    }

    if (!tokenResponse.access_token) {
      return { error: "Invalid credentials" }
    }
    // Set the token for immediate use
    // apiClientInstance.setAccessToken(tokenResponse.access_token)

    try {
      // Get user profile
      const userProfile = await authApi.getProfile(tokenResponse.access_token)

      if (!userProfile.email || !userProfile.username) {
        return { error: "Invalid user profile" }
      }

      // Clear the token only if 2FA is not enabled
      // apiClientInstance.setAccessToken(null)

      return {
        success: "Logged in successfully!",
        redirect: callbackUrl || DEFAULT_LOGIN_REDIRECT,
      }
    } catch (profileError) {
      // Clear the token on profile fetch error
      // apiClientInstance.setAccessToken(null)
      throw profileError
    }
  } catch (error) {
    console.error("Login error:", error)
    // Always clear the token on error
    // apiClientInstance.setAccessToken(null)
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export const verify2FA = async (otp: string): Promise<LoginResult> => {
  try {
    const result = await authApi.check2FA(otp)
    if (result.success) {
      return { success: "2FA verification successful!" }
    }
    return { error: "Invalid 2FA code" }
  } catch (error) {
    console.error("2FA verification error:", error)
    return { error: "Failed to verify 2FA code" }
  }
}

export const resendEmailVerification = async (
  username: string
): Promise<ApiResponse> => {
  try {
    const result = await authApi.resendEmailVerification(username)
    if (result.success) {
      return {
        success: true,
        message:
          "Email verification sent successfully! Please check your inbox",
      }
    }
    return { success: false, error: result.message }
  } catch (error) {
    console.error("Email verification resend error:", error)
    return { success: false, error: "Failed to resend email verification" }
  }
}
