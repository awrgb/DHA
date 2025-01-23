import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().url(),
    API_URL: z.string().url(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.string(),
    SMTP_USER: z.string(),
    SMTP_PASS: z.string(),
  },
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    API_URL: process.env.API_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
})
