# Generic Activity Timeline PCF Conversion — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert the production `activity-timeline.v3.1.4.html` web resource into a Modern PCF-Native TypeScript/React Standard Control with full feature parity.

**Architecture:** React functional components with custom hooks. `ActivityTimeline.tsx` owns all state and delegates to `useActivities` (data fetch) and `useFilter` (derived state). All Dataverse access through `context.webAPI.retrieveMultipleRecords()`. CSS custom properties preserved verbatim from source.

**Tech Stack:** React 17, TypeScript 4, pcf-scripts 1.x, Jest (via pcf-scripts test)

**Source reference:** `d:/Onedrive/OneDrive - Microsoft - Nov 24/OneDrive - Microsoft/DEMO/My Github/Generic.ActicityTimelines/Generic.ActivityTimeline/webresources/activity-timeline/activity-timeline.v3.1.4.html`

**Root:** All paths below are relative to `Generic.ActivityTimeline.PCF/Generic.ActivityTimeline.PCF/`

---

## Phase 1 — Project Setup

### Task 1: Fix tsconfig.json for JSX

**Files:**
- Modify: `tsconfig.json`

**Step 1: Replace tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "lib": ["es6", "dom"],
    "jsx": "react",
    "outDir": "./dist",
    "rootDir": "./ActivityTimelineControl",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["ActivityTimelineControl/**/*"],
  "exclude": ["node_modules", "**/*.test.ts", "**/*.test.tsx"]
}
```

**Step 2: Verify it compiles**

```bash
cd "Generic.ActivityTimeline.PCF"
npm run build 2>&1 | head -20
```

Expected: Build may fail on existing stub files (that's fine for now), but NOT on a JSX syntax error.

**Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "chore: add jsx:react to tsconfig"
```

---

### Task 2: Update package.json

**Files:**
- Modify: `package.json`

**Step 1: Replace package.json**

```json
{
  "name": "generic-activity-timeline-pcf",
  "version": "1.0.0",
  "description": "PCF control for dual-view activity timeline with sentiment analysis.",
  "main": "ActivityTimelineControl/index.ts",
  "scripts": {
    "build": "pcf-scripts build",
    "test": "pcf-scripts test",
    "start": "pcf-scripts start",
    "deploy": "pcf-scripts deploy"
  },
  "keywords": ["pcf", "dynamics365", "activity-timeline"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@types/react": "^17.0.0",
    "@types/react-dom": "^17.0.0",
    "react": "^17.0.0",
    "react-dom": "^17.0.0"
  },
  "devDependencies": {
    "@types/jest": "^26.0.0",
    "pcf-scripts": "^1.0.0",
    "typescript": "^4.0.0"
  }
}
```

**Step 2: Install**

```bash
npm install
```

Expected: No errors. `node_modules/` updated.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: clean up package.json"
```

---

### Task 3: Update ControlManifest.Input.xml

**Files:**
- Modify: `ActivityTimelineControl/ControlManifest.Input.xml`

**Step 1: Replace manifest**

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest>
  <control namespace="Generic.ActivityTimeline"
           constructor="ActivityTimelineControl"
           version="1.0.0"
           display-name-key="ActivityTimeline"
           description-key="ActivityTimeline_Desc"
           control-type="standard">
    <property name="recordId"
              display-name-key="recordId"
              description-key="recordId_Desc"
              of-type="SingleLine.Text"
              usage="bound"
              required="true" />
    <property name="entityName"
              display-name-key="entityName"
              description-key="entityName_Desc"
              of-type="SingleLine.Text"
              usage="input"
              required="true" />
    <resources>
      <code path="index.ts" order="1" />
      <css path="css/ActivityTimelineControl.css" order="1" />
    </resources>
    <feature-usage>
      <uses-feature name="WebAPI" required="true" />
    </feature-usage>
  </control>
</manifest>
```

**Step 2: Commit**

```bash
git add ActivityTimelineControl/ControlManifest.Input.xml
git commit -m "chore: simplify manifest to recordId + entityName"
```

---

## Phase 2 — Models & Constants

### Task 4: Create Data Models

**Files:**
- Overwrite: `ActivityTimelineControl/models/ActivityNode.ts` (replaces Activity.ts concept)
- Overwrite: `ActivityTimelineControl/models/FilterState.ts`
- Overwrite: `ActivityTimelineControl/models/SentimentScore.ts`

**Step 1: Write ActivityNode.ts**

```typescript
// ActivityTimelineControl/models/ActivityNode.ts

export type NormalizedType =
  | 'phonecall' | 'email' | 'task' | 'appointment'
  | 'chat' | 'note' | 'letter' | 'voicemail'
  | 'system' | 'custom' | 'sentiment_score';

export type SentimentClass = 'pos' | 'neg' | 'neu';
export type ActivitySource = 'dataverse' | 'demo';

export interface ActivityNode {
  id: string;
  title: string;
  description: string;
  date: Date;
  rawType: number | string;
  entityName: string;
  normalizedType: NormalizedType;
  displayName: string;
  source: ActivitySource;
  state: string;
  owner: string;
  // sentiment nodes only
  initials?: string;
  sentimentScore?: number;
  sentimentClass?: SentimentClass;
  sentimentChoiceLabel?: string;
}
```

**Step 2: Write FilterState.ts**

```typescript
// ActivityTimelineControl/models/FilterState.ts

export type DaysFilter = 7 | 30 | 90 | 365;
export type TabId = 'journey' | 'list';
export type FontSize = 'sm' | 'md' | 'lg';

export interface FilterState {
  activeDisplayNames: Set<string>;
  searchQuery: string;
  daysFilter: DaysFilter;
  canvasWidth: number;
  showTime: boolean;
  activeTab: TabId;
  panelFontSize: FontSize;
}

export function createInitialFilterState(): FilterState {
  return {
    activeDisplayNames: new Set<string>(),
    searchQuery: '',
    daysFilter: 30,
    canvasWidth: 1000,
    showTime: false,
    activeTab: 'journey',
    panelFontSize: 'md',
  };
}
```

**Step 3: Write SentimentScore.ts**

```typescript
// ActivityTimelineControl/models/SentimentScore.ts

export interface SentimentScore {
  score: number;
  choiceValue: number;
  choiceLabel: string;
}
```

**Step 4: Delete obsolete model**

```bash
rm ActivityTimelineControl/models/Activity.ts
```

**Step 5: Commit**

```bash
git add ActivityTimelineControl/models/
git commit -m "feat: add ActivityNode, FilterState, SentimentScore models"
```

---

### Task 5: Create constants.ts

**Files:**
- Create: `ActivityTimelineControl/constants.ts`

**Step 1: Write constants.ts**

```typescript
// ActivityTimelineControl/constants.ts

export const ENTITY_MAP: Record<number, string> = {
  4210: 'Phone Call',
  4200: 'Email',
  4202: 'Task',
  4201: 'Appointment',
  4216: 'Chat',
  4207: 'Letter',
  4214: 'Voicemail',
  4204: 'Fax',
};

export const ICONS: Record<string, string> = {
  phonecall: '📞',
  email: '✉️',
  task: '✅',
  appointment: '📅',
  chat: '💬',
  system: '⚙️',
  custom: '🧩',
  sentiment_score: '📊',
  note: '📝',
  letter: '✉️',
  voicemail: '🎙️',
  default: '📄',
};

export const SENTIMENT_CHOICE_MAP: Record<number, string> = {
  687940000: 'Positive',
  687940001: 'Neutral',
  687940002: 'Negative',
};
```

