// User Roles
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

// Authentication Types
export interface Token {
  access_token: string
  token_type: string
  refresh_token: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterCredentials {
  name: string
  username: string
  email: string
  password: string
}

export interface UserProfile {
  id: number
  username: string
  email: string
  name: string
  role: UserRole
  is_two_factor_enabled: boolean
  is_oauth: boolean
  image?: string
}

// API Response Types
export interface ApiResponse<T = void> {
  success: boolean
  error?: string
  data?: T
  message?: string
}

export interface ApiError {
  detail: Array<{
    loc: (string | number)[]
    msg: string
    type: string
  }>
}

interface VerificationData {
  email?: string
}

export interface VerificationResponse extends ApiResponse<VerificationData> {
  message: string
}

// Auth API Request Types
export interface ChangePasswordRequest {
  password: string
  newPassword: string
}

export interface UpdateSettingsRequest {
  user_id: string
  is_two_factor_enabled: boolean
}

// Auth API Response Types
export interface LoginResponse extends Token {
  user: UserProfile
}

export interface AuthTokenResponse extends Token {
  success: boolean
  message: string
}

// Todo Types (if needed, consider moving to a separate file)
export interface Todo {
  id?: number
  task: string
  is_completed?: boolean
  user_id: number
}

export interface TodoCreate {
  task: string
}

export interface TodoEdit {
  task: string
  is_completed?: boolean
}

export interface DecodedToken {
  sub: string
  exp: number
  iat: number
  jti?: string
}
