# Research: Generic Activity Timeline PCF Conversion

## Objective
Establish implementation decisions required to migrate the existing HTML timeline to a PCF-native React control with feature parity.

## Decisions

### D1. Runtime Data Access
- Decision: Use `context.webAPI.retrieveMultipleRecords()` for all Dataverse reads.
- Rationale: Native PCF pattern, avoids custom auth flows, matches platform permissions.
- Alternatives considered: Custom REST client (rejected: unnecessary complexity and security risk).

### D2. UI Architecture
- Decision: Root `ActivityTimeline` component owns UI state; specialized hooks handle data loading and filtering.
- Rationale: Keeps view logic testable and minimizes coupling across render components.
- Alternatives considered: Monolithic component (rejected: hard to test and maintain).

### D3. Styling Strategy
- Decision: Port existing CSS custom properties and class semantics with only host-compatibility adjustments.
- Rationale: Supports visual parity while preserving maintainability.
- Alternatives considered: Full redesign (rejected: out of scope for migration parity goal).

### D4. Sentiment Representation
- Decision: Model sentiment as dedicated timeline nodes linked to phone interactions.
- Rationale: Mirrors existing behavior and keeps sentiment visible in both timeline and details panel.
- Alternatives considered: Inline sentiment-only metadata (rejected: reduced visibility and parity risk).

### D5. Verification Approach
- Decision: Use targeted utility tests plus full build/test and PCF harness behavior checks.
- Rationale: Balances migration speed with defect containment and regression confidence.
- Alternatives considered: Harness-only manual testing (rejected: insufficient repeatability).

## Risks and Mitigations
- Risk: Dataverse field shape variation across environments.
  - Mitigation: Defensive null handling and fallback labels.
- Risk: Render path injection via activity descriptions.
  - Mitigation: Explicit sanitization utilities and test coverage.
- Risk: Scope creep during parity migration.
  - Mitigation: Enforce constitution and spec acceptance criteria.