**Step 2: Commit**

```bash
git add ActivityTimelineControl/constants.ts
git commit -m "feat: add ENTITY_MAP, ICONS, SENTIMENT_CHOICE_MAP constants"
```

---

## Phase 3 — Utilities

### Task 6: Implement and test Sanitizer.ts

**Files:**
- Overwrite: `ActivityTimelineControl/utils/Sanitizer.ts`
- Create: `ActivityTimelineControl/utils/Sanitizer.test.ts`

**Step 1: Write the failing tests**

```typescript
// ActivityTimelineControl/utils/Sanitizer.test.ts
import { sanitizeHTML, sanitizeInput } from './Sanitizer';

describe('sanitizeInput', () => {
  it('replaces < with &lt;', () => {
    expect(sanitizeInput('<script>')).toContain('&lt;');
  });
  it('replaces > with &gt;', () => {
    expect(sanitizeInput('<script>')).toContain('&gt;');
  });
  it('returns empty string unchanged', () => {
    expect(sanitizeInput('')).toBe('');
  });
  it('leaves safe text unchanged', () => {
    expect(sanitizeInput('hello world')).toBe('hello world');
  });
});

describe('sanitizeHTML', () => {
  it('is defined', () => {
    expect(typeof sanitizeHTML).toBe('function');
  });
});
```

**Step 2: Run to verify they fail**

```bash
npm test -- --testPathPattern=Sanitizer
```

Expected: FAIL — "Cannot find module './Sanitizer'"

**Step 3: Write Sanitizer.ts**

```typescript
// ActivityTimelineControl/utils/Sanitizer.ts

export function sanitizeHTML(str: string): string {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}

export function sanitizeInput(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
```

**Step 4: Run tests to verify pass**

```bash
npm test -- --testPathPattern=Sanitizer
```

Expected: PASS — 5 tests passing

**Step 5: Commit**

```bash
git add ActivityTimelineControl/utils/Sanitizer.ts ActivityTimelineControl/utils/Sanitizer.test.ts
git commit -m "feat: add Sanitizer utility with tests"
```

---

### Task 7: Implement and test normalizeType.ts

**Files:**
- Create: `ActivityTimelineControl/utils/normalizeType.ts`
- Create: `ActivityTimelineControl/utils/normalizeType.test.ts`

**Step 1: Write the failing tests**

```typescript
// ActivityTimelineControl/utils/normalizeType.test.ts
import { normalizeType } from './normalizeType';

describe('normalizeType — numeric codes', () => {
  it('maps 4210 to phonecall', () => expect(normalizeType(4210)).toBe('phonecall'));
  it('maps 4200 to email',     () => expect(normalizeType(4200)).toBe('email'));
  it('maps 4202 to task',      () => expect(normalizeType(4202)).toBe('task'));
  it('maps 4201 to appointment', () => expect(normalizeType(4201)).toBe('appointment'));
  it('maps 4207 to letter',    () => expect(normalizeType(4207)).toBe('letter'));
  it('maps unknown to custom', () => expect(normalizeType(9999)).toBe('custom'));
});

describe('normalizeType — string types', () => {
  it('maps "annotation" to note',            () => expect(normalizeType('annotation')).toBe('note'));
  it('maps "incidentresolution" to system',  () => expect(normalizeType('incidentresolution')).toBe('system'));
  it('maps "phonecall" to phonecall',        () => expect(normalizeType('phonecall')).toBe('phonecall'));
  it('maps "email" to email',                () => expect(normalizeType('email')).toBe('email'));
  it('maps unknown string to custom',        () => expect(normalizeType('unknown_xyz')).toBe('custom'));
});

describe('normalizeType — workflow detection via description', () => {
  it('maps custom type with "workflow" in desc to system', () => {
    expect(normalizeType(9999, '', 'auto workflow step')).toBe('system');
  });
});
```

**Step 2: Run to verify they fail**

```bash
npm test -- --testPathPattern=normalizeType
```

Expected: FAIL

**Step 3: Write normalizeType.ts**

```typescript
// ActivityTimelineControl/utils/normalizeType.ts

const KNOWN_STRING_TYPES = new Set([
  'phonecall', 'email', 'task', 'appointment', 'chat',
  'incidentresolution', 'annotation', 'adx_portalcomment',
  'letter', 'voicemail',
]);

const NUMERIC_MAP: Record<number, string> = {
  4210: 'phonecall',
  4200: 'email',
  4202: 'task',
  4201: 'appointment',
  4216: 'chat',
  4207: 'letter',
  4214: 'voicemail',
};

const PASSTHROUGH = new Set([
  'phonecall', 'email', 'chat', 'appointment',
  'note', 'adx_portalcomment', 'letter', 'voicemail',
]);

export function normalizeType(
  v: number | string,
  sub = '',
  desc = ''
): string {
  let base = 'custom';
  const combined = (sub + ' ' + desc).toLowerCase();

  if (typeof v === 'string') {
    const s = v.toLowerCase();
    if (KNOWN_STRING_TYPES.has(s)) {
      base = s === 'incidentresolution' ? 'system'
           : s === 'annotation'         ? 'note'
           : s;
    }
  } else {
    base = NUMERIC_MAP[v] ?? 'custom';
  }

  if (PASSTHROUGH.has(base)) return base;
  if (['workflow', 'auto-generated', 'resolution'].some(k => combined.includes(k))) {
    return 'system';
  }
  return base;
}
```

**Step 4: Run tests**

```bash
npm test -- --testPathPattern=normalizeType
```

Expected: PASS — 11 tests passing

**Step 5: Commit**

```bash
git add ActivityTimelineControl/utils/normalizeType.ts ActivityTimelineControl/utils/normalizeType.test.ts
git commit -m "feat: add normalizeType utility with tests"
```

---

### Task 8: Implement and test DateUtils.ts

**Files:**
- Overwrite: `ActivityTimelineControl/utils/DateUtils.ts`
- Create: `ActivityTimelineControl/utils/DateUtils.test.ts`

**Step 1: Write failing tests**

```typescript
// ActivityTimelineControl/utils/DateUtils.test.ts
import { getTemporalContext, getDateLimit } from './DateUtils';

describe('getTemporalContext', () => {
  it('returns d and t string fields', () => {
    const result = getTemporalContext(new Date('2026-01-15T10:30:00'));
    expect(typeof result.d).toBe('string');
    expect(typeof result.t).toBe('string');
    expect(result.d.length).toBeGreaterThan(0);
    expect(result.t.length).toBeGreaterThan(0);
  });
});

describe('getDateLimit', () => {
  it('returns a Date daysBack days in the past', () => {
    const limit = getDateLimit(30);
    const expected = Date.now() - 30 * 24 * 60 * 60 * 1000;
    expect(Math.abs(limit.getTime() - expected)).toBeLessThan(5000);
  });
  it('returns a Date object', () => {
    expect(getDateLimit(7)).toBeInstanceOf(Date);
  });
});
```

**Step 2: Run to verify fail**

```bash
npm test -- --testPathPattern=DateUtils
```

Expected: FAIL

**Step 3: Write DateUtils.ts**

```typescript
// ActivityTimelineControl/utils/DateUtils.ts

export interface TemporalContext {
  d: string;
  t: string;
}

export function getTemporalContext(date: Date): TemporalContext {
  return {
    d: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    t: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

export function getDateLimit(daysBack: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  return d;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}
```

**Step 4: Run tests**

