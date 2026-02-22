# Implementation Plan: Generic Activity Timeline PCF Conversion

**Branch**: `001-pcf-conversion` | **Date**: 2026-02-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-pcf-conversion/spec.md`

## Summary

Convert the existing HTML web resource timeline into a PCF-native React control
with full functional parity for timeline visualization, filtering/search,
sentiment display, diagnostics, and export. Implementation keeps a single root
stateful component, delegates data loading/filtering to hooks, uses Dataverse
WebAPI for runtime data, and preserves styling tokens from the source UI.

## Technical Context

**Language/Version**: TypeScript 4.x, React 17  
**Primary Dependencies**: `pcf-scripts` 1.x, `react`, `react-dom`, typings for React/Jest  
**Storage**: Dataverse via PCF `context.webAPI` (no local persistent store)  
**Testing**: `npm test` (Jest), targeted unit tests for utility modules  
**Target Platform**: Microsoft Dataverse / Model-driven app host (Standard PCF control)  
**Project Type**: Single project PCF control  
**Performance Goals**: For datasets up to 500 timeline items, filter/search and Journey/List toggle updates complete within 1000 ms p95 in harness validation; avoid UI lock during sync  
**Constraints**: Preserve source behavior parity, sanitize render paths, do not exceed current design token system  
**Scale/Scope**: One control package, migration of existing timeline UX and data behaviors

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Source parity scope is explicit and deviations require documentation.
- ✅ Architecture locked to PCF Standard Control + React functional components/hooks.
- ✅ Dataverse access path constrained to `context.webAPI.retrieveMultipleRecords()`.
- ✅ Security baseline included: sanitization of user-visible and HTML render paths.
- ✅ Quality gates included: targeted tests, `npm test`, `npm run build`, and harness verification.
- ✅ Scope-discipline guardrails included: no unsolicited feature expansion.

## Project Structure

### Documentation (this feature)

```text
specs/001-pcf-conversion/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
ActivityTimelineControl/
├── index.ts
├── ControlManifest.Input.xml
├── components/
├── hooks/
├── models/
├── services/
├── utils/
└── css/

docs/
└── plans/

specs/
└── 001-pcf-conversion/
```

**Structure Decision**: Keep a single PCF control project and evolve existing
`ActivityTimelineControl/` folders in place. Add `hooks/` and spec artifacts
without introducing separate frontend/backend projects.

## Phase Plan

### Phase 0: Baseline and Research
- Confirm source parity matrix from existing HTML resource.
- Validate current PCF scaffold, dependencies, and manifest constraints.
- Capture runtime assumptions for Dataverse fields and sentiment mapping.

### Phase 1: Foundations
- Normalize project config (`tsconfig.json`, `package.json`, manifest).
- Define domain models/constants and utility modules with tests.
- Remove obsolete stubs and align file naming to `.tsx` where applicable.

### Phase 2: Data and Filtering
- Implement Dataverse service integration and demo fallback.
- Implement `useActivities` and `useFilter` hooks.
- Validate filter semantics and diagnostics logging behavior.

### Phase 3: UI Composition
- Port CSS and preserve design tokens.
- Build leaf components (badge, diagnostics, intelligence panel).
- Build layout components (header, filter row, journey/list views).
- Assemble root timeline component and connect PCF entry point.

### Phase 4: Verification
- Run targeted unit tests then full `npm test`.
- Run `npm run build` and resolve conversion-introduced issues.
- Validate in PCF harness for interaction, filtering, sync, diagnostics, export.

## Complexity Tracking

No constitution violations identified at planning time.
