# PharmaLink — Handover Document

This document is the operational handover for the PharmaLink platform. It describes what the platform is, how it is put together, who owns what, and how to run, transfer, back up, and operate it day to day. It is paired with [`DEPLOYMENT.md`](./DEPLOYMENT.md), which covers initial setup and hosting.

---

## 1. Platform Overview

PharmaLink is a Next.js 16 web application combining a public marketing site with a member portal. The portal hosts five primary modules:

| Module        | Route prefix                 | Purpose                                                                       |
|---------------|------------------------------|-------------------------------------------------------------------------------|
| E-learning    | `/elearning`                 | SCORM-capable LMS: courses, modules, lessons, quizzes, certificates, surveys. |
| Forum         | `/forum`                     | Member discussion: posts, comments, member spotlights.                        |
| Directory     | `/directory`                 | Searchable directory of pharmacies, partners, and members.                    |
| Careers       | `/careers`                   | Job openings authored in Sanity; applications submitted via API + Resend.     |
| Blog / Data   | `/blog`, `/insights`         | Editorial blog posts and data insights authored in Sanity.                    |

Auxiliary surfaces include `/onboarding` (role selection after sign-up), `/studio` (embedded Sanity Studio), and the marketing landing pages.

---

## 2. Architecture

```
                ┌───────────────────────────────────────────────┐
                │                  End User                     │
                │   (Browser — desktop / tablet / mobile)       │
                └───────────────────┬───────────────────────────┘
                                    │ HTTPS
                                    ▼
                ┌───────────────────────────────────────────────┐
                │   Vercel  ───  Next.js 16 (App Router)        │
                │                                               │
                │   • React Server Components                   │
                │   • API routes (/api/*)                       │
                │   • Embedded Sanity Studio (/studio)          │
                │   • Clerk middleware (src/middleware.ts)      │
                └───┬────────────┬────────────┬─────────────┬───┘
                    │            │            │             │
        Auth +      │   Content +│  Email     │   Cert PDFs │
        identity    │   LMS data │  delivery  │   binary    │
                    ▼            ▼            ▼             ▼
            ┌──────────────┐ ┌──────────┐ ┌─────────┐ ┌──────────────┐
            │    Clerk     │ │  Sanity  │ │ Resend  │ │ Vercel Blob  │
            │  (users,     │ │ (CMS &   │ │ (SMTP/  │ │ (certificate │
            │   sessions,  │ │  database│ │  trans- │ │  PDF store)  │
            │   metadata)  │ │  via API)│ │  ac'l)  │ │              │
            └──────────────┘ └──────────┘ └─────────┘ └──────────────┘
                    ▲
                    │ Webhook (user.created / user.updated)
                    │
            /api/webhooks/clerk → mirrors users to Sanity `author` docs
```

Key points:

- **No traditional database.** Sanity is the operational data store for both content and learning records.
- **No background workers.** All work happens in Next.js API routes (synchronous). Certificate PDFs are rendered on demand with `@react-pdf/renderer` and stored in Vercel Blob.
- **Clerk is the source of truth for identity.** Sanity mirrors users as `author` documents (id pattern `author-<clerkUserId>`).

---

## 3. User Roles

Roles are stored in Clerk `publicMetadata.role`. The onboarding handler (`src/app/api/auth/onboarding/route.ts`) accepts these values:

| Role         | Set via                       | Can access                                                                 |
|--------------|-------------------------------|----------------------------------------------------------------------------|
| `learner`    | Onboarding (default).         | Forum, e-learning courses, dashboard, certificates.                        |
| `pharmacy`   | Onboarding.                   | Forum, directory listing for their pharmacy.                               |
| `job_seeker` | Onboarding.                   | Forum, careers (apply to jobs).                                            |
| `employer`   | Onboarding.                   | Forum, careers (post jobs — via Sanity Studio).                            |
| `partner`    | Onboarding.                   | Forum, partner-facing content; donor reporting via Studio.                 |
| `admin`      | Onboarding **+ invite code**. | Everything above plus `/studio` editorial capability and metadata edits.   |