```bash
npm test -- --testPathPattern=DateUtils
```

Expected: PASS — 3 tests passing

**Step 5: Commit**

```bash
git add ActivityTimelineControl/utils/DateUtils.ts ActivityTimelineControl/utils/DateUtils.test.ts
git commit -m "feat: add DateUtils with getTemporalContext and getDateLimit"
```

---

### Task 9: Implement GccDetector.ts

**Files:**
- Overwrite: `ActivityTimelineControl/utils/GccDetector.ts`

**Step 1: Write GccDetector.ts**

```typescript
// ActivityTimelineControl/utils/GccDetector.ts

export function isGccEnvironment(): boolean {
  return window.location.href.includes('.crm9.');
}
```

**Step 2: Delete obsolete service files**

```bash
rm ActivityTimelineControl/services/SentimentService.ts
rm ActivityTimelineControl/services/ExportService.ts
```

**Step 3: Commit**

```bash
git add ActivityTimelineControl/utils/GccDetector.ts
git commit -m "feat: add GccDetector, remove obsolete service stubs"
```

---

## Phase 4 — Data Layer

### Task 10: Implement DataverseService.ts

**Files:**
- Overwrite: `ActivityTimelineControl/services/DataverseService.ts`

**Step 1: Write DataverseService.ts**

This uses `context.webAPI.retrieveMultipleRecords()` — the OData queries are preserved verbatim from source v3.1.4.

```typescript
// ActivityTimelineControl/services/DataverseService.ts
import { ActivityNode } from '../models/ActivityNode';
import { ENTITY_MAP, SENTIMENT_CHOICE_MAP } from '../constants';
import { normalizeType } from '../utils/normalizeType';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export async function fetchAll(
  context: ComponentFramework.Context<any>,
  recordId: string,
  daysFilter: number,
  isDialog = false
): Promise<ActivityNode[]> {
  const start = new Date();
  start.setDate(start.getDate() - daysFilter);

  const actSelect = [
    'activityid', 'subject', 'description', 'createdon', 'scheduledstart',
    'activitytypecode', 'statecode', 'actualdurationminutes',
    'prioritycode', '_regardingobjectid_value', '_ownerid_value',
  ].join(',');

  const activityQuery = isDialog
    ? `?$select=${actSelect}&$filter=(_regardingobjectid_value eq ${recordId})&$orderby=createdon asc`
    : `?$select=${actSelect}&$filter=(_regardingobjectid_value eq ${recordId}) and (createdon ge ${start.toISOString()})&$orderby=createdon asc`;

  const noteQuery = `?$select=annotationid,subject,notetext,createdon,_ownerid_value` +
    `&$filter=(_objectid_value eq ${recordId})&$top=500`;

  const phoneQuery = `?$select=activityid,gensoft_sentimentscore,gensoft_transcriptsentimentchoice` +
    `&$filter=(_regardingobjectid_value eq ${recordId})&$top=500`;

  const [actResult, noteResult, phoneResult] = await Promise.all([
    context.webAPI.retrieveMultipleRecords('activitypointer', activityQuery),
    context.webAPI.retrieveMultipleRecords('annotation', noteQuery),
    context.webAPI.retrieveMultipleRecords('phonecall', phoneQuery),
  ]);

  // Build sentiment lookup map
  const sentimentMap: Record<string, { score: number; choiceLabel: string }> = {};
  phoneResult.entities.forEach(p => {
    const score = p['gensoft_sentimentscore'];
    if (score !== null && score !== undefined) {
      const choice = p['gensoft_transcriptsentimentchoice'] as number;
      sentimentMap[String(p['activityid'])] = {
        score: score as number,
        choiceLabel: SENTIMENT_CHOICE_MAP[choice] ?? 'Unknown',
      };
    }
  });

  const nodes: ActivityNode[] = [];

  // Primary activities + paired sentiment nodes
  actResult.entities.forEach(a => {
    const typeCode = a['activitytypecode'] as number;
    const d = new Date((a['scheduledstart'] || a['createdon']) as string);
    const label = ENTITY_MAP[typeCode]
      ?? (a['activitytypecode@OData.Community.Display.V1.FormattedValue'] as string)
      ?? 'Interaction';

    nodes.push({
      id: String(a['activityid']),
      title: (a['subject'] as string) || 'No Subject',
      description: (a['description'] as string) || '',
      date: d,
      rawType: typeCode,
      entityName: isNaN(typeCode)
        ? String(typeCode)
        : (ENTITY_MAP[typeCode]?.toLowerCase().replace(' ', '') ?? 'activitypointer'),
      normalizedType: normalizeType(
        typeCode,
        a['subject'] as string,
        a['description'] as string
      ) as ActivityNode['normalizedType'],
      displayName: label,
      source: 'dataverse',
      state: (a['statecode@OData.Community.Display.V1.FormattedValue'] as string) ?? '',
      owner: (a['_ownerid_value@OData.Community.Display.V1.FormattedValue'] as string) ?? 'Unknown',
    });

    const sentiment = sentimentMap[String(a['activityid'])];
    if (sentiment) {
      const val = sentiment.score;
      nodes.push({
        id: `sent-${a['activityid']}`,
        title: `Sentiment: ${val}`,
        description: '',
        date: d,
        rawType: 'sentiment',
        entityName: 'phonecall',
        normalizedType: 'sentiment_score',
        displayName: 'Sentiment',
        source: 'dataverse',
        state: '',
        owner: 'System',
        sentimentClass: val > 5 ? 'pos' : val < 5 ? 'neg' : 'neu',
        sentimentScore: val,
        sentimentChoiceLabel: sentiment.choiceLabel,
      });
    }
  });

  // Notes
  noteResult.entities.forEach(n => {
    const owner = (n['_ownerid_value@OData.Community.Display.V1.FormattedValue'] as string) ?? 'Unknown';
    nodes.push({
      id: String(n['annotationid']),
      title: (n['subject'] as string) || 'Note Entry',
      description: (n['notetext'] as string) || 'No content.',
      date: new Date(n['createdon'] as string),
      rawType: 'annotation',
      entityName: 'annotation',
      normalizedType: 'note',
      displayName: 'Note',
      source: 'dataverse',
      state: 'Notes',
      owner,
      initials: getInitials(owner),
    });
  });

  return nodes.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getDemoNodes(): ActivityNode[] {
  return [{
    id: '1',
    title: 'Baseline Configuration Session',
    description: 'Internal interaction stream.',
    date: new Date(),
    rawType: 'annotation',
    entityName: 'annotation',
    normalizedType: 'note',
    displayName: 'Note',
    source: 'demo',
    state: 'Completed',
    owner: 'Demo User',
    initials: 'DU',
  }];
}
```

**Step 2: Commit**

```bash
git add ActivityTimelineControl/services/DataverseService.ts
git commit -m "feat: implement DataverseService using context.webAPI"
```

---

### Task 11: Implement useActivities hook

**Files:**
- Create: `ActivityTimelineControl/hooks/useActivities.ts`

**Step 1: Create hooks directory and write useActivities.ts**

