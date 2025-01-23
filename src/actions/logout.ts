"use server"

import { signOut } from "@/auth"
import { authApi } from "@/lib/api/auth"

// This file is kept for future server-side logout functionality if needed

export async function logout() {
  try {
    // First, try to logout from the backend
    await authApi.logout()

    // Then, clear the session
    await signOut({ redirect: false })

    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: "Failed to logout" }
  }
}
