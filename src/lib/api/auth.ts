import { AxiosError } from "axios"

import { auth } from "@/auth"
import {
  ApiResponse,
  AuthTokenResponse,
  ChangePasswordRequest,
  RegisterCredentials,
  UpdateSettingsRequest,
  UserProfile,
  VerificationResponse,
} from "@/types/api"

import { apiClient } from "../api-client"

export const authApi = {
  register: async (credentials: RegisterCredentials) => {
    const response = await apiClient.post<UserProfile>("/user/register", null, {
      params: credentials,
    })
    return response.data
  },

  verifyEmail: async (token: string): Promise<VerificationResponse> => {
    try {
      const response = await apiClient.get<VerificationResponse>(
        `/user/verify/${token}`
      )
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: false,
          error: error.response?.data?.detail || "Failed to verify email",
          message: "Verification failed",
        }
      }
      return {
        success: false,
        error: "An unexpected error occurred",
        message: "Verification failed",
      }
    }
  },

  getProfile: async (token: string): Promise<UserProfile> => {
    console.log("🚀 ~ file: auth.ts:50 ~ token:", token)

    const response = await apiClient.get<UserProfile>("/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log("🚀 ~ file: auth.ts:52 ~ response:", response.data)
    return response.data
  },

  changePassword: async (
    request: ChangePasswordRequest
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      "/user/change-password",
      {
        current_password: request.password,
        new_password: request.newPassword,
      }
    )
    return response.data
  },

  updateSettings: async (
    request: UpdateSettingsRequest
  ): Promise<ApiResponse> => {
    const session = await auth()
    const token = session?.user?.accessToken
    try {
      const response = await apiClient.patch<ApiResponse>(
        "/user/settings",
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        // Handle 401 separately as it will be retried by the interceptor
        if (error.response?.status === 401) {
          throw error
        }
        return {
          success: false,
          error: error.response?.data?.detail || "Failed to update settings",
        }
      }
      return {
        success: false,
        error: "An unexpected error occurred while updating settings",
      }
    }
  },

  login: async (
    username: string,
    password: string
  ): Promise<AuthTokenResponse> => {
    const response = await apiClient.post<AuthTokenResponse>(
      "/token",
      new URLSearchParams({
        username,
        password,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    return response.data
  },

  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      "/user/forgot-password",
      null,
      {
        params: { email },
      }
    )
    return response.data
  },

  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>("/user/reset-password", {
      token,
      new_password: newPassword,
    })
    return response.data
  },

  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>("/user/logout")
      // Clear the immediate token after logout
      // apiClientInstance.setAccessToken(null)
      return response.data
    } catch (err) {
      console.error("Logout failed:", err)
      return {
        success: false,
        error: "Failed to logout",
      }
    }
  },

  check2FA: async (two_fa_code: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>("/two-fa-confirm", {
        two_fa_code: two_fa_code,
      })
      return response.data
    } catch (err) {
      console.error("2FA check failed:", err)
      return {
        success: false,
        message: "Failed to check 2FA",
      }
    }
  },

  resendEmailVerification: async (username: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>(
        `/user/resend-verification-email?user_name=${username}`
      )
      if (response.status !== 200) {
        return {
          success: false,
          error: response.data.error || "Failed to resend email verification",
        }
      }
      return {
        success: true,
        message: response.data.message,
      }
    } catch (err) {
      console.error("Email verification resend failed:", err)
      return {
        success: false,
        error: "Failed to resend email verification",
      }
    }
  },
  refreshToken: async (refreshToken: string): Promise<AuthTokenResponse> => {
    const response = await apiClient.post<AuthTokenResponse>(
      `/token/refresh?old_refresh_token=${refreshToken}`
    )
    return response.data
  },
}
