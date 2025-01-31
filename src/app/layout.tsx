import { Suspense } from "react"

import type { Metadata } from "next"

import { Provider } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📦</text></svg>"
      />
      <body className="w-screen h-screen ">
        <Toaster />
        <Provider>
          <main className="w-full h-full flex flex-col flex-grow">
            <Suspense>{children}</Suspense>
          </main>
        </Provider>
      </body>
    </html>
  )
}
