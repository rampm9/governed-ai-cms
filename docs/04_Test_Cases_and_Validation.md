Test Cases & Validation
Functional Test Cases
Test Case 1 — Basic Generation

Input: Short Arabic title
Expected:

3 headlines generated

Slug formatted

Body between 350–600 words

5 tags returned

Summary returned

Test Case 2 — JSON Validation

Simulate malformed response.
System must:

Retry once.

Return structured error if still invalid.

Test Case 3 — Duplicate Tag Removal

If model outputs duplicate tags:
System must return unique tag list only.

Test Case 4 — Input Length Protection

If input > 2000 characters:
System rejects request.

Test Case 5 — Arabic Enforcement

Ensure all outputs are Arabic.
Reject mixed-language response.

Non-Functional Tests

API key not visible in frontend.

No external logging.

SQLite entry created per generation.