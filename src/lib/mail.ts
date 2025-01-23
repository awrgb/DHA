import nodemailer from "nodemailer"

import { env as clientEnv } from "@/env/client"
import { env } from "@/env/server"

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
})

const domain = clientEnv.NEXT_PUBLIC_APP_URL
const fromEmail = clientEnv.NEXT_PUBLIC_EMAIL

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await transporter.sendMail({
    from: fromEmail,
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`

  await transporter.sendMail({
    from: fromEmail,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  })
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`

  await transporter.sendMail({
    from: fromEmail,
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  })
}
