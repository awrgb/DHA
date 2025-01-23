"use client"

import { useState } from "react"

import { useRouter, useSearchParams } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { login, resendEmailVerification, verify2FA } from "@/actions/login"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { OTPModal } from "@/components/auth/otp-modal"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoginSchema } from "@/resources/schemas"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

export const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, setIsPending] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [pendingCredentials, setPendingCredentials] = useState<{
    username: string
    password: string
  } | null>(null)

  const handleOTPSubmit = async (otp: string) => {
    try {
      const result = await verify2FA(otp)

      if (result.success === "2FA verification successful!") {
        // Sign in using credentials after successful 2FA
        try {
          setShowOTPModal(false)
          setSuccess("Successfully logged in! Please wait...")
          await signIn("credentials", {
            username: pendingCredentials?.username,
            password: pendingCredentials?.password,
            callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
            redirect: true,
          })
        } catch (error) {
          setError((error as Error).message)
        }

        router.push(callbackUrl || "/")
      } else {
        setShowOTPModal(false)
        setError(result.error || "Invalid OTP")
      }
    } catch (error) {
      console.error("2FA verification error:", error)
      setShowOTPModal(false)
      setError("Invalid OTP. Please try again.")
    }
  }
  const handleResendVerification = async () => {
    setIsResending(true)
    const result = await resendEmailVerification(pendingCredentials!.username)
    if (result?.error) {
      setError(result.error)
      setIsResending(false)
    }
    setSuccess(result?.message)
    setIsResending(false)
  }

  const getErrorWithAction = () => {
    if (error === "Please verify your email first") {
      return {
        message: error,
        action: {
          label: "Resend verification",
          onClick: handleResendVerification,
          loading: isResending,
        },
      }
    }
    return { message: error }
  }

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("")
    setSuccess("")
    setIsPending(true)
    setPendingCredentials(values)

    try {
      const result = await login(values, callbackUrl)
      if (result?.error === "2FA is enabled for this account") {
        setShowOTPModal(true)
        return
      }

      if (result?.error) {
        setError(result.error)
        return
      }

      if (result?.success) {
        try {
          setSuccess(`${result.success} Please wait...`)
          await signIn("credentials", {
            username: values?.username,
            password: values?.password,
            callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
            redirect: true,
          })
        } catch (error) {
          setError((error as Error).message)
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Something went wrong!")
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
      showForgotPassword
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="John Doe"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError {...getErrorWithAction()} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? "Loading..." : "Login"}
          </Button>
        </form>
      </Form>
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onSubmit={handleOTPSubmit}
      />
    </CardWrapper>
  )
}