```typescript
// ActivityTimelineControl/hooks/useActivities.ts
import { useState, useEffect, useCallback } from 'react';
import { ActivityNode } from '../models/ActivityNode';
import { fetchAll, getDemoNodes } from '../services/DataverseService';

export interface UseActivitiesResult {
  nodes: ActivityNode[];
  loading: boolean;
  error: string | null;
  sync: () => void;
  diagLogs: string[];
}

export function useActivities(
  context: ComponentFramework.Context<any>,
  recordId: string,
  daysFilter: number
): UseActivitiesResult {
  const [nodes, setNodes] = useState<ActivityNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagLogs, setDiagLogs] = useState<string[]>([]);

  const log = (msg: string) =>
    setDiagLogs(prev => [...prev, `[${new Date().toISOString()}] ${msg}`]);

  const sync = useCallback(async () => {
    setLoading(true);
    setError(null);
    log('Sync started');
    try {
      if (!recordId) {
        log('No recordId — demo mode');
        setNodes(getDemoNodes());
        return;
      }
      const isDialog = window.location.href.includes('popped=true');
      const result = await fetchAll(context, recordId, daysFilter, isDialog);
      setNodes(result);
      log(`Loaded ${result.length} nodes`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      log(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [context, recordId, daysFilter]);

  useEffect(() => { sync(); }, [sync]);

  return { nodes, loading, error, sync, diagLogs };
}
```

**Step 2: Commit**

```bash
git add ActivityTimelineControl/hooks/useActivities.ts
git commit -m "feat: add useActivities hook"
```

---

### Task 12: Implement useFilter hook

**Files:**
- Create: `ActivityTimelineControl/hooks/useFilter.ts`

**Step 1: Write useFilter.ts**

```typescript
// ActivityTimelineControl/hooks/useFilter.ts
import { useMemo } from 'react';
import { ActivityNode } from '../models/ActivityNode';
import { FilterState } from '../models/FilterState';

export interface UseFilterResult {
  filtered: ActivityNode[];
  allDisplayNames: Set<string>;
}

export function useFilter(
  nodes: ActivityNode[],
  filterState: FilterState
): UseFilterResult {
  const allDisplayNames = useMemo(
    () => new Set(nodes.map(n => n.displayName)),
    [nodes]
  );

  const filtered = useMemo(() => {
    const { activeDisplayNames, searchQuery } = filterState;
    const q = searchQuery.toLowerCase();
    return nodes.filter(n => {
      if (!activeDisplayNames.has(n.displayName)) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.owner.toLowerCase().includes(q)
      );
    });
  }, [nodes, filterState]);

  return { filtered, allDisplayNames };
}
```

**Step 2: Commit**

```bash
git add ActivityTimelineControl/hooks/useFilter.ts
git commit -m "feat: add useFilter hook"
```

---

## Phase 5 — CSS

### Task 13: Port CSS from source

**Files:**
- Overwrite: `ActivityTimelineControl/css/ActivityTimelineControl.css`

**Step 1: Replace the CSS file**

This is a faithful port of source v3.1.4 CSS — the only change is `height: 100vh` → `height: 100%` for PCF container compatibility.

```css
/* ActivityTimelineControl/css/ActivityTimelineControl.css */
:root {
  --dn-blue: #0078d4;
  --dn-blue-hover: #005a9e;
  --dn-neutral-primary: #323130;
  --dn-neutral-secondary: #605e5c;
  --dn-neutral-lighter: #f3f2f1;
  --dn-neutral-light: #edebe9;
  --dn-white: #ffffff;
  --dn-border-radius: 4px;
  --dn-shadow: 0 1.6px 3.6px rgba(0,0,0,0.132), 0 0.3px 0.9px rgba(0,0,0,0.108);
  --state-completed: #107c10;
  --state-open: #ffaa44;
  --state-canceled: #a19f9d;
  --track-color: #d2d0ce;
  --node-size: 34px;
}

/* Layout */
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 15px;
  gap: 10px;
  font-family: "Segoe UI", sans-serif;
  font-size: 13px;
  color: var(--dn-neutral-primary);
  box-sizing: border-box;
  position: relative;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--dn-neutral-light);
  flex-wrap: wrap;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.main-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--dn-neutral-primary);
}

.record-name-subtitle {
  font-size: 12px;
  color: var(--dn-neutral-secondary);
}

.badge {
  background: var(--dn-blue);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
}

.tab-switcher {
  display: flex;
  background: var(--dn-neutral-lighter);
  padding: 3px;
  border-radius: 8px;
  gap: 2px;
}

.tab-btn {
  padding: 4px 16px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--dn-neutral-secondary);
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--dn-white);
  color: var(--dn-blue);
  font-weight: 600;
  box-shadow: var(--dn-shadow);
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.control-group select,
.control-group input[type="range"] {
  height: 28px;
  border: 1px solid var(--dn-neutral-light);
  border-radius: var(--dn-border-radius);
  padding: 0 8px;
  font-size: 12px;
  background: var(--dn-white);
  cursor: pointer;
}

.btn {
  height: 28px;
  padding: 0 14px;
  font-size: 12px;
  background: var(--dn-white);
  border: 1px solid var(--dn-neutral-light);
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.15s;
}

.btn:hover { background: var(--dn-neutral-lighter); }
.btn.primary { background: var(--dn-blue); color: white; border: none; }
.btn.primary:hover { background: var(--dn-blue-hover); }
.btn.outline { border: 1px solid var(--dn-blue); color: var(--dn-blue); }
.btn.outline:hover { background: #e6f2fb; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Filter Row */
.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.filter-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.type-chip {
  padding: 4px 14px;
  border-radius: 16px;
  font-size: 12px;
  background: var(--dn-white);
  border: 1px solid var(--dn-neutral-light);
  cursor: pointer;
  transition: all 0.15s;
  color: var(--dn-neutral-primary);
}

.type-chip.active {
  background: var(--dn-neutral-primary);
  color: var(--dn-white);
  font-weight: 600;
  border-color: var(--dn-neutral-primary);
}

#searchInput {
  height: 28px;
  border: 1px solid var(--dn-neutral-light);
  border-radius: var(--dn-border-radius);
  padding: 0 10px;
  font-size: 12px;
  min-width: 200px;
  outline: none;
  transition: border-color 0.15s;
}

#searchInput:focus { border-color: var(--dn-blue); }

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 16px;
  flex: 1;
  min-height: 0;
}

.panel {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--dn-neutral-light);
  border-radius: var(--dn-border-radius);
  background: var(--dn-white);
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid var(--dn-neutral-light);
  background: var(--dn-neutral-lighter);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--dn-neutral-secondary);
  letter-spacing: 0.5px;
}

/* Journey View */
#viewJourney {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.top-scrollbar-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  height: 12px;
  background: var(--dn-neutral-lighter);
  border-bottom: 1px solid var(--dn-neutral-light);
}

.timeline-viewport {
  flex: 1;
  overflow: auto;
  background: #fff;
  background-image:
    linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}

.timeline-track {
  position: absolute;
  height: 2px;
  left: 0;
  right: 0;
  background: var(--track-color);
}

.node {
  position: absolute;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -50%);
  transition: transform 0.2s;
}

.node:hover { transform: translate(-50%, -50%) scale(1.05); }

.node-row {
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

.node-icon {
  width: var(--node-size);
  height: var(--node-size);
  background: white;
  border: 2.5px solid var(--dn-blue);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: var(--dn-shadow);
}

.node-side-meta {
  display: flex;
  flex-direction: column;
  font-size: 9px;
  color: var(--dn-neutral-secondary);
  padding-top: 2px;
}

.node-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--dn-neutral-primary);
  max-width: 100px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 4px;
}

/* Sentiment rings */
.ring-pos { border-color: #107c10 !important; box-shadow: 0 0 10px rgba(16,124,16,0.4) !important; }
.ring-neg { border-color: #d13438 !important; box-shadow: 0 0 10px rgba(209,52,56,0.4) !important; }
.ring-neu { border-color: #605e5c !important; }

/* Sentiment badges */
.sentiment-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.sentiment-badge.positive { background: #dff6dd; color: #107c10; border: 1px solid #107c10; }
.sentiment-badge.neutral  { background: #f3f2f1; color: #605e5c; border: 1px solid #605e5c; }
.sentiment-badge.negative { background: #fde7e9; color: #d13438; border: 1px solid #d13438; }

/* List View */
#viewList {
  flex: 1;
  overflow-y: auto;
}

#listContent {
  padding: 16px;
}

.list-item {
  display: flex;
  gap: 16px;
  padding-bottom: 24px;
}

.list-card {
  flex: 1;
  background: white;
  border: 1px solid var(--dn-neutral-light);
  border-radius: var(--dn-border-radius);
  padding: 12px 16px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.list-card:hover { border-color: var(--dn-blue); box-shadow: var(--dn-shadow); }
.list-card.selected { border-color: var(--dn-blue); box-shadow: var(--dn-shadow); }

/* Intelligence Panel */
.details-body {
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

.detail-section {
  padding: 14px;
}

.detail-card {
  background: var(--dn-neutral-lighter);
  border: 1px solid var(--dn-neutral-light);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-size: 9px;
  font-weight: 800;
  color: var(--dn-neutral-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;
  color: var(--dn-neutral-primary);
}

.detail-description-html {
  line-height: 1.5;
  color: var(--dn-neutral-secondary);
  margin-top: 12px;
}

/* Font size variants */
.font-sz-sm { font-size: 11px !important; }
.font-sz-md { font-size: 13px !important; }
.font-sz-lg { font-size: 16px !important; }

/* Readability controls */
.readability-controls {
  display: flex;
  gap: 4px;
  background: var(--dn-neutral-light);
  padding: 2px;
  border-radius: 4px;
}

.readability-btn {
  padding: 2px 8px;
  font-size: 10px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.15s;
}

.readability-btn.active {
  background: white;
  font-weight: bold;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

/* Loading overlay */
#loadingOverlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  flex-direction: column;
  gap: 10px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--dn-neutral-light);
  border-top-color: var(--dn-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Highlight */
.highlight-mark {
  background-color: #fff100;
  color: black;
  font-weight: bold;
  border-radius: 2px;
  padding: 0 1px;
}

/* Footer */
.footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 6px;
  border-top: 1px solid var(--dn-neutral-light);
  font-size: 10px;
  color: var(--dn-neutral-secondary);
}

.version-tag { display: flex; align-items: center; gap: 8px; }

.btn-debug {
  font-size: 10px;
  padding: 2px 8px;
  border: 1px solid var(--dn-neutral-light);
  border-radius: 3px;
  background: none;
  cursor: pointer;
  color: var(--dn-neutral-secondary);
}

/* Diagnostic Console */
#diagnosticConsole {
  position: fixed;
  bottom: 40px;
  left: 0;
  right: 0;
  height: 220px;
  background: #1e1e1e;
  color: #d4d4d4;
  z-index: 4000;
  display: flex;
  flex-direction: column;
  font-family: "Consolas", monospace;
  font-size: 11px;
}

.diag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #333;
  padding: 6px 15px;
  border-bottom: 1px solid #444;
}

.diag-log {
  flex: 1;
  overflow-y: auto;
  white-space: pre-wrap;
  line-height: 1.4;
  padding: 10px 15px;
}
```

