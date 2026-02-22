<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0
- Modified principles:
	- Added I. Source Parity First
	- Added II. PCF-Native React Architecture
	- Added III. Dataverse Access and Security
	- Added IV. Test and Build Gates
	- Added V. Scope Discipline and Simplicity
- Added sections:
	- Technical Standards
	- Delivery Workflow
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ .specify/templates/plan-template.md (reviewed, no change needed)
	- ✅ .specify/templates/spec-template.md (reviewed, no change needed)
	- ✅ .specify/templates/tasks-template.md (reviewed, no change needed)
	- ✅ .github/prompts/speckit.constitution.prompt.md (reviewed, no change needed)
	- ✅ .github/prompts/speckit.specify.prompt.md (reviewed, no change needed)
- Deferred TODOs:
	- None
-->

# Generic Activity Timeline PCF Constitution

## Core Principles

### I. Source Parity First
All migration work MUST preserve functional parity with
`activity-timeline.v3.1.4.html` unless a documented requirement explicitly
changes behavior. Any intentional deviation MUST be listed in the active spec
and verified during harness validation.

### II. PCF-Native React Architecture
The control MUST remain a Standard PCF control with React functional
components and hooks. State ownership MUST stay in the root timeline component,
with data retrieval and filtering delegated to dedicated hooks. Public surface
area changes in manifest inputs MUST be justified in the spec before
implementation.

### III. Dataverse Access and Security
Dataverse data access MUST use `context.webAPI.retrieveMultipleRecords()` and
MUST avoid direct browser-side credential handling. User-visible text and HTML
content MUST be sanitized before render paths that can execute markup.
Navigation and export actions MUST use least-privilege behavior and avoid
leaking hidden fields.

### IV. Test and Build Gates
Utilities and transformation logic MUST have targeted automated tests when
feasible. A feature is not complete until `npm test` and `npm run build` pass,
or failures are documented as pre-existing and out of scope. Test harness
validation MUST be executed for primary user flows before final closure.

### V. Scope Discipline and Simplicity
Implementations MUST follow approved plan scope exactly and avoid unsolicited
feature expansion. Use existing design tokens, CSS custom properties, and
component boundaries; do not introduce unrelated abstractions. When ambiguous,
choose the simplest behavior that satisfies the specification.

## Technical Standards

- Language and runtime: TypeScript + React compatible with `pcf-scripts`.
- Styling: preserve source custom properties and compatibility with PCF
	container constraints.
- Data source: Dataverse only for production behavior; demo fallback permitted
	when record context is absent.
- Compatibility: target Dynamics/Power Platform host expectations for Standard
	Control lifecycle (`init`, `updateView`, `destroy`).
- Security baseline: sanitize searchable and rendered content, avoid unsafe
	assumptions about record ownership or optional fields.

## Delivery Workflow

- Specification MUST define user scenarios, functional requirements, and
	measurable success criteria before planning.
- Plans MUST map changes to concrete files and include validation checkpoints.
- Tasks MUST be grouped for independent delivery slices where practical and
	include explicit test/build verification steps.
- Implementation MUST update documentation when contracts, structure, or runtime
	behavior materially change.
- Final verification MUST include automated checks and PCF harness behavior
	confirmation for key interactions.

## Governance
This constitution is the governing standard for planning and implementation in
this repository. If a plan or task conflicts with this document, the
constitution takes precedence. Amendments require: (1) documented rationale,
(2) impact review on spec/plan/task templates, and (3) version bump using
semantic versioning: MAJOR for breaking governance changes, MINOR for new
principles or materially expanded obligations, PATCH for clarifications.

All pull requests SHOULD reference constitution compliance checks for scope,
security, and verification gates.

**Version**: 1.0.0 | **Ratified**: 2026-02-20 | **Last Amended**: 2026-02-20
