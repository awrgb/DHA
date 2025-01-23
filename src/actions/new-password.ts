"use server"

import * as z from "zod"

import { authApi } from "@/lib/api/auth"
import { NewPasswordSchema } from "@/resources/schemas"
import { ApiResponse } from "@/types/api"

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing token!" }
  }

  const validatedFields = NewPasswordSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { password } = validatedFields.data

  try {
    const response: ApiResponse = await authApi.resetPassword(token, password)
    if (response.success == true)
      return { success: "Password updated!", redirect: "/auth/login" }
    return {
      error: response.error || "Failed to reset password",
    }
  } catch (error: ApiResponse["error"] | unknown) {
    return {
      error: (error as ApiResponse).error || "Failed to reset password",
    }
  }
}
