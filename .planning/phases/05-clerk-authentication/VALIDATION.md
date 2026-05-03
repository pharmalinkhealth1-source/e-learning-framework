# Phase 05: Clerk Authentication - Validation Strategy

**Gathered:** 2026-05-03
**Status:** Ready

## Acceptance Criteria (Nyquist Dimension 8)

| ID | Category | Requirement | Verification Method |
|----|----------|-------------|---------------------|
| V-01 | Security | Unauthenticated access to `/forum` redirects to `/sign-in` | `curl -I /forum` check for 302 |
| V-02 | UX | Sign-in page renders with Stripe `MeshGradient` background | DOM check for `#mesh-gradient` on `/sign-in` |
| V-03 | Data | Onboarding flow captures "Company Name" and saves to Clerk metadata | Manual verification of `publicMetadata` in Clerk dashboard |
| V-04 | Integration | Clerk user creation triggers Sanity document creation | GROQ query check for new `author` document |
| V-05 | RBAC | Middleware blocks Client role from Developer-only routes (if any) | Request from Client user to protected route |

## Verification Tools
- **Playwright**: End-to-end flow testing.
- **GROQ**: Verifying Sanity sync.
- **Clerk CLI**: Inspecting user metadata.
