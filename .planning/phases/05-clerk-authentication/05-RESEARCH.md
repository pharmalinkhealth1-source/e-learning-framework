# Phase 5: Clerk Authentication - Research

## Technical Approach: Custom Auth UI
To achieve Stripe-fidelity, we will use the "Build your own" approach with Clerk.
- **Hooks**: `useSignIn`, `useSignUp`, `useAuth`.
- **Pages**: `/sign-in`, `/sign-up`, `/onboarding`.
- **Components**: Reusable `AuthLayout` featuring the `MeshGradient`.

## Role Management
Roles will be stored in Clerk's `publicMetadata`.
- **Keys**: `role: "client" | "developer" | "partner"`.
- **Updating**: via Clerk Backend SDK (`clerkClient.users.updateUserMetadata`).

## Middleware Logic
- **File**: `src/middleware.ts`
- **Strategy**: Use `authMiddleware` (older) or `clerkMiddleware` (newer). We will use `clerkMiddleware` for Next.js 15 compatibility.
- **Protected Routes**: `/forum(.*)`.

## Sanity Sync Pattern
- **Webhook**: Clerk `user.created` and `user.updated` events.
- **API**: Next.js Route Handler at `/api/webhooks/clerk`.
- **Security**: Verify signature using `svix`.
- **Target**: Create/Update `author` or `user` document in Sanity.

## Dependencies Needed
- `@clerk/nextjs`
- `svix` (for webhooks)

## Validation Architecture
- **Auth**: Redirect to `/forum` fails for unauthenticated users.
- **Metadata**: Authenticated user session contains the correct role in `publicMetadata`.
- **Sync**: Creating a user in Clerk results in a matching document in Sanity.
