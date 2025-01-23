# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.8] - 2024-12-23

### Added
- Email verification system implementation:
  - Added resendEmailVerification API endpoint
  - Implemented handleResendVerification in login form
  - Added verification status check during login flow

### Enhanced
- Improved login form UX with verification status feedback
- Added email verification resend capability for unverified users
- Enhanced error handling for email verification flows

### Security
- Strengthened authentication flow with email verification checks
- Added rate limiting for verification email resend requests

## [0.2.7] - 2024-12-22

### Added
- Complete Two-Factor Authentication (2FA) implementation:
  - TOTP-based authentication flow
  - 2FA setup and verification UI components
  - Server-side 2FA validation and token management

### Changed
- Enhanced authentication flow with 2FA integration
- Improved error handling in authentication components
- Updated user settings page with 2FA management section
- Refactored authentication middleware for 2FA support

### Security
- Implemented secure TOTP token generation and validation
- Enhanced session management with 2FA verification state

### Cleanup
- Removed debug console.log statements across the codebase
- Improved code organization in authentication components
- Enhanced type safety in 2FA-related functions

## [0.2.6] - 2024-12-17

### Changed
- Migrated UserRole enum from Drizzle schema to centralized types/api.ts
- Updated useCurrentRole hook to use useCurrentUser instead of useSession
- Improved role-based access control in RoleGate component
- Removed debug console.log from useCurrentUser hook

### Fixed
- Fixed build error related to Drizzle dependency in user role management
- Improved type safety for user role handling across the application

## [0.2.5] - 2024-12-17

### Added
- SWR integration for efficient client-side data fetching
- Route handlers for secure client-server communication
- New `/api/user/me` endpoint for user profile fetching
- Automatic data revalidation and caching with SWR
- Type-safe data fetching patterns

### Changed
- Updated client components to use route handlers instead of direct API calls
- Modified API client to use client-side environment variables
- Improved user profile fetching with proper Next.js patterns
- Enhanced error handling in data fetching operations
- Refactored useCurrentUser hook to use SWR

### Fixed
- Environment variable access in client components
- Headers scope issue in client-side API calls
- Type safety in API client and data fetching
- Client-side data fetching architecture

### Security
- Proper separation of client and server-side data fetching
- Secure route handlers for client-side API requests

## [0.2.4] - 2024-12-17

### Added
- New password reset functionality with FastAPI backend integration
- Password confirmation field in new password form
- Automatic redirect to login page after successful password reset
- Password matching validation in schema

### Changed
- Updated NewPasswordSchema to include password confirmation
- Migrated new password flow to use FastAPI backend
- Improved error handling with backend error messages
- Enhanced form validation with password matching

### Removed
- Legacy Drizzle ORM code from new password functionality
- Local token validation and password hashing

## [0.2.3] - 2024-12-17

### Added
- Password reset functionality with FastAPI backend integration
- "Forgot password?" link in login form
- Dedicated API client method for password reset

### Changed
- Updated CardWrapper component to support optional password reset link
- Improved login form placeholder text for better UX
- Migrated password reset flow to use FastAPI backend instead of local implementation

## [0.2.2] - 2024-12-16

### Added
- Comprehensive logout functionality with frontend and backend integration
- Server action for handling logout process
- Logout API endpoint in auth client

### Changed
- Updated LogoutButton component to use new logout action
- Improved token cleanup during logout process
- Enhanced error handling in logout flow

## [0.2.1] - 2024-12-16

### Changed

- Optimized authentication flow to use immediate access tokens
- Separated API client instance from Axios instance for better type safety
- Improved token management in login process
- Updated password change endpoint to match backend snake_case format

## [0.2.0] - 2024-12-12

### Changed

- Refactored authentication API client to remove client-side session management
- Updated API endpoints to match FastAPI backend specification
- Fixed registration endpoint to use correct query parameters
- Improved error handling in API requests

## [0.1.2] - 2024-12-07

### Fixed

- Two-factor authentication toggle now works independently
- Removed password validation when toggling 2FA
- Modified settings schema to make password validation conditional
- Improved UX by handling 2FA toggle state separately from form submission

### Changed

- Updated settings form validation to only require passwords when explicitly changing password
- Simplified 2FA toggle handler to update database and session directly

## [0.1.1] - 2024-12-01

### Added

- OAuth account detection in user sessions
- `isOAuth` property in NextAuth session and JWT types
- Database query to check for OAuth provider accounts

### Fixed

- OAuth users now correctly identified in settings page
- Two-factor authentication options properly hidden for OAuth users
- Session data now includes OAuth status based on accounts table

### Technical Details

- Added `isOAuth` property to ExtendedJWT type in auth configuration
- Implemented database check in session callback for OAuth accounts
- Utilized existing accounts table relationship for OAuth detection
- No schema changes required as the accounts table already tracks OAuth providers

### Database Schema

The fix utilizes the existing `account` table structure which tracks OAuth providers:

```dbml
Table "account" {
  "userId" text [not null]
  "type" text [not null]
  "provider" text [not null]
  "providerAccountId" text [not null]
  // ... other fields
}
```

This table maintains the relationship between users and their OAuth providers, enabling the new OAuth detection functionality.
