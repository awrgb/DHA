"use client"

import { useCallback, useEffect, useState } from "react"

import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"

import { BeatLoader } from "react-spinners"

import { newVerification } from "@/actions/new-verification"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"

export const NewVerificationForm = () => {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const searchParams = useSearchParams()

  const token = searchParams.get("token")

  const onSubmit = useCallback(() => {
    if (success || error) return

    if (!token) {
      setError("Missing token!")
      return
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success)
        setError(data.error)
        if (data.success && data.redirect) {
          setTimeout(() => {
            router.push(data.redirect)
          }, 2000) // Redirect after 2 seconds to show success message
        }
      })
      .catch(() => {
        setError("Something went wrong!")
      })
  }, [token, success, error, router])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  )
}
