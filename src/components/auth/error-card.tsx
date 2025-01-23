import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import { CardWrapper } from "@/components/auth/card-wrapper"

export const ErrorCard = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <CardWrapper
        headerLabel="Oops! Something went wrong!"
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
      >
        <div className="w-full flex justify-center items-center">
          <ExclamationTriangleIcon className="text-destructive" />
        </div>
      </CardWrapper>
    </div>
  )
}