**Step 2: Commit**

```bash
git add ActivityTimelineControl/css/ActivityTimelineControl.css
git commit -m "feat: port source CSS to PCF (height:100vh → height:100%)"
```

---

## Phase 6 — Leaf Components

### Task 14: SentimentBadge.tsx

**Files:**
- Create: `ActivityTimelineControl/components/SentimentBadge.tsx`
- Delete: `ActivityTimelineControl/components/SentimentIndicator.ts`

**Step 1: Write SentimentBadge.tsx**

```tsx
// ActivityTimelineControl/components/SentimentBadge.tsx
import * as React from 'react';
import { SentimentClass } from '../models/ActivityNode';

interface Props {
  sentimentClass: SentimentClass;
  label: string;
  score?: number;
}

export const SentimentBadge: React.FC<Props> = ({ sentimentClass, label, score }) => {
  const cls = sentimentClass === 'pos' ? 'positive'
            : sentimentClass === 'neg' ? 'negative'
            : 'neutral';
  return (
    <span className={`sentiment-badge ${cls}`}>
      {label}{score !== undefined ? ` (${score.toFixed(1)})` : ''}
    </span>
  );
};
```

**Step 2: Delete obsolete file**

```bash
rm ActivityTimelineControl/components/SentimentIndicator.ts
```

**Step 3: Commit**

```bash
git add ActivityTimelineControl/components/SentimentBadge.tsx
git commit -m "feat: add SentimentBadge component"
```

---

### Task 15: DiagnosticConsole.tsx

**Files:**
- Create: `ActivityTimelineControl/components/DiagnosticConsole.tsx`

**Step 1: Write DiagnosticConsole.tsx**

```tsx
// ActivityTimelineControl/components/DiagnosticConsole.tsx
import * as React from 'react';

interface Props {
  logs: string[];
  visible: boolean;
  onClose: () => void;
}

export const DiagnosticConsole: React.FC<Props> = ({ logs, visible, onClose }) => {
  if (!visible) return null;

  const copyLogs = () => {
    navigator.clipboard.writeText(logs.join('\n')).catch(() => undefined);
  };

  return (
    <div id="diagnosticConsole">
      <div className="diag-header">
        <span>Diagnostics</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-debug" onClick={copyLogs}>Copy Logs</button>
          <button className="btn-debug" onClick={onClose}>✕</button>
        </div>
      </div>
      <div className="diag-log">
        {logs.length === 0
          ? <span style={{ opacity: 0.5 }}>No log entries yet.</span>
          : logs.map((entry, i) => <div key={i}>{entry}</div>)
        }
      </div>
    </div>
  );
};
```

**Step 2: Commit**

```bash
git add ActivityTimelineControl/components/DiagnosticConsole.tsx
git commit -m "feat: add DiagnosticConsole component"
```

---

### Task 16: IntelligencePanel.tsx

**Files:**
- Overwrite: `ActivityTimelineControl/components/IntelligencePanel.ts` → `IntelligencePanel.tsx`

**Step 1: Delete old file and create new**

```bash
rm ActivityTimelineControl/components/IntelligencePanel.ts
```

**Step 2: Write IntelligencePanel.tsx**