The middleware (`src/middleware.ts`) protects:

- `/forum/*`
- `/elearning/courses/*`
- `/elearning/dashboard/*`

Any signed-in user without `publicMetadata.onboarded=true` is redirected to `/onboarding` on every page except `/api/*` and `/onboarding` itself.

### LMS sub-roles

Within the e-learning module, the documentation/PRDs reference three operational roles. These are administrative distinctions within the `admin` role rather than separate Clerk roles:

| LMS role          | Responsibility                                                          |
|-------------------|-------------------------------------------------------------------------|
| `program_manager` | Authors courses, modules, lessons, quizzes; manages enrollment.         |
| `partner_donor`   | Reviews learner outcomes; receives spotlight/impact reports.            |
| `system_admin`    | Full platform access; can promote/demote users in Clerk; manages keys.  |

If you need to enforce these in code, extend the Clerk `publicMetadata` with a sub-role field and gate the relevant API routes.

---

## 4. Data Ownership

| Data class                                                                                                                                                       | System         | Notes                                                          |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|----------------------------------------------------------------|
| Course content (course, courseModule, lesson, quiz)                                                                                                              | Sanity         | Authored in Studio. Public-readable.                           |
| Learner records (enrollment, lessonProgress, surveyResponse, certificate, notification)                                                                          | Sanity         | Written by `/api/lms/*` server routes using the write token.   |
| Editorial content (blogPost, forumPost, comment, dataInsight, memberSpotlight, directoryItem, jobOpening, author)                                                | Sanity         | Authored in Studio (or mirrored, in the case of `author`).     |
| User identity (email, names, social logins, sessions, MFA)                                                                                                       | Clerk          | Never duplicated in Sanity except for display name + image.    |
| Role / onboarding state                                                                                                                                          | Clerk metadata | `publicMetadata.role`, `publicMetadata.onboarded`.             |
| Certificate PDFs                                                                                                                                                 | Vercel Blob    | Object key `certificates/<certId>.pdf`. URLs stored in Sanity. |
| Transactional email logs                                                                                                                                         | Resend         | Retained by Resend per their retention policy.                 |

### Exporting data

| System      | Export procedure                                                                                                                                                          |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Sanity      | `npx sanity dataset export production ./backup-$(date +%F).tar.gz` (run from project root with `.env.local` populated). Includes documents and asset references.          |
| Clerk       | Clerk dashboard → **Users** → **Export** → CSV (full user list with metadata). For programmatic exports use the Backend API.                                              |
| Vercel Blob | Use the `@vercel/blob` SDK or the Vercel CLI: `vercel blob ls` and `vercel blob download <key>`. Or rebuild on demand from Sanity `certificate.blobUrl` references.       |
| Resend      | Resend dashboard → **Emails** → filter and CSV export. Sent emails are also reproducible from app logs.                                                                   |
| Code        | The Git repository is the source of truth. Mirror to a new origin with `git clone --mirror` and `git push --mirror`.                                                      |

---

## 5. Transferring the Platform

When ownership transfers to a new organisation, do **all** of the following in order. The platform will be unavailable briefly during DNS cut-over; everything else is online.

### 5.1 GitHub repository

1. GitHub → repository → **Settings** → **Transfer ownership**.
2. Enter the destination org/user and confirm.
3. The new owner accepts the transfer in their GitHub notifications.

### 5.2 Vercel project

1. Vercel dashboard → project → **Settings** → **Advanced** → **Transfer project**.
2. Select the destination Vercel team. The new owner must already be a member of that team or accept the invitation.
3. After transfer, re-verify that all environment variables (section 2 of `DEPLOYMENT.md`) are present in the new team's project.

### 5.3 Sanity project

