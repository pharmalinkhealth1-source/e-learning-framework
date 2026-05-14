# Client Requirements — Bespoke LMS (Pharmacist Platform)

> Imported 2026-05-13 — source: client PRD (previously Moodle-based, now bespoke)
> Context: Global pharmacist training platform, multi-country rollout

---

## Scale

- Target: 30,000 pharmacists across 15 countries (3 initial + 3/year for 4 years)
- ~2,000 pharmacists per country
- Multi-language, multi-country content access model

---

## Platform Functionalities

1. Course upload (eLearning content)
2. Built-in dashboards (see Metrics section)
3. User management (4 roles)
4. Certificate issuance (participation + accomplishment)
5. 2-way messaging (MOH guidelines/policies → learners; peer chat forums)
6. WhatsApp, Facebook Messenger, USSD, IVR, offline/low-bandwidth access
7. LinkedIn certificate sharing (optional)

---

## Access Channels

- Web
- WhatsApp
- Facebook Messenger
- USSD
- IVR
- Offline / low-bandwidth mode

---

## User Roles

1. **Learner** — pharmacist end user
2. **Program Manager** — country-level data visibility
3. **Partner/Donor** — view only
4. **System Admin** — full access

### Access Model

- Learner: sees courses assigned to their country + all-country courses
- Program Manager: sees data from their country only
- Program Director / Deputy Director: sees data regardless of user country

---

## User Journey

### Registration (Mandatory Fields)

1. First name
2. Last name
3. DOB: `YYYY-MM-DD`, must be ≥18 years old
4. Gender
5. Province/Region: dropdown based on country (image-based selector)
6. Type of Health Worker:
   - Community Pharmacist
   - Hospital Pharmacist
   - Regulatory Pharmacist
   - Industry Pharmacist
   - Informatics Pharmacist
   - Pharmacy Manager
   - Other (Specify)
7. Pharmacy (place of work)
8. Email: validated format
9. Phone number: pre-fill country code, user confirms; if not confirmed → select country ISO
10. Language: pre-fill from country, user confirms; if not → select language
11. Username auto-generated: phone number with country code (no `+` or leading `0`s)

### Returning Users (WhatsApp/chatbot)

- Prompt for username (phone number format)
- Create password on first Moodle/web login
- If username taken: "Username already in use, please try to log in"
- Password recovery: SMS to phone number

### Course Journey

1. Select Health Area
2. Select Course
3. Course summary
4. Pre-test
5. Select Modules
6. Go through Modules: content → activities → module post-test
7. Self-assessment test
8. Final Post-Test
9. Certificate of Participation / Accomplishment
10. Share on LinkedIn (optional)

---

## Metrics & KPIs

| Metric | Purpose | Measurement |
|--------|---------|-------------|
| CSAT (Client Satisfaction Score) | Learner satisfaction with platform | 1–5 or 1–10 Likert scale |
| NPS (Net Promoter Score) | Likelihood to recommend | # who recommend / # surveyed |
| Knowledge Gain | Learning effectiveness | % meeting benchmark: pre-test vs post-test |
| Daily Active Users | Platform value | # users interacting daily |
| Conversion Rate | Course completion funnel | # who complete / # who initiate a course |
| Client Retention Rate | Loyalty | # active users for 12+ months |
| Total New Clients by Country | Growth tracking | New users by country per month |
| Knowledge Base Growth | Content growth pace | Courses added/month ÷ total courses |

**Breakdown dimensions:** gender, age group, learner type, geography

---

## Interoperability

- DHIS2 integration (country-level): overlay data from supportive supervision visits with eLearning data
- Quality assurance tools at country level
- SCORM/LTI compatibility (legacy content)

---

## Sustainability Model

- Free access for pharmacists
- Revenue from partners using platform to reach pharmacists (promotions, webinars, professional content)

---

## Scalability Requirements

- Multi-tenant per country (content, data, language)
- Easy country onboarding at scale
- Supports 30,000+ users across 15 countries

---

## Phone Number Identity Note

Users are defined by unique phone numbers. One phone number per user — no dual accounts (e.g., separate WhatsApp number + web number not allowed).
