AI Evaluation Plan
1. Evaluation Philosophy

Because LLM systems are probabilistic and non-deterministic, evaluation must be structured and layered.

The system evaluation follows four levels:

Offline Functional Validation

Manual Quality Review

Structured Scoring

Failure Categorization

2. Offline Functional Validation (Automated)

These checks are deterministic and enforced programmatically.

2.1 JSON Structure Validation

Requirements:

headlines must contain exactly 3 entries.

tags must contain exactly 5 entries.

slug must not be empty.

body must be between 350–600 words.

summary must not be empty.

If validation fails:

System retries once.

If still invalid, return structured error.

2.2 Tag Deduplication

Convert all tags to lowercase.

Trim whitespace.

Remove duplicates.

Ensure unique final tag list.

2.3 Slug Validation

Replace spaces with hyphens.

Remove special characters.

Ensure slug length < 120 characters.

3. Manual Quality Review Framework

20 sample topics will be generated across categories:

Politics

Economy

Technology

Sports

Each generated article will be manually scored.

3.1 Scoring Rubric
Criteria	Scale	Target
Clarity	1–5	≥ 3.5
SEO completeness	1–5	≥ 3
Tag relevance	1–5	≥ 3
Summary quality	1–5	≥ 3
Hallucination presence	Pass/Fail	No fabricated facts
4. Hallucination Detection

For prototype evaluation:

Compare generated article against known topic.

Check for fabricated statistics.

Check for invented quotes.

Check for unsupported claims.

If hallucinations detected:

Document failure case.

Classify error category.

Improve prompt constraints.

5. Error Categorization Framework

Failures will be categorized into:

Structure Failure (invalid JSON)

Short Body Failure

Weak SEO optimization

Irrelevant Tags

Tone inconsistency

Fabricated factual claims

This enables systematic improvement.

6. Evaluation Metrics Summary

Success criteria for prototype:

≥ 90% valid JSON output rate.

≥ 80% articles score ≥ 3 on clarity.

0 critical hallucination cases.

Tag duplication rate = 0%.

7. Continuous Improvement Loop

The system logs:

Input prompt

Generated output

Validation failures

Future iterations may:

Refine prompt engineering.

Introduce structured examples.

Add rule-based grounding layer.

Implement semantic tag validation.