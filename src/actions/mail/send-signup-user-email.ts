"use server"

import { sendVerificationEmail } from "@/lib/mail"

interface SendSignupUserEmailParams {
  email: string
  token: string
}

export async function sendSignupUserEmail({
  email,
  token,
}: SendSignupUserEmailParams) {
  try {
    await sendVerificationEmail(email, token)
    return { success: true }
  } catch (error) {
    console.error("Error sending signup email:", error)
    return { success: false, error: "Failed to send verification email" }
  }
}
