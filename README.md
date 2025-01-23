# Next.js Starter Template

A modern, feature-rich Next.js starter template with authentication, database integration, and best practices.

Version: 0.2.7

## Features

### Authentication System

- Complete authentication flow with NextAuth.js and FastAPI backend
- Email/password authentication with secure password hashing
- Email verification system:
  - Automatic verification email on registration
  - Resend verification capability
  - Verification status check during login
- Two-factor authentication (2FA):
  - TOTP-based authentication
  - Optional 2FA enforcement for enhanced security
- Password reset flow:
  - Request password reset via email
  - Secure token-based reset process
  - Password confirmation with matching validation
- Protected routes and role-based access control

### Data Fetching and State Management

- SWR integration for efficient data fetching and caching
- Proper separation of client and server-side data fetching
- Route handlers for secure client-side API requests
- Automatic revalidation and cache management
- Optimistic UI updates with SWR's built-in features

### API Integration

- Custom API client with automatic token management
- Dedicated route handlers for client-side requests
- Type-safe API calls with comprehensive error handling
- Clear separation between client and server data fetching patterns
- Best practices for Next.js App Router architecture

### Frontend Features

- Modern UI with Tailwind CSS and shadcn/ui
- Form validation using Zod and React Hook Form
- Responsive layouts and components
- Loading states and error handling
- Automatic redirects after successful operations

## Project Structure

### Root Directory Important Files

- `package.json`: Contains project dependencies and scripts
- `docker-compose.yaml`: Docker configuration for development
- `tailwind.config.ts`: Tailwind CSS configuration
- `openapi.json`: FastAPI backend API specification
- `.env`: Environment variables configuration

### Source Directory (`src/`)

1. **`env/` Directory**:
   In my whole code base i use server and client side environment variables, so i have this directory for them and also i do not use process.env anywhere in my codebase to fetch environment variables except in the `env` directory.

   - `client.ts`: Defines type-safe environment variables accessible on the client side
   - `server.ts`: Defines server-side environment variables with additional security

2. **Authentication System**:
   The authentication system is built using NextAuth.js with several key files:

   - `auth.ts`: Core authentication configuration
     - Uses Credentials provider for email/password authentication
     - Implements two-factor authentication (2FA)
     - Handles password verification using Argon2 hashing
     - Manages user sessions and tokens
   - `auth.config.ts`: Contains base configuration for NextAuth
   - Integration with FastAPI backend for user management

3. **`lib/` Directory**:
   Core utilities and API clients:

   - `api-client.ts`: Axios-based API client with token management
     - Handles authentication headers
     - Manages access tokens for immediate use
     - Provides type-safe API instance
   - `api/`: Contains domain-specific API clients
     - `auth.ts`: Authentication-related API calls
     - `todos.ts`: Todo management API calls

4. **`actions/` Directory**:
   Server actions for handling form submissions and API calls:

   - `login.ts`: Handles user authentication
   - `two-factor.ts`: Manages 2FA functionality
   - `settings.ts`: User settings management

5. **`app/` Directory**:
   Next.js 13+ app router structure:

   - `(protected)/`: Routes that require authentication
   - these are accessible only when the user is logged in
   - `server/`: Server components
   - `client/`: Client components
   - `admin/`: Admin pages
   - `settings/`: User settings pages
   - Other route groups and pages

6. **`components/` Directory**:
   Reusable React components:

   - `auth/`: Authentication-related components like `login-form.tsx`
   - also these are not accessible while logged in
   - UI components and form elements

7. **`data/` Directory**:
   Data access layer:

   - Database queries and mutations
   - Data transformation logic
   - Repository pattern implementation

8. **`hooks/` Directory**:
   Custom React hooks for:

   - Form handling
   - Authentication state
   - Other reusable logic

9. **`types/` Directory**:
   TypeScript type definitions:
   - Database models
   - API responses
   - Shared interfaces

## Authentication Features

- Secure login with email/password
- OAuth support for social login
- Two-factor authentication (2FA)
- Password reset functionality
- Comprehensive logout with token invalidation
- Session management with refresh tokens

## Version

Current version: 0.2.7

## Recent Updates

