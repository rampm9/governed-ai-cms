Security & Data Architecture
1. Security Philosophy

The Arabic AI CMS Assistant is designed with a privacy-first architecture.

Content generation involves sensitive editorial material. Therefore, the system enforces strict separation between:

Client layer

Model access

Storage

External APIs

No API keys or model calls are exposed to the frontend.

2. API Key Protection

API keys are stored in .env file.

Backend reads keys via dotenv.

Keys are never committed to version control.

Frontend never has direct access to model provider.

3. Backend Proxy Model

All model calls follow this path:

Client
→ Express Backend
→ Gemini API
→ Backend Processing
→ Structured JSON to Client

This prevents:

API key leakage

Direct user access to model endpoint

Abuse of model provider

4. Input Validation

Before sending content to model:

Input length restricted.

Basic sanitization applied.

No raw HTML passed to model.

Reject empty input.

5. Output Validation

After receiving model response:

JSON parsed securely.

Retry on malformed response.

Body length validated.

Slug sanitized.

Duplicate tags removed.

This ensures deterministic control over non-deterministic outputs.

6. Local Data Storage

All logs stored locally in SQLite.

Stored fields:

Input text

Generated structured JSON

Timestamp

No external logging provider used.

7. Data Privacy Considerations

Current prototype:

Sends content to Gemini API.

Does not store data externally.

Does not track user analytics.

Future production-ready design:

Host LLM internally.

Remove external API dependency.

Deploy behind firewall.

Role-based access control.

Audit logging.

8. Risk Assessment
Risk	Mitigation
API key exposure	Backend-only access
Hallucinated content	Manual review + validation
Malformed JSON	Retry + schema validation
Tag duplication	Deterministic deduplication
Model dependency	Abstraction layer design
9. Model Abstraction Strategy

The system isolates LLM calls inside modelService.js.

This allows:

Switching providers easily.

Future migration to internal model.

Reduced vendor lock-in risk.