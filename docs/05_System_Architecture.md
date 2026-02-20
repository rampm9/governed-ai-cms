System Architecture
1. Architectural Overview

The Arabic AI CMS Assistant follows a layered architecture to separate deterministic logic from non-deterministic LLM behavior.

High-level flow:

Client (Author UI)
→ Express Backend API
→ Prompt Builder
→ Model Abstraction Layer
→ Gemini 3.1 Pro
→ Post-Processing & Validation
→ SQLite Logging
→ Structured JSON Response

2. Layer Breakdown
2.1 Client Layer (Deterministic)

Responsibilities:

Accept Arabic input (title or note).

Display structured output.

Never call model directly.

Never expose API key.

2.2 API Layer (Express Server)

Responsibilities:

Validate input length.

Sanitize user input.

Call model service.

Handle retries.

Enforce JSON schema.

Log generation results.

2.3 Prompt Builder Layer

Responsibilities:

Construct structured instruction.

Enforce:

Modern Standard Arabic.

Strict JSON response.

SEO-aware output.

Define output contract.

2.4 Model Abstraction Layer

Responsibilities:

Call Gemini API.

Remain model-agnostic.

Allow easy switching of LLM provider.

Return raw model output.

This layer ensures future portability.

2.5 Post-Processing Layer (Deterministic Guardrails)

Responsibilities:

Parse JSON safely.

Retry if parsing fails.

Remove duplicate tags.

Validate slug format.

Validate body word count.

Validate Arabic-only output.

This layer controls probabilistic instability.

2.6 Logging Layer

Responsibilities:

Store:

Input

Generated output

Timestamp

Enable future:

Evaluation

Error classification

Model improvement

3. Deterministic vs Non-Deterministic Separation

Deterministic Components:

Slug normalization

Tag deduplication

JSON validation

Retry logic

Logging

Non-Deterministic Components:

Article body generation

Headline creativity

Tag relevance

Summary tone

System design explicitly accounts for model variability.

4. Failure Handling Strategy

Invalid JSON → Retry once.

Invalid Arabic detection → Reject response.

Body too short → Regenerate.

API failure → Return structured error.

5. Scalability Considerations (Future State)

Replace SQLite with PostgreSQL.

Add role-based access control.

Introduce queue for generation requests.

Add monitoring dashboard.

Support internal model hosting.