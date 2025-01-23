import { UserRole } from "./api"

export interface ExtendedUser {
  id: string
  name?: string | null
  email: string
  emailVerified?: Date | null
  image?: string | null
  password?: string | null
  role: UserRole
  isTwoFactorEnabled: boolean
  isOAuth?: boolean
  isVerified?: boolean
  createdAt: Date
  updatedAt: Date
}

export type UserSettings = {
  name?: string
  email?: string
  password?: string
  newPassword?: string
  role?: UserRole
  isTwoFactorEnabled?: boolean
}