1. Sanity dashboard → project → **Settings** → **Project transfer** (or contact Sanity support if the option is not visible for your plan).
2. Enter the destination owner's email.
3. Confirm. The destination must accept the transfer.
4. After transfer, **regenerate the write token** and update `SANITY_API_WRITE_TOKEN` in Vercel.

### 5.4 Clerk application

1. Clerk dashboard → application → **Settings** → **Transfer ownership** (or contact Clerk support).
2. The destination accepts in their dashboard.
3. After transfer, regenerate the secret key and webhook signing secret and update `CLERK_SECRET_KEY` and `CLERK_WEBHOOK_SECRET` in Vercel.

### 5.5 Resend account

Resend does not currently support inline account transfer. Options:

- Add the new team to the Resend organisation, then have them generate a new API key and remove old members.
- Or create a new Resend account in the destination organisation, verify the sending domain there, and update `RESEND_API_KEY` in Vercel.

### 5.6 Vercel Blob

Blob is bound to the Vercel project, so it follows the Vercel transfer automatically. The `BLOB_READ_WRITE_TOKEN` is re-issued by Vercel; verify it is present after transfer.

### 5.7 DNS

1. The new owner adds the custom domain on their Vercel project.
2. Update the DNS records at the registrar to point to the new project (Vercel will give the records).
3. Reconfigure Clerk allowed origins and Sanity CORS origins to the new project's preview domains if those change.

### 5.8 Post-transfer checklist

- [ ] Sanity write token rotated and updated in Vercel.
- [ ] Clerk secret key rotated and updated in Vercel.
- [ ] Clerk webhook signing secret rotated and updated in Vercel.
- [ ] Resend API key rotated and updated in Vercel.
- [ ] `ADMIN_INVITE_CODE` rotated and re-distributed.
- [ ] Vercel Blob token verified.
- [ ] DNS verified; HTTPS active.
- [ ] Test sign-up → onboarding → forum flow on production.
- [ ] Test course enrollment, lesson progress, certificate issuance.
- [ ] Verify Sanity webhook delivers `author` upserts.

---

## 6. Backup Procedures

| What                  | Cadence  | How                                                                                                                                                 |
|-----------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| Sanity dataset        | Weekly   | `npx sanity dataset export production ./backups/sanity-$(date +%F).tar.gz`. Run via cron on a backup host with `.env.local` populated, or via CI.   |
| Clerk users           | Monthly  | Dashboard → **Users** → **Export CSV**. Store with backups. For programmatic backups, the Clerk Backend API exposes a paginated `users` list.       |
| Vercel Blob (certs)   | On change| Certificates are idempotent and reproducible from Sanity records. For belt-and-braces, mirror with `vercel blob ls` + `vercel blob download` script.|
| Code                  | Continuous | The Git remote is the source of truth. Mirror nightly to a secondary remote: `git push --mirror <secondary>`.                                     |
| Environment variables | On change| Store a copy of all env vars in a secure secret manager (1Password, HashiCorp Vault, etc.). Do not commit them to Git.                              |

### Restore drill

Verify the backup process at least quarterly:

1. Spin up a new Sanity project with `production-restore-test` dataset.
2. `npx sanity dataset import ./backups/sanity-YYYY-MM-DD.tar.gz production-restore-test`.
3. Confirm document counts match the live dataset.
4. Tear down the test project.

---

## 7. Common Operations

### 7.1 Add a new course

1. Sign in to `/studio` as an admin.
2. **Course** → **Create new**. Fill in `title`, `slug`, `description`, `passingScore` (default 70), modules, lessons, quizzes.
3. Publish. The course appears at `/elearning/courses/<slug>` once at least one module + lesson is attached.

### 7.2 Add an admin

**Option A — Self-service with invite code (preferred):**

1. Share `ADMIN_INVITE_CODE` with the new admin over a secure channel.
2. They sign up at `/sign-up`, complete `/onboarding`, select role `admin`, and paste the code.
3. They are granted `publicMetadata.role = 'admin'` on success.

