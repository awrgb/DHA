"use client"

import Link from "next/link"

import { BackButton } from "@/components/auth/back-button"
import { Header } from "@/components/auth/header"
import { Social } from "@/components/auth/social"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  backButtonLabel: string
  backButtonHref: string
  showSocial?: boolean
  showForgotPassword?: boolean
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  showForgotPassword,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>
        {children}
        <div className="mt-4 flex flex-col gap-2">
          {showForgotPassword && (
            <Link
              href="/auth/reset"
              className="text-sm text-muted-foreground hover:text-primary hover:underline"
            >
              Forgot password?
            </Link>
          )}
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </div>
        {showSocial && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Social />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
