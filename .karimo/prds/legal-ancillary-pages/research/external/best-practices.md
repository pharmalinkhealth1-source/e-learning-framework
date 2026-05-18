# External Research: Legal Requirements & Best Practices

## Jurisdiction Overview

PharmaLink operates under:
- **US law** (primary — HQ in Washington DC)
- **Nigeria** — Nigeria Data Protection Act 2023 (NDPA 2023), supersedes NDPR 2019
- **Kenya** — Data Protection Act 2019 (DPA 2019)
- **Ethiopia** — Personal Data Protection Proclamation No. 1321/2024 (came into force July 2024)
- **GDPR** — applicable if any EU/UK users access the platform
- **HIPAA** — relevant context; PharmaLink is healthcare-adjacent but likely not a HIPAA "covered entity"

---

## Page 1: Privacy Policy

### Legal Status: P0 — Legally Required

**US:** No single federal privacy law requires a privacy policy for all websites, but:
- FTC Act Section 5 (unfair/deceptive practices) — if you collect data and don't disclose it, you're liable
- CalOPPA (California) — requires privacy policy if you collect PII from California residents
- COPPA — required if any users may be under 13

**GDPR:** Required if processing EU/EEA personal data. Must include: legal basis for processing, data subject rights, DPO contact (if applicable), retention periods, third-party sharing.

**Nigeria NDPA 2023:** Data controllers must provide clear information on purpose of processing, categories of data, retention periods, third-party sharing, and DPO contact. Health data is classified as sensitive and subject to heightened requirements. Data controllers of "major importance" must register with the Nigeria Data Protection Commission (NDPC).

**Kenya DPA 2019:** Modeled on GDPR. Organizations collecting personal data must provide a privacy notice at point of collection. Healthcare sector must register with the Office of the Data Protection Commissioner (ODPC) regardless of size. Effective 1 January 2025, new health facility registrations require a valid Certificate of Data Handler/Processor.

**Ethiopia PDPP 1321/2024:** First comprehensive data protection law, effective July 2024. Healthcare platforms face 33 specific controls on health data processing. Sensitive health data requires explicit consent or other specific conditions. Data localization requirement: personal data collected locally must be stored on servers within Ethiopia (implementing directives pending).

### Minimum Content Requirements:
- Identity and contact details of data controller
- Purposes and legal basis for processing
- Categories of personal data collected
- Retention periods
- Third-party sharing (Clerk, Sanity, Vercel, Resend, Svix)
- User rights (access, rectification, erasure, portability, objection)
- Data Protection Officer contact (required if processing health data at scale in Nigeria/Kenya)
- How to lodge a complaint with relevant authority (NDPC, ODPC, ECA)
- Cookie information (or link to Cookie Policy)
- Cross-border transfer information
- Last updated date

---

## Page 2: Terms of Service / Terms & Conditions

### Legal Status: P0 — Legally Required (for platform operation)

**US:** Not strictly required by law, but without ToS:
- No enforceable limitation of liability
- No intellectual property protections
- No basis for account termination
- No governing law/dispute resolution provisions

For an e-learning platform with paid courses, ToS is operationally required to enforce refund limits, acceptable use, and licensing of content.

**Nigerian/Kenyan/Ethiopian context:** Courts will generally enforce well-drafted ToS. Local law requirements include: plain language, not unconscionable, compliance with consumer protection laws.

### Minimum Content Requirements:
- Acceptance mechanism (clickwrap on signup)
- Eligible users (healthcare professionals only — age, credential requirements)
- Account creation and security obligations
- Acceptable use policy (especially critical for forum/messaging)
- Intellectual property (user-generated content license grant to PharmaLink)
- E-learning terms (license to access courses, not download/redistribute)
- Subscription terms and cancellation (per FTC Click-to-Cancel rule, effective 2024-2025)
- Limitation of liability and disclaimers
- Governing law (Washington DC / District of Columbia)
- Dispute resolution (arbitration clause or court)
- Termination provisions
- Changes to terms (notification mechanism)

---

## Page 3: Cookie Policy

### Legal Status: P0 — Required (GDPR, Kenya DPA, Ethiopia PDPP)

**GDPR:** Cookie consent required for non-essential cookies before they load. Cookie policy must categorize cookies by type (strictly necessary, functional, analytics, marketing). Cookie banner must offer accept/reject with equal visual prominence. Pre-selected opt-in is invalid.

**Kenya DPA 2019:** Cookies that collect or transfer personal data are subject to DPA rules. Categorize cookies, state purposes, gather valid consent prior to deployment.

**Ethiopia PDPP 1321/2024:** Cookie consent required for personal data collection.

**Nigeria NDPA 2023:** Consent required for non-essential data collection; cookies collecting personal data require opt-in.

### Minimum Content Requirements:
- What cookies are used and why
- Categories: strictly necessary / functional / analytics / marketing
- Third-party cookies (Clerk auth, Vercel analytics if used)
- How to manage/reject cookies
- Cookie lifespan for each category
- Link to update consent preferences

---

## Page 4: Accessibility Statement (WCAG 2.1 AA)

### Legal Status: P1 — Strongly Recommended (ADA Title III, Section 508-adjacent)

