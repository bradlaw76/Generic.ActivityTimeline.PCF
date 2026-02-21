# Tasks: Generic Activity Timeline PCF Conversion

**Input**: Design documents from `/specs/001-pcf-conversion/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Normalize project configuration for PCF + React migration.

- [ ] T001 Update JSX compiler configuration in `tsconfig.json`
- [ ] T002 Align scripts/dependencies for PCF React build in `package.json`
- [ ] T003 Simplify and align control input contract in `ActivityTimelineControl/ControlManifest.Input.xml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish core models, utilities, and base styling required by all user stories.

**⚠️ CRITICAL**: No user story implementation starts until this phase is complete.

- [ ] T004 Replace activity domain model with `ActivityTimelineControl/models/ActivityNode.ts`
- [ ] T005 Update filter state model in `ActivityTimelineControl/models/FilterState.ts`
- [ ] T006 Update sentiment score model in `ActivityTimelineControl/models/SentimentScore.ts`
- [ ] T007 Remove obsolete model `ActivityTimelineControl/models/Activity.ts`
- [ ] T008 Add shared entity/icon/sentiment maps in `ActivityTimelineControl/constants.ts`
- [ ] T009 Implement sanitization utility in `ActivityTimelineControl/utils/Sanitizer.ts`
- [ ] T010 [P] Add sanitizer tests in `ActivityTimelineControl/utils/Sanitizer.test.ts`
- [ ] T011 Implement type normalization utility in `ActivityTimelineControl/utils/normalizeType.ts`
- [ ] T012 [P] Add normalization tests in `ActivityTimelineControl/utils/normalizeType.test.ts`
- [ ] T013 Implement date formatting/limit helpers in `ActivityTimelineControl/utils/DateUtils.ts`
- [ ] T014 [P] Add date utility tests in `ActivityTimelineControl/utils/DateUtils.test.ts`
- [ ] T015 Update GCC detection utility in `ActivityTimelineControl/utils/GccDetector.ts`
- [ ] T016 Remove obsolete service `ActivityTimelineControl/services/SentimentService.ts`
- [ ] T017 Remove obsolete service `ActivityTimelineControl/services/ExportService.ts`
- [ ] T018 Port parity CSS baseline to `ActivityTimelineControl/css/ActivityTimelineControl.css`

**Checkpoint**: Foundation complete; user stories can proceed.

---

## Phase 3: User Story 1 - View and analyze customer activity timeline (Priority: P1) 🎯 MVP

**Goal**: Deliver core timeline data loading, visualization, and detail analysis.

**Independent Test**: Launch harness and verify timeline/list population for record history, node selection, and detail rendering.

### Tests for User Story 1

- [ ] T019 [P] [US1] Add data mapping tests in `ActivityTimelineControl/services/DataverseService.test.ts`

### Implementation for User Story 1

- [ ] T020 [US1] Implement Dataverse fetch and demo fallback in `ActivityTimelineControl/services/DataverseService.ts`
- [ ] T021 [US1] Implement activities loading hook in `ActivityTimelineControl/hooks/useActivities.ts`
- [ ] T022 [US1] Add sentiment badge component in `ActivityTimelineControl/components/SentimentBadge.tsx`
- [ ] T023 [US1] Remove legacy sentiment indicator `ActivityTimelineControl/components/SentimentIndicator.ts`
- [ ] T024 [US1] Rebuild intelligence panel in `ActivityTimelineControl/components/IntelligencePanel.tsx`
- [ ] T025 [US1] Replace legacy panel file `ActivityTimelineControl/components/IntelligencePanel.ts`
- [ ] T026 [US1] Rebuild journey timeline renderer in `ActivityTimelineControl/components/JourneyView.tsx`
- [ ] T027 [US1] Replace legacy journey view file `ActivityTimelineControl/components/JourneyView.ts`
- [ ] T028 [US1] Rebuild list renderer in `ActivityTimelineControl/components/ListView.tsx`
- [ ] T029 [US1] Replace legacy list view file `ActivityTimelineControl/components/ListView.ts`
- [ ] T030 [US1] Create root timeline composition component in `ActivityTimelineControl/components/ActivityTimeline.tsx`
- [ ] T031 [US1] Mount root React component from PCF entrypoint in `ActivityTimelineControl/index.ts`

**Checkpoint**: US1 provides a working MVP for timeline exploration and detail analysis.

---

## Phase 4: User Story 2 - Filter and search interaction history (Priority: P2)

**Goal**: Deliver type/date/search filtering and view controls across journey/list representations.

**Independent Test**: Apply chips/search/date filters and verify identical filtered results in both Journey and List views.

### Tests for User Story 2

