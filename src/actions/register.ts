"use server"

import * as z from "zod"

import { authApi } from "@/lib/api/auth"
import { RegisterSchema } from "@/resources/schemas"

export type Res = {
  error?: string | z.ZodError
  success?: boolean
  message?: string
  redirectTo?: string
}

export async function register(
  values: z.infer<typeof RegisterSchema>
): Promise<Res> {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { name, username, email, password } = validatedFields.data

  try {
    await authApi.register({ name, username, email, password })
    return {
      success: true,
      message: "Registration successful! Please log in to continue.",
      redirectTo: "/auth/login",
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      error: "Something went wrong during registration!",
    }
  }
}