```tsx
// ActivityTimelineControl/components/IntelligencePanel.tsx
import * as React from 'react';
import { ActivityNode } from '../models/ActivityNode';
import { FontSize } from '../models/FilterState';
import { SentimentBadge } from './SentimentBadge';
import { sanitizeHTML, sanitizeInput } from '../utils/Sanitizer';

interface Props {
  selectedNode: ActivityNode | null;
  fontSize: FontSize;
  onFontSizeChange: (sz: FontSize) => void;
  onViewRecord?: (node: ActivityNode) => void;
  searchQuery: string;
}

function highlightText(text: string, query: string): string {
  const safe = sanitizeHTML(text);
  if (!query) return safe;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return safe.replace(new RegExp(escaped, 'gi'), m =>
    `<mark class="highlight-mark">${m}</mark>`
  );
}

export const IntelligencePanel: React.FC<Props> = ({
  selectedNode, fontSize, onFontSizeChange, onViewRecord, searchQuery,
}) => {
  return (
    <aside className="panel">
      <div className="panel-header">
        <span>Intelligence Panel</span>
        {selectedNode && (
          <div className="readability-controls">
            {(['sm', 'md', 'lg'] as FontSize[]).map(sz => (
              <button
                key={sz}
                className={`readability-btn${fontSize === sz ? ' active' : ''}`}
                onClick={() => onFontSizeChange(sz)}
              >
                {sz === 'sm' ? 'A-' : sz === 'md' ? 'A' : 'A+'}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="details-body">
        {!selectedNode ? (
          <div className="detail-section">
            <div style={{ opacity: 0.5, fontSize: 12 }}>
              Select a record to analyze metadata.
            </div>
          </div>
        ) : selectedNode.normalizedType === 'sentiment_score' ? (
          <div className="detail-section">
            <div className="detail-card" style={{ background: 'white', textAlign: 'center' }}>
              <strong style={{ display: 'block', fontSize: 14, marginBottom: 12 }}>
                {selectedNode.displayName}
              </strong>
              {selectedNode.sentimentClass && selectedNode.sentimentChoiceLabel && (
                <SentimentBadge
                  sentimentClass={selectedNode.sentimentClass}
                  label={selectedNode.sentimentChoiceLabel}
                />
              )}
              <div style={{ fontSize: 32, fontWeight: 700, margin: '16px 0', color: 'var(--dn-neutral-primary)' }}>
                {selectedNode.sentimentScore?.toFixed(1) ?? 'N/A'}
              </div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, color: 'var(--dn-neutral-secondary)' }}>
                Sentiment Score
              </div>
            </div>
            <div className="detail-card">
              <div className="detail-item">
                <span className="detail-label">Date</span>
                <span className="detail-value">{selectedNode.date.toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Owner</span>
                <span className="detail-value">{sanitizeInput(selectedNode.owner)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="detail-section">
            <div className="detail-card">
              <strong style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>
                {sanitizeInput(selectedNode.displayName)}
              </strong>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Owner</span>
                  <span className="detail-value">{sanitizeInput(selectedNode.owner)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className="detail-value">{sanitizeInput(selectedNode.state || 'N/A')}</span>
                </div>
              </div>
            </div>
            <div className="detail-card" style={{ background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>{sanitizeInput(selectedNode.title)}</span>
                <span style={{ fontSize: 10, background: '#f3f2f1', padding: '2px 6px', borderRadius: 4 }}>
                  {selectedNode.date.toLocaleDateString()}
                </span>
              </div>
              <div
                className={`detail-description-html font-sz-${fontSize}`}
                dangerouslySetInnerHTML={{
                  __html: highlightText(selectedNode.description, searchQuery) || '<em>No content provided.</em>',
                }}
              />
            </div>
            {selectedNode.source !== 'demo' && onViewRecord && (
              <button
                className="btn primary"
                style={{ width: '100%', marginTop: 8 }}
                onClick={() => onViewRecord(selectedNode)}
              >
                View Record
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
```

**Step 3: Commit**

```bash
git add ActivityTimelineControl/components/IntelligencePanel.tsx
git commit -m "feat: implement IntelligencePanel with sentiment + search highlight"
```

---

## Phase 7 — Layout Components

### Task 17: FilterRow.tsx

**Files:**
- Create: `ActivityTimelineControl/components/FilterRow.tsx`
- Delete: `ActivityTimelineControl/components/FilterControls.ts`
- Delete: `ActivityTimelineControl/components/SearchBar.ts`

**Step 1: Delete obsolete files**

```bash
rm ActivityTimelineControl/components/FilterControls.ts
rm ActivityTimelineControl/components/SearchBar.ts
```

**Step 2: Write FilterRow.tsx**

```tsx
// ActivityTimelineControl/components/FilterRow.tsx
import * as React from 'react';
import { FilterState } from '../models/FilterState';

interface Props {
  filterState: FilterState;
  allDisplayNames: Set<string>;
  onFilterChange: (update: Partial<FilterState>) => void;
}

export const FilterRow: React.FC<Props> = ({ filterState, allDisplayNames, onFilterChange }) => {
  const searchRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleType = (name: string) => {
    const next = new Set(filterState.activeDisplayNames);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    onFilterChange({ activeDisplayNames: next });
  };

  const showAll = () => {
    onFilterChange({ activeDisplayNames: new Set(allDisplayNames) });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      onFilterChange({ searchQuery: val });
    }, 150);
  };

  const allActive = allDisplayNames.size > 0 &&
    [...allDisplayNames].every(n => filterState.activeDisplayNames.has(n));

  return (
    <div className="filter-row">
      <div className="filter-chips">
        {!allActive && (
          <button className="type-chip active" onClick={showAll}>Show All</button>
        )}
        {[...allDisplayNames].sort().map(name => (
          <button
            key={name}
            className={`type-chip${filterState.activeDisplayNames.has(name) ? ' active' : ''}`}
            onClick={() => toggleType(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <input
        type="text"
        id="searchInput"
        placeholder="Search interactions... (Ctrl+K)"
        defaultValue={filterState.searchQuery}
        onChange={handleSearch}
      />
    </div>
  );
};
```

**Step 3: Commit**

```bash
git add ActivityTimelineControl/components/FilterRow.tsx
git commit -m "feat: add FilterRow component (type chips + search)"
```

---

### Task 18: JourneyView.tsx

**Files:**
- Overwrite: `ActivityTimelineControl/components/JourneyView.ts` → `JourneyView.tsx`

**Step 1: Delete old file**

```bash
rm ActivityTimelineControl/components/JourneyView.ts
```

**Step 2: Write JourneyView.tsx**

