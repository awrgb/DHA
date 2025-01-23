"use client"

import { useRouter } from "next/navigation"

import { toast } from "sonner"

import { logout } from "@/actions/logout"

interface LogoutButtonProps {
  children?: React.ReactNode
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const router = useRouter()

  const onClick = async () => {
    try {
      const result = await logout()

      if (result.success) {
        toast.success("Logged out successfully!")
        router.push("/auth/login")
      } else {
        toast.error(result.error || "Something went wrong!")
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Something went wrong!")
    }
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  )
}
