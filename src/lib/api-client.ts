import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios"

import { auth } from "@/auth"
import { env } from "@/env/server"

const API_URL = env.API_URL || "http://localhost:8000"

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/token$",
  "/token/refresh",
  "/user/login$",
  "/user/register$",
  "/user/verify",
  "/user/forgot-password$",
  "/user/resend-email-verification",
  "/$", // Root path needs exact match
]

class ApiClient {
  private static instance: ApiClient
  private api: AxiosInstance
  private currentAccessToken: string | null = null

  private isPublicRoute(url: string | undefined): boolean {
    if (!url) return false

    for (const route of PUBLIC_ROUTES) {
      if (route.endsWith("$")) {
        const exactRoute = route.slice(0, -1)
        const isMatch = url === exactRoute
        if (isMatch) return true
      } else {
        const isMatch = url.startsWith(route)
        if (isMatch) return true
      }
    }

    return false
  }

  private constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const isPublicRoute = this.isPublicRoute(config.url)
        console.log("Request interceptor:", {
          url: config.url,
          isPublicRoute,
          currentAccessToken: this.currentAccessToken,
        })
        // Don't add auth header for public routes
        if (isPublicRoute) {
          return config
        }

        try {
          // Get fresh session to ensure we have the latest tokens
          const session = await auth()
          if (session?.user?.accessToken) {
            this.currentAccessToken = session.user.accessToken
            config.headers["Authorization"] =
              `Bearer ${this.currentAccessToken}`
          } else {
            console.error("No access token in session")
            this.currentAccessToken = null
          }
        } catch (error) {
          console.error("Failed to get session:", error)
          this.currentAccessToken = null
        }

        return config
      },
      (error) => {
        console.error("Request interceptor error:", error)
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle 401 errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        console.error("Response interceptor error:", error)
        const originalRequest = error.config

        if (!originalRequest) {
          console.error("No original request found in error")
          return Promise.reject(error)
        }

        // Only retry once and only for 401 errors
        if (
          error.response?.status !== 401 ||
          originalRequest.headers["X-Retry"] ||
          this.isPublicRoute(originalRequest.url)
        ) {
          return Promise.reject(error)
        }

        try {
          const session = await auth()

          if (!session?.user?.accessToken) {
            console.error("No access token in session")
            return Promise.reject(error)
          }

          originalRequest.headers["Authorization"] =
            `Bearer ${session.user.accessToken}`
          originalRequest.headers["X-Retry"] = "true"

          return this.api(originalRequest)
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError)
          return Promise.reject(error)
        }
      }
    )
    //   // Simplified error handling
    //   this.api.interceptors.response.use(
    //     (response) => response,
    //     async (error: AxiosError) => {
    //       console.error("API Error:", error.message)
    //       return Promise.reject(error)
    //     }
    //   )
    // }
  }
  public setAccessToken(token: string | null) {
    this.currentAccessToken = token
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  public getApi(): AxiosInstance {
    return this.api
  }
}

export const apiClientInstance = ApiClient.getInstance()
export const apiClient = apiClientInstance.getApi()
