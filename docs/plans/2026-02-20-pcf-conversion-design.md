# PCF Conversion Design — Generic Activity Timeline
**Date:** 2026-02-20
**Status:** Approved
**Source:** `Generic.ActicityTimelines/Generic.ActivityTimeline/webresources/activity-timeline/activity-timeline.v3.1.4.html`
**Target:** `Generic.ActivityTimeline.PCF/ActivityTimelineControl/`

---

## Overview

Convert the production Dynamics 365 HTML web resource (v3.1.4, 549-line single-file vanilla JS) into a PowerApps Component Framework (PCF) Standard Control using React functional components and TypeScript. The feature set is preserved with full parity (minus web-resource-specific features). Architecture follows PCF best practices from day one.

**Approach chosen:** B — Modern PCF-Native (clean architecture, React hooks, `context.webAPI`)

---

## Architecture

### Component Tree

```
ActivityTimeline (root — owns all state)
├── Header            (title, tab switcher, days filter, zoom, time toggle, export, sync)
├── FilterRow         (type chip filters + search input)
└── ContentGrid
    ├── JourneyView   (horizontal auto-laned timeline)  ─┐ toggled by activeTab
    │    └── ListView (vertical chronological list)      ─┘
    └── IntelligencePanel  (right pane — selected node metadata + sentiment)
        └── SentimentBadge
```

### File Structure

```
ActivityTimelineControl/
├── index.ts                         # PCF entry point — mounts React root
├── ControlManifest.Input.xml        # PCF manifest (minimal — recordId + entityName only)
├── css/
│   └── ActivityTimelineControl.css  # Global styles + CSS custom properties
├── components/
│   ├── ActivityTimeline.tsx         # Root component, all state
│   ├── Header.tsx                   # Title, controls bar
│   ├── FilterRow.tsx                # Type chips + search input
│   ├── JourneyView.tsx              # Horizontal auto-laned timeline
│   ├── ListView.tsx                 # Vertical chronological list
│   ├── IntelligencePanel.tsx        # Right pane, node metadata
│   ├── SentimentBadge.tsx           # Sentiment color badge
│   └── DiagnosticConsole.tsx        # Debug tray
├── hooks/
│   ├── useActivities.ts             # Fetch + transform → ActivityNode[]
│   └── useFilter.ts                 # Filter/search derived state
├── services/
│   └── DataverseService.ts          # context.webAPI queries
├── models/
│   ├── ActivityNode.ts              # Core data model
│   ├── FilterState.ts               # Filter/UI state
│   └── SentimentScore.ts           # Sentiment data
└── utils/
    ├── DateUtils.ts                 # Date formatting helpers
    ├── Sanitizer.ts                 # XSS protection
    └── GccDetector.ts              # GCC environment detection
```

---

## Data Models

### ActivityNode

```typescript
interface ActivityNode {
  id: string;
  title: string;
  description: string;
  date: Date;
  rawType: number | string;
  entityName: string;
  normalizedType: 'phonecall' | 'email' | 'task' | 'appointment' |
                  'chat' | 'note' | 'letter' | 'voicemail' |
                  'system' | 'custom' | 'sentiment_score';
  displayName: string;
  source: 'dataverse' | 'demo';
  state: string;
  owner: string;
  // Optional — sentiment nodes only
  initials?: string;
  sentimentScore?: number;
  sentimentClass?: 'pos' | 'neg' | 'neu';
  sentimentChoiceLabel?: string;
}
```

### FilterState

```typescript
interface FilterState {
  activeDisplayNames: Set<string>;
  searchQuery: string;
  daysFilter: 7 | 30 | 90 | 365;
  canvasWidth: number;       // 800–4000
  showTime: boolean;
  activeTab: 'journey' | 'list';
  panelFontSize: 'sm' | 'md' | 'lg';
}
```

---

## PCF Manifest

Minimal — runtime UI state (search, zoom, filter, time display) is not manifest config.

```xml
<property name="recordId"   display-name="Record ID"   of-type="SingleLine.Text" required="true" />
<property name="entityName" display-name="Entity Name" of-type="SingleLine.Text" required="true" />
```

