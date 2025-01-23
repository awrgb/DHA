import { UserRole } from "@/types/api"

import { useCurrentUser } from "./use-current-user"

export const useCurrentRole = () => {
  console.log("useCurrentRole: I called it")
  const { user } = useCurrentUser()
  return (user?.role as UserRole) ?? UserRole.USER
}
