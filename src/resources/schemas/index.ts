import * as z from "zod"

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    username: z.optional(z.string()),
    isTwoFactorEnabled: z.boolean(),
    role: z.enum(["admin", "user"]).default("user"),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      // Only validate passwords if either password field is filled
      if (!data.password && !data.newPassword) return true
      if (data.password && !data.newPassword) return false
      if (!data.password && data.newPassword) return false
      return true
    },
    {
      message: "Both current and new password are required to change password",
      path: ["newPassword"],
    }
  )

export const TwoFactorSchema = z.object({
  isTwoFactorEnabled: z.boolean(),
})

export const NewPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
    confirmPassword: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
})

export const LoginSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
  twoFactorVerified: z.optional(z.boolean()),
})

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must not exceed 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers and underscores",
    }),
})
