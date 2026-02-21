# Data Model: Generic Activity Timeline PCF Conversion

## Core Entities

### ActivityNode
Represents one timeline item rendered in journey/list views.

Attributes (logical):
- `id`: stable item identifier
- `title`: subject/title text
- `description`: body/detail text
- `date`: primary event timestamp
- `rawType`: source type value (numeric/string)
- `entityName`: Dataverse logical entity name
- `normalizedType`: normalized rendering category (e.g., phonecall, email, note, sentiment_score)
- `displayName`: user-facing type label
- `source`: `dataverse` or `demo`
- `state`: status label
- `owner`: owner display label
- Optional sentiment/author fields for specialized nodes

### FilterState
Represents current user filter and display controls.

Attributes (logical):
- Active display type set
- Search query
- Date range window (days)
- Canvas width/zoom
- Time label toggle
- Active tab (`journey` or `list`)
- Panel readability/font size state

### SentimentScore
Represents normalized sentiment metadata associated with a source interaction.

Attributes (logical):
- Numeric score
- Choice value
- Choice label

## Relationships
- One source interaction can yield zero or one sentiment item in rendered timeline data.
- Filter state projects the full activity collection into a user-visible subset.
- Selection context points to one current `ActivityNode` for intelligence panel rendering.
