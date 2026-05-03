# Phase 5: Clerk Authentication - Context

**Gathered:** 2026-05-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Implementation of secure user lifecycle management using Clerk, including custom branded auth pages (Stripe-fidelity), role-based access control, and onboarding data collection.

</domain>

<decisions>
## Implementation Decisions

### Auth UI Strategy
- **D-01:** Build fully custom UI using Clerk Hooks (`useSignIn`, `useSignUp`) rather than embedded components to maintain 100% fidelity to the Stripe design system.
- **D-02:** Auth pages must incorporate the `MeshGradient` and `HDS` tokens.

### Role & Metadata Storage
- **D-03:** Store primary user roles (Client, Developer, Partner) in Clerk `publicMetadata` for middleware performance.
- **D-04:** Sync essential user profile data to Sanity for forum attribution and long-term profile storage.

### Access Control Policy
- **D-05:** Only the **/forum** route and its sub-pages are protected by authentication middleware.
- **D-06:** Careers, Directory, and Marketing pages remain public.

### Onboarding Flow
- **D-07:** Implement a post-signup onboarding step to collect "Company Name" and "Primary Use Case" to mirror the Stripe onboarding experience.

### the agent's Discretion
- Technical implementation of the Sanity-Clerk webhook sync.
- Choice of Clerk's development vs production environment setup.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Core
- `src/middleware.ts` — Authentication boundary
- `.planning/ROADMAP.md` — Phase 5 goals
- `.planning/REQUIREMENTS.md` — Global security constraints

### Design System
- `src/styles/tokens.css` — HDS Design Tokens
- `src/components/stripe/MeshGradient.tsx` — Visual background for auth pages

</canonical_refs>

<specifics>
## Specific Ideas
- The signup form should use the high-fidelity input styles defined in Phase 1.
- Role selection should be presented as a clean choice during the onboarding step.

</specifics>

<deferred>
## Deferred Ideas
- Social login (Google/GitHub) — initial focus is email/password for fidelity.
- Multi-factor authentication (MFA) setup.
</deferred>

---

*Phase: 05-clerk-authentication*
*Context gathered: 2026-05-03 via user discussion*