```tsx
// ActivityTimelineControl/components/JourneyView.tsx
import * as React from 'react';
import { ActivityNode } from '../models/ActivityNode';
import { ICONS } from '../constants';
import { getTemporalContext } from '../utils/DateUtils';
import { sanitizeHTML } from '../utils/Sanitizer';

interface Props {
  nodes: ActivityNode[];
  canvasWidth: number;
  showTime: boolean;
  onNodeSelect: (node: ActivityNode) => void;
  selectedNodeId: string | null;
}

export const JourneyView: React.FC<Props> = ({
  nodes, canvasWidth, showTime, onNodeSelect, selectedNodeId,
}) => {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const topScrollRef = React.useRef<HTMLDivElement>(null);

  const handleViewportScroll = () => {
    if (viewportRef.current && topScrollRef.current) {
      topScrollRef.current.scrollLeft = viewportRef.current.scrollLeft;
    }
  };

  const handleTopScroll = () => {
    if (viewportRef.current && topScrollRef.current) {
      viewportRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
  };

  // Lane algorithm — faithful port of source v3.1.4
  const laneData = React.useMemo(() => {
    const total = nodes.length;
    const lanes: number[] = [];
    return nodes.map((_, index) => {
      const pos = total <= 1 ? 50 : (index / (total - 1)) * 75 + 12.5;
      let lane = 0;
      while ((lanes[lane] ?? -999) > (pos - 12) && lane < 12) lane++;
      lanes[lane] = pos;
      return { pos, lane };
    });
  }, [nodes]);

  const maxLane = laneData.reduce((m, { lane }) => Math.max(m, lane), 0);
  const canvasHeight = Math.max((Math.min(maxLane + 1, 12)) * 115 + 150, 200);

  return (
    <div id="viewJourney">
      <div
        className="top-scrollbar-wrapper"
        ref={topScrollRef}
        onScroll={handleTopScroll}
      >
        <div style={{ width: canvasWidth, height: 1 }} />
      </div>
      <div
        id="viewport"
        className="timeline-viewport"
        ref={viewportRef}
        onScroll={handleViewportScroll}
      >
        <div
          id="timelineCanvas"
          style={{ minWidth: canvasWidth, height: canvasHeight, position: 'relative' }}
        >
          <div className="timeline-track" style={{ top: 60 }} />
          {nodes.map((node, i) => {
            const { pos, lane } = laneData[i];
            const ctx = getTemporalContext(node.date);
            const ring = node.normalizedType === 'sentiment_score'
              ? `ring-${node.sentimentClass}` : '';
            const isSelected = node.id === selectedNodeId;
            const icon = node.normalizedType === 'note' && node.initials
              ? <span style={{ fontSize: 10, fontWeight: 800 }}>{node.initials}</span>
              : (ICONS[node.normalizedType] || ICONS['default']);

            return (
              <div
                key={node.id}
                className="node"
                style={{
                  left: `${pos}%`,
                  top: 60 + lane * 115,
                  transform: `translate(-50%, -50%)${isSelected ? ' scale(1.1)' : ''}`,
                }}
                onClick={() => onNodeSelect(node)}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onNodeSelect(node)}
                aria-label={node.title}
              >
                <div className="node-row">
                  <div className={`node-icon ${ring}`}>{icon}</div>
                  <div className="node-side-meta">
                    <strong>{ctx.d}</strong>
                    {showTime && <span style={{ opacity: 0.7 }}>{ctx.t}</span>}
                  </div>
                </div>
                <div className="node-label">{sanitizeHTML(node.title)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
```

**Step 3: Commit**

```bash
git add ActivityTimelineControl/components/JourneyView.tsx
git commit -m "feat: implement JourneyView with auto-laning algorithm"
```

---

### Task 19: ListView.tsx

**Files:**
- Overwrite: `ActivityTimelineControl/components/ListView.ts` → `ListView.tsx`

**Step 1: Delete old file**

```bash
rm ActivityTimelineControl/components/ListView.ts
```

**Step 2: Write ListView.tsx**

```tsx
// ActivityTimelineControl/components/ListView.tsx
import * as React from 'react';
import { ActivityNode } from '../models/ActivityNode';
import { ICONS } from '../constants';
import { sanitizeHTML } from '../utils/Sanitizer';

interface Props {
  nodes: ActivityNode[];
  onNodeSelect: (node: ActivityNode) => void;
  selectedNodeId: string | null;
}

export const ListView: React.FC<Props> = ({ nodes, onNodeSelect, selectedNodeId }) => {
  return (
    <div id="viewList" className="list-viewport">
      <div id="listContent">
        {nodes.length === 0 && (
          <div style={{ padding: 20, textAlign: 'center', opacity: 0.5 }}>
            No interactions found.
          </div>
        )}
        {nodes.map(node => (
          <div key={node.id} className="list-item">
            <div style={{ paddingTop: 6, fontSize: 20, userSelect: 'none' }}>
              {ICONS[node.normalizedType] || ICONS['default']}
            </div>
            <div
              className={`list-card${node.id === selectedNodeId ? ' selected' : ''}`}
              onClick={() => onNodeSelect(node)}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onNodeSelect(node)}
              aria-label={node.title}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <strong style={{ fontSize: 13 }}>{sanitizeHTML(node.title)}</strong>
                <span style={{ fontSize: 10, opacity: 0.7, whiteSpace: 'nowrap', marginLeft: 8 }}>
                  {node.date.toLocaleDateString()}
                </span>
              </div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>
                {node.displayName}
                {node.owner ? ` · ${sanitizeHTML(node.owner)}` : ''}
                {node.state ? ` · ${sanitizeHTML(node.state)}` : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

**Step 3: Commit**

```bash
git add ActivityTimelineControl/components/ListView.tsx
git commit -m "feat: implement ListView"
```

---

### Task 20: Header.tsx

**Files:**
- Create: `ActivityTimelineControl/components/Header.tsx`

**Step 1: Write Header.tsx**

```tsx
// ActivityTimelineControl/components/Header.tsx
import * as React from 'react';
import { FilterState, DaysFilter } from '../models/FilterState';
import { isGccEnvironment } from '../utils/GccDetector';

interface Props {
  filterState: FilterState;
  loading: boolean;
  nodeCount: number;
  onFilterChange: (update: Partial<FilterState>) => void;
  onSync: () => void;
  onExport: () => void;
  onToggleDiag: () => void;
}

export const Header: React.FC<Props> = ({
  filterState, loading, nodeCount,
  onFilterChange, onSync, onExport, onToggleDiag,
}) => {
  const isGcc = isGccEnvironment();

  return (
    <header className="header">
      <div className="title-group">
        <span className="main-title">Activity Journey</span>
        <span className="badge">{nodeCount}</span>
        <div className="tab-switcher">
          <button
            className={`tab-btn${filterState.activeTab === 'journey' ? ' active' : ''}`}
            onClick={() => onFilterChange({ activeTab: 'journey' })}
          >
            Journey
          </button>
          <button
            className={`tab-btn${filterState.activeTab === 'list' ? ' active' : ''}`}
            onClick={() => onFilterChange({ activeTab: 'list' })}
          >
            List
          </button>
        </div>
      </div>
      <div className="control-group">
        <select
          value={filterState.daysFilter}
          onChange={e => onFilterChange({ daysFilter: Number(e.target.value) as DaysFilter })}
        >
          <option value={7}>7 Days</option>
          <option value={30}>30 Days</option>
          <option value={90}>90 Days</option>
          <option value={365}>1 Year</option>
        </select>
        <input
          type="range"
          min={800}
          max={4000}
          step={100}
          value={filterState.canvasWidth}
          onChange={e => onFilterChange({ canvasWidth: Number(e.target.value) })}
          title="Zoom"
        />
        <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="checkbox"
            checked={filterState.showTime}
            onChange={e => onFilterChange({ showTime: e.target.checked })}
          />
          TIME
        </label>
        <button className="btn outline" onClick={onExport}>Export</button>
        {!isGcc && (
          <button className="btn outline" title="Popout (deferred)" disabled>
            Popout
          </button>
        )}
        <button className="btn primary" onClick={onSync} disabled={loading}>
          {loading ? 'Syncing…' : 'Sync'}
        </button>
      </div>
    </header>
  );
};
```

**Step 2: Commit**

```bash
git add ActivityTimelineControl/components/Header.tsx
git commit -m "feat: add Header component"
```

---

## Phase 8 — Root Component & Entry Point

### Task 21: ActivityTimeline.tsx (root component)

**Files:**
- Create: `ActivityTimelineControl/components/ActivityTimeline.tsx`

**Step 1: Write ActivityTimeline.tsx**

```tsx
// ActivityTimelineControl/components/ActivityTimeline.tsx
import * as React from 'react';
import { IInputs } from '../generated/ManifestTypes';
import { ActivityNode } from '../models/ActivityNode';
import { FilterState, createInitialFilterState } from '../models/FilterState';
import { useActivities } from '../hooks/useActivities';
import { useFilter } from '../hooks/useFilter';
import { Header } from './Header';
import { FilterRow } from './FilterRow';
import { JourneyView } from './JourneyView';
import { ListView } from './ListView';
import { IntelligencePanel } from './IntelligencePanel';
import { DiagnosticConsole } from './DiagnosticConsole';