---

## Data Flow

```
PCF context.webAPI
      ↓
DataverseService.fetchAll(context, recordId, daysFilter)
  → retrieveMultipleRecords('activitypointer', query)   [parallel]
  → retrieveMultipleRecords('annotation', query)         [parallel]
  → retrieveMultipleRecords('phonecall', query)          [parallel]
      ↓ Promise.all → merge + sort by date
useActivities hook  →  ActivityNode[]
      ↓
useFilter hook  →  filtered ActivityNode[]  (type chips, search, date range)
      ↓
JourneyView / ListView  (render filtered nodes)
IntelligencePanel       (receives selectedNode on click)
```

**Key differences from source:**
- `context.webAPI.retrieveMultipleRecords()` replaces `fetch('/api/data/v9.2/')` and `Xrm.WebApi`
- Record ID comes from the `recordId` manifest property, not URL parsing
- OData query strings (`$select`, `$filter`, `$orderby`) are identical to source v3.1.4
- Demo mode: when `recordId` is empty, `useActivities` returns a single demo node (graceful degradation)

---

## Feature Parity

| Source Feature | PCF Status | Notes |
|---|---|---|
| Journey View (auto-laned) | Full port | Same lane algorithm (max 12 lanes), CSS absolute positioning |
| List View | Full port | |
| Intelligence Panel | Full port | |
| Sentiment rings + badges | Full port | `SentimentBadge` component |
| Type filter chips | Full port | |
| Search (debounced 150ms) | Full port | |
| Date range filter (7/30/90/365d) | Full port | Triggers re-fetch via `useActivities` |
| Zoom slider (800–4000px) | Full port | |
| Time toggle | Full port | |
| Export CSV | Full port | Same Blob/download approach |
| GCC compliance | Full port | `GccDetector` hides popout in `.crm9.` envs |
| Diagnostic console | Full port | `DiagnosticConsole` component |
| Font size (A-/A/A+) | Full port | |
| Popout button | Deferred | Requires web resource URL context; not applicable in PCF iframe |
| Close button | Dropped | No meaning inside a PCF form control |

---

## Styling

- Keep source CSS custom property tokens verbatim (`--dn-blue`, `--dn-neutral-primary`, etc.)
- Single CSS file — no CSS modules, no Fluent UI dependency
- Replace `height: 100vh` with `height: 100%` for PCF container compatibility
- All source layout classes (`.container`, `.content-grid`, `.timeline-viewport`, etc.) preserved

---

## Constants (from source — preserve exactly)

```typescript
const ENTITY_MAP: Record<number, string> = {
  4210: 'Phone Call', 4200: 'Email', 4202: 'Task',
  4201: 'Appointment', 4216: 'Chat', 4207: 'Letter', 4214: 'Voicemail', 4204: 'Fax'
};

const ICONS: Record<string, string> = {
  phonecall: '📞', email: '✉️', task: '✅', appointment: '📅',
  chat: '💬', system: '⚙️', custom: '🧩', sentiment_score: '📊',
  note: '📝', letter: '✉️', voicemail: '🎙️', default: '📄'
};

const SENTIMENT_CHOICE_MAP: Record<number, string> = {
  687940000: 'Positive', 687940001: 'Neutral', 687940002: 'Negative'
};
```

---

## OData Queries (from source — preserve exactly)

**activitypointer:**
```
$select=activityid,subject,description,createdon,scheduledstart,activitytypecode,
        statecode,actualdurationminutes,prioritycode,_regardingobjectid_value,_ownerid_value
$filter=(_regardingobjectid_value eq {recordId}) and (createdon ge {startDate})
$orderby=createdon asc
```

**annotation:**
```
$select=annotationid,subject,notetext,createdon,_ownerid_value
$filter=(_objectid_value eq {recordId})
$top=500
```

**phonecall:**
```
$select=activityid,gensoft_sentimentscore,gensoft_transcriptsentimentchoice
$filter=(_regardingobjectid_value eq {recordId})
$top=500
```
