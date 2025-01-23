import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getToken } from "next-auth/jwt"

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes"

import { env } from "./env/server"

export default async function middleware(request: NextRequest) {
  const { nextUrl } = request

  // // Debug proxy headers
  // console.log("\n=== PROXY DEBUG START ===")
  // console.log("Proxy Headers:", {
  //   forwardedProto: request.headers.get("x-forwarded-proto"),
  //   forwardedHost: request.headers.get("x-forwarded-host"),
  //   host: request.headers.get("host"),
  //   realIp: request.headers.get("x-real-ip"),
  //   forwardedFor: request.headers.get("x-forwarded-for"),
  // })

  // Check for secure cookie
  const secureCookie = request.cookies.get("__Secure-next-auth.session-token")
  // console.log("Secure Cookie Present:", !!secureCookie)

  try {
    const token = await getToken({
      req: request,
      secret: env.AUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production", // Only use secure cookies in production
    })

    // console.log("Token Result:", {
    //   exists: !!token,
    //   cookiePresent: !!secureCookie,
    //   tokenFields: token ? Object.keys(token) : null,
    // })

    // Your original route protection logic
    const isLoggedIn = !!token?.accessToken

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)
    const isVerificationRoute = nextUrl.pathname === "/auth/new-verification"

    if (isApiAuthRoute) {
      // console.log("[MIDDLEWARE]: API Auth Route")
      return null
    }

    if (isAuthRoute) {
      // console.log("[MIDDLEWARE]: Auth Route")
      if (isLoggedIn) {
        // console.log("[MIDDLEWARE]: Already logged in")
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
      }
      // console.log("[MIDDLEWARE]: Not logged in")
      return null
    }

    if (!isLoggedIn && !isPublicRoute && !isVerificationRoute) {
      // console.log("[MIDDLEWARE]: Not logged in")
      let callbackUrl = nextUrl.pathname
      if (nextUrl.search) {
        callbackUrl += nextUrl.search
      }

      const encodedCallbackUrl = encodeURIComponent(callbackUrl)
      // console.log(
      //   "[MIDDLEWARE]: Redirecting to:",
      //   `/auth/login?callbackUrl=${encodedCallbackUrl}`
      // )
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
      )
    }

    // console.log("[MIDDLEWARE]: Logged in")
    return null
  } catch (error) {
    // console.error("Middleware Error:", error)
    // On error, redirect to login
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