### Role-Based Access Control Improvements
- Centralized user role management with TypeScript enums
- Enhanced role-based access control with improved type safety
- Streamlined authentication flow using SWR for data fetching
- Removed legacy Drizzle ORM dependencies for role management

### Authentication System
- Improved user role validation in protected routes
- Enhanced type safety for user roles across components
- Optimized role-based component rendering

### Version 0.2.5 (2024-12-17)

- Added SWR for efficient client-side data fetching
- Implemented route handlers for secure client-server communication
- Fixed environment variable access in client components
- Improved user profile fetching with proper Next.js patterns
- Enhanced type safety in API client and data fetching
- Updated client components to use route handlers instead of direct API calls

### Version 0.2.4 (2024-12-17)

- Enhanced password reset functionality with FastAPI backend
- Added password confirmation to new password form
- Implemented secure token-based password reset
- Added automatic redirect to login after password reset

### Version 0.2.3 (2024-12-17)

- Added "Forgot password?" link to login form
- Integrated password reset request with FastAPI
- Improved login form UX with better placeholders

### Version 0.2.2 (2024-12-16)

- Added comprehensive logout functionality
- Improved token cleanup during logout
- Enhanced error handling in logout flow

### Recent Updates

- Added comprehensive logout functionality
- Enhanced token management in API client
- Improved error handling in auth flows
- Updated API client structure for better type safety
- Improved authentication system with FastAPI backend integration
- Updated API client to handle server-side authentication
- Fixed registration and user management endpoints

## Creating Protected Routes and Admin Pages

### Protected Routes

All routes under `src/app/(protected)` are automatically protected by authentication middleware. To create a new protected route:

1. Create a new directory in `src/app/(protected)`
2. Add a `page.tsx` file with the following structure:

```typescript
"use client"

import { Card, CardHeader, CardContent } from "@/components/ui/card"

const YourNewProtectedPage = () => {
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Your Title</p>
      </CardHeader>
      <CardContent>
        {/* Your content here */}
      </CardContent>
    </Card>
  )
}

export default YourNewProtectedPage
```

### Admin-Only Pages

To create pages accessible only to administrators:

1. Create the page in `src/app/(protected)`
2. Use the `RoleGate` component to restrict access:

```typescript
"use client"

import { admin } from "@/actions/your-admin-action"
import { RoleGate } from "@/components/auth/role-gate"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { UserRole } from "@/db/schema/users"

const YourAdminPage = () => {
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin Page</p>
      </CardHeader>
      <CardContent>
        <RoleGate allowedRole={UserRole.ADMIN}>
          {/* Your admin-only content here */}
        </RoleGate>
      </CardContent>
    </Card>
  )
}

export default YourAdminPage
```

### Admin Server Actions

For admin-only backend operations, create server actions with role checks:

```typescript
// src/actions/your-admin-action.ts
"use server"

import { UserRole } from "@/db/schema/users"
import { currentRole } from "@/lib/current-user"

export const yourAdminAction = async () => {
  const role = await currentRole()

  if (role !== UserRole.ADMIN) {
    return { error: "Forbidden Server Action!" }
  }

  // Your admin-only logic here
  return { success: "Action completed!" }
}
```

### Key Points

1. All routes under `(protected)` require authentication
2. Use `RoleGate` for admin UI restrictions
3. Use `currentRole()` in server actions for admin-only operations
4. Follow the Card layout pattern for consistency
5. Keep server actions in the `actions` directory
6. Use existing UI components from `@/components/ui`

## Authentication Flow

1. User submits credentials through the login form
2. Credentials provider in `auth.ts` validates the email/password
3. If 2FA is enabled, a verification token is required
4. Upon successful authentication, a session is created
5. Protected routes check for valid session using middleware

## Database Setup

The project uses Drizzle ORM with:

- Type-safe schema definitions
- Migration system for database changes
- Connection pooling for better performance
- Separate schemas for different entities (users, tokens, etc.)

## Features

- Next.js 15+ with App Router
- TypeScript for type safety
- NextAuth.js for authentication
- Drizzle ORM for database operations
- Tailwind CSS for styling
- Docker support
- Environment variable validation
- Protected routes
- Two-factor authentication