**Option B — Direct promotion in Clerk:**

1. Clerk dashboard → **Users** → select the user.
2. **Metadata** → **Public metadata** → set:
   ```json
   { "role": "admin", "onboarded": true }
   ```
3. Save. The change takes effect on the user's next request.

To grant Sanity Studio access in addition, invite the user as a Sanity project member (dashboard → Members → Invite). Clerk admin role alone does not grant Sanity editorial rights.

### 7.3 View student progress

In Studio:

- **LessonProgress** documents — one per learner per lesson. Track `completed`, `postTestScore`, `timeSpent`, etc.
- **Enrollment** documents — top-level per-course enrollment record.
- **SurveyResponse** documents — course exit survey responses.
- **Certificate** documents — issued certificates with `tier`, `score`, `issuedAt`, `expiresAt`, `blobUrl`.

For ad-hoc queries, use the Studio **Vision** plugin. Example — all certificates issued in the last 30 days:

```groq
*[_type == "certificate" && issuedAt > now() - 60*60*24*30]{
  userId, courseId, tier, score, issuedAt, blobUrl
} | order(issuedAt desc)
```

### 7.4 Issue a certificate manually

Certificates are normally issued automatically once a learner completes the post-test and submits the exit survey. To issue manually for a specific user/course combination, POST to the certificate endpoint:

```bash
curl -X POST https://your-domain/api/lms/certificate \
  -H "Cookie: __session=<the user's Clerk session cookie>" \
  -H "Content-Type: application/json" \
  -d '{"courseId":"<sanity-course-id>"}'
```

The endpoint:

1. Verifies a `surveyResponse` exists for the user/course (returns 400 otherwise).
2. Computes the tier (`accomplishment` if `postTestScore >= course.passingScore`, else `participation`).
3. Renders the PDF with `@react-pdf/renderer`.
4. Uploads to Vercel Blob at `certificates/cert_<userId>_<courseId>.pdf`.
5. Writes a `certificate` document and a `notification` document.
6. Returns `{ blobUrl, tier }`.

Note: the endpoint requires a logged-in session for the **target user**. To issue on behalf of another user, you must impersonate via Clerk (Users → Impersonate) or temporarily script with a server-only token.

### 7.5 Manage notifications

Notifications are surfaced to learners in the dashboard.

- **Read all:** `/studio` → **Notification** documents → filter by `userId`.
- **Mark as read:** edit `read: true` in Studio, or PATCH via `/api/lms/notifications`.
- **Create:** Studio → **Notification** → New. Set `userId`, `type`, `message`, `read: false`, `createdAt`.

### 7.6 Add or edit blog posts, jobs, directory entries, member spotlights

All authored content lives in Sanity. From Studio:

- **Blog post** → publishes to `/blog/<slug>`.
- **Job opening** → publishes to `/careers` and listings.
- **Directory item** → published in the `/directory`.
- **Member spotlight** → surfaced on the forum/landing pages.

### 7.7 Rotate secrets

- **Clerk secret key:** dashboard → API Keys → roll. Update `CLERK_SECRET_KEY` in Vercel and redeploy.
- **Clerk webhook signing secret:** Webhooks → endpoint → roll. Update `CLERK_WEBHOOK_SECRET`.
- **Sanity write token:** API → Tokens → delete + create new. Update `SANITY_API_WRITE_TOKEN`.
- **Admin invite code:** generate a new random string. Update `ADMIN_INVITE_CODE`.
- **Resend API key:** Resend dashboard → API Keys → roll. Update `RESEND_API_KEY`.

After any rotation, redeploy on Vercel so the running functions pick up the new value.

---

## 8. Monitoring & Logs

