"use client"

import { SessionProvider } from "next-auth/react"
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes"

interface ProvidersProps extends Omit<ThemeProviderProps, "children"> {
  children: React.ReactNode
}

export function Provider({ children, ...props }: ProvidersProps) {
  return (
    <SessionProvider refetchInterval={60 * 5}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        {...props}
      >
        {children}
      </NextThemesProvider>
    </SessionProvider>
  )
}
