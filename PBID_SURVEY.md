# PBID Digital Training Exit Interview — Survey

A standalone, passcode-gated survey for Takeda's Pharmacy-Based Immunization Delivery (PBID) digital training programme. Learners complete it immediately after the post-training knowledge check.

---

## Route

```
/surveys/pbid
```

Not linked from any navigation element. Not indexed by search engines (`noindex, nofollow`). Direct URL access only.

---

## Environment Variables

Add these to `.env.local` (and to Vercel project environment variables):

| Variable | Required | Description |
|---|---|---|
| `PBID_SURVEY_CODE` | Optional | Access code shown to learners. Omit to leave survey open to anyone with the URL. Case-insensitive. |
| `PBID_EXPORT_SECRET` | Recommended | Bearer token protecting the CSV export endpoint. Omit to leave export unprotected. |

Example:
```
PBID_SURVEY_CODE=TAKEDA2025
PBID_EXPORT_SECRET=a-long-random-secret-string
```

---

## Passcode Gate

When `PBID_SURVEY_CODE` is set, visitors see a code-entry screen before the survey. The validated state is stored in `localStorage` so learners are not re-prompted on the same device. The code is validated server-side at `POST /api/surveys/pbid/auth`.

---

## Survey Structure

Three stepped sections rendered as a single-page flow with a progress bar.

### Section 1 — Digital Training Experience
| Question | Type | Conditional on |
|---|---|---|
| Q100 — Device(s) used | Multi-checkbox | — |
| Q101 — Most-used device | Radio (derived from Q100) | Q100 ≥ 2 selections |
| Q101-2 — Device owner | Radio | Q101 = "Non-smart phone" |
| Q102 — Technical challenges | Multi-checkbox | — |
| Q102-2 — Technical barrier severity | Radio | Q102 has any selection other than "None of these" |
| Q103 — Logistical challenges | Multi-checkbox | — |
| Q103-2 — Logistical barrier severity | Radio | Q103 has any selection other than "None of these" |
| Q104 — When training done | Radio | — |
| Q105 — Where training done | Radio | — |
| Q105-2 — Other location (text) | Text input | Q105 = "Other" |

### Section 2 — Quality of Training & Readiness
| Question | Type | Conditional on |
|---|---|---|
| Q200 — Overall comprehensiveness | Radio | — |
| Q201 — What liked (multi) | Multi-checkbox | — |
| Q201-1 — Other liked (text) | Text input | Q201 includes "Other" |
| Q201-2 — Most liked | Radio (derived from Q201) | Q201 ≥ 2 non-"None" selections |
| Q202 — What disliked (multi) | Multi-checkbox | — |
| Q203-1 — Other disliked (text) | Text input | Q202 includes "Other" |
| Q203-2 — Most disliked | Radio (derived from Q202) | Q202 ≥ 2 non-"None" selections |
| Q204 — Format preference | Radio | — |

### Section 3 — Feasibility & Acceptability (Likert Scale)
16 statements rated 1 (Strongly Disagree) → 5 (Strongly Agree). Questions Q300–Q315. All required.

---

## Sanity CMS

### Document Types Added

**`pbidSurveyResponse`** — one document per submission.

| Field | Type | Notes |
|---|---|---|
| `submittedAt` | datetime | Auto-set on submission |
| `sessionId` | string | UUID, for deduplication |
| `responses` | text | Full JSON of all answers |
| `surveyVersion` | string | Currently `"1.0"` |

**`pbidSurveyConfig`** — singleton, controls survey behaviour from Studio.

| Field | Type | Notes |
|---|---|---|
| `title` | string | Survey heading shown to learner |
| `introText` | text | Description shown above form |
| `completionMessage` | text | Shown on successful submit |
| `isActive` | boolean | Set to `false` to close survey without deploying |

### Viewing Responses in Studio

Navigate to **PBID Survey Response** in the Sanity Studio sidebar (`/studio`). Each document shows the submission timestamp and session ID. The `responses` field contains the full JSON payload.

---

## CSV Export

```
GET /api/surveys/pbid/export
Authorization: Bearer <PBID_EXPORT_SECRET>
```

Returns a `.csv` file with one row per response and one column per question field. Arrays (multi-checkbox answers) are joined with `; ` within the cell. The filename includes the export date.

### Columns
`submittedAt`, `sessionId`, `surveyVersion`, `q100`–`q105-2`, `q200`–`q204`, `q300`–`q315`

### Importing to Google Sheets
1. Download the CSV from the export URL (use a tool like `curl` or Postman with the Bearer header).
2. In Google Sheets: **File → Import → Upload** → select the CSV.
3. Choose "Replace spreadsheet" or "Insert new sheet".

### Automating with Zapier / Make
Point a Zapier Webhook trigger or Make HTTP module at the export endpoint with the `Authorization` header. Schedule it to run on whatever cadence suits the project.

---

## File Structure

```
src/
├── app/
│   ├── surveys/
│   │   └── pbid/
│   │       ├── page.tsx              # Server component — cookie check, config fetch
│   │       ├── PbidSurveyGate.tsx    # Client — passcode gate (localStorage)
│   │       ├── PbidSurveyForm.tsx    # Client — full 3-section form (604 lines)
│   │       └── Survey.module.css     # Takeda brand styles (scoped)
│   └── api/
│       └── surveys/
│           └── pbid/
│               ├── route.ts          # POST — submit response to Sanity
│               ├── auth/
│               │   └── route.ts      # POST — validate access code
│               └── export/
│                   └── route.ts      # GET  — CSV export (Bearer-protected)
└── sanity/
    └── schemaTypes/
        ├── pbidSurveyResponse.ts     # Response document schema
        └── pbidSurveyConfig.ts       # Singleton config schema
```

---

## Deployment Checklist

- [ ] Add `PBID_SURVEY_CODE` to Vercel environment variables
- [ ] Add `PBID_EXPORT_SECRET` to Vercel environment variables
- [ ] Deploy to trigger Sanity schema sync (new document types appear in Studio after first deploy)
- [ ] In Sanity Studio, open **PBID Survey Settings** and populate title, intro text, completion message
- [ ] Test full form flow end-to-end on preview deployment
- [ ] Share `/surveys/pbid` URL (+ access code if set) with training coordinators

---

## Branding

Takeda colour tokens used throughout:

| Token | Value | Used for |
|---|---|---|
| Primary purple | `rgb(79, 38, 131)` | Headers, borders, primary button, progress bar |
| Accent pink | `#d656c2` | Submit button, checkbox/radio accent |
| Light lavender | `#D1BAF8` | Question block borders, input borders |
| Deep navy | `#220a47` | Body text, labels |
| Background | `#eeedf2` | Page background |
