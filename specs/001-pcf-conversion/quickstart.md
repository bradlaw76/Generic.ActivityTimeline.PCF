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
   - Diagnostics panel can be opened and closed

## Packaging/Deployment (when ready)
- Use existing project deployment process (`pcf-scripts deploy` or solution packaging workflow used by the team).

## Acceptance Gate
Before closing implementation:
- `npm test` passes
- `npm run build` passes
- Harness verification checklist is complete
