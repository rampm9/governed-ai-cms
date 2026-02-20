UI Component Architecture
1. Component Structure

The UI will follow a structured component layout even though it is implemented using vanilla HTML + JS.

High-level structure:

App Container

InputPanel

OutputPanel

SystemMetricsPanel

2. InputPanel

Responsibilities:

Accept Arabic text input.

Show character counter.

Handle Generate button.

Show loading state.

Disable button during generation.

States:

Idle

Loading

Error

3. OutputPanel

Displays structured AI output in separate sections:

Components inside:

HeadlinesBlock

SlugBlock

SEOTitleBlock

SEODescriptionBlock

BodyBlock

TagsBlock

SummaryBlock

Each block includes:

Title label

Content display

Copy button

4. SystemMetricsPanel

Displays backend instrumentation data:

Word count

Retry triggered

Validation status

Generation duration (ms)

This reinforces observability design.

5. Data Flow

User submits input.

Frontend sends POST request.

Backend returns structured JSON.

Frontend:

Renders content blocks.

Calculates word count (secondary check).

Displays metrics returned from backend.

6. Error Flow

If backend returns error:

Display error banner.

Do not clear input.

Allow retry.

7. Future Component Hooks

Design UI with expandable structure for:

Regenerate section button

Inline editing

CMS export

Role-based UI states