- [ ] T032 [P] [US2] Add filter logic tests in `ActivityTimelineControl/hooks/useFilter.test.ts`

### Implementation for User Story 2

- [ ] T033 [US2] Implement filtered projection hook in `ActivityTimelineControl/hooks/useFilter.ts`
- [ ] T034 [US2] Implement filter/search row component in `ActivityTimelineControl/components/FilterRow.tsx`
- [ ] T035 [US2] Remove legacy filter controls `ActivityTimelineControl/components/FilterControls.ts`
- [ ] T036 [US2] Remove legacy search component `ActivityTimelineControl/components/SearchBar.ts`
- [ ] T037 [US2] Implement top header controls in `ActivityTimelineControl/components/Header.tsx`
- [ ] T038 [US2] Wire filter/header state transitions in `ActivityTimelineControl/components/ActivityTimeline.tsx`

**Checkpoint**: US2 adds efficient narrowing of activity history without breaking US1 behavior.

---

## Phase 5: User Story 3 - Operate and validate control in production workflow (Priority: P3)

**Goal**: Deliver diagnostics, operational controls, and deployment-ready runtime behavior.

**Independent Test**: Validate sync/export/diagnostics/demo-mode in harness and confirm operational workflows complete successfully.

### Tests for User Story 3

- [ ] T039 [P] [US3] Add diagnostics visibility behavior tests in `ActivityTimelineControl/components/DiagnosticConsole.test.tsx`

### Implementation for User Story 3

- [ ] T040 [US3] Implement diagnostics console component in `ActivityTimelineControl/components/DiagnosticConsole.tsx`
- [ ] T041 [US3] Wire diagnostics toggle, export action, and sync UX in `ActivityTimelineControl/components/ActivityTimeline.tsx`
- [ ] T042 [US3] Ensure cloud-specific control behavior in `ActivityTimelineControl/components/Header.tsx`

**Checkpoint**: US3 makes the control operationally supportable for rollout.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, documentation alignment, and migration closure.

- [ ] T043 Run and fix conversion test suite using `package.json`
- [ ] T044 Run and fix build verification using `package.json`
- [ ] T045 Execute harness verification checklist in `specs/001-pcf-conversion/quickstart.md`
- [ ] T045a Define performance validation dataset and procedure in `specs/001-pcf-conversion/quickstart.md`
- [ ] T045b Capture and record p95 toggle/filter timings in `specs/001-pcf-conversion/research.md`
- [ ] T046 Update migration decisions and parity notes in `specs/001-pcf-conversion/research.md`
- [ ] T047 Record final acceptance updates in `specs/001-pcf-conversion/spec.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1) has no dependencies and starts immediately.
- Foundational (Phase 2) depends on Setup and blocks all user stories.
- User stories (Phases 3-5) depend on Foundational completion.
- Polish (Phase 6) depends on completion of selected user stories.

### User Story Dependencies

- **US1 (P1)**: starts after Phase 2; no dependency on US2/US3.
- **US2 (P2)**: starts after Phase 2; depends on shared state wiring from US1 files but remains independently testable.
- **US3 (P3)**: starts after Phase 2; can be validated independently once core composition exists.

### Recommended Completion Order

1. Phase 1 → Phase 2
2. US1 (MVP)
3. US2
4. US3
5. Phase 6 polish

---

## Parallel Execution Examples

### US1 Parallel Example

- Run T019 while implementing T020/T021.
- Run T022 and T024 in parallel after T020 model contracts are stable.
- Run T026 and T028 in parallel before T030 integration.

### US2 Parallel Example

- Run T032 in parallel with T033.
- Run T034 and T037 in parallel, then integrate in T038.

### US3 Parallel Example

- Run T039 in parallel with T040.
- After T040, run T041 and T042 in parallel where file ownership allows.

---

## Implementation Strategy

### MVP First

1. Complete Phases 1-2.
2. Deliver US1 (Phase 3) and validate independent test criteria.
3. Demo MVP before expanding scope.

### Incremental Delivery

1. Add US2 filtering/search controls and validate independently.
2. Add US3 operational features and validate independently.
3. Finish with cross-cutting verification and spec/research updates.

### Team Parallelization

1. One engineer completes setup/foundations.
2. Then split by story:
   - Engineer A: US1 core data + view components
   - Engineer B: US2 filtering controls
   - Engineer C: US3 diagnostics/operations
3. Rejoin for Phase 6 verification.

---

## Notes

- Every task uses strict checklist format: `- [ ] T### [P?] [US?] Description with file path`.
- `[P]` tasks are safe to parallelize when dependencies are satisfied.
- User story phases are independently testable increments aligned to spec priorities.
