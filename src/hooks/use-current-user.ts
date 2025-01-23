"use client"

import { useSession } from "next-auth/react"
import useSWR from "swr"

import type { SafeUser } from "@/lib/current-user"

export const useCurrentUser = () => {
  console.log("useCurrentUser: I have been called")
  const { data: session } = useSession()

  const { data: user, error } = useSWR<SafeUser>(
    session?.user ? "/api/user/me" : null,
    async (url) => {
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch user")
      return response.json()
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000, // Cache for 10 seconds
    }
  )

  return {
    user,
    error,
    isLoading: session?.user && !user && !error,
  }
}
