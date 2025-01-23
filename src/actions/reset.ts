"use server"

import * as z from "zod"

import { authApi } from "@/lib/api/auth"
import { ResetSchema } from "@/resources/schemas"
import { ApiResponse } from "@/types/api"

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid email!" }
  }

  const { email } = validatedFields.data

  try {
    const response: ApiResponse = await authApi.forgotPassword(email)
    if (response.success == true) return { success: "Reset email sent!" }
    return {
      error: response.error || "Failed to send reset email",
    }
  } catch (error: ApiResponse["error"] | unknown) {
    return {
      error: (error as ApiResponse).error || "Failed to send reset email",
    }
  }
}
