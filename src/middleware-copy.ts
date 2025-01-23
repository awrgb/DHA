import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getToken } from "next-auth/jwt"

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes"
import {} from "next-auth/middleware"

import { env } from "./env/server"

export default async function middleware(request: NextRequest) {
  const { nextUrl } = request
  console.log("\n=== MIDDLEWARE DEBUG START ===")

  // Log request details
  console.log("Request Details:", {
    url: nextUrl.pathname,
    method: request.method,
    host: request.headers.get("host"),
    protocol: request.headers.get("x-forwarded-proto") || "http",
  })

  // Log all headers
  console.log("Request Headers:")
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    headers[key] = value
  })
  console.log(headers)

  // Log all cookies
  console.log("Request Cookies:")
  const cookiesList = request.cookies.getAll()
  const cookies: Record<string, string> = {}
  cookiesList.forEach((cookie) => {
    cookies[cookie.name] = cookie.value
  })
  console.log(cookies)

  // Log environment variables availability (not values for security)
  console.log("Environment Variables Status:", {
    hasAuthSecret: !!env.AUTH_SECRET,
    hasNextAuthUrl: !!env.NEXTAUTH_URL,
    nodeEnv: process.env.NODE_ENV,
  })

  const token = await getToken({
    req: request,
    secret: env.AUTH_SECRET,
  })

  console.log("Token Details:", {
    exists: !!token,
    url: request.nextUrl.pathname,
    tokenProperties: token ? Object.keys(token) : null,
    // Log specific token fields without exposing sensitive data
    hasAccessToken: !!token?.accessToken,
    hasRefreshToken: !!token?.refreshToken,
    role: token?.role,
    username: token?.username,
  })

  const isLoggedIn = !!token?.accessToken

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isVerificationRoute = nextUrl.pathname === "/auth/new-verification"

  if (isApiAuthRoute) {
    console.log("[MIDDLEWARE]: API Auth Route")
    return null
  }

  if (isAuthRoute) {
    console.log("[MIDDLEWARE]: Auth Route")
    if (isLoggedIn) {
      console.log("[MIDDLEWARE]: Already logged in")
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    console.log("[MIDDLEWARE]: Not logged in")
    return null
  }

  if (!isLoggedIn && !isPublicRoute && !isVerificationRoute) {
    console.log("[MIDDLEWARE]: Not logged in")
    let callbackUrl = nextUrl.pathname
    console.log("[MIDDLEWARE]: Callback URL:", callbackUrl)
    if (nextUrl.search) {
      console.log("[MIDDLEWARE]: Search:", nextUrl.search)
      callbackUrl += nextUrl.search
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl)

    console.log(
      "[MIDDLEWARE]: Redirecting to:",
      `/auth/login?callbackUrl=${encodedCallbackUrl}`
    )
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    )
  }
  console.log("[MIDDLEWARE]: Logged in")
  return null
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
