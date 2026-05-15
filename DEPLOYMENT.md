# PharmaLink — Deployment Guide

This guide describes how to set up, host, and deploy the PharmaLink e-learning platform from a fresh environment. It is intended for an IT team with general web development experience.

The platform is a [Next.js 16](https://nextjs.org/) application (App Router) using [Sanity](https://www.sanity.io/) as the CMS/database, [Clerk](https://clerk.com/) for authentication, [Resend](https://resend.com/) for transactional email, [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) for certificate PDF storage, and Vercel for hosting.

---

## 1. Prerequisites

| Tool    | Version           | Notes                                                                 |
|---------|-------------------|-----------------------------------------------------------------------|
| Node.js | 20.x LTS or newer | `@types/node` is pinned to v20. Next.js 16 requires Node 20+.         |
| npm     | 10.x or newer     | Bundled with Node 20. The repo ships a `package-lock.json` for npm.   |
| Git     | 2.30+             | Required for cloning and for Vercel/GitHub integration.               |
| Sanity CLI | latest         | Installed on demand via `npx sanity ...`. No global install required. |

> The repository does not include a `.nvmrc` or `engines` field. Use Node 20 LTS unless you have a specific reason to use a later version. Verify with `node --version`.

---

## 2. Environment Variables

All environment variables required to run the app. Variables prefixed `NEXT_PUBLIC_` are exposed to the browser. Everything else is server-only and must never be checked in or exposed to the client.

| Variable                              | Scope       | Required | Description                                                                                          | Where to obtain                                                                                       |
|---------------------------------------|-------------|----------|------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`       | Public      | Yes      | Sanity project ID (8-char string, e.g. `a1b2c3d4`).                                                  | Sanity dashboard → Project → Settings → API.                                                          |
| `NEXT_PUBLIC_SANITY_DATASET`          | Public      | Yes      | Sanity dataset name. Production should use `production`.                                             | Created when you create the Sanity project. Default is `production`.                                  |
| `NEXT_PUBLIC_SANITY_API_VERSION`      | Public      | Yes      | Sanity API version date. Use `2024-05-03` (matches `.env.example`).                                  | Pin to a date; do not use `vX`.                                                                       |
| `SANITY_API_WRITE_TOKEN`              | **Server**  | Yes      | Write token used by server routes (enrollment, certificates, notifications, SCORM uploads).          | Sanity dashboard → Project → API → Tokens → Add API token → Permissions: **Editor** or **Write**.     |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`   | Public      | Yes      | Clerk publishable key (`pk_live_...` or `pk_test_...`).                                              | Clerk dashboard → API Keys.                                                                           |
| `CLERK_SECRET_KEY`                    | **Server**  | Yes      | Clerk secret key (`sk_live_...` or `sk_test_...`).                                                   | Clerk dashboard → API Keys.                                                                           |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`       | Public      | Yes      | Sign-in route. Set to `/sign-in`.                                                                    | Static.                                                                                                |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`       | Public      | Yes      | Sign-up route. Set to `/sign-up`.                                                                    | Static.                                                                                                |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Public      | Yes      | Post sign-in redirect. Set to `/forum`.                                                              | Static.                                                                                                |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Public      | Yes      | Post sign-up redirect. Set to `/onboarding`.                                                         | Static.                                                                                                |
| `CLERK_WEBHOOK_SECRET`                | **Server**  | Yes      | Svix signing secret for the Clerk → Sanity user-sync webhook.                                        | Clerk dashboard → Webhooks → Endpoint → Signing secret.                                               |
| `ADMIN_INVITE_CODE`                   | **Server**  | Yes      | Shared secret required at onboarding to claim the `admin` role. Distribute internally only.          | You generate this. Use a random 20+ char string (e.g. `openssl rand -hex 24`).                        |
| `RESEND_API_KEY`                      | **Server**  | Yes      | Resend API key used to send transactional email (certificates, notifications, careers applications). | Resend dashboard → API Keys → Create API key.                                                         |
| `BLOB_BASE_URL`                       | **Server**  | Optional | Override base URL for the Vercel Blob store. Set only if using a custom blob domain.                 | Vercel dashboard → Storage → Blob.                                                                    |

A `BLOB_READ_WRITE_TOKEN` is also required at runtime for `@vercel/blob` to upload certificate PDFs. When deployed on Vercel and connected to a Blob store, this token is provisioned automatically. For local development, copy it from the Vercel dashboard → Storage → Blob → `.env.local` snippet.

### Setting variables locally

Copy `.env.example` to `.env.local` at the repo root and fill in every value listed above. `.env.local` is gitignored.

```bash
cp .env.example .env.local
# then edit .env.local
```

### Setting variables on Vercel

Vercel dashboard → your project → Settings → Environment Variables. Add each variable for the `Production`, `Preview`, and `Development` environments as appropriate. Server-only variables must **not** be prefixed with `NEXT_PUBLIC_`.

---

## 3. Sanity Setup

Sanity is the system of record for all content and learning data: courses, lessons, quizzes, lesson progress, enrollments, certificates, survey responses, notifications, blog posts, forum posts, directory entries, job openings, data insights, authors, comments, and member spotlights.

### 3.1 Create the project

1. Sign up at <https://www.sanity.io/>.
2. Create a new project. Name it `PharmaLink` (or as required).
3. When prompted, create a dataset called `production` (public or private — private is recommended for handover).
4. Copy the **Project ID** from Project Settings → API. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` to this value.
5. Set `NEXT_PUBLIC_SANITY_DATASET=production`.

### 3.2 Create the write token

1. Sanity dashboard → API → Tokens → **Add API token**.
2. Name: `pharmalink-server`. Permissions: **Editor** (or any role with write access to all document types).
3. Copy the token immediately (it cannot be retrieved later). Set `SANITY_API_WRITE_TOKEN` to this value.

### 3.3 Configure CORS origins

Sanity dashboard → API → CORS origins → Add CORS origin:

- `http://localhost:3000` (credentials: allow) — for local development
- `https://your-production-domain` (credentials: allow) — for production
- Any preview domain you intend to serve Studio from

### 3.4 Deploy the Studio schema

The embedded Studio is served at `/studio` (configured in `sanity.config.ts`). Schema deployment is what makes the GraphQL/Live APIs aware of the document types. Run once after setting env vars:

```bash
npx sanity deploy
```

You will be prompted to choose a `<subdomain>.sanity.studio` hostname. This hostname hosts the **stand-alone** Studio. Day-to-day editors use the embedded Studio at `https://your-domain/studio`, so the stand-alone hostname is optional.

To redeploy after schema changes:

```bash
npx sanity deploy
```

### 3.5 Document types

The full set of schema types is defined in `src/sanity/schemaTypes/index.ts`:

```
forumPost, directoryItem, jobOpening, dataInsight, author, comment,
course, courseModule, lesson, quiz,
lessonProgress, surveyResponse, certificate, enrollment, notification,
memberSpotlight, blogPost
```

---

## 4. Clerk Setup

Clerk handles all authentication and stores user identity. User profile data (role, onboarding flag, etc.) is stored in Clerk `publicMetadata`. Authors are mirrored to Sanity via webhook.

### 4.1 Create the application

1. Sign up at <https://clerk.com/>.
2. Create a new application. Enable **Email** as the primary identifier; enable Google/social providers as required.
3. From the **API Keys** screen, copy the **Publishable key** and **Secret key**:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...`
   - `CLERK_SECRET_KEY=sk_live_...`

### 4.2 Configure paths

In **Paths** (or the corresponding section in the dashboard), set:

| Setting                | Value          |
|------------------------|----------------|
| Sign-in URL            | `/sign-in`     |
| Sign-up URL            | `/sign-up`     |
| After sign-in URL      | `/forum`       |
| After sign-up URL      | `/onboarding`  |

These must match the `NEXT_PUBLIC_CLERK_*` env vars.

### 4.3 Configure the webhook

The Clerk → Sanity sync runs on user create/update events. The handler lives at `src/app/api/webhooks/clerk/route.ts`.

1. Clerk dashboard → **Webhooks** → **Add endpoint**.
2. Endpoint URL: `https://your-domain/api/webhooks/clerk`.
3. Subscribed events: `user.created`, `user.updated`.
4. Copy the **Signing secret** (`whsec_...`) and set `CLERK_WEBHOOK_SECRET`.
5. Save and send a test event. Verify a 200 response and that an `author-<userId>` document appears in Sanity.

### 4.4 Allowed origins

Clerk dashboard → **Domains**. Add your production domain (and any preview domains) so Clerk accepts sessions from those hosts.

---

## 5. Local Development

```bash
# 1. Clone
git clone <repo-url> pharmalink
cd pharmalink

# 2. Install dependencies
npm install

# 3. Environment
cp .env.example .env.local
# edit .env.local with the values from sections 2–4

# 4. Run the dev server
npm run dev
```

The app is served at <http://localhost:3000>. The embedded Sanity Studio is at <http://localhost:3000/studio>.

Useful scripts (`package.json`):

| Script           | Purpose                                  |
|------------------|------------------------------------------|
| `npm run dev`    | Start Next.js in development mode.       |
| `npm run build`  | Production build.                        |
| `npm run start`  | Start the production server (post-build).|
| `npm run lint`   | Run ESLint.                              |

---

## 6. Production Deployment on Vercel

The application is designed to deploy on Vercel without additional configuration. There is no `vercel.json` — Vercel auto-detects the Next.js app.

### 6.1 Connect the repository

1. Push the code to a GitHub (or GitLab/Bitbucket) repository.
2. Vercel dashboard → **Add New** → **Project** → import the repository.
3. Framework preset: **Next.js** (auto-detected). Build command: `next build` (default). Output: `.next` (default).

### 6.2 Set environment variables

Settings → Environment Variables. Add **every** variable from section 2. Tick `Production`, `Preview`, and `Development` as needed.

> **Critical:** `SANITY_API_WRITE_TOKEN`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`, `ADMIN_INVITE_CODE`, and `RESEND_API_KEY` must **not** have the `NEXT_PUBLIC_` prefix. Exposing them in the browser would compromise the platform.

### 6.3 Add a Vercel Blob store

Storage → Blob → **Create**. This auto-provisions `BLOB_READ_WRITE_TOKEN` in the project environment. Certificates are written to `certificates/<certId>.pdf` with `access: 'private'`.

### 6.4 Deploy

Trigger a deployment (push to the production branch, or click **Deploy** in the dashboard). The first build will take several minutes; subsequent incremental deploys are faster.

### 6.5 Post-deploy verification

After the first deploy:

1. Visit the production URL. The landing page should render.
2. Sign up with a test account. Confirm redirect to `/onboarding`.
3. Complete onboarding as a `learner`. Confirm redirect to `/forum`.
4. Confirm a corresponding `author-<userId>` document appears in Sanity Studio.
5. Visit `/studio`. Sign in with a Sanity account that has access to the project.

---

## 7. Custom Domain

1. Vercel dashboard → **Domains** → **Add**. Enter your domain (e.g. `pharmalink.gov`).
2. Configure DNS as Vercel instructs (A record / CNAME / `_vercel` verification).
3. Wait for SSL provisioning (usually under 5 minutes).
4. **Update Clerk allowed origins** (section 4.4) to include the new domain.
5. **Update Sanity CORS origins** (section 3.3) to include the new domain.
6. **Update the Clerk webhook endpoint** (section 4.3) to point at the new domain.
7. Update any hard-coded URLs in environment variables (e.g. `BLOB_BASE_URL` if customised).

---

## 8. Sanity Studio

The Studio is the day-to-day editorial interface for non-technical staff.

- **URL:** `https://your-domain/studio` (embedded) and optionally `https://<subdomain>.sanity.studio` (stand-alone, after `npx sanity deploy`).
- **Login:** Editors sign in with the Sanity account that has been invited to the project. Invite users at Sanity dashboard → **Members** → **Invite**.
- **What admins can do:**
  - Create/edit/publish/unpublish all document types (courses, lessons, quizzes, blog posts, forum posts, directory entries, jobs, member spotlights, etc.).
  - Inspect learner data: `lessonProgress`, `enrollment`, `surveyResponse`, `certificate`, `notification` documents.
  - Use the **Vision** plugin (top nav) to run GROQ queries against the dataset.

The Studio is exposed via the Next.js `(studio)` route group. Access is restricted to users with a Sanity login — there is no separate password.

---

## 9. Admin Invite Code

The `admin` role is gated by a shared secret (`ADMIN_INVITE_CODE`). The onboarding handler `src/app/api/auth/onboarding/route.ts` rejects any `role=admin` request whose `inviteCode` field does not match.

### Generating the code

```bash
openssl rand -hex 24
```

Set the result as `ADMIN_INVITE_CODE` in Vercel and `.env.local`.

### Distribution

- Share only via a secure channel (password manager, internal secret store).
- Rotate immediately if leaked. After rotation, any pending admin sign-ups will fail until the new code is distributed.
- The code is **only** used during the onboarding form; after a user has claimed admin role it is recorded in their Clerk `publicMetadata.role` and the code is no longer consulted.

### Promoting an existing user to admin without the code

Clerk dashboard → **Users** → select user → **Metadata** → **Public**:

```json
{ "role": "admin", "onboarded": true }
```

---

## 10. Reference: file map

| Concern                | Path                                              |
|------------------------|---------------------------------------------------|
| Sanity client config   | `src/sanity/env.ts`, `src/sanity/lib/client.ts`   |
| Sanity write client    | `src/sanity/lib/write-client.ts`                  |
| Sanity schema types    | `src/sanity/schemaTypes/`                         |
| Sanity Studio config   | `sanity.config.ts`, `sanity.cli.ts`               |
| Clerk middleware       | `src/middleware.ts`                               |
| Clerk webhook handler  | `src/app/api/webhooks/clerk/route.ts`             |
| Onboarding endpoint    | `src/app/api/auth/onboarding/route.ts`            |
| LMS API routes         | `src/app/api/lms/` (certificate, enroll, progress, quiz-submit, scorm-upload, scorm-commit, survey, dashboard, notifications, register) |
| Careers application    | `src/app/api/careers/apply/route.ts`              |
| Forum API              | `src/app/api/forum/`                              |
| Next.js config         | `next.config.ts`                                  |

---

## 11. Troubleshooting

| Symptom                                                              | Likely cause                                                                                          |
|----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| 500 on `/api/webhooks/clerk` and "no svix headers" in logs           | Request is not coming from Clerk (or signature secret is wrong). Verify `CLERK_WEBHOOK_SECRET`.       |
| Authors not syncing to Sanity                                        | Webhook endpoint not subscribed to `user.created`/`user.updated`, or `SANITY_API_WRITE_TOKEN` invalid.|
| Certificate generation fails                                          | Missing `BLOB_READ_WRITE_TOKEN`, missing survey response for the course, or invalid `courseId`.       |
| `/studio` 404                                                         | Build did not include the `(studio)` route group. Rebuild and redeploy.                               |
| Sign-up redirects to `/onboarding` then loops                        | Clerk `publicMetadata.onboarded` is not being set. Inspect `/api/auth/onboarding` response.           |
| `Sanity sync error` in webhook logs                                   | CORS or token issue. Re-issue the write token and update Vercel env.                                  |
