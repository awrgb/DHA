"use server"

import { authApi } from "@/lib/api/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

export const newVerification = async (token: string) => {
  try {
    const response = await authApi.verifyEmail(token)

    if (response.success) {
      return {
        success: response.message,
        redirect: DEFAULT_LOGIN_REDIRECT,
      }
    }

    return {
      error: response.message || "Verification failed",
    }
  } catch (error) {
    console.error("Error verifying email:", error)
    return {
      error: "Something went wrong with the verification!",
    }
  }
}
