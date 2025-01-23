"use client"

import { useSearchParams } from "next/navigation"

import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"

import { Button } from "@/components/ui/button"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

export const Social = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  const onClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    })
  }

  return (
    <div className="flex w-full flex-col gap-y-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        Google
      </Button>
    </div>
  )
}
