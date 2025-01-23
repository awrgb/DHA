"use server"

import { currentRole } from "@/lib/current-user"
import { UserRole } from "@/types/api"

export const admin = async () => {
  const role = await currentRole()

  if (role === UserRole.ADMIN) {
    return { success: "Allowed Server Action!" }
  }

  return { error: "Forbidden Server Action!" }
}
