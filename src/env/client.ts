import { createEnv } from "@t3-oss/env-nextjs"
import { z, ZodError } from "zod"

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_EMAIL: z.string().min(1),
    NEXT_PUBLIC_API_URL: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_EMAIL: process.env.NEXT_PUBLIC_EMAIL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  onValidationError: (error: ZodError) => {
    console.error(
      "❌ Invalid environment variables:",
      error.flatten().fieldErrors
    )
    process.exit(1)
  },
  // Called when server variables are accessed on the client.
  onInvalidAccess: (variable: string) => {
    throw new Error(
      "❌ Attempted to access a server-side environment variable on the client" +
        ` - ${variable}`
    )
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
})