| Surface             | Where                                                                                                  |
|---------------------|--------------------------------------------------------------------------------------------------------|
| Application logs    | Vercel dashboard → project → **Logs** (live) or **Functions** → function name → **Logs** (per route). |
| Build logs          | Vercel dashboard → project → **Deployments** → deployment → **Build Logs**.                            |
| Sanity API usage    | Sanity dashboard → project → **Usage** (requests, bandwidth, document count, quota).                   |
| Sanity webhook log  | Sanity dashboard → API → Webhooks (if outbound webhooks are configured).                               |
| Clerk webhook log   | Clerk dashboard → Webhooks → endpoint → **Message Attempts** (status, payload, retry).                 |
| Email delivery      | Resend dashboard → **Emails** (status, opens if tracked, bounces).                                     |
| Blob storage usage  | Vercel dashboard → **Storage** → Blob.                                                                 |

Recommended alerting:

- Vercel: enable email/Slack notifications for failed deployments.
- Clerk: monitor webhook delivery failures; investigate any sustained non-2xx.
- Sanity: set quota alert at 80% of plan limits.

---

## 9. Support Contacts

> Replace the placeholders below with verified contacts during handover.

| Role                            | Contact         | Notes                                          |
|---------------------------------|-----------------|------------------------------------------------|
| PharmaLink product owner        | _TBD_           | Strategic direction, content approvals.        |
| PharmaLink technical lead       | _TBD_           | Architecture, deploy authority.                |
| Primary on-call developer       | _TBD_           | First responder for outages.                   |
| Sanity organisation owner       | _TBD_           | Billing and project transfer authority.        |
| Clerk organisation owner        | _TBD_           | Billing and application transfer authority.    |
| Vercel team owner               | _TBD_           | Billing and project transfer authority.        |
| Domain registrar account holder | _TBD_           | DNS changes.                                   |

### Vendor support

| Vendor | URL                                | Notes                                            |
|--------|------------------------------------|--------------------------------------------------|
| Vercel | <https://vercel.com/support>       | Free/Pro/Enterprise tiers; ticketing in dashboard. |
| Sanity | <https://www.sanity.io/contact/support> | Community Slack at <https://slack.sanity.io>.     |
| Clerk  | <https://clerk.com/support>        | In-app chat; email `support@clerk.com`.          |
| Resend | <https://resend.com/contact>       | Email `support@resend.com`.                      |

---

## 10. Appendix — Code map

| Concern                            | Path                                                                                                          |
|------------------------------------|---------------------------------------------------------------------------------------------------------------|
| Pages (App Router)                 | `src/app/`                                                                                                    |
| Auth middleware                    | `src/middleware.ts`                                                                                           |
| API routes                         | `src/app/api/`                                                                                                |
| Clerk webhook                      | `src/app/api/webhooks/clerk/route.ts`                                                                         |
| Onboarding                         | `src/app/api/auth/onboarding/route.ts`                                                                        |
| LMS — certificate issuance        | `src/app/api/lms/certificate/route.ts`                                                                        |
| LMS — enrollment                  | `src/app/api/lms/enroll/route.ts`                                                                             |
| LMS — quiz submit                 | `src/app/api/lms/quiz-submit/route.ts`                                                                        |
| LMS — survey                      | `src/app/api/lms/survey/route.ts`                                                                             |
| LMS — SCORM upload/commit         | `src/app/api/lms/scorm-upload/route.ts`, `src/app/api/lms/scorm-commit/route.ts`                              |
| Careers application                | `src/app/api/careers/apply/route.ts`                                                                          |
| Sanity client (read)               | `src/sanity/lib/client.ts`                                                                                    |
| Sanity client (write)              | `src/sanity/lib/write-client.ts`                                                                              |
| Sanity schema types                | `src/sanity/schemaTypes/`                                                                                     |
| Sanity Studio config               | `sanity.config.ts`, `sanity.cli.ts`                                                                           |
| Next.js config                     | `next.config.ts`                                                                                              |
| Tailwind / styling                 | `src/app/globals.css`, project Tailwind config                                                                |

---

_See `DEPLOYMENT.md` for installation, environment configuration, and first-time deployment._