**US:** Private businesses (Title III ADA) are not yet subject to a specific WCAG compliance deadline, but courts consistently reference WCAG 2.0/2.1 Level AA in ADA web accessibility cases. The DOJ issued new ruling in April 2024 requiring Title II entities (government) to meet WCAG 2.1 AA. Private sector: WCAG 2.1 AA is industry standard to minimize legal risk.

An accessibility statement is not legally mandated for US private companies, but is strongly recommended as evidence of good-faith compliance effort. W3C provides a standard template.

**Nigerian/Kenyan/Ethiopian context:** No specific web accessibility laws yet. WCAG compliance is best practice.

### Minimum Content Requirements (W3C format):
- Conformance status (fully / partially / non-conformant with WCAG 2.1 AA)
- Non-accessible content and reasons
- Alternatives provided
- Feedback/contact mechanism for accessibility issues
- Date of assessment
- Formal complaints escalation path

---

## Page 5: Medical / Health Disclaimer

### Legal Status: P1 — Strongly Recommended for Healthcare Platforms

**US FTC:** Health claims must be truthful, non-misleading, and supported by evidence. A disclaimer is required when content could be misread as medical advice. The FTC has pursued enforcement against health platforms that implied clinical validity without adequate disclaimers.

**Professional network context:** PharmaLink hosts clinical education content, forum discussions about drug therapies, and peer-to-peer health worker communication. Without a clear disclaimer that content is for professional education only (not patient care decisions), PharmaLink faces FTC and state medical board risk.

**Critical:** A disclaimer must not contradict the core message. It must be prominent, not buried in footers.

### Minimum Content Requirements:
- Platform is for healthcare professionals, not patients
- Content is for educational purposes only
- Not a substitute for clinical judgment, professional guidelines, or patient-specific advice
- Always verify information against authoritative clinical sources
- Limitation of liability for clinical decisions made based on platform content
- Emergency: always refer to emergency services

---

## Page 6: Community Guidelines / Code of Conduct

### Legal Status: P1 — Strongly Recommended (Forum + Direct Messaging)

**Legal basis:** Not required by law, but operationally essential. Without enforceable community guidelines:
- Cannot terminate accounts for policy violations
- Cannot remove harmful content
- DMCA safe harbor is harder to maintain (requires "repeat infringer policy")
- Forum discussions about clinical topics without moderation rules create liability exposure

**Forum context:** PharmaLink's forum explicitly includes rules on patient confidentiality (Rule #3: "Protect Patient Confidentiality"), facility information (Rule #4), and clinical accuracy (Rule #5). These already exist as `forumRules` in Sanity. Community Guidelines should be the public-facing version of these rules.

### Minimum Content Requirements:
- Acceptable and unacceptable content categories
- Patient confidentiality requirements (no PHI/case-identifying details)
- Clinical accuracy standards
- Respectful professional conduct
- Prohibited content: misinformation, spam, harassment, political content
- Moderation process and enforcement
- Reporting mechanism
- Consequences for violations (warning → suspension → ban)
- Relationship to ToS (community guidelines incorporated by reference)

---

## Page 7: DMCA Policy / Copyright Notice

### Legal Status: P1 — Required for DMCA Safe Harbor Protection

**US DMCA Section 512:** To qualify for safe harbor from copyright infringement liability for user-generated content, PharmaLink must:
1. Designate a DMCA agent and register with the US Copyright Office
2. Post the designated agent's contact information on the website
3. Have a published repeat infringer policy
4. Respond expeditiously to valid takedown notices
5. Have a counter-notice procedure

**Relevance:** The forum, blog (user comments if any), and e-learning (user assignments, uploaded content) all involve user-generated content. Without DMCA registration, PharmaLink has no safe harbor.

**2025 requirement:** The Copyright Office DMCA agent registration directory requires re-registration every 3 years. Registration fee is $6.

### Minimum Content Requirements:
- DMCA designated agent name, address, email, phone
- How to submit a valid takedown notice (required elements per 17 USC 512(c)(3))
- Counter-notification procedure
- Repeat infringer policy statement
- Good faith disclaimer

---

## Page 8: Refund / Cancellation Policy

### Legal Status: P1 — Required for E-learning Subscriptions (FTC)

**FTC Negative Option Rule / ROSCA:** If PharmaLink offers recurring subscriptions (course memberships, platform access), the FTC requires:
- Clear disclosure of all material terms before the subscription starts
- Cancellation as easy as signup ("Click-to-Cancel" rule, effective 2024-2025)
- Refund policy clearly stated

**FTC enforcement precedent:** Chegg paid $7.5M in 2025 for making subscription cancellation difficult. This rule is actively enforced.

**E-learning context:** If PharmaLink charges for CPD courses or platform access, a refund policy is required. Standard for e-learning: 14-30 day window, full refund before substantial course completion.

### Minimum Content Requirements:
- Which products/subscriptions are eligible for refund
- Refund window (e.g., 14 days from purchase)
- Conditions (course not substantially completed)
- How to request a refund
- Processing time
- Exceptions (downloaded certificates, completed courses)
- Cancellation process (must be as easy as signup)

---

## Additional Pages to Consider

### Data Processing Agreement (DPA) — P2
For institutional/organizational accounts (hospitals, pharmacy schools, NGOs). Not legally required unless PharmaLink acts as a data processor for an organization. Relevant if B2B partnerships develop.

### About / Mission Page — Already Exists
`/about-us` — complete.

### Contact / Support Page — Already Exists
`/contact-us` — complete.
