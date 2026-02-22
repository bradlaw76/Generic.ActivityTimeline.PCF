# Quickstart: Generic Activity Timeline PCF Conversion

## Prerequisites
- Node.js and npm available
- Power Platform CLI available when packaging/deploying to Dataverse
- PCF project dependencies installed

## Setup
1. Install dependencies:
   - `npm install`
2. Build the control:
   - `npm run build`
3. Run tests:
   - `npm test`

## Local Harness Validation
1. Start harness:
   - `npm start`
2. In harness properties:
   - Set `recordId` empty to validate demo fallback mode
   - Set `entityName` to a valid table logical name (for example `contact`)
3. Verify baseline behavior:
   - Journey/List toggle updates view
   - Filters and search affect visible items
   - Selection updates intelligence panel details
   - Sync shows loading state and refreshes data
   - Export action creates CSV output
   - Export output includes only allowlisted fields (no hidden/sensitive fields)
   - Diagnostics panel can be opened and closed

## SC-001 User Validation Procedure
1. Recruit at least 10 target users (support/account personas).
2. Provide a consistent dataset and the same starting record context.
3. Ask each user to identify the latest relevant interaction.
4. Start timing when the control becomes visible; stop when the user confirms selection.
5. Record pass/fail for each participant using the rule: completion under 30 seconds.
6. SC-001 passes when at least 90% of participants complete within 30 seconds.

### Evidence Template
| Participant | Role | Completion Time (s) | Pass (<30s) | Notes |
|-------------|------|---------------------|-------------|-------|
| P01 | Support |  |  |  |
| P02 | Account |  |  |  |

## Packaging/Deployment (when ready)
- Use existing project deployment process (`pcf-scripts deploy` or solution packaging workflow used by the team).

## Acceptance Gate
Before closing implementation:
- `npm test` passes
- `npm run build` passes
- Harness verification checklist is complete
- SC-001 user validation evidence is recorded
- Security verification confirms export allowlist behavior