interface Props {
  context: ComponentFramework.Context<IInputs>;
}

export const ActivityTimeline: React.FC<Props> = ({ context }) => {
  const recordId = context.parameters.recordId?.raw ?? '';

  const [filterState, setFilterState] = React.useState<FilterState>(createInitialFilterState());
  const [selectedNode, setSelectedNode] = React.useState<ActivityNode | null>(null);
  const [diagVisible, setDiagVisible] = React.useState(false);

  const { nodes, loading, sync, diagLogs } = useActivities(
    context, recordId, filterState.daysFilter
  );
  const { filtered, allDisplayNames } = useFilter(nodes, filterState);

  // Initialise type filters when nodes first load
  React.useEffect(() => {
    if (allDisplayNames.size > 0 && filterState.activeDisplayNames.size === 0) {
      setFilterState(prev => ({ ...prev, activeDisplayNames: new Set(allDisplayNames) }));
    }
  }, [allDisplayNames]);

  const handleFilterChange = (update: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...update }));
  };

  const handleExport = () => {
    const rows = filtered
      .filter(n => n.source !== 'demo')
      .map(n => `"${n.date.toISOString()}","${n.displayName}","${n.state}","${n.owner}","${n.title}"`);
    const csv = ['Date,Type,Status,Owner,Subject', ...rows].join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = 'interaction_export.csv';
    link.click();
  };

  const handleViewRecord = (node: ActivityNode) => {
    // context.navigation is available in PCF at runtime
    const nav = (context as any).navigation;
    if (nav?.navigateTo) {
      nav.navigateTo(
        {
          pageType: 'entityrecord',
          entityName: node.entityName === 'note' ? 'annotation' : node.entityName,
          entityId: node.id.replace(/[{}]/g, ''),
        },
        { target: 2, position: 1, width: { value: 95, unit: '%' }, height: { value: 95, unit: '%' } }
      );
    }
  };

  return (
    <div className="container">
      {loading && (
        <div id="loadingOverlay">
          <div className="spinner" />
          <span style={{ fontSize: 13 }}>Loading interactions…</span>
        </div>
      )}
      <Header
        filterState={filterState}
        loading={loading}
        nodeCount={filtered.length}
        onFilterChange={handleFilterChange}
        onSync={sync}
        onExport={handleExport}
        onToggleDiag={() => setDiagVisible(v => !v)}
      />
      <FilterRow
        filterState={filterState}
        allDisplayNames={allDisplayNames}
        onFilterChange={handleFilterChange}
      />
      <div className="content-grid">
        <section className="panel">
          {filterState.activeTab === 'journey' ? (
            <JourneyView
              nodes={filtered}
              canvasWidth={filterState.canvasWidth}
              showTime={filterState.showTime}
              onNodeSelect={setSelectedNode}
              selectedNodeId={selectedNode?.id ?? null}
            />
          ) : (
            <ListView
              nodes={filtered}
              onNodeSelect={setSelectedNode}
              selectedNodeId={selectedNode?.id ?? null}
            />
          )}
        </section>
        <IntelligencePanel
          selectedNode={selectedNode}
          fontSize={filterState.panelFontSize}
          onFontSizeChange={sz => handleFilterChange({ panelFontSize: sz })}
          onViewRecord={handleViewRecord}
          searchQuery={filterState.searchQuery}
        />
      </div>
      <div className="footer-row">
        <div className="version-tag">
          v1.0.0 (PCF)
          <button className="btn-debug" onClick={() => setDiagVisible(v => !v)}>
            Diagnostics
          </button>
        </div>
      </div>
      <DiagnosticConsole
        logs={diagLogs}
        visible={diagVisible}
        onClose={() => setDiagVisible(false)}
      />
    </div>
  );
};
```

**Step 2: Commit**

```bash
git add ActivityTimelineControl/components/ActivityTimeline.tsx
git commit -m "feat: add ActivityTimeline root component"
```

---

### Task 22: Overwrite index.ts (PCF entry point)

**Files:**
- Overwrite: `ActivityTimelineControl/index.ts`

**Step 1: Write index.ts**

```typescript
// ActivityTimelineControl/index.ts
import { IInputs, IOutputs } from './generated/ManifestTypes';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ActivityTimeline } from './components/ActivityTimeline';

export class ActivityTimelineControl
  implements ComponentFramework.StandardControl<IInputs, IOutputs> {

  private container!: HTMLDivElement;

  public init(
    context: ComponentFramework.Context<IInputs>,
    _notifyOutputChanged: () => void,
    _state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this.container = container;
    this.render(context);
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.render(context);
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {
    ReactDOM.unmountComponentAtNode(this.container);
  }

  private render(context: ComponentFramework.Context<IInputs>): void {
    ReactDOM.render(
      React.createElement(ActivityTimeline, { context }),
      this.container
    );
  }
}
```

**Step 2: Commit**

```bash
git add ActivityTimelineControl/index.ts
git commit -m "feat: PCF entry point mounts React ActivityTimeline"
```

---

## Phase 9 — Verification

### Task 23: Run all unit tests

**Step 1: Run tests**

```bash
npm test
```

Expected output:
```
PASS ActivityTimelineControl/utils/Sanitizer.test.ts
PASS ActivityTimelineControl/utils/normalizeType.test.ts
PASS ActivityTimelineControl/utils/DateUtils.test.ts

Test Suites: 3 passed, 3 total
Tests:       19 passed, 19 total
```

If any tests fail: fix the failing implementation before continuing.

---

### Task 24: Build verification

**Step 1: Run build**

```bash
npm run build
```

Expected: `Build succeeded` with no TypeScript errors.

Common errors and fixes:
- `Cannot find module './generated/ManifestTypes'` → Run `npm run build` once first to generate types (pcf-scripts regenerates ManifestTypes on first build)
- `JSX element ... has no overload` → Confirm `"jsx": "react"` is in tsconfig.json
- `Property 'webAPI' does not exist on type 'Context'` → This is expected in dev; `context.webAPI` is available at PCF runtime

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: complete PCF conversion from web resource v3.1.4"
```

---

### Task 25: Visual verification in test harness

**Step 1: Start the PCF test harness**

```bash
npm start
```

Expected: Browser opens at `http://localhost:8181` showing the PCF test harness.

**Step 2: Configure harness properties**

In the harness UI, set:
- `recordId`: leave empty (triggers demo mode — you should see the demo node)
- `entityName`: `contact`

Expected: Control renders with the Journey view active, one demo node visible, the Intelligence Panel on the right showing "Select a record to analyze metadata."

**Step 3: Verify all UI controls respond**

- [ ] Journey / List tab toggle works
- [ ] Zoom slider changes canvas width
- [ ] TIME toggle shows/hides time labels
- [ ] Search input filters nodes (debounced)
- [ ] Sync button shows "Syncing…" spinner
- [ ] Diagnostics button opens the console tray
- [ ] Export button downloads a CSV

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: verified PCF control in test harness"
```

---

## Cleanup Checklist

After all tasks complete, these old scaffold files should be gone:

```bash
# Verify these no longer exist:
ls ActivityTimelineControl/components/*.ts   # should only show .tsx files
ls ActivityTimelineControl/models/Activity.ts  # should not exist
ls ActivityTimelineControl/services/SentimentService.ts  # should not exist
ls ActivityTimelineControl/services/ExportService.ts     # should not exist
```

---

*End of plan.*
