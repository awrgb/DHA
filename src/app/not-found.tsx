import Link from "next/link"

import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  const page_not_found = "The page you're looking for doesn't exist"
  const page_not_found_description =
    "Please check the URL or navigate back to home"
  const return_home = "Return Home"
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-green-700 to-green-900 px-4 text-center">
      <AlertCircle className="h-16 w-16 text-white/80" />
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
        404
      </h1>
      <p className="mt-4 text-xl text-gray-100">{page_not_found}</p>
      <p className="mt-2 text-gray-200">{page_not_found_description}</p>
      <Link href="/" className="mt-8">
        <Button
          variant="ghost"
          size="lg"
          className="border-white bg-green-600 text-white hover:bg-white/10"
        >
          {return_home}
        </Button>
      </Link>
    </div>
  )
}
