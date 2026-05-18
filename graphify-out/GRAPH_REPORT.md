# Graph Report - src  (2026-05-16)

## Corpus Check
- 175 files · ~60,379 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 359 nodes · 287 edges · 23 communities detected
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Dashboard & API Routes|Dashboard & API Routes]]
- [[_COMMUNITY_Navigation & Megamenu|Navigation & Megamenu]]
- [[_COMMUNITY_Onboarding & Role Selection|Onboarding & Role Selection]]
- [[_COMMUNITY_Member Spotlights Client|Member Spotlights Client]]
- [[_COMMUNITY_Certificate Dashboard|Certificate Dashboard]]
- [[_COMMUNITY_eLearning SCORM Player|eLearning SCORM Player]]
- [[_COMMUNITY_Community UI|Community UI]]
- [[_COMMUNITY_WebGL Mesh Gradient|WebGL Mesh Gradient]]
- [[_COMMUNITY_Global Search|Global Search]]
- [[_COMMUNITY_User Registration|User Registration]]
- [[_COMMUNITY_Email Automation|Email Automation]]
- [[_COMMUNITY_Job Apply Flow|Job Apply Flow]]
- [[_COMMUNITY_Forum Realtime Sync|Forum Realtime Sync]]
- [[_COMMUNITY_News Carousel|News Carousel]]
- [[_COMMUNITY_Theme System|Theme System]]
- [[_COMMUNITY_Assignment Creation|Assignment Creation]]
- [[_COMMUNITY_Spotlights Page|Spotlights Page]]
- [[_COMMUNITY_Job Detail Page|Job Detail Page]]
- [[_COMMUNITY_Age Group API|Age Group API]]
- [[_COMMUNITY_API Route Handler|API Route Handler]]
- [[_COMMUNITY_Community Page|Community Page]]
- [[_COMMUNITY_Globe Partners Section|Globe Partners Section]]
- [[_COMMUNITY_Brand Identity|Brand Identity]]

## God Nodes (most connected - your core abstractions)
1. `DashboardPage()` - 9 edges
2. `GET()` - 9 edges
3. `buildParams()` - 8 edges
4. `roleScope()` - 8 edges
5. `getCsatAvg()` - 8 edges
6. `getNpsScore()` - 8 edges
7. `getKnowledgeGain()` - 8 edges
8. `getDau()` - 8 edges
9. `getConversionRate()` - 8 edges
10. `getRetentionRate()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `CardContent()` --calls--> `urlForImage()`  [INFERRED]
  components/community/SpotlightCarousel.tsx → /Users/ciarannash/Downloads/stripe clone reset/src/sanity/lib/image.ts
- `DashboardPage()` --calls--> `getCsatAvg()`  [INFERRED]
  app/elearning/dashboard/page.tsx → sanity/lib/dashboardQueries.ts
- `DashboardPage()` --calls--> `getNpsScore()`  [INFERRED]
  app/elearning/dashboard/page.tsx → sanity/lib/dashboardQueries.ts
- `DashboardPage()` --calls--> `getKnowledgeGain()`  [INFERRED]
  app/elearning/dashboard/page.tsx → sanity/lib/dashboardQueries.ts
- `DashboardPage()` --calls--> `getDau()`  [INFERRED]
  app/elearning/dashboard/page.tsx → sanity/lib/dashboardQueries.ts

## Communities (147 total, 13 thin omitted)

### Community 0 - "Dashboard & API Routes"
Cohesion: 0.49
Nodes (13): DashboardPage(), GET(), buildParams(), filterClauses(), getConversionRate(), getCsatAvg(), getDau(), getKnowledgeBaseGrowth() (+5 more)

### Community 1 - "Navigation & Megamenu"
Cohesion: 0.19
Nodes (4): CommunityPanel(), ContactUsPanel(), DataInsightsPanel(), PodcastPanel()

### Community 2 - "Onboarding & Role Selection"
Cohesion: 0.18
Nodes (3): handleSubmit(), validateGphc(), StripeButton()

### Community 3 - "Member Spotlights Client"
Cohesion: 0.27
Nodes (3): SpotlightCard(), CardContent(), urlForImage()

### Community 4 - "Certificate Dashboard"
Cohesion: 0.22
Nodes (5): CertificateList(), ExpiryAlert(), MetricCard(), getEnrollmentsByCountry(), getExpiringCertificates()

### Community 5 - "eLearning SCORM Player"
Cohesion: 0.29
Nodes (4): CertificateViewer(), ScormPlayer(), ScormPlayerSlot(), SurveyFormSlot()

### Community 6 - "Community UI"
Cohesion: 0.29
Nodes (3): Avatar(), AvatarAddButton(), cn()

### Community 10 - "User Registration"
Cohesion: 0.7
Nodes (4): generateUsername(), isAtLeast18(), isValidEmail(), POST()

### Community 11 - "Email Automation"
Cohesion: 0.7
Nodes (4): getExpiringCertificates(), getInactiveLearnerIds(), isoWeek(), POST()

### Community 38 - "Brand Identity"
Cohesion: 0.67
Nodes (3): App Icon SVG, Icon Color Palette, PharmaLink Brand Identity

## Knowledge Gaps
- **2 isolated node(s):** `PharmaLink Brand Identity`, `Icon Color Palette`
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getEnrollmentsByCountry()` connect `Certificate Dashboard` to `Dashboard & API Routes`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **Why does `getExpiringCertificates()` connect `Certificate Dashboard` to `Dashboard & API Routes`?**
  _High betweenness centrality (0.000) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `DashboardPage()` (e.g. with `getCsatAvg()` and `getNpsScore()`) actually correct?**
  _`DashboardPage()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `GET()` (e.g. with `getCsatAvg()` and `getNpsScore()`) actually correct?**
  _`GET()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `getCsatAvg()` (e.g. with `DashboardPage()` and `GET()`) actually correct?**
  _`getCsatAvg()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `PharmaLink Brand Identity`, `Icon Color Palette` to the rest of the system?**
  _2 weakly-connected nodes found - possible documentation gaps or missing edges._