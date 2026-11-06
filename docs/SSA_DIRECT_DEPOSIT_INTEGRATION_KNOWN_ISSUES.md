# SSA Direct Deposit — Generic Activity Timeline PCF: Known Issues and Future Integration

**Status:** OPEN / NOT INSTALLED — documentation-only assessment (2026-11-05 ET)  
**PCF repository:** `bradlaw76/Generic.ActivityTimeline.PCF` (`001-pcf-conversion`)  
**Target application repository:** `bradlaw76/ContactCenterDirectDeposit` (`potential-eureka`)  
**Target:** existing `SSADirectDeposit` solution; new **SSA Direct Deposit - Contact** model-driven main form on native `contact`  
**Scope:** Preserve current control and SSA deployments. No installation, build, write to Dataverse, form publication, or merge is recorded by this note.

## Summary

The existing PCF is a candidate for the SSA Contact form's **Customer Activity** tab, but it is **not ready to install** as a functioning Contact timeline. Its UI components and Dataverse service exist separately; the current control lifecycle does not load records or pass them to the visualizations. In addition, its direct API queries, security, filtering, and SSA data compatibility require correction.

The SSA repository's H018 handoff still has separately governed schema/form/runtime approval gates. This enhancement must not bypass them. Review the *current* sequential HXXX handoff before proceeding; H018 is the last verified at the time of this assessment, not a reserved ID for future work.

## Confirmed code issues

| ID | Priority | Location | Observed issue | Required future fix / acceptance |
| --- | --- | --- | --- | --- |
| AT-01 | P0 | `ActivityTimelineControl/index.ts` | `init` creates visual components and `updateView` only calls component `update` methods. It never calls `DataverseService.fetchActivities` or `setActivities`. | Load activities from the current Contact context and supply them to both JourneyView and ListView; handle record changes and stale requests. |
| AT-02 | P0 | `ActivityTimelineControl/services/DataverseService.ts` | Uses `/api/data/v9.2/activitypointer` and `/api/data/v9.2/phonecall` as entity-set paths. These are singular names, not verified Dataverse entity sets; the activity regarding lookup is also unverified. | Use verified Dataverse entity-set and attribute metadata and supported `context.webAPI` operations where suitable. Test retrieval against the actual target environment. |
| AT-03 | P0 | `ActivityTimelineControl/components/ListView.ts`, `IntelligencePanel.ts` | Unescaped record-derived strings are placed into `innerHTML` (`title`, `displayName`, `owner`, `description`, etc.). | Use DOM `textContent`/safe node composition; add injection-regression tests. Do not rely on the presence of unused sanitizer utilities. |
| AT-04 | P1 | `ActivityTimelineControl/index.ts`, `SearchBar.ts`, `FilterControls.ts` | SearchBar provides a callback, but the root control never wires it to ListView. FilterControls renders a search input without applying filters. | Wire one consistent search/filter state to views; validate type, date-range, and search controls rather than implying they work. |
| AT-05 | P1 | `ActivityTimelineControl/services/DataverseService.ts` | `fetchSentimentScores` selects `gensoft_sentimentscore` and `gensoft_transcriptsentimentchoice`, which are not confirmed in SSA metadata. The current code does not gracefully handle their absence. | Make sentiment optional and capability-detected. The base timeline must work when these columns are unavailable. |
| AT-06 | P1 | `ActivityTimelineControl/ControlManifest.Input.xml`, `index.ts` | Manifest defines optional text inputs `recordId` and `entityName`, but the root control does not consume them. Form-context binding and host compatibility are unproven. | Decide on a supported model-driven host (field-bound or other supported placement); bind the active Contact ID and logical name without static record GUIDs. Verify editor and runtime behavior. |
| AT-07 | P1 | `ActivityTimelineControl/services/DataverseService.ts` | Current query scope is activity records regarding the supplied record; it does not implement Contact-related Case history, notes, or actual voice/chat relationship traversal. | Design bounded, metadata-verified queries for standard activities and separately labeled related Cases, notes, and interactions; enforce permissions, actual relationships, and deduplication. Do not invent timeline events. |
| AT-08 | P1 | `ActivityTimelineControl/index.ts` and view components | No reliable asynchronous lifecycle states, error/retry behavior, pending-load cancellation/discard, or coherent selection-to-detail wiring are evident. | Implement loading/empty/error/no-permission states, race guards, retry, accessible interaction and selection-driven detail. |
| AT-09 | P2 | `ActivityTimelineControl/components/JourneyView.ts`, `ListView.ts` | Timestamps use raw `toISOString()`; there is no proven shared chronological sort, locale/date presentation, or meaningful journey grouping. | Sort consistently by source timestamps; display local time and source/type; retain auditable UTC timestamps in data. |
| AT-10 | P1 | PCF and SSA solution sources | No verified installed PCF or registered form component in the SSA environment; no exact approved component/layer/rollback plan. | Build/test locally, package reproducibly, inspect publisher/solution dependencies and current form metadata, then request a separate exact deployment approval. |

## Recommended form experience (future)

- Add a dedicated **Customer Activity** tab to the new `SSA Direct Deposit - Contact` main form, subject to supported PCF hosting and current form schema.
- Keep existing Contact details and **native Timeline** until the custom component passes live acceptance; do not replace shared Contact forms.
- Keep the SSA Case checklist, Generic Sidebar, Contact Center workspace, and portal unchanged.
- Show verified, timestamped phone calls, emails, tasks, appointments and other supported activity types first; add Case/notes/voice/chat entries only after their actual lookup relationships and permissions are established.
- Make the PCF read-only initially; never change existing activity records to make the demonstration appear populated.

## Integration gates and execution order

1. **Reconcile first:** Fetch current PCF and SSA branches; read `docs/CHATGPT_REVIEW_HANDOFF.md` in SSA and later HXXX records; verify actual Contact form and solution metadata. Avoid stale H008/H014 assumptions.
2. **Fix/test PCF locally:** Resolve AT-01 through AT-09; add focused tests for loading, context switch, injection, missing optional columns, filtering and query behavior.
3. **Prepare *additive* form registration:** Prove the supported control-host and input-binding mechanism in a testable form design. Identify exact form ID, control dependencies, publisher and solution ownership; do not overwrite P0 or other SSA/shared forms.
4. **Package and review:** Record components, hashes, layer effects, permissions, tests, deployment rollback and drift checks. Maintain separation from frozen H014 schema-only approval.
5. **Obtain explicit exact-scope authorization before writes:** No `pac pcf push`, solution import, Contact form update/publish, new schema, fixture writes, or changes to shared components without approval.
6. **Validate live after approval:** Confirm installed control on the intended Contact form, correct per-record event isolation, timestamps, empty/no-access behavior, no console errors, and preserved native Timeline/Case/portal behavior.

## Completion criteria

- **Local-ready:** PCF build and tests pass; verified data-loading and safe rendering; reproducible component package; supported Contact form placement and mapping documented.
- **Installed:** Exact authorized PCF component and Contact form registration present in the intended Dataverse environment.
- **Validated:** Real representative Contact records show only legitimately related activities; user access, changing records, empty/error states and no-regression checks pass.

**Current status is NOT INSTALLED and NOT VALIDATED.** This document is a future-work backlog, not proof of a deployed component.

## Handoff convention

When this future work is executed, update the SSA repository's `docs/CHATGPT_REVIEW_HANDOFF.md`, preserve previous entries, use the next actual sequential HXXX number, and include the numbered ChatGPT conversation/workstream title **SSA Direct Deposit — Generic Activity Timeline PCF Integration**. Record exact changed files, commits, tests, deployment status, blockers and next steps.
