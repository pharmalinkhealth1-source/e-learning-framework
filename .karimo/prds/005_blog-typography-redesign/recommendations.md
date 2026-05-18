# Brief Review: blog-typography-redesign

**Reviewed:** 2026-05-18
**Briefs reviewed:** 8 (T001–T008)

---

## Critical (must fix before execution)

- [CRIT-001] **T002 / PRD: Dark mode claim is partially false for two replacement tokens.**

  The PRD states "All replacement tokens have verified dark mode variants" and T002 repeats "All replacements have dark mode variants — dark mode safe." This is incorrect for two of the seven replacements.

  `tokens.css` `:root[data-theme='dark']` block (lines 182–228) does **not** override `--hds-color-util-brand-500` or `--hds-color-core-secondary-500`. Both resolve to their light-mode values (`#635bff` and `#E84AC7`) in dark mode.

  These tokens replace `--hds-color-accent-primary` (7 occurrences: category badge color, backLink hover, avatarPlaceholder gradient, relatedTag, shareButton hover, relatedCard hover border) and `--hds-color-accent-secondary` (1 occurrence: avatarPlaceholder gradient end). The colours are accent/brand purples and pink — both have reasonable contrast on dark backgrounds as they stand. However, the claim that they are "verified" is false, which could mislead the executing agent into skipping dark-mode visual QA.

  **Fix:** Update T002 brief "Context" section and the validation checklist to replace "All 7 replacements have dark mode variants — dark mode safe" with accurate wording: "5 of 7 replacement tokens have explicit dark mode overrides (`--hds-color-surface-bg-quiet`, `--hds-color-surface-bg-subdued`, `--hds-color-surface-border-quiet`, `--hds-color-core-neutral-50`). Two accent tokens (`--hds-color-util-brand-500`, `--hds-color-core-secondary-500`) have no dark override and retain their light-mode values — verify contrast visually in dark mode after T002 lands." Apply the same correction to the PRD Research Findings reference and to the T005 brief which also says "valid token from T002" without flagging the dark-mode gap.

---

## Warnings (should fix)

- [WARN-001] **T006 / tasks.yaml: Box-shadow removal criterion absent from tasks.yaml success_criteria but present in brief validation.**

  `tasks.yaml` T006 `success_criteria` (line 254) lists five checks for `.heroImageContainer` but omits the box-shadow removal. The brief's Validation section correctly includes "has no `box-shadow`". The tasks.yaml line reads only: `.heroImageContainer has aspect-ratio: 16/9, no fixed height, border-radius 8px`. Because the executing agent typically runs the task brief (which is authoritative), this is unlikely to cause a failure, but the tasks.yaml is the source of truth for orchestration reporting. The discrepancy could cause a post-execution audit to incorrectly mark the criterion as unverified.

  **Fix:** Update tasks.yaml T006 `success_criteria` to: `.heroImageContainer has aspect-ratio: 16/9, no fixed height, border-radius 8px, no box-shadow`.

- [WARN-002] **T008 brief: Misleading scoping note in implementation step 2.**

  T008 implementation step 2 says "the selector scoping (`:not(.BlogIndexPost--variantFeatured)` wrapper at line 301) must be preserved as-is." The `:not()` scoped block at line 301 is a **padding-left** override — it has nothing to do with font-size. The font-size 18px override that step 2 is actually targeting is at line 306 in a separate, unscoped `@media (min-width: 600px)` block. The note is factually correct that the scoped block must not be touched, but the phrasing implies the font-size override carries the scoping, which it does not.

  An executing agent reading this may become confused about which block to edit and accidentally modify the wrong selector.

  **Fix:** Replace step 2's parenthetical with: "There are two separate `@media (min-width: 600px)` blocks for `.BlogIndexPost__body`. The first (line 301) is a padding-left scoped override — do not touch it. The second (line 306) is the unscoped `font-size: 18px` override — that is the block to update."

- [WARN-003] **T006: Container width jump from 1000px to 1264px is architecturally significant and unmentioned as a risk.**

  The PRD explicitly specifies this change (`.container` max-width → `var(--hds-space-layout-content-maxWidth)` which resolves to 1264px). However, this is a 264px increase in the article container width. The inner `.content` max-width stays at 720px, so article body text is unaffected, but elements outside `.content` (hero image, related cards, sidebar, meta row) will stretch to fill the wider container. T006 brief and tasks.yaml do not flag this as a visual risk or mention that the executor should verify how the layout looks at the new width.

  **Fix:** Add an observation note to T006's Context section: "Note: this change widens the article container from 1000px to 1264px. Article body text is constrained by `.content` max-width: 720px and is unaffected. All full-bleed elements (hero image, related grid, meta row) will expand to fill 1264px — verify visually at desktop widths after the change."

---

## Observations (informational)

- [OBS-001] **T001: Italic import mention in brief is a non-issue — handled correctly.**

  T001 brief step 4 references `@import '@fontsource/ibm-plex-sans/400-italic.css'` with a "only if present" guard. The actual `globals.css` has no italic import. The brief's conditional phrasing handles this correctly; no action needed.

- [OBS-002] **T003 and T004 both guard against double-fixing the font-family token.**

  Both T003 and T004 include conditional language ("only if not already fixed by T002") when updating `font-family: var(--hds-font-sans)` → `var(--hds-font-family)` on `.title` and `.content` respectively. Since T002 is a wave 1 prerequisite for both, and wave 2 tasks run after wave 1 completes, T002 will always have run first. The conditionals are safe and add no risk — they are a prudent guard against partial execution scenarios.

- [OBS-003] **T006: The 900px sidebar `transform: none` override on `.shareTitle` becomes redundant after T006 removes `transform: rotate(-90deg)` from the base rule.**

  T006 brief correctly notes this and explicitly says to leave the 900px override in place. This is the right call — the redundant override is harmless.

- [OBS-004] **T007 and T008 wave 3 dependency on T001 only (not T002) is correct.**

  `Blog.module.css` uses only valid HDS tokens (`--hds-color-util-brand-500`, `--hds-color-surface-bg-quiet`, etc.) and has no undefined token references. The wave 3 briefs correctly depend only on T001.

- [OBS-005] **T005 `.relatedTag` brief removes `letter-spacing: 0.05em` but the actual CSS shows `letter-spacing: 0.05em` on `.relatedTag` (line 305 of BlogPostDetail.module.css).**

  T005 brief step 7 says "Remove `text-transform: uppercase` and `letter-spacing: 0.05em`" — confirmed accurate against the file. No issue.

---

## Verdict

PASS

The briefs are structurally sound with correct wave ordering, accurate selector references, correct file boundaries (all changes scoped to `src/app/blog/` and `src/styles/globals.css`), no cross-task selector conflicts in T003–T006, and proper dependency chains. No brief will fail to execute due to a missing file, missing command, or impossible success criterion.

The single Critical finding (CRIT-001) is a documentation accuracy issue — the dark mode claim is false for two tokens — rather than an execution blocker. The tokens will still resolve to valid colour values; the risk is that the executing agent skips dark-mode visual QA believing it has been pre-verified. This should be corrected before execution to ensure proper QA happens.

**Summary counts:**
- Critical: 1
- Warnings: 3
- Observations: 5
